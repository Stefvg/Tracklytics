//
//  Timer.m
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Timer.h"
#import "TrackLytics.h"
@implementation Timer {
    NSDate *startDate;
    Tracking *trackingObject;
}

-(id) initTimer:(Tracking *)object {
    self = [super init];
    
    startDate = [NSDate date];
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        trackingObject = object;
    });
    return self;
}

-(void) stop {
    NSDate *endDate = [NSDate date];
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSTimeInterval secondsBetween = [endDate timeIntervalSinceDate:startDate];
        trackingObject.durationTime = [NSNumber numberWithFloat:secondsBetween];
        [[[StorageManager sharedInstance] getContext] save:nil];
        [[TrackLytics sharedInstance] addRequest:trackingObject];
    });
}

@end
