# Dev Tools

一个基于 Next.js 和 NextUI 构建的开发工具集合，提供多种实用的开发工具。

## 功能特性

- **颜色工具**
  - RGB、HSL、CMYK 颜色转换
  - 颜色选择器
  - 颜色预设
  - 历史记录
  - 复制颜色代码

- **JSON 工具**
  - JSON 格式化
  - JSON 压缩
  - 语法高亮
  - 复制功能

- **二维码工具**
  - 文本转二维码
  - 自定义颜色
  - 下载二维码
  - SVG 格式支持

## 技术栈

- [Next.js 15](https://nextjs.org/) - React 框架
- [NextUI v2](https://nextui.org/) - 现代化 UI 组件库
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [QRCode.react](https://www.npmjs.com/package/qrcode.react) - React 二维码生成器
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 开始使用

1. 克隆项目

```bash
git clone <your-repo-url>
cd dev-tools
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 构建部署

1. 构建项目

```bash
npm run build
# 或
yarn build
```

2. 启动生产服务器

```bash
npm run start
# 或
yarn start
```

## 部署到 Vercel

本项目已配置好自动部署到 Vercel 的设置。只需要：

1. Fork 本项目到你的 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 完成自动部署

## 开源协议

MIT License - 查看 [LICENSE](LICENSE) 文件了解更多信息。
