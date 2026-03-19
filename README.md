# 测名字AI算命

基于 Next.js + 豆包API 的国潮风格姓名算命应用。

## 功能特性

- ✨ AI智能算命 - 基于姓名、性别、出生日期生成个性化分析
- 🎨 国潮风格UI - 红金配色，传统韵味
- 📊 多维度分析 - 性格、事业、感情、健康、幸运元素、每日箴言
- 🎭 三种风格 - 传统八字、星座运势、塔罗占卜
- 💾 历史记录 - 本地存储历史测算结果
- 🎋 每日签到 - 连续签到奖励机制
- 🖼️ 分享功能 - 生成精美分享图片

## 技术栈

- **框架**: Next.js 15 + TypeScript (App Router)
- **样式**: Tailwind CSS
- **AI**: 豆包API (火山引擎Ark)
- **存储**: localStorage
- **图片生成**: html2canvas

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，并配置你的豆包API密钥：

```env
DOUBAO_API_KEY=your_api_key_here
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
DOUBAO_MODEL=your_model_endpoint
```

> 注意：如果不配置API密钥，应用会使用模拟数据，方便开发调试。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可使用。

## 项目结构

```
suanming/
├── src/
│   ├── app/
│   │   ├── api/fortune/route.ts    # 算命API
│   │   ├── page.tsx                 # 首页
│   │   ├── result/page.tsx          # 结果页
│   │   ├── history/page.tsx         # 历史记录
│   │   └── checkin/page.tsx         # 签到页
│   ├── components/
│   │   ├── form/                     # 表单组件
│   │   ├── result/                   # 结果组件
│   │   └── common/                   # 通用组件
│   ├── lib/
│   │   ├── doubao/                   # 豆包API封装
│   │   ├── storage/                  # 本地存储
│   │   └── image/                    # 图片生成
│   └── types/                        # TypeScript类型
└── package.json
```

## 免责声明

本应用仅供娱乐，所有内容均由AI生成，不构成任何建议。请勿迷信，理性对待。
