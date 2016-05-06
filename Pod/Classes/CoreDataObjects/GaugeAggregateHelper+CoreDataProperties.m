//
//  Gauge+CoreDataProperties.m
//  SportsTimer
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "GaugeAggregateHelper+CoreDataProperties.h"

@implementation GaugeAggregateHelper (CoreDataProperties)

@dynamic mean;
@dynamic numberOfMeasurements;
@dynamic median;
@dynamic lowest;
@dynamic highest;

@end
