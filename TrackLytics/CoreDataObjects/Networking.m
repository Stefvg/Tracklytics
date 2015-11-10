//
//  Networking.m
//  SportsTimer
//
//  Created by Stef Van Gils on 7/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Networking.h"

@implementation Networking

// Insert code here to add functionality to your managed object subclass

-(NSDictionary *) getData {
    return [NSDictionary dictionaryWithObjects:@[[self getDevice], self.durationTime, [self getDate], self.name, self.connectionType] forKeys:@[@"device",@"durationTime", @"date", @"name", @"connectionType"]];
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/Network.php";
}


@end
