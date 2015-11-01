//
//  Request+CoreDataProperties.h
//  SportsTimer
//
//  Created by Stef Van Gils on 25/10/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "Request.h"

NS_ASSUME_NONNULL_BEGIN

@interface Request (CoreDataProperties)

@property (nullable, nonatomic, retain) NSString *event;
@property (nullable, nonatomic, retain) NSString *name;
@property (nullable, nonatomic, retain) NSString *data;
@property (nullable, nonatomic, retain) NSDate *date;

@end

NS_ASSUME_NONNULL_END
