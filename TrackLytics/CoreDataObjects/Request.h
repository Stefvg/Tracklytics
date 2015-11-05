//
//  Request.h
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

NS_ASSUME_NONNULL_BEGIN

@interface Request : NSManagedObject

// Insert code here to declare functionality of your managed object subclass

-(NSDictionary *) getData;
-(NSString *) getDevice;
-(NSString *) getDate;
-(NSString *) getURL;
@end

NS_ASSUME_NONNULL_END

#import "Request+CoreDataProperties.h"