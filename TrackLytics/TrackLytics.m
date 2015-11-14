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


@implementation TrackLytics

static NSMutableArray *array;
static NSString *appCode;
static NSString *device;

+(void) startTrackerWithAppCode:(NSString *)code {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        appCode = appCode;
        UIDeviceHardware *h=[[UIDeviceHardware alloc] init];
        device = [h platform];
        [[VersionTracker new] getVersion:device];
        
        array = [NSMutableArray new];
        [array addObjectsFromArray:[self getPreviousRequests]];
        [self sendRequests];
        [NSTimer scheduledTimerWithTimeInterval:60.0 target:self selector:@selector(sendRequests) userInfo:nil repeats:YES];
    });
}

+(void) addRequest:(Core *) request {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        [array addObject:request];
        [self save];
    });
}

+(void) sendRequests {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        HTTPPost *httpPost = [HTTPPost new];
        NSLog(@"Sending %ld tracks which are not yet synced to the server", (unsigned long)array.count);
        for (Core *request in array) {
            NSString *url = [request getURL];
            @try {
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
            @catch (NSException *exception) {
            }
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


+(void) createNewCounterWithType:(NSString *)type withName:(NSString *)name {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance] getContext];
        Counter *counter;
        counter = [NSEntityDescription
                   insertNewObjectForEntityForName:@"Counter"
                   inManagedObjectContext:context];
        counter.name = name;
        counter.type = type;
        [self save];
        [array addObject:counter];
    });
}

+(void) createNewCounterWithType:(NSString *)type withName:(NSString *)name withValue:(NSInteger)value{
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance] getContext];
        Counter *counter;
        counter = [NSEntityDescription
                   insertNewObjectForEntityForName:@"Counter"
                   inManagedObjectContext:context];
        counter.name = name;
        counter.type = type;
        counter.value = [NSNumber numberWithInteger:value];
        [self save];
        [array addObject:counter];
    });
}

+(Timer *) createNewTimerWithType:(NSString *)type withName:(NSString *)name {
    NSManagedObjectContext *context =
    [[StorageManager sharedInstance] getContext];
    Timer *timer;
    timer = [NSEntityDescription
             insertNewObjectForEntityForName:@"Timer"
             inManagedObjectContext:context];
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        timer.name = name;
        timer.type = type;
        [self save];
    });
    return timer;
}

+(void) createNewGaugeWithType:(NSString *)type withName:(NSString *)name withValue:(NSNumber *) value {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance] getContext];
        Gauge *gauge;
        gauge = [NSEntityDescription
                   insertNewObjectForEntityForName:@"Gauge"
                   inManagedObjectContext:context];
        gauge.name = name;
        gauge.type = type;
        gauge.value = value;
        [self save];
        [array addObject:gauge];
    });
}

+(void) createNewHistogramWithType:(NSString *)type withName:(NSString *)name withValue:(NSInteger)value{
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance] getContext];
        Histogram *histogram;
        histogram = [NSEntityDescription
                   insertNewObjectForEntityForName:@"Histogram"
                   inManagedObjectContext:context];
        histogram.name = name;
        histogram.type = type;
        histogram.value = [NSNumber numberWithInteger:value];
        [self save];
        [array addObject:histogram];
    });
}

+(NSArray *) getPreviousRequests {
    @try {
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance]  getContext];
        NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] init];
        NSEntityDescription *entity = [NSEntityDescription
                                       entityForName:@"Core" inManagedObjectContext:context];
        [fetchRequest setEntity:entity];
        
        NSArray *fetchedObjects = [context executeFetchRequest:fetchRequest error:nil];
        NSMutableArray *array = [NSMutableArray new];
        for (Core *request in fetchedObjects) {
            if(![request.shouldBeSynced boolValue]){
                [self deleteRequest:request];
            }else{
                [array addObject:request];
            }
        }
        
        return array;
    }
    @catch (NSException *exception) {
        
    }
    return [[NSArray alloc] init];
    
}

+(void) deleteRequest:(Core *) request {
    [[[StorageManager sharedInstance]  getContext] deleteObject:request];
    [self save];
}

+(void) save {
    @try {
        [[[StorageManager sharedInstance] getContext] save:nil];
    }
    @catch (NSException *exception) {
    }
}

-(void) save {
    @try {
        [[[StorageManager sharedInstance] getContext] save:nil];
    }
    @catch (NSException *exception) {
    }
}



@end
