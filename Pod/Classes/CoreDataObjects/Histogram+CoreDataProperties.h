//
//  Histogram+CoreDataProperties.h
//  Tracklytics
//
//  Created by Stef Van Gils on 23/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "Histogram.h"

NS_ASSUME_NONNULL_BEGIN

@interface Histogram (CoreDataProperties)

@property (nullable, nonatomic, retain) NSNumber *value;

@end

NS_ASSUME_NONNULL_END
