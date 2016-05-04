//
//  Timer.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Timer.h"
#import "TrackLytics.h"

@implementation Timer{
    NSDate *startTime;
}

// Insert code here to add functionality to your managed object subclass

- (void)awakeFromInsert
{
    [super awakeFromInsert];
    self.shouldBeSynced = [NSNumber numberWithBool:NO];
    startTime = [NSDate date];
}
-(void) start {
    
    self.shouldBeSynced = [NSNumber numberWithBool:NO];
    startTime = [NSDate date];

}


-(void) stop {
    NSDate *stopTime = [NSDate date];
    //dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSTimeInterval secondsBetween = [stopTime timeIntervalSinceDate:startTime];
        self.durationTime = [NSNumber numberWithFloat:secondsBetween];
        self.shouldBeSynced = [NSNumber numberWithBool:YES];
        [TrackLytics addRequest:self];
    //});
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/Timer.php";
}

-(NSDictionary *) getData {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:[super getMetadata]];
    [dictionary setObject:self.durationTime forKey:@"durationTime"];
    return dictionary;
}

@end
