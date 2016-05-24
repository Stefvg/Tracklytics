//
//  Meter.m
//  Tracklytics
//
//  Created by Stef Van Gils on 28/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "MeterAggregateHelper.h"
#import "TrackLytics.h"
@implementation MeterAggregateHelper

-(void) initialize {
    [super initialize];
    self.total = [NSNumber numberWithFloat:0];
    self.numberOfMeasurements = [NSNumber numberWithInteger:0];
}


-(void) addValue: (float) value{
    float currentValue = [self.total floatValue];
    NSInteger numberOfMeasurements = [self.numberOfMeasurements intValue];
    float newValue = (currentValue*numberOfMeasurements + value) / (numberOfMeasurements +1);
    numberOfMeasurements++;
    self.total = [NSNumber numberWithFloat:newValue];
    self.numberOfMeasurements = [NSNumber numberWithInteger:numberOfMeasurements];
    [TrackLytics addRequest:self];
}


// Insert code here to add functionality to your managed object subclass
-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/MeterAggregateHelper.php";
}

-(NSDictionary *) getData {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:[super getMetadata]];
    [dictionary setObject:self.total forKey:@"mean"];
    [dictionary setObject:self.numberOfMeasurements forKey:@"numberOfMeasurements"];
    return dictionary;
}

@end
