//
//  Timer.h
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "StorageManager.h"
#import "DefaultTracking+CoreDataProperties.h"

@interface Timer : NSObject

-(void) initTimer:(DefaultTracking *) trackingObject;
-(void) stop;

@end
