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
#import "Switch+CoreDataProperties.h"
#import "Tracking+CoreDataProperties.h"
#import "Networking+CoreDataProperties.h"

@implementation TrackLytics {
    NSMutableArray *requests;
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
        NSArray *previousRequests = [self getPreviousRequests];
        [requests addObjectsFromArray:previousRequests];
        [self sendRequests];
        [NSTimer scheduledTimerWithTimeInterval:60.0 target:self selector:@selector(sendRequests) userInfo:nil repeats:YES];
    });
}



-(void) logScreenVisit:(NSString *)name {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        Request *request = [self getNewRequest:@"Screen"];
        request.name = name;
        request.date = [NSDate date];
        [self save];
        [requests addObject:request];
    });
}

-(void) logButtonClick:(NSString *)name {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        Request *request = [self getNewRequest:@"Button"];
        request.name = name;
        request.date = [NSDate date];
        [self save];
        [requests addObject:request];
    });
}

-(void) logSwitchClick:(NSString *)name switchIsOn:(BOOL) isOn {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        Switch *request = (Switch *)[self getNewRequest:@"Switch"];
        request.name = name;
        request.date = [NSDate date];
        request.isOn = [NSNumber numberWithBool:isOn];
        [self save];
        [requests addObject:request];
    });
}

-(Timer *) trackEvent:(NSString *)name {
    Tracking *request = (Tracking *)[self getNewRequest:@"Tracking"];
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        request.name = name;
        request.date = [NSDate date];
        [self save];
    });
    Timer *timer = [[Timer alloc] initTimer:request];
    return timer;
}

-(Timer *) trackNetworkEvent:(NSString *)name {
    Networking *request = (Networking *)[self getNewRequest:@"Networking"];
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        request.name = name;
        request.date = [NSDate date];
        request.connectionType = [self getConnectionType];
        
        [self save];
    });
    Timer *timer = [[Timer alloc] initTimer:request];
    return timer;
}

-(void) addRequest:(Request *) request {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        [requests addObject:request];
    });
}

-(void) sendRequests {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        HTTPPost *httpPost = [HTTPPost new];
        NSLog(@"Sending %ld tracks which are not yet synced to the server", (unsigned long)requests.count);
        for (Request *request in requests) {
            NSString *url = [request getURL];
            NSDictionary *dict = [request getData];
            dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
                NSData *data = [httpPost postSynchronous:url data:dict];
                NSString *message = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
                while(![message  isEqual: @"SUCCESS"]) {
                    data = [httpPost postSynchronous:url data:dict];
                    message = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
                }
                [self deleteRequest:request];
            });
            
        }
    });
    
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
            connectionType = @"4G";
        } else if([currentRadio isEqualToString:CTRadioAccessTechnologyEdge] || [currentRadio isEqualToString:CTRadioAccessTechnologyGPRS]) {
            connectionType = @"Edge";
        } else if([currentRadio isEqualToString:CTRadioAccessTechnologyWCDMA] || [currentRadio isEqualToString:CTRadioAccessTechnologyHSDPA] || [currentRadio isEqualToString:CTRadioAccessTechnologyHSUPA]){
            connectionType = @"3G";
        }
    }
    return connectionType;
}


-(Request *) getNewRequest:(NSString *) requestType {
    NSManagedObjectContext *context =
    [[StorageManager sharedInstance] getContext];
    Request *request;
    request = [NSEntityDescription
               insertNewObjectForEntityForName:requestType
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
