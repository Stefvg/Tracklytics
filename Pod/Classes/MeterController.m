//
//  Meter.m
//  SportsTimer
//
//  Created by Stef Van Gils on 28/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "MeterController.h"
#import "TrackLytics.h"
@implementation MeterController {
    NSTimer *timer;
    id<MeterInterface> meterInterface;
}

-(void) addEntry:(float)value {
    //dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        [TrackLytics addMeterEntryWithType:self.type withValue:[NSNumber numberWithFloat:value]];
    //});
}



-(void) addRepeatable:(id<MeterInterface>) interface withTimeInterval:(NSTimeInterval) interval{
    meterInterface = interface;
    timer = [NSTimer scheduledTimerWithTimeInterval:interval target:self selector:@selector(collectNewData) userInfo:nil repeats:YES];
}

-(void) collectNewData {
    //dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        [self addEntry:[meterInterface getValue]];
    //});
}

-(void) stop {
    [timer invalidate];
}

@end
