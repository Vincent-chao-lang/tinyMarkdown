<div align="center">

# tinyMarkdown

**极简 Markdown 阅读器**

[![CI](https://img.shields.io/github/actions/workflow/status/username/tinyMarkdown/ci.yml?branch=main)](https://github.com/username/tinyMarkdown/actions)
[![iOS](https://img.shields.io/badge/iOS-17%2B-blue)](https://github.com/username/tinyMarkdown)
[![Android](https://img.shields.io/badge/Android-8%2B-green)](https://github.com/username/tinyMarkdown)
[![License](https://img.shields.io/github/license/username/tinyMarkdown)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

一个极简的 Markdown **阅读器**（只读），支持 iOS 和 Android 平台。

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [文档](#-文档) • [贡献](#-贡献)

</div>

---

## ✨ 功能特性

- 📄 **只读预览** - 极简阅读体验，专注于内容
- 📏 **文件限制** - 最大 1MB，轻量快速
- 🔒 **隐私优先** - 纯本地离线，无网络请求，无数据收集
- 📱 **系统关联** - 支持从系统文件 App 打开 .md 文件
- 🔤 **字体调节** - 支持 14/16/18/20 四档字体大小
- 🎨 **基础语法** - 标题、列表、粗体、斜体、代码块、链接、图片

## 📸 截图

### iOS
<table>
  <tr>
    <td><img src="docs/screenshots/ios-welcome.png" width="250" alt="iOS 欢迎界面"></td>
    <td><img src="docs/screenshots/ios-preview.png" width="250" alt="iOS 预览界面"></td>
    <td><img src="docs/screenshots/ios-font-size.png" width="250" alt="iOS 字体设置"></td>
  </tr>
  <tr>
    <td align="center">欢迎界面</td>
    <td align="center">Markdown 预览</td>
    <td align="center">字体大小调节</td>
  </tr>
</table>

### Android
<table>
  <tr>
    <td><img src="docs/screenshots/android-welcome.png" width="250" alt="Android 欢迎界面"></td>
    <td><img src="docs/screenshots/android-preview.png" width="250" alt="Android 预览界面"></td>
    <td><img src="docs/screenshots/android-file-open.png" width="250" alt="Android 文件打开"></td>
  </tr>
  <tr>
    <td align="center">欢迎界面</td>
    <td align="center">Markdown 预览</td>
    <td align="center">文件打开</td>
  </tr>
</table>

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9
- iOS: macOS + Xcode 15+
- Android: Android Studio

### 安装

```bash
# 克隆仓库
git clone https://github.com/username/tinyMarkdown.git
cd tinyMarkdown

# 安装依赖
npm install

# iOS - 安装 CocoaPods
cd ios && pod install && cd ..
```

### 运行

```bash
# iOS
npm run ios

# Android
npm run android

# 启动 Metro
npm start
```

## 📖 使用指南

### 打开文件

1. 在系统文件 App 中找到 .md 文件
2. 点击文件
3. 选择 tinyMarkdown 打开

### 调节字体

点击右上角的 `Aa` 按钮可以切换字体大小：
- 小号: 14px
- 中号: 16px（默认）
- 大号: 18px
- 特大: 20px

## 🛠️ 开发

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 运行测试
npm test
```

## 📁 项目结构

```
tinyMarkdown/
├── src/
│   ├── screens/          # 页面组件
│   │   └── PreviewScreen.tsx
│   ├── utils/            # 工具函数
│   │   ├── FileOpener.ts
│   │   └── markdownParser.ts
│   ├── types/            # 类型定义
│   │   └── index.ts
│   └── App.tsx           # 应用入口
├── ios/                  # iOS 原生代码
├── android/              # Android 原生代码
└── docs/                 # 文档
```

## 🎯 支持的 Markdown 语法

| 语法 | 支持 | 示例 |
|------|------|------|
| 标题 | ✅ | `# H1` ~ `###### H6` |
| 粗体 | ✅ | `**text**` |
| 斜体 | ✅ | `*text*` |
| 列表 | ✅ | `- item` 或 `1. item` |
| 代码块 | ✅ | ``` ``` ``` |
| 行内代码 | ✅ | `` `code` `` |
| 链接 | ✅ | `[text](url)` |
| 图片 | ✅ | `![alt](url)` |
| 引用 | ✅ | `> quote` |
| 分隔线 | ✅ | `---` |
| 表格 | ❌ | - |
| 删除线 | ❌ | - |
| 任务列表 | ❌ | - |

## 📚 文档

- [快速开始指南](QUICKSTART.md) - 详细的安装和配置说明
- [原生模块配置](NATIVE_SETUP.md) - 文件关联配置详解
- [贡献指南](CONTRIBUTING.md) - 如何贡献代码
- [更新日志](CHANGELOG.md) - 版本更新记录

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 📝 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 🙏 致谢

- [React Native](https://reactnative.dev/) - 跨平台移动应用框架
- [react-native-markdown-display](https://github.com/ammarahm-ed/react-native-markdown-display) - Markdown 渲染组件

## 📧 联系方式

- Issues: [GitHub Issues](https://github.com/username/tinyMarkdown/issues)
- Discussions: [GitHub Discussions](https://github.com/username/tinyMarkdown/discussions)

---

<div align="center">

**Made with ❤️ by tinyMarkdown team**

[⬆ 返回顶部](#-readmemd)

</div>
