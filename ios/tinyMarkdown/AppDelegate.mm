//
//  AppDelegate.mm
//  TinyMarkdown
//

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import "FileOpenerModule.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"TinyMarkdown";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // 检查是否通过文件启动应用
  NSURL *fileURL = (NSURL *)launchOptions[UIApplicationLaunchOptionsURLKey];

  if (fileURL && [fileURL isFileURL]) {
    [self handleFileURL:fileURL];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// 处理文件 URL（iOS 9+）
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([url isFileURL]) {
    [self handleFileURL:url];
  }
  return YES;
}

// iOS 13+ Universal Links 支持（虽然我们只处理本地文件）
- (BOOL)application:(UIApplication *)application
    continueUserActivity:(NSUserActivity *)userActivity
      restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [super application:application
           continueUserActivity:userActivity
             restorationHandler:restorationHandler];
}

// 处理文件 URL 的通用方法
- (void)handleFileURL:(NSURL *)fileURL
{
  // 获取文件信息
  NSString *filePath = [fileURL path];
  NSString *fileName = [fileURL lastPathComponent];

  // 获取文件大小
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *error = nil;
  NSDictionary *fileAttributes = [fileManager attributesOfItemAtPath:filePath error:&error];

  NSNumber *fileSize = @0;
  if (fileAttributes) {
    fileSize = [fileAttributes objectForKey:NSFileSize];
  }

  // 获取安全范围的文件访问权限（iOS 14+）
  if (@available(iOS 14.0, *)) {
    [fileManager startAccessingSecurityScopedResourceIfNeeded:fileURL];
  }

  // 存储初始文件信息到 UserDefaults，供 JS 端获取
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:fileURL.absoluteString forKey:@"initialFileUri"];
  [defaults setObject:fileName forKey:@"initialFileName"];
  [defaults setObject:fileSize forKey:@"initialFileSize"];
  [defaults synchronize];

  // 发送通知到 React Native
  FileOpenerModule *fileOpener = [self.moduleRegistry moduleForName:@"FileOpenerModule"];

  if (fileOpener && [fileOpener respondsToSelector:@selector(sendFileOpenedEvent:name:size:)]) {
    // 延迟发送，确保 React Native 已准备好
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [fileOpener sendFileOpenedEvent:fileURL.absoluteString
                                 name:fileName
                                 size:fileSize];
    });
  }
}

@end
