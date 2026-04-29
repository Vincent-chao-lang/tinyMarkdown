# 快速开始指南

本指南将帮助你快速构建和运行 tinyMarkdown 项目。

## 前置要求

- Node.js >= 18
- npm >= 9
- macOS（iOS 开发必需）
- Xcode 15+（iOS 开发必需）
- Android Studio（Android 开发必需）

## 步骤 1：初始化 React Native 项目

由于此项目包含完整的原生代码，建议使用 React Native CLI 初始化项目：

```bash
# 创建新的 React Native 项目
npx react-native@latest init TinyMarkdown

# 进入项目目录
cd TinyMarkdown
```

## 步骤 2：复制项目文件

将 tinyMarkdown 项目中的以下文件/目录复制到新创建的项目中：

### 必需的文件

```bash
# 复制源代码
cp -r ../tinyMarkdown/src ./src

# 复制配置文件
cp ../tinyMarkdown/package.json ./
cp ../tinyMarkdown/tsconfig.json ./
cp ../tinyMarkdown/babel.config.js ./
cp ../tinyMarkdown/.eslintrc.js ./
cp ../tinyMarkdown/jest.config.js ./
cp ../tinyMarkdown/jest.setup.js ./

# 复制 iOS 原生模块
cp ../tinyMarkdown/ios/tinyMarkdown/FileOpenerModule.* ./ios/TinyMarkdown/
cp ../tinyMarkdown/ios/tinyMarkdown/AppDelegate.* ./ios/TinyMarkdown/

# 更新 iOS Info.plist
# 需要手动合并 Info.plist 中的 CFBundleDocumentTypes 配置

# 复制 Android 原生模块
cp -r ../tinyMarkdown/android/app/src/main/java/com/tinymarkdown ./android/app/src/main/java/com/

# 更新 Android AndroidManifest.xml
# 需要手动合并 Intent Filter 配置
```

### 自动复制脚本（可选）

创建一个 `copy-files.sh` 脚本：

```bash
#!/bin/bash

SOURCE="../tinyMarkdown"
TARGET="."

echo "复制源代码..."
cp -r "$SOURCE/src" "$TARGET/"

echo "复制配置文件..."
cp "$SOURCE/package.json" "$TARGET/"
cp "$SOURCE/tsconfig.json" "$TARGET/"
cp "$SOURCE/babel.config.js" "$TARGET/"
cp "$SOURCE/.eslintrc.js" "$TARGET/"
cp "$SOURCE/jest.config.js" "$TARGET/"
cp "$SOURCE/jest.setup.js" "$TARGET/"

echo "复制 iOS 原生模块..."
cp "$SOURCE/ios/tinyMarkdown/FileOpenerModule.h" "./ios/TinyMarkdown/"
cp "$SOURCE/ios/tinyMarkdown/FileOpenerModule.m" "./ios/TinyMarkdown/"
cp "$SOURCE/ios/tinyMarkdown/AppDelegate.h" "./ios/TinyMarkdown/"
cp "$SOURCE/ios/tinyMarkdown/AppDelegate.mm" "./ios/TinyMarkdown/"

echo "复制 Android 原生模块..."
mkdir -p "./android/app/src/main/java/com/tinymarkdown"
cp -r "$SOURCE/android/app/src/main/java/com/tinymarkdown/"* "./android/app/src/main/java/com/tinymarkdown/"

echo "完成！"
```

## 步骤 3：更新 iOS 配置

### 更新 Info.plist

在 `ios/TinyMarkdown/Info.plist` 中添加文件类型配置：

```xml
<key>CFBundleDocumentTypes</key>
<array>
    <dict>
        <key>CFBundleTypeExtensions</key>
        <array>
            <string>md</string>
            <string>markdown</string>
        </array>
        <key>CFBundleTypeName</key>
        <string>Markdown File</string>
        <key>CFBundleTypeRole</key>
        <string>Viewer</string>
        <key>LSHandlerRank</key>
        <string>Owner</string>
    </dict>
</array>
```

### 更新 Podfile

确保 Podfile 包含必要的依赖：

```ruby
target 'TinyMarkdown' do
  # ... 其他依赖

  # 添加这行（如果需要）
  pod 'RNFastImage', :path => '../node_modules/react-native-fast-image'

end
```

### 安装 pods

```bash
cd ios
pod install
cd ..
```

## 步骤 4：更新 Android 配置

### 更新 AndroidManifest.xml

在 `android/app/src/main/AndroidManifest.xml` 的 `<activity>` 标签中添加 Intent Filter：

```xml
<intent-filter
    android:label="@string/app_name"
    android:priority="1">

    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="file" />
    <data android:scheme="content" />
    <data android:mimeType="*/*" />

    <data android:pathPattern=".*\\.md" />
    <data android:pathPattern=".*\\..*\\.md" />
</intent-filter>
```

### 更新 MainApplication.java

确保注册 FileOpenerPackage：

```java
package com.tinymarkdown;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.tinymarkdown.FileOpenerPackage; // 添加此行

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
        new DefaultReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                // Packages that cannot be autolinked yet can be added manually here
                packages.add(new FileOpenerPackage()); // 添加此行
                return packages;
            }

            // ... 其他代码
        };
}
```

## 步骤 5：安装依赖

```bash
# 安装 JavaScript 依赖
npm install

# iOS 安装 pods
cd ios && pod install && cd ..
```

## 步骤 6：运行项目

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

## 测试文件关联

### iOS 测试

1. 在模拟器或真机上安装应用
2. 在 Files App 中创建一个测试文件 `test.md`
3. 点击文件，选择用 tinyMarkdown 打开

### Android 测试

1. 安装 APK 到设备
2. 在文件管理器中找到 .md 文件
3. 点击文件，选择用 tinyMarkdown 打开

## 常见问题

### iOS: "No such module 'React'"

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android: "Could not resolve com.facebook.react:react-native"

检查 `android/build.gradle` 中的 React Native 版本是否与 `package.json` 一致。

### 文件关联不工作

- iOS: 检查 Info.plist 中的 CFBundleDocumentTypes 配置
- Android: 检查 AndroidManifest.xml 中的 Intent Filter 配置

## 下一步

- 阅读 [NATIVE_SETUP.md](./NATIVE_SETUP.md) 了解更多原生配置细节
- 阅读 [CLAUDE.md](./CLAUDE.md) 了解项目架构
- 查看 [README.md](./README.md) 了解项目功能
