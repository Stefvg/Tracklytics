//
//  VersionTracker.h
//  SportsTimer
//
//  Created by Stef Van Gils on 25/10/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
static NSString *version;

@interface VersionTracker : NSObject

-(void) getVersion:(NSString *) device;

@end
