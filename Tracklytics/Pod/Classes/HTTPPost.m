//
//  HTTPPost.m
//  voedingscentrum
//
//  Created by Eelco van de Wiel on 27-05-13.
//  Copyright (c) 2013 intoapps. All rights reserved.
//

#import "HTTPPost.h"

@implementation HTTPPost



-(NSData*) postSynchronous:(NSString*)url data:(NSDictionary*)data {
    @try {
        NSMutableURLRequest *request = [NSMutableURLRequest
                                        requestWithURL:[NSURL URLWithString:url]];
        
        NSError *error;
        NSURLResponse *response;
        NSString *post = @"";
        for (NSObject *key in data) {
            NSString *value = [data objectForKey:key];
            
            
            post = [NSString stringWithFormat:@"%@%@=%@&", post, key, value];
        }
        if (post.length>1) {
            post = [post substringToIndex:(post.length -1)];
        }
        
        NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
        //[request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setHTTPMethod:@"POST"];
        [request setHTTPBody:postData];
        
        NSData *resp = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        
        
        return resp;

    }
    @catch (NSException *exception) {
        return nil;
    }

    
    
}

-(NSDictionary*) postReturnDictionary:(NSString*)url data:(NSDictionary*)data {
    @try {
        NSMutableURLRequest *request = [NSMutableURLRequest
                                        requestWithURL:[NSURL URLWithString:url]];
        
        NSError *error;
        NSURLResponse *response;
        
        NSString *post = @"";
        for (NSObject *key in data) {
            NSString *value = [data objectForKey:key];
            
            
            post = [NSString stringWithFormat:@"%@%@=%@&", post, key, value];
        }
        if (post.length>1) {
            post = [post substringToIndex:(post.length -1)];
        }
        
        NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
        //NSData *postData = [NSJSONSerialization dataWithJSONObject:data options:0 error:&error];
        //[request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setHTTPMethod:@"POST"];
        [request setHTTPBody:postData];
        NSData *resp = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];

        NSDictionary *returnObject=[NSJSONSerialization JSONObjectWithData:resp options:
                                    NSJSONReadingMutableContainers error:&error];
        return returnObject;
    }
    @catch (NSException *exception) {
        return nil;
    }
}


- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    responseData = [NSMutableData data];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    [responseData appendData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{

}





@end
