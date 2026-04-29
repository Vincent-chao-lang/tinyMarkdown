# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-04-29

### Added
- 🎉 首个正式发布
- 📄 Markdown 只读预览功能
- 📏 文件大小限制 1MB，超出提示「文件过大，无法预览」
- 🔤 字体大小调节（14/16/18/20 四档）
- 🔒 纯本地离线运行，无网络请求
- 📱 支持 iOS/Android 系统文件 App 关联打开 .md 文件
- 🎨 支持基础 Markdown 语法（标题、列表、粗体、斜体、代码块、链接、图片）
- 🏗️ 完整的 CI/CD 自动构建流程
- 📋 完善的项目文档和模板

### Features
- 支持 .md 和 .markdown 文件
- 支持 iOS 18.5+ 和 Android 8.0+
- 自动保存字体大小设置
- 文件关联功能（通过系统文件 App 打开）

### Technical
- React Native 0.85.2
- TypeScript 5.8.3
- iOS 构建时间：约 3-4 分钟
- Android 构建时间：约 3-4 分钟
- 代码覆盖率检查
- ESLint 代码规范检查

### Security
- 纯本地运行，无网络请求
- 无数据收集
- 无第三方分析工具
- 文件大小限制防止内存溢出

---

## 版本说明

- **Added**: 新功能
- **Changed**: 功能变更
- **Deprecated**: 即将废弃的功能
- **Removed**: 已移除的功能
- **Fixed**: 修复的问题
- **Security**: 安全相关的修复
