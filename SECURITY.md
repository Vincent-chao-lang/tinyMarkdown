# 安全策略

## 📋 安全政策

tinyMarkdown 承诺快速响应安全漏洞。我们认真对待安全问题，并希望社区也能这样做。

## 🔍 报告漏洞

如果你发现安全漏洞，**请不要公开 issue**。

### 如何报告

1. 发送邮件到：security@tinymarkdown.com
2. 在邮件主题中包含「[SECURITY]」
3. 提供详细的问题描述

### 报告内容应包括

- 漏洞描述
- 受影响的版本
- 复现步骤
- 潜在影响
- 建议的修复方案（如有）

## ⏱️ 响应时间

我们会在收到报告后 48 小时内回复，并在 7 天内提供修复方案或时间表。

## 🔐 已知安全特性

### 隐私保护

- ✅ 纯本地运行，无网络请求
- ✅ 不收集任何用户数据
- ✅ 不上传文件内容
- ✅ 不使用第三方分析工具

### 文件处理

- ✅ 文件大小限制（1MB）防止内存溢出
- ✅ 只读模式，防止文件篡改
- ✅ 沙盒化文件访问
- ✅ 不执行任何动态代码

### 代码安全

- ✅ TypeScript 类型检查
- ✅ 无 `eval()` 或类似危险函数
- ✅ 无第三方 CDN 依赖
- ✅ 定期更新依赖版本

## 🛡️ 安全最佳实践

### 开发者

- 遵循 [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/) 指南
- 使用 HTTPS 进行网络通信（虽然本项目不需要）
- 定期更新依赖
- 使用静态分析工具

### 用户

- 仅从可信来源安装应用
- 保持应用更新
- 不要打开未知来源的文件
- 注意文件大小限制

## 🔗 相关资源

- [GitHub Security Advisories](https://github.com/username/tinyMarkdown/security/advisories)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [React Native Security](https://reactnative.dev/docs/security)

## 📧 联系方式

- 安全问题：security@tinymarkdown.com
- 一般问题：[GitHub Issues](https://github.com/username/tinyMarkdown/issues)

---

感谢帮助保持 tinyMarkdown 安全！🙏
