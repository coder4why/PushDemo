//
//  RootViewController.m
//  PUSHDemo
//
//  Created by hu ping kang on 2019/8/13.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import <MapKit/MapKit.h>
#import "RootViewController.h"

@interface RootViewController ()<CLLocationManagerDelegate>{
  CLLocationManager * _locationManager;       // 位置管理器
}
@end
@implementation RootViewController
- (void)viewDidLoad {
  [super viewDidLoad];
    _locationManager = [CLLocationManager new];
    _locationManager.delegate = self;
    [_locationManager requestAlwaysAuthorization];
}

// 当定位授权状态改变时
- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
  switch (status){
    case kCLAuthorizationStatusDenied:                  // 拒绝授权
      NSLog(@"授权失败：用户拒绝授权或未开启定位服务");
      break;
    case kCLAuthorizationStatusAuthorizedWhenInUse:     // 在使用期间使用定位
      NSLog(@"授权成功：用户允许应用“使用期间”使用定位服务");
      break;
    case kCLAuthorizationStatusAuthorizedAlways:
      NSLog(@"授权成功：用户允许应用“始终”使用定位服务");    // 始终使用定位服务
      break;
  }
}
@end
