//
//  Timer.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "TimerAggregate.h"
#import "TrackLytics.h"

@implementation Timer{
    NSDate *startTime;
}

// Insert code here to add functionality to your managed object subclass

- (void)awakeFromInsert
{
    [super awakeFromInsert];
   // self.shouldBeSynced = [NSNumber numberWithBool:NO];
    
}

-(void) start {
    startTime = [NSDate date];
}

-(void) stop {
    NSDate *stopTime = [NSDate date];
    //dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
    NSTimeInterval secondsBetween = [stopTime timeIntervalSinceDate:startTime];
    self.totalTime += [NSNumber numberWithFloat:secondsBetween];
    self.numberOfMeasurements++;
    //});
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/TimerAggregate.php";
}

-(NSDictionary *) getData {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:[super getMetadata]];
    //[dictionary setObject:self.durationTime forKey:@"durationTime"];
    return dictionary;
}

@end
