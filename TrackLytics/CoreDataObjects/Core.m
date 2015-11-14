//
//  Core.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Core.h"
#import "UIDeviceHardware.h"
@implementation Core

// Insert code here to add functionality to your managed object subclass

- (void)awakeFromInsert
{
    [super awakeFromInsert];
    self.date = [NSDate date];
}

-(NSDictionary *) getData {
    return [NSDictionary new];
}

-(NSString *) getDevice {
    UIDeviceHardware *h=[[UIDeviceHardware alloc] init];
    NSString *device = [h platform];
    return device;
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

@end
