# tinyMarkdown

一个极简的 Markdown **阅读器**（只读），支持 iOS 和 Android 平台。

## 特性

- 📄 **只读预览** - 极简阅读体验，不支持编辑
- 📏 **文件限制** - 最大 1MB，超出提示「文件过大，无法预览」
- 🔒 **纯本地离线** - 不上传、不联网、不隐私收集
- 📱 **系统关联** - 支持从系统文件 App 打开 .md 文件
- 🔤 **字体调节** - 支持 14/16/18/20 四档字体大小
- 🎨 **基础语法** - 标题、列表、粗体、斜体、代码块、链接、图片

## 快速开始

### 方法一：使用现有项目结构（推荐）

```bash
# 1. 克隆或下载此项目
cd tinyMarkdown

# 2. 安装依赖
npm install

# 3. iOS - 安装 CocoaPods
cd ios && pod install && cd ..

# 4. 运行项目
npm run ios    # iOS
npm run android # Android
```

### 方法二：创建新的 React Native 项目

```bash
# 1. 创建新项目
npx react-native@latest init TinyMarkdown

# 2. 将以下文件/目录复制到新项目：
#    - src/
#    - package.json (合并依赖)
#    - ios/tinyMarkdown/FileOpenerModule.* → ios/TinyMarkdown/
#    - ios/tinyMarkdown/AppDelegate.* → ios/TinyMarkdown/
#    - android/app/src/main/java/com/tinymarkdown/ → android/app/src/main/java/com/tinymarkdown/
#    - 其他配置文件

# 3. 安装依赖
npm install
cd ios && pod install && cd ..

# 4. 运行
npm run ios
```

## 开发命令

```bash
# 安装依赖
npm install

# iOS - 安装 pods
cd ios && pod install && cd ..

# iOS 开发
npm run ios

# Android 开发
npm run android

# 启动 Metro 打包服务器
npm start

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 运行测试
npm test
```

## 项目结构

```
tinyMarkdown/
├── src/
│   ├── screens/
│   │   └── PreviewScreen.tsx      # 主预览界面
│   ├── utils/
│   │   ├── FileOpener.ts          # 文件打开原生模块桥接
│   │   └── markdownParser.ts      # Markdown 工具函数
│   ├── types/
│   │   └── index.ts               # TypeScript 类型定义
│   └── App.tsx                    # 应用入口
├── ios/
│   └── tinyMarkdown/
│       ├── FileOpenerModule.h/m   # iOS 原生模块
│       ├── AppDelegate.h/mm       # iOS 应用委托
│       └── Info.plist             # iOS 配置（含文件关联）
├── android/
│   └── app/src/main/
│       ├── java/com/tinymarkdown/
│       │   ├── FileOpenerModule.java    # Android 原生模块
│       │   ├── FileOpenerPackage.java   # Android 模块注册
│       │   └── MainActivity.java        # Android 应用活动
│       └── AndroidManifest.xml          # Android 配置（含文件关联）
├── package.json
├── tsconfig.json
├── CLAUDE.md
├── NATIVE_SETUP.md
└── README.md
```

## 支持的 Markdown 语法

- 标题（# ## ### #### ##### ######）
- 粗体（**text**）和斜体（*text*）
- 有序和无序列表
- 代码块和行内代码
- 链接和图片
- 引用块（>）
- 分隔线（---）

**不支持**：表格、删除线、任务列表、脚注等扩展语法

## 系统要求

- Node.js >= 18
- npm >= 9
- iOS: macOS + Xcode 15+
- Android: Android SDK + Android Studio

## 原生模块开发

详细的文件关联配置说明请参考 [NATIVE_SETUP.md](./NATIVE_SETUP.md)。

## 许可证

MIT
