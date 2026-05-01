//
//  DocumentPickerModule.m
//  tinyMarkdown
//
//  原生模块：iOS 文档选择器
//

#import "DocumentPickerModule.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>

@interface DocumentPickerModule() <UIDocumentPickerDelegate>
@property (nonatomic, strong) RCTPromiseResolveBlock resolve;
@property (nonatomic, strong) RCTPromiseRejectBlock reject;
@end

@implementation DocumentPickerModule

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

// 暴露给 JavaScript 的方法：打开文档选择器
RCT_EXPORT_METHOD(pickDocument:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject) {
  NSLog(@"[DocumentPicker] Opening document picker");

  self.resolve = resolve;
  self.reject = reject;

  dispatch_async(dispatch_get_main_queue(), ^{
    // 获取当前视图控制器
    UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;

    if (!rootViewController) {
      reject(@"NO_VIEW_CONTROLLER", @"Could not find root view controller", nil);
      return;
    }

    // 创建文档选择器
    NSArray *documentTypes = @[
      @"public.text",
      @"public.plain-text",
      @"public.utf8-plain-text",
      @"net.daringfireball.markdown",
      @"org.openxmlformats.openxml.wordprocessingml.document"  // 作为备选
    ];

    UIDocumentPickerViewController *documentPicker =
      [[UIDocumentPickerViewController alloc] initWithDocumentTypes:documentTypes
                                                           inMode:UIDocumentPickerModeImport];

    documentPicker.delegate = self;
    documentPicker.modalPresentationStyle = UIModalPresentationPageSheet;

    [rootViewController presentViewController:documentPicker
                                            animated:YES
                                          completion:nil];
  });
}

#pragma mark - UIDocumentPickerDelegate

- (void)documentPicker:(UIDocumentPickerViewController *)controller
didPickDocumentsAtURLs:(NSArray<NSURL *> *)urls {
  NSLog(@"[DocumentPicker] Documents picked: %@", urls);

  if (urls.count == 0) {
    self.reject(@"NO_DOCUMENT", @"No document was selected", nil);
    return;
  }

  NSURL *fileURL = urls.firstObject;

  // 获取文件访问权限
  [fileURL startAccessingSecurityScopedResource];

  // 读取文件内容
  NSError *error = nil;
  NSString *content = [NSString stringWithContentsOfURL:fileURL
                                            encoding:NSUTF8StringEncoding
                                               error:&error];

  if (error) {
    [fileURL stopAccessingSecurityScopedResource];
    self.reject(@"READ_ERROR", @"Failed to read document", error);
    return;
  }

  // 获取文件信息
  NSString *fileName = fileURL.lastPathComponent;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSDictionary *attributes = [fileManager attributesOfItemAtPath:fileURL.path error:nil];
  NSNumber *fileSize = attributes[NSFileSize];

  // 停止访问
  [fileURL stopAccessingSecurityScopedResource];

  // 返回结果
  self.resolve(@{
    @"uri": fileURL.absoluteString,
    @"name": fileName,
    @"size": fileSize,
    @"content": content
  });

  // 清理
  self.resolve = nil;
  self.reject = nil;
}

- (void)documentPickerWasCancelled:(UIDocumentPickerViewController *)controller {
  NSLog(@"[DocumentPicker] Document picker was cancelled");

  self.reject(@"CANCELLED", @"Document picker was cancelled", nil);

  // 清理
  self.resolve = nil;
  self.reject = nil;
}

@end
