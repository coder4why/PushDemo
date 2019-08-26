//
//  AMapTool.h
//  PUSHDemo
//
//  Created by hu ping kang on 2019/8/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface AMapTool : NSObject

+(instancetype)shared;
@property(nonatomic,strong)NSString * city;
@property(nonatomic,strong)NSString * latitude;
@property(nonatomic,strong)NSString * longtitude;
-(void)getLocationSuccess:(void(^)(NSArray*results))success fail:(void(^)(void))fail;
-(void)searchCityBusLines:(NSString *)keyword success:(void(^)(NSArray*results))success fail:(void(^)(void))fail;
-(void)queryWeatherCityName:(NSString *)cityName success:(void(^)(NSArray*results))success fail:(void(^)(void))fail;
@end

NS_ASSUME_NONNULL_END
