//
//  Switch+CoreDataProperties.h
//  SportsTimer
//
//  Created by Stef Van Gils on 5/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "Switch.h"

NS_ASSUME_NONNULL_BEGIN

@interface Switch (CoreDataProperties)

@property (nullable, nonatomic, retain) NSNumber *isOn;

@end

NS_ASSUME_NONNULL_END
