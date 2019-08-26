//
//  AMapTool.m
//  PUSHDemo
//
//  Created by hu ping kang on 2019/8/12.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import <SVProgressHUD/SVProgressHUD.h>
#import "Global.h"
#import <MAMapKit/MAMapKit.h>
#import <AMapLocationKit/AMapLocationKit.h>
#import <AMapSearchKit/AMapSearchKit.h>
#import "AMapTool.h"
@interface AMapTool()<AMapSearchDelegate,AMapLocationManagerDelegate,CLLocationManagerDelegate,MAMapViewDelegate>
@property(nonatomic,strong)AMapSearchAPI * search;
@property(nonatomic,strong)AMapLocationManager * locationManager;
@property(nonatomic,strong)MAMapView * mapView;
@property(nonatomic,copy)void(^success)(NSArray *results);
@property(nonatomic,copy)void(^fail)(void);
@end
@implementation AMapTool
-(MAMapView *)mapView{
  if (!_mapView) {
    _mapView = [[MAMapView alloc]initWithFrame:CGRectMake(0, 0, 0.5, 0.5)];
    _mapView.showsUserLocation = YES;
    _mapView.hidden = NO;
    _mapView.desiredAccuracy = kCLLocationAccuracyBest;
  }
  return _mapView;
}
-(AMapSearchAPI *)search{
  if (!_search) {
    _search = [[AMapSearchAPI alloc]init];
    _search.delegate = self;
  }
  return _search;
}
-(AMapLocationManager *)locationManager{
  if (!_locationManager) {
    _locationManager = [[AMapLocationManager alloc]init];
    _locationManager.distanceFilter = 200;
    [_locationManager setLocatingWithReGeocode:YES];
  }
  return _locationManager;
}
static AMapTool * tool = nil;
+(instancetype)shared{
  if (tool==nil) {
    tool = [[self alloc]init];
  }
  return tool;
}

-(void)getLocationSuccess:(void(^)(NSArray*results))success fail:(void(^)(void))fail{
  self.success = success;
  self.fail=fail;
  self.locationManager.delegate = self;
  [self.locationManager setLocatingWithReGeocode:YES];
  [self.locationManager startUpdatingLocation];
}
  
-(void)startLocation{
  self.mapView.delegate = self;
  [[Global topViewController].view addSubview:self.mapView];
}

-(void)searchCityBusLines:(NSString *)keyword success:(void(^)(NSArray*results))success fail:(void(^)(void))fail{
//  [SVProgressHUD show];
  if (self.city==nil || self.city.length==0) {
    self.city = @"上海";
  }
  self.success = success;
  self.fail = fail;
  [Global translateHZToPingyin:self.city completed:^(NSString * _Nonnull pinyin) {
    self.city = pinyin;
    AMapBusLineNameSearchRequest *line = [[AMapBusLineNameSearchRequest alloc] init];
    line.keywords           = keyword;
    line.city               = pinyin;
    line.requireExtension   = YES;
    [self.search AMapBusLineNameSearch:line];
  }];

}
#pragma mark --公交路线回调
- (void)onBusLineSearchDone:(AMapBusLineBaseSearchRequest *)request response:(AMapBusLineSearchResponse *)response
{
//  [SVProgressHUD dismiss];
  if (response.buslines.count == 0)
  {
    if (self.fail) {
      self.fail();
    }
    return;
  }else{
    if (self.success) {
      self.success(response.buslines);
//      [SVProgressHUD showInfoWithStatus:response.buslines.firstObject.name];
    }
  }
}
- (void)AMapSearchRequest:(id)request didFailWithError:(NSError *)error{
    if (self.fail) {
      self.fail();
    }
//  [SVProgressHUD dismiss];
}
#pragma mark -- 公交站点回调
- (void)onBusStopSearchDone:(AMapBusStopSearchRequest *)request response:(AMapBusStopSearchResponse *)response
  {
//    [SVProgressHUD dismiss];
    if (response.busstops.count == 0)
    {
      if (self.fail) {
        self.fail();
      }
      return;
    }else{
      if (self.success) {
        self.success(response.busstops);
      }
    }
}
#pragma mark -- AMapLocationManagerDelegate
- (void)amapLocationManager:(AMapLocationManager *)manager didUpdateLocation:(CLLocation *)location reGeocode:(AMapLocationReGeocode *)regeocode
{
  self.latitude = [NSString stringWithFormat:@"%f",location.coordinate.latitude];
  self.longtitude = [NSString stringWithFormat:@"%f",location.coordinate.longitude];
  [self regeoLocation:location];
  [manager stopUpdatingLocation];
}
-(void)amapLocationManager:(AMapLocationManager *)manager doRequireLocationAuth:(CLLocationManager *)locationManager{
}
-(void)amapLocationManager:(AMapLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status{
  if (status == kCLAuthorizationStatusAuthorizedAlways || status == kCLAuthorizationStatusAuthorizedWhenInUse) {
//    [self startLocation];
    [manager startUpdatingHeading];
  }else{
    CLLocationManager * locationManager = [[CLLocationManager alloc]init];
    if([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0){
      [locationManager requestAlwaysAuthorization];
    }else{
      if([locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
        [locationManager requestAlwaysAuthorization]; // 永久授权
        [locationManager requestWhenInUseAuthorization]; //使用中授权
      }
    }
  }
}

-(void)regeoLocation:(CLLocation *)location{
  
  AMapReGeocodeSearchRequest *regeo = [[AMapReGeocodeSearchRequest alloc] init];
  regeo.location = [AMapGeoPoint locationWithLatitude:location.coordinate.latitude longitude:location.coordinate.longitude];
  self.latitude = [NSString stringWithFormat:@"%f",regeo.location.latitude];
  self.longtitude = [NSString stringWithFormat:@"%f",regeo.location.longitude];
  regeo.requireExtension =YES;
  regeo.radius = 100;
  self.search.delegate = self;
  [self.search AMapReGoecodeSearch:regeo];
  
}
#pragma mark - AMapSearchDelegate
- (void)onReGeocodeSearchDone:(AMapReGeocodeSearchRequest *)request response:(AMapReGeocodeSearchResponse *)response{
  
  AMapReGeocode * regeocode = response.regeocode;
  if(regeocode != nil)
  {
    self.city = regeocode.addressComponent.district;
    if (self.success) {
      self.success(@[@{@"city":self.city,@"adcode":regeocode.addressComponent.adcode}]);
    }
    return;
  }else{
    if (self.fail) {
      self.fail();
    }
    return;
  }
  
}
-(NSString *)safeString:(NSString *)string{
  if (string == nil) {
    return @"";
  }
  return string;
}
 -(void)queryWeatherCityName:(NSString *)adcode success:(void(^)(NSArray*results))success fail:(void(^)(void))fail{
  self.success = success;
  self.fail = fail;
//  AMapDistrictSearchRequest *dist = [[AMapDistrictSearchRequest alloc] init];
//  dist.keywords = cityName;
//  dist.requireExtension = YES;
//  self.search.delegate = self;
//  [self.search AMapDistrictSearch:dist];
   [self queryCityCode:adcode success:^(NSArray *results) {
     if (self.success) {
       self.success(results);
     }
   }];
}
#pragma mark -- 行政区划回调
- (void)onDistrictSearchDone:(AMapDistrictSearchRequest *)request response:(AMapDistrictSearchResponse *)response{
    if (response.districts.count == 0){
      if (self.fail) {
        self.fail();
      }
    }else{
//      [SVProgressHUD showInfoWithStatus:response.districts.firstObject.adcode];
      [self queryCityCode:response.districts.firstObject.adcode success:^(NSArray *results) {
        if (self.success) {
          self.success(results);
        }
      }];
    }
  }
#pragma mark -- 查询实时天气
-(void)queryCityCode:(NSString *)cityCode success:(void(^)(NSArray*results))success{
  AMapWeatherSearchRequest *request = [[AMapWeatherSearchRequest alloc] init];
  request.city = cityCode;
  request.type = AMapWeatherTypeForecast; //AMapWeatherTypeLive为实时天气；AMapWeatherTypeForecase为预报天气
  self.search.delegate = self;
  [self.search AMapWeatherSearch:request];
}
- (void)onWeatherSearchDone:(AMapWeatherSearchRequest *)request response:(AMapWeatherSearchResponse *)response{
  
  if (response.forecasts.count>0) {
    if (self.success) {
      self.success(response.forecasts);
//      NSMutableString * string = [NSMutableString string];
//      for (AMapLocalWeatherForecast * cast in response.forecasts) {
//        for (AMapLocalDayWeatherForecast * xs in cast.casts) {
//          [string appendString:[NSString stringWithFormat:@"-%@",xs.dayWeather]];
//        }
//      }
//      [SVProgressHUD showInfoWithStatus:string];
    }
  }else{
    if (self.fail) {
      self.fail();
    }
  }
}
@end
