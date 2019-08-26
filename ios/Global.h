//
//  Global.h
//  PUSHDemo
//
//  Created by hu ping kang on 2019/8/12.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Global : NSObject
+ (UIViewController *)topViewController;
+(void)translateHZToPingyin:(NSString *)key completed:(void(^)(NSString * pinyin))completed;
@end

NS_ASSUME_NONNULL_END
