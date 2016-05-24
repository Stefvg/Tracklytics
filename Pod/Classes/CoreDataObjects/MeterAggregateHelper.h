//
//  Meter.h
//  Tracklytics
//
//  Created by Stef Van Gils on 28/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Core.h"

NS_ASSUME_NONNULL_BEGIN

@interface MeterAggregateHelper : Core

// Insert code here to declare functionality of your managed object subclass

/**
 * This method is used by the Tracklytics library to initialize the aggregate object with the correct values.
 */
-(void) initialize;

/**
 * This method is used by the Tracklytics library to add a value to the aggregate object.
 */
-(void) addValue:(float) value;

@end

NS_ASSUME_NONNULL_END

#import "MeterAggregateHelper+CoreDataProperties.h"
