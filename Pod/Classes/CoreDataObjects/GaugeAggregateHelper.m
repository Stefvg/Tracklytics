//
//  Gauge.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "GaugeAggregateHelper.h"

@implementation GaugeAggregateHelper
@dynamic valueArray;

// Insert code here to add functionality to your managed object subclass

-(void) initGauge{
    self.valueArray = [NSMutableArray new];
}

-(void) addValue:(NSInteger) value {
    [self.valueArray addObject:[NSNumber numberWithInteger:value]];
    NSInteger numberOfMeasurements =  [self.numberOfMeasurements integerValue];
    float mean =  [self.numberOfMeasurements floatValue];
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
    self.lowest = [NSNumber numberWithInteger:value];
    self.highest = [NSNumber numberWithInteger:highest];
    self.median = [self getMedian];
    numberOfMeasurements++;
}

-(NSNumber *) getMedian {
    [self.valueArray sortUsingComparator:^(id obj1, id obj2) {
        if (obj1 > obj2)
            return NSOrderedAscending;
        else if (obj1 < obj2)
            return NSOrderedDescending;
        
        return NSOrderedSame;
    }];
    
    NSInteger middle = self.valueArray.count / 2;
    if(self.valueArray.count>0){
        return [self.valueArray objectAtIndex:middle];
    }else {
        return 0;
    }
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/GaugeAggregateHelper.php";
}

-(NSDictionary *) getData {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:[super getMetadata]];
    [dictionary setObject:self.mean forKey:@"mean"];
    [dictionary setObject:self.median forKey:@"median"];
    [dictionary setObject:self.lowest forKey:@"lowest"];
    [dictionary setObject:self.highest forKey:@"highest"];
    
    return dictionary;
}

@end
