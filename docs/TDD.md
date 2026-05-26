# 求职助手 AI 面试官 — 技术方案文档（TDD）

> 版本：v0.1（草稿，待确认）  
> 日期：2026-05-25

---

## 1. 技术选型

| 层级 | 技术 | 版本/说明 |
|------|------|---------|
| 前端框架 | React | 18，函数组件 + Hooks |
| 前端构建 | Vite | 最新稳定版，开发体验好、构建快 |
| 前端样式 | Tailwind CSS | v3，utility-first |
| 前端路由 | React Router | v6 |
| 后端框架 | Node.js + Express | Express 4.x |
| 数据库 | PostgreSQL | 15+，使用 pg 驱动（node-postgres）|
| 认证 | JWT | jsonwebtoken，无状态认证 |
| 密码加密 | bcrypt | 密码哈希存储 |
| AI 模型 | Claude API | claude-sonnet-4-6，via @anthropic-ai/sdk |
| 语音转文字 | Web Speech API | 浏览器原生，无需额外费用 |
| HTTP 客户端 | Axios | 前端调用后端 API |

---

## 2. 项目目录结构

```
interview-assistant/
├── client/                          # React 前端
│   ├── public/
│   ├── src/
│   │   ├── pages/                   # 路由级页面组件
│   │   │   ├── HomePage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── SetupPage.jsx
│   │   │   ├── InterviewPage.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── components/              # 可复用 UI 组件
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── interview/
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   ├── AnswerInput.jsx
│   │   │   │   ├── VoiceRecorder.jsx
│   │   │   │   ├── FeedbackCard.jsx
│   │   │   │   └── ProgressBar.jsx
│   │   │   └── report/
│   │   │       ├── ScoreSummary.jsx
│   │   │       ├── StrengthsList.jsx
│   │   │       ├── ImprovementsList.jsx
│   │   │       └── QuestionReviewList.jsx
│   │   ├── hooks/                   # 自定义 Hook
│   │   │   ├── useAuth.js
│   │   │   └── useVoice.js
│   │   ├── api/                     # Axios 请求封装
│   │   │   ├── client.js            # Axios 实例配置
│   │   │   ├── auth.js
│   │   │   ├── sessions.js
│   │   │   └── reports.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── server/                          # Node.js 后端
│   ├── routes/                      # Express 路由
│   │   ├── auth.js
│   │   ├── sessions.js
│   │   ├── questions.js
│   │   ├── answers.js
│   │   └── reports.js
│   ├── controllers/                 # 业务逻辑
│   │   ├── authController.js
│   │   ├── sessionController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   └── reportController.js
│   ├── services/                    # 外部服务封装
│   │   └── claudeService.js        # Claude API 调用
│   ├── middleware/
│   │   ├── auth.js                  # JWT 验证中间件
│   │   └── errorHandler.js
│   ├── db/
│   │   ├── pool.js                  # pg 连接池
│   │   └── migrations/
│   │       └── 001_init.sql
│   └── index.js                     # 入口文件
│
├── .env                             # 环境变量（不提交 git）
├── .env.example                     # 环境变量示例
└── package.json
```

---

## 3. 数据库表设计

> 所有表使用 UUID 主键，字段名均为 snake_case，与 API 返回字段名完全一致。

---

### 表：users（用户）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | UUID | 是 | 主键，gen_random_uuid() |
| email | VARCHAR(255) | 是 | 登录邮箱，唯一 |
| password_hash | VARCHAR(255) | 是 | bcrypt 加密后的密码 |
| created_at | TIMESTAMPTZ | 是 | 默认 NOW() |

---

### 表：sessions（面试会话）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | UUID | 是 | 主键 |
| user_id | UUID | 是 | 外键 → users.id |
| job_title | VARCHAR(255) | 是 | 目标岗位名称 |
| company | VARCHAR(255) | 否 | 目标公司（可选）|
| resume_text | TEXT | 是 | 用户简历原文 |
| status | VARCHAR(20) | 是 | 'active' 或 'completed' |
| created_at | TIMESTAMPTZ | 是 | 默认 NOW() |
| completed_at | TIMESTAMPTZ | 否 | 面试结束时间 |

---

### 表：questions（面试题目）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | UUID | 是 | 主键 |
| session_id | UUID | 是 | 外键 → sessions.id |
| content | TEXT | 是 | 题目内容 |
| question_type | VARCHAR(30) | 是 | 'behavioral' / 'technical' / 'resume_based' / 'followup' |
| order_index | INTEGER | 是 | 在本次会话中的题目序号 |
| created_at | TIMESTAMPTZ | 是 | 默认 NOW() |

---

### 表：answers（用户回答）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | UUID | 是 | 主键 |
| session_id | UUID | 是 | 外键 → sessions.id |
| question_id | UUID | 是 | 外键 → questions.id |
| content | TEXT | 是 | 用户回答正文 |
| input_type | VARCHAR(10) | 是 | 'text' 或 'voice' |
| score | INTEGER | 否 | AI 评分 1–10 |
| feedback_content | TEXT | 否 | AI 对内容的点评 |
| feedback_structure | TEXT | 否 | AI 对 STAR 结构的点评 |
| feedback_improvement | TEXT | 否 | AI 给出的改进建议 |
| created_at | TIMESTAMPTZ | 是 | 默认 NOW() |

---

### 表：reports（面试报告）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | UUID | 是 | 主键 |
| session_id | UUID | 是 | 外键 → sessions.id，唯一 |
| overall_score | NUMERIC(4,1) | 是 | 综合评分（如 7.5） |
| overall_summary | TEXT | 是 | 综合评价段落 |
| strengths | JSONB | 是 | 优势列表，如 ["沟通清晰","有数据支撑"] |
| improvements | JSONB | 是 | 改进方向列表 |
| created_at | TIMESTAMPTZ | 是 | 默认 NOW() |

---

## 4. API 接口设计

> 所有接口前缀 `/api`。  
> 需要鉴权的接口在 Header 中携带 `Authorization: Bearer <token>`。  
> 字段名与数据库表字段名完全一致。

---

### 认证模块

#### `POST /api/auth/register` — 注册
**请求体：**
```json
{
  "email": "string（必填）",
  "password": "string（必填，至少8位）"
}
```
**返回：**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "created_at": "timestamp"
  },
  "token": "string"
}
```

---

#### `POST /api/auth/login` — 登录
**请求体：**
```json
{
  "email": "string（必填）",
  "password": "string（必填）"
}
```
**返回：**
```json
{
  "user": {
    "id": "uuid",
    "email": "string"
  },
  "token": "string"
}
```

---

### 会话模块（需鉴权）

#### `POST /api/sessions` — 创建新面试会话
**请求体：**
```json
{
  "job_title": "string（必填）",
  "company": "string（可选）",
  "resume_text": "string（必填）"
}
```
**返回：**
```json
{
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "job_title": "string",
    "company": "string | null",
    "resume_text": "string",
    "status": "active",
    "created_at": "timestamp",
    "completed_at": null
  }
}
```

---

#### `GET /api/sessions` — 获取历史会话列表
**返回：**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "job_title": "string",
      "company": "string | null",
      "status": "active | completed",
      "created_at": "timestamp",
      "completed_at": "timestamp | null"
    }
  ]
}
```

---

#### `GET /api/sessions/:id` — 获取会话详情
**返回：**
```json
{
  "session": {
    "id": "uuid",
    "job_title": "string",
    "company": "string | null",
    "resume_text": "string",
    "status": "string",
    "created_at": "timestamp",
    "completed_at": "timestamp | null"
  },
  "questions": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "content": "string",
      "question_type": "string",
      "order_index": 1,
      "created_at": "timestamp"
    }
  ],
  "answers": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "question_id": "uuid",
      "content": "string",
      "input_type": "text | voice",
      "score": 8,
      "feedback_content": "string",
      "feedback_structure": "string",
      "feedback_improvement": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

#### `PATCH /api/sessions/:id/complete` — 结束面试
**请求体：** 无  
**返回：**
```json
{
  "session": {
    "id": "uuid",
    "status": "completed",
    "completed_at": "timestamp"
  }
}
```

---

### 题目模块（需鉴权）

#### `POST /api/sessions/:id/questions` — 生成下一道题
**请求体：** 无（后端根据会话上下文自动决定题目类型和内容）  
**返回：**
```json
{
  "question": {
    "id": "uuid",
    "session_id": "uuid",
    "content": "string",
    "question_type": "behavioral | technical | resume_based | followup",
    "order_index": 1,
    "created_at": "timestamp"
  }
}
```

---

### 回答模块（需鉴权）

#### `POST /api/questions/:question_id/answers` — 提交回答，获取 AI 点评
**请求体：**
```json
{
  "content": "string（必填，用户回答正文）",
  "input_type": "text | voice（必填）"
}
```
**返回：**
```json
{
  "answer": {
    "id": "uuid",
    "session_id": "uuid",
    "question_id": "uuid",
    "content": "string",
    "input_type": "text | voice",
    "score": 7,
    "feedback_content": "string",
    "feedback_structure": "string",
    "feedback_improvement": "string",
    "created_at": "timestamp"
  }
}
```

---

### 报告模块（需鉴权）

#### `POST /api/sessions/:id/report` — 生成面试报告
**请求体：** 无（面试结束后调用，后端聚合所有回答生成报告）  
**返回：**
```json
{
  "report": {
    "id": "uuid",
    "session_id": "uuid",
    "overall_score": 7.5,
    "overall_summary": "string",
    "strengths": ["条目1", "条目2"],
    "improvements": ["条目1", "条目2"],
    "created_at": "timestamp"
  }
}
```

---

#### `GET /api/sessions/:id/report` — 获取面试报告
**返回：**
```json
{
  "report": {
    "id": "uuid",
    "session_id": "uuid",
    "overall_score": 7.5,
    "overall_summary": "string",
    "strengths": ["条目1", "条目2"],
    "improvements": ["条目1", "条目2"],
    "created_at": "timestamp"
  },
  "items": [
    {
      "question": {
        "id": "uuid",
        "content": "string",
        "question_type": "string",
        "order_index": 1
      },
      "answer": {
        "id": "uuid",
        "content": "string",
        "input_type": "text | voice",
        "score": 8,
        "feedback_content": "string",
        "feedback_structure": "string",
        "feedback_improvement": "string"
      }
    }
  ]
}
```

---

## 5. 核心页面与组件拆分

| 页面 | 路由 | 说明 | 主要组件 |
|------|------|------|---------|
| 首页 | `/` | 产品介绍，引导用户开始 | `HeroSection`, `FeatureList`, `CTAButton` |
| 注册/登录 | `/auth` | 标签页切换登录和注册 | `LoginForm`, `RegisterForm` |
| 新建面试 | `/interview/new` | 填写岗位、公司、粘贴简历 | `SetupForm`, `JobInput`, `ResumeInput` |
| 面试进行中 | `/interview/:id` | 核心交互页面，逐题作答 | `QuestionCard`, `AnswerInput`, `VoiceRecorder`, `FeedbackCard`, `ProgressBar` |
| 面试报告 | `/interview/:id/report` | 查看完整报告 | `ScoreSummary`, `StrengthsList`, `ImprovementsList`, `QuestionReviewList` |
| 历史记录 | `/history` | 查看过去的面试会话 | `SessionList`, `SessionCard` |

---

## 6. 环境变量清单

在项目根目录创建 `.env` 文件（不提交 git），参考 `.env.example`。

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | `development` | 运行环境，取值 `development` / `production` |
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/interview_db` | PostgreSQL 连接串 |
| `JWT_SECRET` | `your-super-secret-key-here` | JWT 签名密钥，请使用随机长字符串 |
| `JWT_EXPIRES_IN` | `7d` | Token 有效期 |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Claude API 密钥 |
| `CLAUDE_MODEL` | `claude-sonnet-4-6` | 使用的 Claude 模型 |
| `PORT` | `3001` | 后端服务端口 |
| `CLIENT_URL` | `http://localhost:5173` | 前端地址（用于 CORS 配置）|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | 前端 Axios 的 API 基础地址 |
