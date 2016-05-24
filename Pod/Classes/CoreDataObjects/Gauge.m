//
//  Gauge.m
//  Tracklytics
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "Gauge.h"

@implementation Gauge

// Insert code here to add functionality to your managed object subclass

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/Gauge.php";
}

-(NSDictionary *) getData {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:[super getMetadata]];
    [dictionary setObject:self.value forKey:@"value"];
    return dictionary;
}

@end
