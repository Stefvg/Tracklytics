//
//  CounterObject.m
//  SportsTimer
//
//  Created by Stef Van Gils on 5/12/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "CounterObject.h"
#import "TrackLytics.h"
@implementation CounterObject

// Insert code here to add functionality to your managed object subclass

// Insert code here to add functionality to your managed object subclass

- (void)awakeFromInsert
{
    [super awakeFromInsert];
    self.value = [NSNumber numberWithInt:0];
}

-(NSString *) getURL {
    return @"https://svg-apache.iminds-security.be/backend/Counter.php";
}

-(NSDictionary *) getData {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:[super getMetadata]];
    [dictionary setObject:self.value forKey:@"value"];
    return dictionary;
}

-(void) inc {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSInteger value = [self.value integerValue];
        value++;
        self.value = [NSNumber numberWithInteger:value];
        [TrackLytics addRequest:self];
    });
}

-(void) inc:(NSInteger)number {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSInteger value = [self.value integerValue];
        value+=number;
        self.value = [NSNumber numberWithInteger:value];
        [TrackLytics addRequest:self];
    });
}

-(void) dec {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSInteger value = [self.value integerValue];
        value--;
        self.value = [NSNumber numberWithInteger:value];
        [TrackLytics addRequest:self];
    });
}

-(void) dec:(NSInteger)number {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        NSInteger value = [self.value integerValue];
        value-=number;
        self.value = [NSNumber numberWithInteger:value];
        [TrackLytics addRequest:self];
    });
}

@end
