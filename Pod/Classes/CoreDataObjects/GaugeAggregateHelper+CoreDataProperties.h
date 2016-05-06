//
//  Gauge+CoreDataProperties.h
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "GaugeAggregateHelper.h"

NS_ASSUME_NONNULL_BEGIN

@interface GaugeAggregateHelper (CoreDataProperties)

@property (nullable, nonatomic, retain) NSNumber *mean;
@property (nullable, nonatomic, retain) NSNumber *numberOfMeasurements;
@property (nullable, nonatomic, retain) NSNumber *median;
@property (nullable, nonatomic, retain) NSNumber *highest;
@property (nullable, nonatomic, retain) NSNumber *lowest;



@end

NS_ASSUME_NONNULL_END
