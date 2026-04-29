## 🎉 Release ${{ version }}

### 📱 下载

#### iOS
- [TinyMarkdown.ipa](https://github.com/username/tinyMarkdown/releases/download/${{ version }}/TinyMarkdown.ipa)
- 或通过 TestFlight 安装（链接）

#### Android
- [TinyMarkdown.apk](https://github.com/username/tinyMarkdown/releases/download/${{ version }}/app-release.apk)
- 或从 Google Play 安装（链接）

---

### ✨ 新功能

- 功能描述 1
- 功能描述 2

### 🐛 修复

- 修复描述 1
- 修复描述 2

### 🔧 改进

- 改进描述 1
- 改进描述 2

### ⚠️ 已知问题

- 问题描述 1
- 问题描述 2

---

### 📦 签名信息

**iOS**
- 签名：Apple Distribution
- 证书有效期：YYYY-MM-DD

**Android**
- 签名：SHA-256: XXXX...
- 签名证书有效期：YYYY-MM-DD

### 🔐 验证

**Android APK 验证**
```bash
# 下载 APK 后验证签名
keytool -printcert -jarfile TinyMarkdown.apk
```

**iOS IPA 验证**
```bash
# 下载 IPA 后验证签名
codesign -d -vvv TinyMarkdown.ipa
```

---

### 📚 完整更新日志

查看 [CHANGELOG.md](https://github.com/username/tinyMarkdown/blob/main/CHANGELOG.md) 了解详细信息。

---

### 🙏 致谢

感谢所有贡献者和测试用户！

---

<details>
<summary><b>开发说明</b></summary>

### 发布流程

1. 更新版本号
   ```bash
   # package.json
   npm version patch | minor | major
   ```

2. 更新 CHANGELOG.md

3. 创建 Git tag
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

4. GitHub Actions 自动构建并创建 Release

5. 下载构建产物并上传到 Release

</details>
