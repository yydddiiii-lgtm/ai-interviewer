# AI 面试教练

输入岗位和简历，AI 模拟真实面试官逐题提问，用户回答后获得即时评分与点评，面试结束后生成完整面试报告。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite 5 + Tailwind CSS v4 + React Router v6 |
| 后端 | Node.js + Express + JWT（待开发）|
| 数据库 | PostgreSQL + node-postgres（待开发）|
| AI | Claude API（claude-sonnet-4-6）via @anthropic-ai/sdk（待开发）|
| 语音 | Web Speech API（浏览器原生）|

---

## 页面展示

### 首页
产品介绍、功能亮点和使用流程引导。

![首页](interview-assistant/docs/screenshots/01-home.png)

---

### 注册 / 登录
标签页切换，支持邮箱注册和登录。

![注册登录](interview-assistant/docs/screenshots/02-auth.png)

---

### 新建面试
填写目标岗位、公司（可选）和简历文本，AI 据此生成专属题目。

![新建面试](interview-assistant/docs/screenshots/03-setup.png)

---

### 面试进行中
AI 面试官逐题提问，支持文字或语音作答，每题提交后右侧即时显示 AI 评分与点评。

![面试进行中](interview-assistant/docs/screenshots/04-interview.png)

---

### 面试报告
面试结束后生成完整报告：综合评分、突出优势、改进方向，以及每道题的折叠式详细回顾。

![面试报告](interview-assistant/docs/screenshots/05-report.png)

---

### 历史记录
查看所有历史面试会话，展示统计数据和每次面试的得分与状态。

![历史记录](interview-assistant/docs/screenshots/06-history.png)

---

## 快速开始

### 环境要求

- Node.js v20+

### 启动前端（当前阶段）

```bash
cd interview-assistant/client
npm install
npm run dev
```

浏览器访问 `http://localhost:5173`

> 当前版本使用 mock 数据，无需启动后端和数据库。

### 环境变量

参考 `.env.example` 创建 `.env` 文件（后端接入时需要）：

```
DATABASE_URL=postgresql://user:pass@localhost:5432/interview_db
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-sonnet-4-6
PORT=3001
CLIENT_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3001/api
```

---

## 项目结构

```
interview-assistant/
├── client/                  # React 前端
│   ├── src/
│   │   ├── pages/           # 6 个路由页面
│   │   ├── components/      # 可复用组件
│   │   ├── hooks/           # useAuth / useVoice
│   │   ├── api/             # API 封装（当前为 mock）
│   │   └── mock/            # Mock 数据
│   └── vite.config.js
├── server/                  # Node.js 后端（待开发）
└── docs/
    ├── PRD.md
    ├── TDD.md
    ├── frontend-api.md      # 前端接口文档
    └── screenshots/         # 页面截图
```

---

## 开发进度

- [x] 产品需求文档（PRD）
- [x] 技术方案文档（TDD）
- [x] 前端 6 个页面（mock 数据）
- [ ] Node.js 后端（Express + JWT + PostgreSQL）
- [ ] 接入 Claude API
- [ ] 前后端联调
