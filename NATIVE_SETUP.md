# 原生文件关联配置说明

完整的 React Native 项目需要通过 `npx react-native init` 或 `npx @react-native-community/cli init` 生成完整的 iOS 和 Android 项目结构。

## 初始化项目

```bash
# 方法1: 使用 React Native CLI（推荐）
npx react-native@latest init TinyMarkdown

# 然后将当前项目的文件复制到新项目中

# 方法2: 在当前目录初始化
# 需要手动创建完整的 iOS 和 Android 项目结构
```

## iOS 文件关联实现

### 1. AppDelegate.mm 配置

在 `ios/TinyMarkdown/AppDelegate.mm` 中添加：

```objective-c
#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // 检查是否通过文件打开
  NSURL *url = (NSURL *)launchOptions[UIApplicationLaunchOptionsURLKey];

  if (url) {
    // 文件被打开，需要将 URL 传递给 React Native
    // 可以通过 RCTRootView 的 initialProperties 传递
  }

  // ... 原有代码
}

// 处理文件打开（iOS 9+）
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  // 将文件 URL 传递给 React Native
  // 需要发送通知或使用 EventEmitter
  return YES;
}

@end
```

### 2. 创建原生模块

创建 `ios/FileOpenerModule.h` 和 `ios/FileOpenerModule.m` 来传递文件信息给 JavaScript：

```objective-c
// FileOpenerModule.h
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface FileOpenerModule : RCTEventEmitter <RCTBridgeModule>
@end
```

```objective-c
// FileOpenerModule.m
#import "FileOpenerModule.h"

@implementation FileOpenerModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"FileOpened"];
}

- (void)openFile:(NSString *)uri
            name:(NSString *)name
            size:(NSNumber *)size {
  [self sendEventWithName:@"FileOpened"
                     body:@{@"uri": uri, @"name": name, @"size": size}];
}

@end
```

### 3. Info.plist 配置

已包含在 `ios/tinyMarkdown/Info.plist` 中，确保以下内容正确添加到项目。

## Android 文件关联实现

### 1. MainActivity.java 配置

在 `android/app/src/main/java/com/tinymarkdown/MainActivity.java` 中添加：

```java
package com.tinymarkdown;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.content.Intent;
import android.net.Uri;

public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "TinyMarkdown";
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    @Override
    protected void onStart() {
        super.onStart();
        handleIntent(getIntent());
    }

    private void handleIntent(Intent intent) {
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri uri = intent.getData();
            if (uri != null) {
                // 将文件信息传递给 React Native
                // 需要创建原生模块或使用 DeviceEventEmitter
            }
        }
    }
}
```

### 2. AndroidManifest.xml 配置

已包含在 `android/app/src/main/AndroidManifest.xml` 中。

### 3. 创建原生模块

创建 `FileOpenerModule.java`：

```java
package com.tinymarkdown;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FileOpenerPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new FileOpenerModule(reactContext));
        return modules;
    }
}
```

## JavaScript 端接收文件

更新 `src/App.tsx`：

```typescript
import {NativeEventEmitter, NativeModules} from 'react-native';

const {FileOpenerModule} = NativeModules;

useEffect(() => {
  const eventEmitter = new NativeEventEmitter(FileOpenerModule);

  const subscription = eventEmitter.addListener('FileOpened', (file) => {
    setAppState({
      fileUri: file.uri,
      fileName: file.name,
      fileSize: file.size,
    });
  });

  return () => {
    subscription.remove();
  };
}, []);
```

## 测试文件关联

### iOS
1. 在模拟器或真机中安装应用
2. 在 Files App 中创建一个 .md 文件
3. 点击文件，选择用 tinyMarkdown 打开

### Android
1. 安装 APK 到设备
2. 在文件管理器中找到 .md 文件
3. 点击文件，选择用 tinyMarkdown 打开
