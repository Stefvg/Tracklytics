//
//  Logger.h
//  SportsTimer
//
//  Created by Stef Van Gils on 29/09/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import "Request+CoreDataProperties.h"
#import "Timer.h"
@interface TrackLytics : NSObject

@property (nonatomic, strong) NSString *appCode;
@property (nonatomic, strong) NSString *device;

@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;


+ (id)sharedInstance;

-(void) startTrackerWithAppCode:(NSString *) appCode;

-(void) logScreenVisit:(NSString *)name;
-(void) logButtonClick:(NSString *) name;
-(void) logSwitchClick:(NSString *)name switchIsOn:(BOOL) isOn;
-(Timer *) trackEvent:(NSString *)name;
-(Timer *) trackNetworkEvent:(NSString *)name;

-(void) addRequest:(Request *) request;
@end
