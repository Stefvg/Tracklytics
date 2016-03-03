//
//  Logger.h
//  SportsTimer
//
//  Created by Stef Van Gils on 29/09/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import "Core+CoreDataProperties.h"
#import "Timer+CoreDataProperties.h"
#import "CounterObject+CoreDataProperties.h"
#import "Gauge+CoreDataProperties.h"
#import "Histogram+CoreDataProperties.h"
#import "Meter+CoreDataProperties.h"
#import "MeterController.h"
@interface TrackLytics : NSObject

@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;


+(void) startTrackerWithAppCode:(NSInteger) appCode;

+(void) addRequest:(Core *) request;

+(CounterObject *) createNewCounterWithType:(NSString *)type withName:(NSString *) name;
+(CounterObject *) createNewCounterWithType:(NSString *)type withName:(NSString *) name withValue:(NSInteger) value;
+(Timer *) createNewTimerWithType:(NSString *)type withName:(NSString *)name;
+(void) createNewGaugeWithType:(NSString *) type withName:(NSString *) name withValue:(NSNumber *) value;
+(void) createNewHistogramWithType:(NSString *)type withName:(NSString *) name withValue:(NSInteger) value;
+(MeterController *) createNewMeter:(NSString *) type withName:(NSString *) name;
+(void) addMeterEntryWithType:(NSString *)type withName:(NSString *)name withValue:(NSNumber *)value;


+(NSDictionary *) getMetaData;
@end
