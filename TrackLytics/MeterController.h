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
@property (nonatomic, strong) NSString *name;

-(void) addEntry:(float) value;

-(void) addRepeatable:(id<MeterInterface>) interface withTimeInterval:(NSTimeInterval) interval;

-(void) stop;

@end
