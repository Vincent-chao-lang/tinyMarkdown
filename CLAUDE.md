# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

tinyMarkdown 是一个极简的 Markdown **阅读器**（只读，不支持编辑），支持 iOS 和 Android 平台。

**核心特性：**
- 纯本地离线，不上传、不联网、不隐私收集
- 文件大小限制 1MB，超出提示「文件过大，无法预览」
- 只支持基础 Markdown 语法（标题、列表、粗体、斜体、代码块、链接、图片）
- 支持系统文件 App 关联打开 .md 文件
- 极简 UI：预览 + 字体大小调节

## 开发命令

```bash
# 安装依赖
npm install

# iOS 开发（需要 macOS + Xcode）
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

## 项目架构

```
src/
├── components/     # 可复用的 UI 组件
├── screens/        # 页面/屏幕组件
│   └── PreviewScreen.tsx    # 主预览页面
├── navigation/     # 导航配置（如需要）
├── utils/          # 工具函数
│   └── markdownParser.ts    # Markdown 解析和文件大小检查
└── types/          # TypeScript 类型定义
```

## 技术栈

- **React Native 0.76**: 跨平台移动应用框架
- **TypeScript**: 类型安全
- **react-native-markdown-display**: Markdown 渲染
- **@react-native-async-storage/async-storage**: 本地存储（字体大小设置）

## 文件关联配置

### iOS
- 在 `ios/PROJECT_NAME/Info.plist` 中配置 `CFBundleDocumentTypes`
- 支持 `.md` 和 `.markdown` 文件类型

### Android
- 在 `android/app/src/main/AndroidManifest.xml` 中配置 Intent Filter
- 配置 `android:mimeType="text/markdown"` 和 `.md` 文件扩展名

## 支持的 Markdown 语法

- 标题（# ## ### #### ##### ######）
- 粗体（**text**）和斜体（*text*）
- 有序和无序列表
- 代码块和行内代码
- 链接和图片
- 引用块（>）
- 分隔线（---）

**不支持**：表格、删除线、任务列表、脚注等扩展语法

## 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置 (@react-native/eslint-config)
- 组件使用函数式组件 + Hooks
- 使用路径别名 `@/*` 引用 src 目录下的文件
- 保持 UI 极简，不添加不必要的动画和装饰

## 注意事项

- 需要 Node.js >= 18
- iOS 开发需要 macOS 和 Xcode
- Android 开发需要 Android SDK 和模拟器
- 文件大小限制严格为 1MB (1024 * 1024 bytes)
