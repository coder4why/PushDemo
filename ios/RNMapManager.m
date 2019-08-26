//
//  RNMapManager.m
//  PUSHDemo
//
//  Created by hu ping kang on 2019/8/12.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import <AMapSearchKit/AMapSearchKit.h>
#import <MJExtension/MJExtension.h>
#import "AMapTool.h"
#import "RNMapManager.h"
#import <SVProgressHUD/SVProgressHUD.h>

@implementation RNMapManager
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(getLocationCallback:(RCTResponseSenderBlock)callback){
  
    [AMapTool.shared getLocationSuccess:^(NSArray * _Nonnull results) {
      callback(results);
    } fail:^{
    }];
}
RCT_EXPORT_METHOD(searchBusLine:(NSString *)lineNumber callback:(RCTResponseSenderBlock)callback){
  
  [AMapTool.shared searchCityBusLines:lineNumber success:^(NSArray<AMapBusLine *>* _Nonnull results) {
    NSMutableArray<NSDictionary*>*calls = [NSMutableArray array];
    for (AMapBusLine * line in results) {
        NSDictionary * dix = [line mj_keyValues];
        [calls addObject:dix];
    }
    callback(calls);
  } fail:^{
  }];
  
}
RCT_EXPORT_METHOD(searchWeatherForcast:(NSString *)city callback:(RCTResponseSenderBlock)callback){
  
  [AMapTool.shared queryWeatherCityName:city
                                success:^(NSArray<AMapLocalWeatherForecast *> * _Nonnull results) {
                                 
                                  NSMutableArray<NSDictionary*>*calls = [NSMutableArray array];
                                  for (AMapLocalWeatherForecast * line in results) {
                                    NSDictionary * dix = [line mj_keyValues];
                                    [calls addObject:dix];
                                  }
                                  callback(calls);
                                } fail:^{
                                  [SVProgressHUD showInfoWithStatus:@"查询失败"];
                                }];
  
}
@end
