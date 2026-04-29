# 贡献指南

感谢你有兴趣为 tinyMarkdown 做出贡献！本文档将指导你如何参与项目开发。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [问题反馈](#问题反馈)

## 🤝 行为准则

参与本项目时，请遵守以下准则：

- 尊重所有贡献者
- 保持友好和包容的态度
- 接受建设性批评
- 关注对社区最有利的事情

## 🚀 如何贡献

### 报告 Bug

1. 检查 [Issues](https://github.com/username/tinyMarkdown/issues) 确保问题未被报告
2. 使用 [Bug 反馈模板](https://github.com/username/tinyMarkdown/issues/new?template=bug_report.md) 创建 Issue
3. 提供详细的问题描述和复现步骤

### 提出新功能

1. 检查 [Issues](https://github.com/username/tinyMarkdown/issues) 确保功能未被建议
2. 使用 [功能建议模板](https://github.com/username/tinyMarkdown/issues/new?template=feature_request.md) 创建 Issue
3. 说明功能的用途和实现方案

### 提交代码

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 💻 开发流程

### 环境设置

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/YOUR_USERNAME/tinyMarkdown.git
cd tinyMarkdown

# 2. 安装依赖
npm install

# 3. iOS 安装 pods
cd ios && pod install && cd ..

# 4. 创建功能分支
git checkout -b feature/your-feature-name
```

### 开发规范

1. **遵循项目结构** - 保持代码组织一致性
2. **使用 TypeScript** - 所有新代码必须使用 TypeScript
3. **添加类型定义** - 在 `src/types/` 中定义新类型
4. **编写清晰注释** - 解释复杂逻辑
5. **保持极简** - 不添加不必要的功能

### 代码检查

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 运行测试
npm test
```

## 📝 代码规范

### TypeScript/JavaScript

- 使用 2 空格缩进
- 使用单引号
- 使用箭头函数
- 组件使用函数式组件 + Hooks

```typescript
// ✅ 好的示例
const MyComponent: React.FC<Props> = ({ title }) => {
  const [value, setValue] = useState('');

  const handleChange = (text: string) => {
    setValue(text);
  };

  return <TextInput value={value} onChangeText={handleChange} />;
};

// ❌ 不好的示例
function MyComponent(props) {
  var value = "";
  function handleChange(text) {
    value = text;
  }
  return <TextInput value={value} onChangeText={handleChange} />;
}
```

### 样式规范

```typescript
// ✅ 使用 StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// ❌ 内联样式
<View style={{ flex: 1, backgroundColor: '#fff' }}>
```

### 命名规范

- 组件: PascalCase (`MyComponent.tsx`)
- 工具函数: camelCase (`formatFileSize.ts`)
- 常量: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- 类型/接口: PascalCase (`MarkdownFile`)

## 🎯 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

### 示例

```bash
feat(preview): 添加字体大小记忆功能

fix(android): 修复文件打开时崩溃的问题

docs: 更新 README 安装说明

refactor(parser): 优化 Markdown 解析性能
```

## 📤 Pull Request

### PR 标题

遵循提交规范：

```bash
feat(preview): 添加字体大小记忆功能
```

### PR 描述

使用 [PR 模板](https://github.com/username/tinyMarkdown/blob/main/.github/pull_request_template.md)，包含：

- 变更描述
- 相关 Issue
- 变更类型
- 测试步骤
- 截图（如果适用）

### PR 检查清单

提交 PR 前确保：

- [ ] 代码符合项目规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 已通过本地测试
- [ ] TypeScript 类型检查通过
- [ ] ESLint 检查通过

## 🔍 问题反馈

### Bug 反馈

使用 [Bug 反馈模板](https://github.com/username/tinyMarkdown/issues/new?template=bug_report.md)，包含：

- 问题描述
- 复现步骤
- 期望行为
- 环境信息
- 截图（如果适用）

### 功能建议

使用 [功能建议模板](https://github.com/username/tinyMarkdown/issues/new?template=feature_request.md)，包含：

- 功能描述
- 使用场景
- 实现方案
- 替代方案

### 问题咨询

使用 [问题咨询模板](https://github.com/username/tinyMarkdown/issues/new?template=question.md)。

## 📚 更多资源

- [项目架构](CLAUDE.md)
- [快速开始](QUICKSTART.md)
- [原生配置](NATIVE_SETUP.md)

## 🎉 认可贡献者

所有贡献者将被添加到 [CONTRIBUTORS.md](CONTRIBUTORS.md) 文件中。

---

感谢你的贡献！🙏
