//
//  Core.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Core.h"
#import "TrackLytics.h"
#import "Reachability.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
@implementation Core

// Insert code here to add functionality to your managed object subclass

- (void)awakeFromInsert
{
    [super awakeFromInsert];
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        self.connectionType = [self getConnectionType];
    });
}

-(NSDictionary *) getData {
    return [NSDictionary new];
}

-(NSString *) getDate {
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    
    NSString *formattedDateString = [dateFormatter stringFromDate:self.date];
    return formattedDateString;
}

-(NSString *) getURL {
    return @"";
}

-(NSString *) getDatabaseID {
    return self.databaseID;
}

-(NSDictionary *) getMetadata {
    @try {
        NSString *databaseID;
        if(self.databaseID==nil){
            databaseID = @"";
        }else {
            databaseID = self.databaseID;
        }
        NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithObjects:@[self.type, self.name, [self getDate], databaseID, self.connectionType] forKeys:@[@"type",@"name", @"date", @"databaseID", @"connectionType"]];
        [dictionary addEntriesFromDictionary:[TrackLytics getMetaData]];
        
        return dictionary;
    }
    @catch (NSException *exception) {
        return [NSDictionary new];
    }
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

@end
