//
//  CounterObject.h
//  SportsTimer
//
//  Created by Stef Van Gils on 5/12/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Core.h"

NS_ASSUME_NONNULL_BEGIN

@interface CounterObject : Core

// Insert code here to declare functionality of your managed object subclass

/**
 * Increase the value of the counter with 1.
 */
-(void) inc;
/**
 * Increase the value of the counter with a certain value.
 * @param   value
 *          The value the counter has to be increased with.
 */
-(void) inc:(NSInteger) value;
/**
 * Decrease the value of the counter with 1.
 */
-(void) dec;
/**
 * Decrease the value of the counter with a certain value.
 * @param   value
 *          The value the counter has to be decreased with.
 */
-(void) dec:(NSInteger) value;

@end

NS_ASSUME_NONNULL_END

#import "CounterObject+CoreDataProperties.h"
