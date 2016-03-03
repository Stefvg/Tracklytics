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

-(void) inc;
-(void) inc:(NSInteger) value;
-(void) dec;
-(void) dec:(NSInteger) value;

@end

NS_ASSUME_NONNULL_END

#import "CounterObject+CoreDataProperties.h"
