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
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import "Reachability.h"

@implementation TrackLytics

static NSMutableArray *array;
static NSInteger appCode;
static NSString *device;
static NSString *previousConnectionType;
static BOOL firstRun;
static NSString *uuid;
static BOOL shouldMonitor;

+(void) startTrackerWithAppCode:(NSInteger)code withSyncInterval:(double) interval {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        appCode = code;
        [self checkShouldMonitor];
        
        uuid = [[NSUUID UUID] UUIDString];
        UIDeviceHardware *h=[[UIDeviceHardware alloc] init];
        device = [h platform];
        //[[VersionTracker new] getVersion:device];
        firstRun = YES;
        
        array = [NSMutableArray new];
        [array addObjectsFromArray:[self getPreviousRequests]];
        [self sendRequests];
        if(shouldMonitor){
            [NSTimer scheduledTimerWithTimeInterval:interval target:self selector:@selector(sendRequests) userInfo:nil repeats:YES];
        }
        
    });
}

+(void) addRequest:(Core *) request {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        if(![array containsObject:request]){
            [array addObject:request];
        }
        [self save];
    });
}

+(void) sendRequests {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        HTTPPost *httpPost = [HTTPPost new];
        NSLog(@"Sending %ld tracks which are not yet synced to the server", (unsigned long)array.count);
        NSArray *copyOfArray = [NSArray arrayWithArray:array];
        for (Core *request in copyOfArray) {
            NSString *url = [request getURL];
            @try {
                NSDictionary *dict = [request getData];
                NSArray *split;
                if(dict.count>0){
                    NSData *data = [httpPost postSynchronous:url data:dict];
                    NSString *message = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
                    split = [message componentsSeparatedByString:@"#"];
                    
                    while(split.count!=2 || ![[split objectAtIndex:1]  isEqual: @"SUCCESS"]) {
                        data = [httpPost postSynchronous:url data:dict];
                        message = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
                        split = [message componentsSeparatedByString:@"#"];
                    }
                }
                [array removeObject:request];
                if(firstRun){
                    [self deleteRequest:request];
                }else {
                    request.databaseID = [split objectAtIndex:0];
                }
                
            }
            @catch (NSException *exception) {
            }
        }
        [self save];
        firstRun = NO;
    });
    
}


+(NSString *) getConnectionType {
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


+(CounterObject *) createNewCounterWithType:(NSString *)type withName:(NSString *)name {
    if(shouldMonitor){
        NSDate *date = [NSDate date];
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance] getContext];
        CounterObject *counter;
        
        
        counter = [NSEntityDescription
                   insertNewObjectForEntityForName:@"CounterObject"
                   inManagedObjectContext:context];
        counter.name = name;
        counter.type = type;
        counter.date = date;
        [array addObject:counter];
        return counter;
    }else return nil;
}

+(CounterObject *) createNewCounterWithType:(NSString *)type withName:(NSString *)name withValue:(NSInteger)value{
    if(shouldMonitor){
        NSDate *date = [NSDate date];
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance] getContext];
        CounterObject *counter;
        counter = [NSEntityDescription
                   insertNewObjectForEntityForName:@"CounterObject"
                   inManagedObjectContext:context];
        counter.name = name;
        counter.type = type;
        counter.date = date;
        [counter inc:value];
        [array addObject:counter];
        return counter;
    }else return nil;
}

+(Timer *) createNewTimerWithType:(NSString *)type withName:(NSString *)name {
    if(shouldMonitor) {
        
        NSDate *date = [NSDate date];
        NSManagedObjectContext *context =
        [[StorageManager sharedInstance] getContext];
        Timer *timer;
        timer = [NSEntityDescription
                 insertNewObjectForEntityForName:@"Timer"
                 inManagedObjectContext:context];
        timer.name = name;
        timer.type = type;
        timer.date = date;
        [array addObject:timer];
        
        return timer;
    }else return nil;
}

+(void) createNewGaugeWithType:(NSString *)type withName:(NSString *)name withValue:(NSInteger) value {
    if(shouldMonitor){
        NSDate *date = [NSDate date];
        dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
            NSManagedObjectContext *context =
            [[StorageManager sharedInstance] getContext];
            Gauge *gauge;
            gauge = [NSEntityDescription
                     insertNewObjectForEntityForName:@"Gauge"
                     inManagedObjectContext:context];
            gauge.name = name;
            gauge.type = type;
            gauge.value = [NSNumber numberWithInteger:value];
            gauge.date = date;
            [self save];
            [array addObject:gauge];
        });
    }
}

+(void) createNewHistogramWithType:(NSString *)type withName:(NSString *)name withValue:(NSInteger)value{
    if(shouldMonitor){
        NSDate *date = [NSDate date];
        dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
            NSManagedObjectContext *context =
            [[StorageManager sharedInstance] getContext];
            Histogram *histogram;
            histogram = [NSEntityDescription
                         insertNewObjectForEntityForName:@"Histogram"
                         inManagedObjectContext:context];
            histogram.name = name;
            histogram.type = type;
            histogram.date = date;
            histogram.value = [NSNumber numberWithInteger:value];
            [self save];
            [array addObject:histogram];
            
        });
    }
}

+(MeterController *) createNewMeter:(NSString *)type{
    MeterController *meter = [MeterController new];
    meter.type = type;
    return meter;
    
}

+(void) addMeterEntryWithType:(NSString *)type withValue:(NSNumber *)value{
    if(shouldMonitor){
        NSDate *date = [NSDate date];
        dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
            NSManagedObjectContext *context =
            [[StorageManager sharedInstance] getContext];
            Meter *meter;
            meter = [NSEntityDescription
                     insertNewObjectForEntityForName:@"Meter"
                     inManagedObjectContext:context];
            meter.name = @"";
            meter.type = type;
            meter.value = value;
            meter.date = date;
            [self save];
            [array addObject:meter];
            
        });
    }
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

+(NSDictionary *) getMetaData {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    
    [dictionary setObject:[self getDevice] forKey:@"device"];
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    [dictionary setObject:bundleIdentifier forKey:@"bundleID"];
    NSDictionary* infoDict = [[NSBundle mainBundle] infoDictionary];
    NSString* version = [infoDict objectForKey:@"CFBundleShortVersionString"];
    [dictionary setObject:version forKey:@"version"];
    
    [dictionary setObject:uuid forKey:@"UUID"];
    [dictionary setObject:[NSNumber numberWithInteger:appCode] forKey:@"appCode"];
    
    return dictionary;
}

+(NSString *) getDevice {
    UIDeviceHardware *h=[[UIDeviceHardware alloc] init];
    NSString *device = [h platform];
    return device;
}

+(void) checkShouldMonitor {
    HTTPPost *post = [HTTPPost new];
    NSDictionary *dict = [NSDictionary dictionaryWithObject:[NSNumber numberWithInteger:appCode] forKey:@"appCode"];
    NSData *data = [post postSynchronous:@"https://svg-apache.iminds-security.be/backend/ShouldMonitor.php" data:dict];
    NSString* newStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSNumberFormatter *f = [[NSNumberFormatter alloc] init];
    f.numberStyle = NSNumberFormatterDecimalStyle;
    NSNumber *shouldMonitorNumber = [f numberFromString:newStr];
    
    shouldMonitor = [shouldMonitorNumber boolValue];
    
    if(shouldMonitor){
        NSLog(@"Monitoring is turned on");
    }else {
        NSLog(@"Monitoring is turned off");
    }
    
}



@end
