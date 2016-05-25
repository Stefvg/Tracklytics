//
//  TracklyticsViewController.m
//  Tracklytics
//
//  Created by Stefvg on 03/31/2016.
//  Copyright (c) 2016 Stefvg. All rights reserved.
//

#import "TracklyticsViewController.h"
#import "TrackLytics.h"
#import "CounterObject.h"
#import "Timer.h"
#import "MeterController.h"
@interface TracklyticsViewController (){
    CounterObject *counter;
}

@end

@implementation TracklyticsViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    counter = [TrackLytics createNewCounterWithType:@"Button" withName:@"button1"];
    
    MeterController *controller = [TrackLytics createNewMeter:@"Meter"];
    [controller addEntry:2.0]; //if you only want to collect values manually
    [controller addRepeatable:self withTimeInterval:10.0]; //if you want to collect values automatically with an interval between two collections.
}

-(void) viewWillAppear:(BOOL)animated {
    [TrackLytics createNewCounterWithType:@"Screen Visit" withName:@"Home Screen" withValue:1];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)buttonClick:(id)sender {
    //Some stuff what you want to do with the button.
    [counter inc];
}


-(void) someMethod {
    Timer *timer = [TrackLytics createNewTimerWithType:@"Method Timer" withName:@"someMethod"];
    //some stuff you want to time.
    [timer stop];
    
}

-(void) someMethod2 {
    //random values
    [TrackLytics createNewGaugeWithType:@"Gauge" withName:@"someMethod2" withValue:20];
    [TrackLytics createNewHistogramWithType:@"Histogram" withName:@"someMethod2" withValue:20];
    
}

-(float) getValue {
    //random value
    return 1.0;
}

@end
