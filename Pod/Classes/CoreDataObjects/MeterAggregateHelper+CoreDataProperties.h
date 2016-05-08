//
//  Meter+CoreDataProperties.h
//  SportsTimer
//
//  Created by Stef Van Gils on 28/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "MeterAggregateHelper.h"

NS_ASSUME_NONNULL_BEGIN

@interface MeterAggregateHelper (CoreDataProperties)

@property (nullable, nonatomic, retain) NSNumber *total;
@property (nullable, nonatomic, retain) NSNumber *numberOfMeasurements;


@end

NS_ASSUME_NONNULL_END
