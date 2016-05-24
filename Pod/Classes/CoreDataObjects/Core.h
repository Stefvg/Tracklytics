//
//  Core.h
//  Tracklytics
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

NS_ASSUME_NONNULL_BEGIN

@interface Core : NSManagedObject

-(void) initialize;
/**
 * This method is purely used in the library. It shouldn't be used by a developer.
 */
-(NSDictionary *) getData;
/**
 * This method is purely used in the library. It shouldn't be used by a developer.
 */
-(NSString *) getDate;
/**
 * This method is purely used in the library. It shouldn't be used by a developer.
 */
-(NSString *) getURL;
/**
 * This method is purely used in the library. It shouldn't be used by a developer.
 */
-(NSString *) getDatabaseID;
/**
 * This method is purely used in the library. It shouldn't be used by a developer.
 */
-(NSDictionary *) getMetadata;
@end

NS_ASSUME_NONNULL_END

#import "Core+CoreDataProperties.h"
