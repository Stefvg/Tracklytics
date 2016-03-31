//
//  Meter.h
//  SportsTimer
//
//  Created by Stef Van Gils on 28/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MeterInterface.h"
@interface MeterController : NSObject

@property (nonatomic, strong) NSString *type;

/**
 * Add an entry manually to the meter.
 * @param   value
 *          A float value indicating a meter observation.
 */
-(void) addEntry:(float) value;

/**
 * Configure a repeatable operation. The value of the meter gets collected periodically.
 * @param   interface
 *          An instance of an object implementing the MeterInterface.
 * @param   interval
 *          The frequency of the collection of the data. (in seconds)
 */
-(void) addRepeatable:(id<MeterInterface>) interface withTimeInterval:(NSTimeInterval) interval;

-(void) stop;

@end
