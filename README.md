# ENGR90051 前端框架原型

这是一个现代化的前端项目框架，使用Vite、原生HTML/CSS/JS和Tailwind CSS构建。

## 📁 项目结构

```
prototype_90051/
├── index.html              # 主HTML文件
├── package.json            # 项目配置
├── vite.config.js         # Vite配置
├── tailwind.config.js     # Tailwind配置
├── postcss.config.js      # PostCSS配置
├── src/
│   ├── main.js            # JavaScript入口文件
│   └── main.css           # 主样式文件
└── dist/                  # 构建输出目录 (生成)
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览构建结果

```bash
npm run preview
```

## 🛠️ 包含的工具和库

- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **PostCSS** - CSS变换工具
- **Autoprefixer** - 自动添加浏览器前缀

## 📝 项目特性

✅ 现代化的响应式设计  
✅ 快速的开发体验  
✅ 优化的生产构建  
✅ 包含导航、英雄区、特性展示、联系表单等完整页面组件  
✅ **自定义MP4加载动画** - 使用Flood.mp4视频作为loading图标

## 🎯 文件说明

### `index.html`

主页面文件，包含：

- 导航栏（响应式菜单）
- 英雄区（Hero Section）
- 功能展示区
- 项目信息区
- 联系表单
- 页脚

### `src/main.js`

JavaScript入口点，包括：

- DOM初始化
- 导航菜单交互处理
- Loading动画控制（支持MP4视频播放/暂停）
- 工具函数（API调用、DOM操作等）

### `src/Flood.mp4`

自定义loading动画视频文件，在连接过程中循环播放

### `src/main.css`

样式文件，包含：

- Tailwind CSS指令
- 自定义CSS变量
- 基础样式

## 🎨 自定义

### 修改颜色

编辑 `tailwind.config.js` 中的 `theme.extend.colors`

### 添加新페이지

1. 在 `index.html` 中添加新的 section
2. 在导航栏中添加对应链接
3. 在 `src/main.js` 中添加交互逻辑

### 自定义Loading视频

1. 将您的MP4视频文件放入 `src/` 目录
2. 在 `index.html` 中更新video标签的src路径
3. 可在 `src/main.css` 中调整 `.loading-video` 的尺寸和样式

### 修改Loading时长

在 `src/main.js` 中修改 `setTimeout` 的延迟时间：

```javascript
await new Promise((resolve) => setTimeout(resolve, 4000)); // 4秒
```

// 获取数据
const data = await utils.fetchData('/api/data')

````

## 📦 部署

### GitHub Pages
```bash
npm run build
# 将 dist 文件夹上传到 GitHub Pages
````

### 其他部署方案

1. 使用Vercel
2. 使用Netlify
3. 使用自有服务器

## 💡 开发建议

- 使用Tailwind CSS的utility类来快速构建样式
- 保持JavaScript模块化，创建单独的模块文件
- 使用CSS变量来管理全局主题
- 在 `src/` 目录中组织代码，保持结构清晰

## 📚 参考资源

- [Vite文档](https://vitejs.dev/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [MDN Web文档](https://developer.mozilla.org/)

## 📄 License

MIT

---

**开始构建您的项目吧！** 💻
