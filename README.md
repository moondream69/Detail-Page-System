# AI 详情页生成器

基于 AI 的电商详情页生成工具，支持上传商品图片，自动分析并生成完整的营销详情页内容。

## 功能特性

- **图片上传** - 支持拖拽或点击上传商品图片
- **AI 分析** - 自动识别商品特征、材质、风格
- **详情页生成** - AI 生成标题、副标题、卖点、材质信息等完整营销内容
- **设计方向推荐** - 提供视觉风格、配色方案、排版建议
- **导出功能** - 支持将生成的详情页导出为图片

## 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 http://localhost:3000
```

## 环境配置

首次启动前，需要配置环境变量：

```bash
# 复制环境变量模板
cp .env.example .env
```

然后编辑 `.env` 文件，填入以下配置：

```env
# API 配置
API_BASE_URL=https://api.vectorengine.cn/v1
API_KEY=你的API密钥

# 模型配置
GENERATE_API_MODEL=gemini-3-pro-image-preview
ANALYZE_API_MODEL=gemini-3.1-flash-lite-preview
```

### 环境变量说明

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `API_BASE_URL` | 是 | AI API 地址 |
| `API_KEY` | 是 | AI API 密钥 |
| `GENERATE_API_MODEL` | 否 | 生成详情页使用的模型，默认 `gemini-3-pro-image-preview` |
| `ANALYZE_API_MODEL` | 否 | 分析图片使用的模型，默认 `gemini-3.1-flash-lite-preview` |

## 注意事项

1. **API 密钥安全** - 请勿将 `.env` 文件提交到代码仓库（已通过 `.gitignore` 忽略）
2. **部署环境** - 在 Vercel 等平台部署时，需在环境变量配置页面添加相同的配置
3. **图片大小** - 上传图片会被压缩处理，建议单张不超过 5MB
4. **生成时间** - AI 分析和生成可能需要数秒，请耐心等待

## 技术栈

- **框架**: Next.js 16
- **AI**: OpenAI API (支持 Gemini 等兼容模型)
- **图片处理**: Sharp
- **样式**: Tailwind CSS
- **图标**: Lucide React

## 项目结构

```
app/
├── api/
│   ├── analyze/          # AI 图片分析接口
│   └── generate-detail/  # AI 详情页生成接口
├── page.tsx              # 主页面
└── layout.tsx            # 布局组件
.env                      # 环境变量（本地）
.env.example              # 环境变量模板
```

## 构建生产版本

```bash
npm run build
npm start
```

## 输入图

<img src=".\image_test\PixPin_2026-04-27_11-00-29.png" style="zoom: 33%;" />

## 结果图

<img src=".\image\AI-Detail-1777259317291.png" style="zoom:50%;" />
