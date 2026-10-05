# 轻待办

一个简洁轻量的跨端待办清单应用。支持添加、完成、删除待办，以及按全部、待完成和已完成状态筛选。待办数据保存在当前设备本地。

本项目使用 **uni-app、Vue 3、TypeScript 和 Vite** 开发，并在 **OpenAI Codex** 的协助下构建。

## 环境要求

- Node.js 和 npm
- 微信小程序开发需要微信开发者工具
- App 端预览或打包需要 HBuilderX 及相应的 App 运行/打包环境

## 安装依赖

在项目根目录运行：

```bash
npm install
```

## 开发运行

### H5 网页

```bash
npm run dev:h5
```

在浏览器打开终端输出的本地地址，默认是 `http://localhost:5173`。

### 微信小程序

```bash
npm run dev:mp-weixin
```

编译完成后，在微信开发者工具中导入项目配置的开发目录 `dist/dev/mp-weixin/`。

### App

```bash
npm run dev:app
```

此命令用于 App 端开发编译和预览，不会直接生成可安装的 APK 或 IPA。需要在 HBuilderX 或对应 App 运行环境中打开、运行项目；生成安装包还需另外进行 App 原生打包。

## 构建与检查

```bash
npm run build:h5         # 构建 H5
npm run build:mp-weixin  # 构建微信小程序
npm run build:app        # 编译 App 端代码（非 APK/IPA 打包）
npm run type-check       # TypeScript/Vue 类型检查
```

构建输出在 `dist/` 下。`dist/` 和 `node_modules/` 不纳入版本控制；克隆项目后使用 `npm install` 安装依赖，再按目标平台运行相应命令。
