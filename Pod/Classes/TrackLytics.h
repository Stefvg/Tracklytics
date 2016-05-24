//
//  Logger.h
//  Tracklytics
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


/**
 * Start the tracklytics library with your app code received from the dashboard and the frequency indicating when the library has to sync the data.
 * @param   appCode
 *          The code received from the Tracklytics dashboard.
 * @param   interval
 *          An interval indicating the frequency of the syncing to the server of the data. (in seconds)
 */
+(void) startTrackerWithAppCode:(NSInteger) appCode withSyncInterval:(double) interval;

/**
 * This method should not be used in the app.
 */
+(void) addRequest:(Core *) request;

/**
 * With this method you can create a counter. A counter can be used to count some event. 
 * The counter must be created with a type and a name.
 *
 * @param   type
 *          The type of the counter. This is used to differentiate in which diagram the counter will appear on the dashboard.
 * @param   name
 *          The name is used to differentiate the counter within the diagram from other counters.
 * @return  A counter object that can be manipulated.
 */
+(CounterObject *) createNewCounterWithType:(NSString *)type withName:(NSString *) name;

/**
 * With this method you can create a counter. A counter can be used to count some event. This counter has an initial value.
 * The counter must be created with a type and a name.
 *
 * @param   type
 *          The type of the counter. This is used to differentiate in which diagram the counter will appear on the dashboard.
 * @param   name
 *          The name is used to differentiate the counter within the diagram from other counters.
 * @param   value
 *          The initial value of the counter.
  * @return  A counter object that can be manipulated.
 */
+(CounterObject *) createNewCounterWithType:(NSString *)type withName:(NSString *) name withValue:(NSInteger) value;

/**
 * This method creates a new Timer. The timer starts when it is created.
 * @param   type
 *          The type of the timer. This is used to differentiate in which diagram the timer will appear on the dashboard.
 * @param   name
 *          The name is used to differentiate the timer within the diagram from other timers.
  * @return  A timer object to stop the timer after the event.
 */
+(Timer *) createNewTimerWithType:(NSString *)type withName:(NSString *)name;

/**
 * Create a new gauge. A gauge holds a value.
 *
 * @param   type
 *          The type of the gauge. This is used to differentiate in which diagram the gauge will appear on the dashboard.
 * @param   name
 *          The name is used to differentiate the gauge within the diagram from other gauges.
 * @param   value
 *          The value of the gauge.
 */
+(void) createNewGaugeWithType:(NSString *) type withName:(NSString *) name withValue:(NSInteger) value;

/**
 * Create a new histogram value.
 *
 * @param   type
 *          The type of the histogram. This is used to differentiate in which diagram the histogram will appear on the dashboard.
 * @param   name
 *          The name is used to differentiate the histogram within the diagram from other histograms.
 * @param   value
 *          The value of the histogram.
 */
+(void) createNewHistogramWithType:(NSString *)type withName:(NSString *) name withValue:(NSInteger) value;

/**
 * Create a new MeterController. The MeterController instance can be used to collect meter values.
 *
 * @param   type
 *          The type of the meter. This is used to differentiate in which diagram the meter will appear on the dashboard.
 */
+(MeterController *) createNewMeter:(NSString *) type;

/**
 * This method should not be used in the app.
 */
+(void) addMeterEntryWithType:(NSString *)type withValue:(NSNumber *)value;

/**
 * This method should not be used in the app.
 */
+(NSDictionary *) getMetaData;

/**
 * This method should not be used in the app.
 */
+(void) save;
@end
