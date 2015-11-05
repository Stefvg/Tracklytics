//
//  Networking.m
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Networking.h"

@implementation Networking

// Insert code here to add functionality to your managed object subclass

-(NSDictionary *) getData {
    return [NSDictionary dictionaryWithObjects:@[self.name, [super getDate], [super getDevice], self.durationTime, self.connectionType] forKeys:@[@"name", @"date", @"device",  @"durationTime", @"connectionType"]];
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/Network.php";
}

@end
