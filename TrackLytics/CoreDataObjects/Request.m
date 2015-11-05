//
//  Request.m
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Request.h"
#import "UIDeviceHardware.h"
@implementation Request

// Insert code here to add functionality to your managed object subclass

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
