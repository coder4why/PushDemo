/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import <AMapFoundationKit/AMapFoundationKit.h>
#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Bugly/Bugly.h>
#import <AVFoundation/AVFoundation.h>
#import <AvoidCrash/AvoidCrash.h>
#import <JPush/JPUSHService.h>
#import "AMapTool.h"
#import "RootViewController.h"
@interface AppDelegate()<CLLocationManagerDelegate>{
  CLLocationManager * _locationManager;
}
@end
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [AMapServices sharedServices].apiKey = @"a51fb8446847993cbf0585157d4a7491";
  [Bugly startWithAppId:@"8da6aeaefb"];
  [AvoidCrash becomeEffective];
  [AvoidCrash makeAllEffective];
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = UIColor.whiteColor;
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"PUSHDemo"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view.backgroundColor = UIColor.whiteColor;
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self requestAuth];
  [self.window makeKeyAndVisible];
  
  return YES;
  
}

-(void)requestAuth{
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
    {
      NSLog(@"授权成功：用户允许应用“使用期间”使用定位服务");
    }
      break;
    case kCLAuthorizationStatusAuthorizedAlways:
    {
      NSLog(@"授权成功：用户允许应用“始终”使用定位服务");
    }
      break;
    default:
      break;
  }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

@end
