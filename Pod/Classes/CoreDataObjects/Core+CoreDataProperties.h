//
//  Core+CoreDataProperties.h
//  Tracklytics
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "Core.h"

NS_ASSUME_NONNULL_BEGIN

@interface Core (CoreDataProperties)

@property (nullable, nonatomic, retain) NSDate *date;
@property (nullable, nonatomic, retain) NSString *type;
@property (nullable, nonatomic, retain) NSString *name;
@property (nullable, nonatomic, retain) NSNumber *shouldBeSynced;
@property (nullable, nonatomic, retain) NSString *databaseID;
@property (nullable, nonatomic, retain) NSString *connectionType;
@end

NS_ASSUME_NONNULL_END
