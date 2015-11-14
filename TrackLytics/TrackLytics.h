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
#import "Counter+CoreDataProperties.h"
#import "Gauge+CoreDataProperties.h"
#import "Histogram+CoreDataProperties.h"
@interface TrackLytics : NSObject

@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;


+(void) startTrackerWithAppCode:(NSString *) appCode;

+(void) addRequest:(Core *) request;

+(void) createNewCounterWithType:(NSString *)type withName:(NSString *) name;
+(void) createNewCounterWithType:(NSString *)type withName:(NSString *) name withValue:(NSInteger) value;
+(Timer *) createNewTimerWithType:(NSString *)type withName:(NSString *)name;
+(void) createNewGaugeWithType:(NSString *) type withName:(NSString *) name withValue:(NSNumber *) value;
+(void) createNewHistogramWithType:(NSString *)type withName:(NSString *) name withValue:(NSInteger) value;
@end
