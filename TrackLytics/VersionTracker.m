//
//  VersionTracker.m
//  SportsTimer
//
//  Created by Stef Van Gils on 25/10/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import "VersionTracker.h"
#import "HTTPPost.h"
@implementation VersionTracker

-(void) getVersion:(NSString *) device {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        HTTPPost *httpPost = [HTTPPost new];
        NSString *url = @"https://svg-apache.iminds-security.be/GetVersion.php";
        NSDictionary *dict = [NSDictionary dictionaryWithObject:device forKey:@"device"];
        dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
            NSData *data = [httpPost postSynchronous:url data:dict];
           version = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
            version = [version stringByReplacingOccurrencesOfString:@"\t" withString:@""];
            version = [version stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        });

    });
}

@end
