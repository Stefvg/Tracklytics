//
//  Switch.m
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Switch.h"

@implementation Switch

// Insert code here to add functionality to your managed object subclass
-(NSDictionary *) getData {
    return [NSDictionary dictionaryWithObjects:@[self.name, [super getDate], [super getDevice], [self.isOn stringValue]] forKeys:@[@"name", @"date", @"device", @"isOn"]];
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/Switch.php";
}

@end
