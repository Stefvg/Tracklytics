//
//  StorageManager.h
//  Tracklytics
//
//  Created by Stef Van Gils on 25/10/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
@interface StorageManager : NSObject
@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;


/**
 * Used by the Tracklytics library to store data on disk
 */
+ (id)sharedInstance;
/**
 * Used by the Tracklytics library to store data on disk
 */
-(NSManagedObjectContext *) getContext;

/**
 * Used by the Tracklytics library to store data on disk
 */
-(void) save;

@end
