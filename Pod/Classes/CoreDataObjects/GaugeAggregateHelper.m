//
//  Gauge.m
//  Tracklytics
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "GaugeAggregateHelper.h"
#import "TrackLytics.h"
@implementation GaugeAggregateHelper{
    NSMutableArray *valueArray;
}

// Insert code here to add functionality to your managed object subclass

-(void) initialize{
    [super initialize];
    valueArray = [NSMutableArray new];
    self.highest = [NSNumber numberWithInteger: INT_MIN];
    self.lowest = [NSNumber numberWithInteger:INT_MAX];
}

-(void) addValue:(NSInteger) value {
    [valueArray addObject:[NSNumber numberWithInteger:value]];
    NSInteger numberOfMeasurements =  [self.numberOfMeasurements integerValue];
    float mean =  [self.mean floatValue];
    NSInteger lowest =  [self.lowest integerValue];
    NSInteger highest =  [self.highest integerValue];
    
    mean = (mean * numberOfMeasurements + value) / (numberOfMeasurements + 1);
    
    if(value < lowest){
        lowest = value;
    }
    if(value > highest){
        highest = value;
    }
    
    self.mean = [NSNumber numberWithFloat:mean];
    self.lowest = [NSNumber numberWithInteger:lowest];
    self.highest = [NSNumber numberWithInteger:highest];
    self.median = [self getMedian];
    numberOfMeasurements++;
    self.numberOfMeasurements = [NSNumber numberWithInteger:numberOfMeasurements];
    [TrackLytics addRequest:self];
}

-(NSNumber *) getMedian {
    [valueArray sortUsingComparator:^(id obj1, id obj2) {
        if (obj1 > obj2)
            return NSOrderedAscending;
        else if (obj1 < obj2)
            return NSOrderedDescending;
        
        return NSOrderedSame;
    }];
    
    NSInteger middle = valueArray.count / 2;
    if(valueArray.count>0){
        return [valueArray objectAtIndex:middle];
    }else {
        return 0;
    }
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/GaugeAggregateHelper.php";
}

-(NSDictionary *) getData {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:[super getMetadata]];
    [dictionary setObject:self.numberOfMeasurements forKey:@"numberOfMeasurements"];
    [dictionary setObject:self.mean forKey:@"mean"];
    [dictionary setObject:self.median forKey:@"median"];
    [dictionary setObject:self.lowest forKey:@"lowest"];
    [dictionary setObject:self.highest forKey:@"highest"];
    
    return dictionary;
}

@end
