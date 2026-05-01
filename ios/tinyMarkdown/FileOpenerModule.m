//
//  FileOpenerModule.m
//  TinyMarkdown
//
//  原生模块：检查初始文件
//

#import "FileOpenerModule.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>

@implementation FileOpenerModule

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

// 暴露给 JavaScript 的方法：检查应用是否通过文件启动
RCT_EXPORT_METHOD(checkInitialFile:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject) {
  NSLog(@"[FileOpener] checkInitialFile called");

  // 从 UserDefaults 获取初始文件信息
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *initialUri = [defaults stringForKey:@"initialFileUri"];

  NSLog(@"[FileOpener] initialUri from UserDefaults: %@", initialUri);

  if (initialUri) {
    NSString *initialName = [defaults stringForKey:@"initialFileName"];
    NSNumber *initialSize = [defaults objectForKey:@"initialFileSize"];

    NSLog(@"[FileOpener] File found - Name: %@, Size: %@", initialName, initialSize);

    // 清除存储的初始文件信息
    [defaults removeObjectForKey:@"initialFileUri"];
    [defaults removeObjectForKey:@"initialFileName"];
    [defaults removeObjectForKey:@"initialFileSize"];
    [defaults synchronize];

    NSDictionary *result = @{
      @"uri": initialUri,
      @"name": initialName,
      @"size": initialSize ?: @0
    };

    NSLog(@"[FileOpener] Resolving with result: %@", result);
    resolve(result);
  } else {
    NSLog(@"[FileOpener] No initial file found, resolving with nil");
    resolve(nil);
  }
}

@end
