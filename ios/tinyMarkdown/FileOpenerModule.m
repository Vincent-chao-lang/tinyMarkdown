//
//  FileOpenerModule.m
//  TinyMarkdown
//
//  原生模块：处理系统文件打开事件
//

#import "FileOpenerModule.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>

@implementation FileOpenerModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"FileOpened"];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

// 供 AppDelegate 调用，发送文件打开事件到 JavaScript
- (void)sendFileOpenedEvent:(NSString *)uri
                       name:(NSString *)name
                       size:(NSNumber *)size {

  NSDictionary *body = @{
    @"uri": uri,
    @"name": name,
    @"size": size
  };

  [self sendEventWithName:@"FileOpened" body:body];
}

// 暴露给 JavaScript 的方法：检查应用是否通过文件启动
RCT_EXPORT_METHOD(checkInitialFile:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject) {
  // 从 UserDefaults 获取初始文件信息
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *initialUri = [defaults stringForKey:@"initialFileUri"];

  if (initialUri) {
    NSString *initialName = [defaults stringForKey:@"initialFileName"];
    NSNumber *initialSize = [defaults objectForKey:@"initialFileSize"];

    // 清除存储的初始文件信息
    [defaults removeObjectForKey:@"initialFileUri"];
    [defaults removeObjectForKey:@"initialFileName"];
    [defaults removeObjectForKey:@"initialFileSize"];
    [defaults synchronize];

    resolve(@{
      @"uri": initialUri,
      @"name": initialName,
      @"size": initialSize ?: @0
    });
  } else {
    resolve(nil);
  }
}

@end
