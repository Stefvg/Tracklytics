//
//  Counter.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Counter.h"

@implementation Counter

// Insert code here to add functionality to your managed object subclass

- (void)awakeFromInsert
{
    [super awakeFromInsert];
    self.value = [NSNumber numberWithInt:1];
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/Counter.php";
}

-(NSDictionary *) getData {
    return [NSDictionary dictionaryWithObjects:@[self.type, self.name, self.value, [super getDate], [super getDevice]] forKeys:@[@"type",@"name", @"value", @"date", @"device"]];
}

@end
