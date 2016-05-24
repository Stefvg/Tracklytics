//
//  Core+CoreDataProperties.m
//  Tracklytics
//
//  Created by Stef Van Gils on 14/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "Core+CoreDataProperties.h"

@implementation Core (CoreDataProperties)

@dynamic date;
@dynamic type;
@dynamic name;
@dynamic shouldBeSynced;
@dynamic databaseID;
@dynamic connectionType;
@end
