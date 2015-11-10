//
//  Tracking.m
//  SportsTimer
//
//  Created by Stef Van Gils on 7/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Tracking.h"

@implementation Tracking

// Insert code here to add functionality to your managed object subclass

-(NSDictionary *) getData {
    return [NSDictionary dictionaryWithObjects:@[[self getDevice], self.durationTime, [self getDate], self.name] forKeys:@[@"device",@"durationTime", @"date", @"name"]];
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/Track.php";
}

@end
