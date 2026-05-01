//
//  FileReaderModule.m
//  tinyMarkdown
//
//  原生模块：读取文件内容
//

#import "FileReaderModule.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>

@implementation FileReaderModule

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

// 暴露给 JavaScript 的方法：读取文件内容
RCT_EXPORT_METHOD(readFile:(NSString *)fileURI
                 resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject) {
  NSLog(@"[FileReader] ========== readFile called ==========");
  NSLog(@"[FileReader] fileURI: %@", fileURI);

  dispatch_async(dispatch_get_main_queue(), ^{
    // 将 file:// URL 转换为文件路径
    NSString *filePath = nil;
    NSURL *fileURL = nil;

    if ([fileURI hasPrefix:@"file://"]) {
      fileURL = [NSURL URLWithString:fileURI];
      filePath = fileURL.path;
    } else {
      filePath = fileURI;
      fileURL = [NSURL fileURLWithPath:filePath];
    }

    NSLog(@"[FileReader] File path: %@", filePath);
    NSLog(@"[FileReader] File URL: %@", fileURL);
    NSLog(@"[FileReader] File URL (absolute): %@", [fileURL absoluteString]);

    // 检查文件是否存在
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if (![fileManager fileExistsAtPath:filePath]) {
      NSLog(@"[FileReader] File does not exist at path: %@", filePath);
      reject(@"FILE_NOT_FOUND", @"File does not exist", nil);
      return;
    }
    NSLog(@"[FileReader] File exists at path");

    // 请求安全范围的文件访问权限（iOS 14+）
    BOOL hasAccess = YES;
    if (@available(iOS 14.0, *)) {
      hasAccess = [fileURL startAccessingSecurityScopedResource];
      NSLog(@"[FileReader] startAccessingSecurityScopedResource: %d", hasAccess);
    }

    if (!hasAccess) {
      NSLog(@"[FileReader] Failed to get security-scoped access");
      NSLog(@"[FileReader] Trying to read file anyway...");
      // 尝试继续读取，可能会成功
    }

    // 读取文件内容
    NSError *error = nil;
    NSString *content = [NSString stringWithContentsOfFile:filePath
                                                  encoding:NSUTF8StringEncoding
                                                     error:&error];

    // 停止访问安全范围资源
    if (@available(iOS 14.0, *)) {
      if (hasAccess) {
        [fileURL stopAccessingSecurityScopedResource];
        NSLog(@"[FileReader] stopAccessingSecurityScopedResource called");
      }
    }

    if (error) {
      NSLog(@"[FileReader] ========== Failed to read file ==========");
      NSLog(@"[FileReader] Error domain: %@", error.domain);
      NSLog(@"[FileReader] Error code: %ld", (long)error.code);
      NSLog(@"[FileReader] Error description: %@", error.localizedDescription);
      NSLog(@"[FileReader] Error reason: %@", error.localizedFailureReason);
      reject(@"READ_ERROR", @"Failed to read file", error);
      return;
    }

    NSLog(@"[FileReader] ========== File read successfully ==========");
    NSLog(@"[FileReader] Content size: %lu", (unsigned long)content.length);
    NSLog(@"[FileReader] Content preview: %@", [content substringToIndex:MIN(100, content.length)]);

    resolve(@{
      @"uri": fileURI,
      @"content": content,
      @"size": @(content.length)
    });
  });
}

@end
