//
//  MeterInterface.h
//  Tracklytics
//
//  Created by Stef Van Gils on 28/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol MeterInterface <NSObject>

/**
 * Use this method to temporarily collect a value.
 * @return a float value.
 */
-(float) getValue;

@end

@interface MeterInterface : NSObject

@end
