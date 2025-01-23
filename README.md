# Dev Tools

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NextUI](https://img.shields.io/badge/NextUI-2.0-blue?style=flat-square)](https://nextui.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)

一个现代化的开发工具集合，基于 Next.js 和 NextUI 构建。提供多种实用的开发工具，帮助开发者提高工作效率。

## ✨ 功能特性

### 🎨 颜色工具
- 支持多种颜色格式转换（RGB、HSL、CMYK）
- 专业的颜色选择器界面
- 常用颜色预设功能
- 自动保存颜色历史记录
- 一键复制各种格式的颜色代码

### 📝 JSON 工具
- 智能 JSON 格式化与压缩
- 实时语法错误检测
- 专业的代码语法高亮
- 便捷的复制与分享功能

### 📱 二维码工具
- 快速文本转二维码
- 支持自定义颜色和样式
- 多种格式导出（PNG/SVG）
- 实时预览效果

### ⏰ 时间戳工具
- 时间戳与日期格式互转
- 支持毫秒/秒级时间戳
- 多种日期格式化选项
- 时间计算与时区转换
- 一键复制转换结果

## 🚀 技术栈

- **前端框架**: [Next.js 15](https://nextjs.org/) - React 应用框架
- **UI 组件**: [NextUI v2](https://nextui.org/) - 现代化 UI 组件库
- **编辑器**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code 同款编辑器
- **二维码**: [QRCode.react](https://www.npmjs.com/package/qrcode.react) - React 二维码生成器
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

## 🔧 开始使用

1. **克隆项目**

```bash
git clone git@github.com:mant7s/dev-tools.git
cd dev-tools
```

2. **安装依赖**

```bash
pnpm install  # 推荐
# 或
npm install
# 或
yarn install
```

3. **启动开发服务器**

```bash
pnpm dev  # 推荐
# 或
npm run dev
# 或
yarn dev
```

4. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

## 📦 构建部署

1. **构建项目**

```bash
pnpm build
# 或
npm run build
# 或
yarn build
```

2. **启动生产服务器**

```bash
pnpm start
# 或
npm run start
# 或
yarn start
```

## ☁️ Vercel 部署

本项目支持一键部署到 Vercel 平台：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fmant7s%2Fdev-tools)

或者手动部署：

1. Fork 本项目到你的 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 等待自动部署完成

## 🤝 贡献指南

欢迎提交 Pull Request 来帮助改进这个项目！在提交 PR 之前，请确保：

- 代码经过格式化和 lint 检查
- 所有测试用例通过
- 如果添加新功能，请补充相应的文档

## 📄 开源协议

本项目采用 [MIT](LICENSE) 开源协议 - 详见 [LICENSE](LICENSE) 文件。
