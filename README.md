# AI 面试教练

**线上地址：http://123.56.244.199:8080**

输入岗位和简历，AI 模拟真实面试官逐题提问，用户回答后获得即时评分与点评，面试结束后生成完整面试报告。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite 5 + Tailwind CSS v4 + React Router v6 |
| 后端 | Node.js + Express + JWT |
| 数据库 | PostgreSQL 15 |
| AI | DeepSeek API |
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

## 快速开始（本地开发）

### 环境要求

- Node.js v20+
- PostgreSQL 15+

### 启动

```bash
# 后端
cd interview-assistant/server
npm install
npm run dev

# 前端
cd interview-assistant/client
npm install
npm run dev
```

### 环境变量

参考 `interview-assistant/.env.example` 创建 `.env` 文件。

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
├── server/                  # Node.js 后端
└── docs/
    ├── PRD.md
    ├── TDD.md
    ├── frontend-api.md      # 前端接口文档
    └── screenshots/         # 页面截图
```

---

