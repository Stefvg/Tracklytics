//
//  HTTPPost.h
//  Tracklytics
//
//  Created by Stef Van Gils on 28/11/15.
//  Copyright © 2015 KU Leuven. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface HTTPPost : NSObject {
 NSMutableData *responseData;   
}

/*!
 * @discussion This method sends a request to the server and retrieves data.
 * @param url The url to the file.
 * @param data The data that has to be send to the server.
 * @return The data returned from the server, probably a string message.
 */
-(NSData*) postSynchronous:(NSString*)url data:(NSDictionary*)data;

/*!
 * @discussion This method sends a request to the server and retrieves the JSON encoded data.
 * @param url The url to the file.
 * @param data The data that has to be send to the server.
 * @return A dictionary containing the info from the JSON returned from the server.
 */
-(NSDictionary*)postReturnDictionary:(NSString*)url data:(NSDictionary*)data;

@end
