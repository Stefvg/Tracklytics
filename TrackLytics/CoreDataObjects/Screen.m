//
//  Screen.m
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Screen.h"

@implementation Screen

// Insert code here to add functionality to your managed object subclass


-(NSDictionary *) getData {
    return [NSDictionary dictionaryWithObjects:@[self.name, [super getDate], [super getDevice]] forKeys:@[@"name", @"date", @"device"]];
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/Screen.php";
}

@end
