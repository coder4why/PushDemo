//
//  Global.m
//  PUSHDemo
//
//  Created by hu ping kang on 2019/8/12.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import <PinYin4Objc/PinYin4Objc.h>
#import <HanyuPinyinOutputFormat.h>
#import "Global.h"

@implementation Global
+ (UIViewController *)topViewController {
  UIViewController *resultVC;
  resultVC = [self _topViewController:[[UIApplication sharedApplication].keyWindow rootViewController]];
  while (resultVC.presentedViewController) {
    resultVC = [self _topViewController:resultVC.presentedViewController];
  }
  return resultVC;
}
  
+ (UIViewController *)_topViewController:(UIViewController *)vc {
  if ([vc isKindOfClass:[UINavigationController class]]) {
    return [self _topViewController:[(UINavigationController *)vc topViewController]];
  } else if ([vc isKindOfClass:[UITabBarController class]]) {
    return [self _topViewController:[(UITabBarController *)vc selectedViewController]];
  } else {
    return vc;
  }
  return nil;
}

+(void)translateHZToPingyin:(NSString *)key completed:(void(^)(NSString * pinyin))completed{

    HanyuPinyinOutputFormat *outputFormat=[[HanyuPinyinOutputFormat alloc] init];
    [outputFormat setToneType:ToneTypeWithoutTone];
    [outputFormat setVCharType:VCharTypeWithV];
    [outputFormat setCaseType:CaseTypeLowercase];
    [PinyinHelper toHanyuPinyinStringWithNSString:key
                      withHanyuPinyinOutputFormat:outputFormat
                                     withNSString:@" "
                                      outputBlock:^(NSString *pinYin) {
                                        completed(pinYin);
                                      }];
  }
  
@end

