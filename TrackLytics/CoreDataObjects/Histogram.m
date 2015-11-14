//
//  Histogram.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Histogram.h"

@implementation Histogram

// Insert code here to add functionality to your managed object subclass

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/Histogram.php";
}

-(NSDictionary *) getData {
    return [NSDictionary dictionaryWithObjects:@[self.type, self.name, self.value, [super getDate], [super getDevice]] forKeys:@[@"type",@"name", @"value", @"date", @"device"]];
}

@end
