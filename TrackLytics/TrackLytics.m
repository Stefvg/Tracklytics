//
//  Logger.m
//  SportsTimer
//
//  Created by Stef Van Gils on 29/09/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "TrackLytics.h"
#import "HTTPPost.h"
#import "StorageManager.h"
#import "UIDeviceHardware.h"
#import "VersionTracker.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import "Reachability.h"
@implementation TrackLytics {
    NSMutableArray *requests;
    NSMutableDictionary *pendingTracking;
    NSMutableDictionary *pendingNetworkEvents;
}

+ (id)sharedInstance
{
    // structure used to test whether the block has completed or not
    static dispatch_once_t p = 0;
    
    // initialize sharedObject as nil (first call only)
    __strong static id _sharedObject = nil;
    
    // executes a block object once and only once for the lifetime of an application
    dispatch_once(&p, ^{
        _sharedObject = [[self alloc] init];
    });
    
    // returns the same object each time
    return _sharedObject;
}


-(void) startTrackerWithAppCode:(NSString *)appCode {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        self.appCode = appCode;
        UIDeviceHardware *h=[[UIDeviceHardware alloc] init];
        self.device = [h platform];
        [[VersionTracker new] getVersion:self.device];
        
        requests = [NSMutableArray new];
        pendingTracking = [NSMutableDictionary new];
        pendingNetworkEvents = [NSMutableDictionary new];
        NSArray *previousRequests = [self getPreviousRequests];
        [requests addObjectsFromArray:previousRequests];
        [self sendRequests];
        [NSTimer scheduledTimerWithTimeInterval:60.0 target:self selector:@selector(sendRequests) userInfo:nil repeats:YES];
    });
}



-(void) logScreenVisit:(NSString *)name {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        Request *request = [self getNewRequest];
        request.event = @"screen";
        request.name = name;
        request.date = [NSDate date];
        [self save];
        [requests addObject:request];
    });
}

-(void) logButtonClick:(NSString *)name {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        Request *request = [self getNewRequest];
        request.event = @"button";
        request.name = name;
        request.date = [NSDate date];
        [self save];
        [requests addObject:request];
    });
}

-(void) logSwitchClick:(NSString *)name switchIsOn:(BOOL) isOn {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        Request *request = [self getNewRequest];
        request.event = @"switch";
        request.name = name;
        request.date = [NSDate date];
        request.data = [NSString stringWithFormat:@"%d", isOn];
        [self save];
        [requests addObject:request];
    });
}

-(void) trackEvent:(NSString *)name {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        if([pendingTracking.allKeys containsObject:name]) {
            NSDate *previousDate = [pendingTracking valueForKey:name];
            NSDate *now = [NSDate date];
            NSTimeInterval secondsBetween = [now timeIntervalSinceDate:previousDate];
            Request *request = [self getNewRequest];
            request.event = @"tracking";
            request.name = name;
            request.date = [NSDate date];
            NSString *data = [NSString stringWithFormat:@"%f", secondsBetween];
            request.data = data;
            [self save];
            [requests addObject:request];
            [pendingTracking removeObjectForKey:name];
        }else {
            [pendingTracking setValue:[NSDate date] forKey:name];
        }
    });
}

-(void) trackNetworkEvent:(NSString *)name {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        if([pendingNetworkEvents.allKeys containsObject:name]) {
            NSDate *previousDate = [pendingNetworkEvents valueForKey:name];
            NSDate *now = [NSDate date];
            NSTimeInterval secondsBetween = [now timeIntervalSinceDate:previousDate];
            Request *request = [self getNewRequest];
            request.event = @"networking";
            request.name = name;
            request.date = [NSDate date];
            NSString *data = [NSString stringWithFormat:@"%f+%@", secondsBetween, [self getConnectionType]];
            request.data = data;
            [self save];
            [requests addObject:request];
            [pendingNetworkEvents removeObjectForKey:name];
        }else {
            [pendingNetworkEvents setValue:[NSDate date] forKey:name];
        }
    });
}


-(void) sendRequests {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        HTTPPost *httpPost = [HTTPPost new];
        NSLog(@"Sending %ld tracks which are not yet synced to the server", requests.count);
        for (Request *request in requests) {
            NSString *url = [self getURL:request];
            NSDictionary *dict = [self getData:request];
            dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
               // [self trackNetworkEvent:@"testnetworking"];
                
                NSData *data = [httpPost postSynchronous:url data:dict];
                NSString *message = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
                while(![message  isEqual: @"SUCCESS"]) {
                    data = [httpPost postSynchronous:url data:dict];
                    message = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
                }
                [self deleteRequest:request];
                //[self trackNetworkEvent:@"testnetworking"];
            });
            
        }
    });
    
}


-(NSDictionary *) getData:(Request *) request {
    NSDictionary *data;
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    
    NSString *formattedDateString = [dateFormatter stringFromDate:request.date];
    if([request.event isEqual:@"button"]){
        data = [NSDictionary dictionaryWithObjects:@[request.name, formattedDateString, self.device] forKeys:@[@"name", @"date", @"device"]];
    }else if([request.event isEqual:@"switch"]) {
        data = [NSDictionary dictionaryWithObjects:@[request.name, formattedDateString, request.data, self.device] forKeys:@[@"name", @"date", @"isOn", @"device"]];
    }else if([request.event isEqual:@"tracking"]){
        NSNumberFormatter *f = [[NSNumberFormatter alloc] init];
        f.numberStyle = NSNumberFormatterScientificStyle;
        NSDecimalNumber *number = [NSDecimalNumber decimalNumberWithString:request.data];
        data = [NSDictionary dictionaryWithObjects:@[request.name, number, formattedDateString, self.device] forKeys:@[@"name", @"durationTime", @"date", @"device"]];
    }else if([request.event isEqual:@"screen"]){
        data = [NSDictionary dictionaryWithObjects:@[request.name, formattedDateString, self.device] forKeys:@[@"name", @"date", @"device"]];
    }else if([request.event isEqual:@"networking"]){
        NSArray *split = [request.data componentsSeparatedByString:@"+"];
        NSString *numberString = split[0];
        NSString *connectionType = split[1];
        
        NSNumberFormatter *f = [[NSNumberFormatter alloc] init];
        f.numberStyle = NSNumberFormatterScientificStyle;
        NSDecimalNumber *number = [NSDecimalNumber decimalNumberWithString:numberString];
        data = [NSDictionary dictionaryWithObjects:@[request.name, number, formattedDateString, self.device, connectionType] forKeys:@[@"name", @"durationTime", @"date", @"device", @"connectionType"]];
    }
    return data;
}

-(NSString *) getURL:(Request *) request {
    NSString *url;
    if([request.event isEqual:@"button"]){
        url = @"https://svg-apache.iminds-security.be/Button.php";
    }else if([request.event isEqual:@"switch"]){
        url = @"https://svg-apache.iminds-security.be/Switch.php";
    }else if([request.event isEqual:@"tracking"]){
        url = @"https://svg-apache.iminds-security.be/Track.php";
    }else if([request.event isEqual:@"screen"]){
        url = @"https://svg-apache.iminds-security.be/Screen.php";
    }else if([request.event isEqual:@"networking"]){
        url = @"https://svg-apache.iminds-security.be/Network.php";
    }
    return url;
}


-(NSString *) getConnectionType {
    Reachability *reachability = [Reachability reachabilityForInternetConnection];
    [reachability startNotifier];
    
    NSString *connectionType = @"WiFi";
    NetworkStatus status = [reachability currentReachabilityStatus];
    if (status != ReachableViaWiFi)
    {
        CTTelephonyNetworkInfo *telephonyInfo = [[CTTelephonyNetworkInfo alloc] init];
        NSString *currentRadio = telephonyInfo.currentRadioAccessTechnology;
        if ([currentRadio isEqualToString:CTRadioAccessTechnologyLTE]) {
            // LTE
            NSLog(@"4G");
            connectionType = @"4G";
        } else if([currentRadio isEqualToString:CTRadioAccessTechnologyEdge] || [currentRadio isEqualToString:CTRadioAccessTechnologyGPRS]) {
            // EDGE
            NSLog(@"edge");
            connectionType = @"Edge";
        } else if([currentRadio isEqualToString:CTRadioAccessTechnologyWCDMA] || [currentRadio isEqualToString:CTRadioAccessTechnologyHSDPA] || [currentRadio isEqualToString:CTRadioAccessTechnologyHSUPA]){
            // 3G
            NSLog(@"3G");
            connectionType = @"3G";
        }
    }
    return connectionType;
}


-(Request *) getNewRequest {
    NSManagedObjectContext *context =
    [[StorageManager sharedInstance] getContext];
    Request *request;
    request = [NSEntityDescription
               insertNewObjectForEntityForName:@"Request"
               inManagedObjectContext:context];
    
    return request;
}

-(NSArray *) getPreviousRequests {
    @try {
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance]  getContext];
        NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] init];
        NSEntityDescription *entity = [NSEntityDescription
                                       entityForName:@"Request" inManagedObjectContext:context];
        [fetchRequest setEntity:entity];
        
        NSArray *fetchedObjects = [context executeFetchRequest:fetchRequest error:nil];
        return  fetchedObjects;
    }
    @catch (NSException *exception) {
        
    }
    return [[NSArray alloc] init];
    
}

-(void) deleteRequest:(Request *) request {
    [[[StorageManager sharedInstance]  getContext] deleteObject:request];
    [self save];
}

-(void) save {
    @try {
        [[[StorageManager sharedInstance] getContext] save:nil];
        
    }
    @catch (NSException *exception) {
        
    }
}



@end
