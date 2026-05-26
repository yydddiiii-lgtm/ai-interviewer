# 前端 API 接口文档

> 当前状态：前端使用 mock 数据，所有接口均在 `src/api/` 中以本地 mock 实现。
> 接入真实后端时，将 `src/api/` 各文件中的 mock 函数替换为真实 Axios 调用即可。
> API 基础地址由环境变量 `VITE_API_BASE_URL` 控制（默认 `http://localhost:3001/api`）。

---

## 认证模块 `src/api/auth.js`

### POST /api/auth/register — 注册

**请求体：**
```json
{ "email": "string", "password": "string（至少8位）" }
```

**返回：**
```json
{
  "user": { "id": "uuid", "email": "string", "created_at": "timestamp" },
  "token": "string"
}
```

**前端调用位置：** `RegisterForm.jsx` → 注册成功后 `saveAuth(user, token)` 并跳转 `/history`

---

### POST /api/auth/login — 登录

**请求体：**
```json
{ "email": "string", "password": "string" }
```

**返回：**
```json
{
  "user": { "id": "uuid", "email": "string" },
  "token": "string"
}
```

**前端调用位置：** `LoginForm.jsx` → 登录成功后 `saveAuth(user, token)` 并跳转 `/history`

---

## 会话模块 `src/api/sessions.js`

### POST /api/sessions — 创建新面试会话

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

**前端调用位置：** `SetupPage.jsx` → 创建成功后跳转 `/interview/:id`

---

### GET /api/sessions — 获取历史会话列表

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
      "completed_at": "timestamp | null",
      "question_count": 6,
      "duration_minutes": 28,
      "overall_score": 7.5
    }
  ]
}
```

> 注：`question_count`、`duration_minutes`、`overall_score` 为前端展示需要的聚合字段，后端需在此接口中一并返回（或前端通过 GET /api/sessions/:id 分别查询）。

**前端调用位置：** `HistoryPage.jsx` → 页面加载时调用，展示会话卡片列表和统计数据

---

### GET /api/sessions/:id — 获取会话详情

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
      "question_type": "behavioral | technical | resume_based | followup",
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

**前端调用位置：** 当前 mock 阶段未直接使用，后端接入后可用于面试页面恢复会话状态

---

### PATCH /api/sessions/:id/complete — 结束面试

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

**前端调用位置：** `InterviewPage.jsx` → 点击"结束面试"或完成最后一题后调用，随后调用 POST /api/sessions/:id/report

---

### POST /api/sessions/:id/questions — 生成下一道题

**请求体：** 无

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

**前端调用位置：** `InterviewPage.jsx` → 页面加载时获取第1题，每次点击"下一题"后获取下一题

---

### POST /api/questions/:question_id/answers — 提交回答，获取 AI 点评

**请求体：**
```json
{
  "content": "string（用户回答正文）",
  "input_type": "text | voice"
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

**前端调用位置：** `InterviewPage.jsx` → 用户点击"提交回答"后调用，返回结果传入 `FeedbackCard`

---

## 报告模块 `src/api/reports.js`

### POST /api/sessions/:id/report — 生成面试报告

**请求体：** 无

**返回：**
```json
{
  "report": {
    "id": "uuid",
    "session_id": "uuid",
    "overall_score": 7.5,
    "overall_summary": "string",
    "strengths": ["string", "string"],
    "improvements": ["string", "string"],
    "created_at": "timestamp"
  }
}
```

**前端调用位置：** `InterviewPage.jsx` → 结束面试后立即调用，生成成功后跳转 `/interview/:id/report`

---

### GET /api/sessions/:id/report — 获取面试报告

**返回：**
```json
{
  "report": {
    "id": "uuid",
    "session_id": "uuid",
    "overall_score": 7.5,
    "overall_summary": "string",
    "strengths": ["string", "string"],
    "improvements": ["string", "string"],
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

**前端调用位置：** `ReportPage.jsx` → 页面加载时调用，数据传入 `ScoreSummary`、`StrengthsList`、`ImprovementsList`、`QuestionReviewList`

---

## 前端状态管理说明

| 状态 | 存储位置 | 说明 |
|------|----------|------|
| 登录状态 | `AuthContext`（`useAuth` hook） | user 对象 + token，持久化到 localStorage |
| 当前题目 | `InterviewPage` 本地 state | currentIndex、question、feedback |
| 报告数据 | `ReportPage` 本地 state | report + items，页面挂载时从 API 获取 |

## 接入真实后端的替换步骤

1. 在 `.env` 中设置 `VITE_API_BASE_URL=http://localhost:3001/api`
2. 在 `src/api/client.js` 中初始化带有 `Authorization: Bearer <token>` 头的 Axios 实例
3. 逐个替换 `src/api/auth.js`、`src/api/sessions.js`、`src/api/reports.js` 中的 mock 函数为真实 Axios 调用
4. 删除 `src/mock/data.js`（或保留作测试用）

---

## 数据库表结构（PostgreSQL）

> 迁移文件：`server/db/migrations/001_init.sql`  
> 执行方式：`psql $DATABASE_URL < server/db/migrations/001_init.sql`  
> 所有表使用 UUID 主键，字段名 snake_case，与 API 返回字段名完全一致。

---

### 表：users

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 登录邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 加密后的密码 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 注册时间 |

---

### 表：sessions

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| user_id | UUID | NOT NULL, FK → users.id | 所属用户 |
| job_title | VARCHAR(255) | NOT NULL | 目标岗位 |
| company | VARCHAR(255) | — | 目标公司（可选） |
| resume_text | TEXT | NOT NULL | 简历原文 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active', CHECK IN ('active','completed') | 会话状态 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 创建时间 |
| completed_at | TIMESTAMPTZ | — | 面试结束时间 |

---

### 表：questions

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| session_id | UUID | NOT NULL, FK → sessions.id | 所属会话 |
| content | TEXT | NOT NULL | 题目内容 |
| question_type | VARCHAR(30) | NOT NULL, CHECK IN ('behavioral','technical','resume_based','followup') | 题目类型 |
| order_index | INTEGER | NOT NULL | 会话内题目序号（从 1 开始） |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 生成时间 |

---

### 表：answers

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| session_id | UUID | NOT NULL, FK → sessions.id | 所属会话 |
| question_id | UUID | NOT NULL, FK → questions.id | 对应题目 |
| content | TEXT | NOT NULL | 用户回答正文 |
| input_type | VARCHAR(10) | NOT NULL, CHECK IN ('text','voice') | 输入方式 |
| score | INTEGER | CHECK BETWEEN 1 AND 10 | AI 评分（提交回答后由 Claude 填充） |
| feedback_content | TEXT | — | AI 对内容的点评 |
| feedback_structure | TEXT | — | AI 对 STAR 结构的点评 |
| feedback_improvement | TEXT | — | AI 的改进建议 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 提交时间 |

---

### 表：reports

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| session_id | UUID | NOT NULL, UNIQUE, FK → sessions.id | 所属会话（每会话唯一） |
| overall_score | NUMERIC(4,1) | NOT NULL | 综合评分，如 7.5 |
| overall_summary | TEXT | NOT NULL | 综合评价段落 |
| strengths | JSONB | NOT NULL, DEFAULT '[]' | 优势列表，如 ["沟通清晰"] |
| improvements | JSONB | NOT NULL, DEFAULT '[]' | 改进方向列表 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 生成时间 |

---

### 外键关系

```
users
 └── sessions (user_id → users.id)
       ├── questions (session_id → sessions.id)
       ├── answers   (session_id → sessions.id)
       │              question_id → questions.id
       └── reports   (session_id → sessions.id, UNIQUE)
```

---

### 后端开发说明

**连接池**：使用 `server/db/pool.js` 中的 `pg.Pool`，通过 `DATABASE_URL` 环境变量连接。

**ID 生成**：全部由数据库负责（`gen_random_uuid()`），后端代码无需手动生成 UUID。

**AI 字段写入时机**：
- `answers.score / feedback_*` — 用户提交回答时，调用 AI API 后一次性 INSERT（含评分字段）。
- `reports.*` — 调用 `POST /api/sessions/:id/report` 时，聚合所有 answers 后 INSERT；重复调用返回已有报告（幂等）。

**status 流转**：`sessions.status` 仅有两个值：
- `active` — 面试进行中（默认）
- `completed` — 调用 `PATCH /api/sessions/:id/complete` 后更新

---

## 后端实现说明（已实现，2026-05-26）

### 运行环境

| 项目 | 值 |
|------|----|
| 运行目录 | `interview-assistant/server/` |
| 启动命令 | `node index.js` |
| 端口 | `process.env.PORT`（默认 3001） |
| AI 服务 | DeepSeek API（OpenAI 兼容接口） |

### 环境变量（实际使用）

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | PostgreSQL 连接串 |
| `JWT_SECRET` | JWT 签名密钥 |
| `JWT_EXPIRES_IN` | Token 有效期（默认 7d） |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 |
| `DEEPSEEK_MODEL` | 模型名（默认 deepseek-chat） |
| `PORT` | 后端端口（默认 3001） |
| `CLIENT_URL` | 前端地址（CORS 白名单） |

### 实际路由挂载

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/sessions
GET    /api/sessions
GET    /api/sessions/:id
PATCH  /api/sessions/:id/complete
POST   /api/sessions/:id/questions
POST   /api/sessions/:id/report
GET    /api/sessions/:id/report
POST   /api/questions/:question_id/answers
```

### GET /api/sessions 实际返回字段

`question_count`、`duration_minutes`、`overall_score` 均由后端 SQL 聚合计算后一并返回，无需前端额外请求。

### AI 调用模块

`server/services/claudeService.js` 导出三个函数：

| 函数 | 触发时机 | 返回 |
|------|----------|------|
| `generateQuestion` | `POST /sessions/:id/questions` | `{ content, question_type }` |
| `evaluateAnswer` | `POST /questions/:id/answers` | `{ score, feedback_content, feedback_structure, feedback_improvement }` |
| `generateReport` | `POST /sessions/:id/report` | `{ overall_score, overall_summary, strengths, improvements }` |

### 接入真实后端步骤

1. 将 `src/api/client.js` 替换为带 `Authorization: Bearer <token>` 的真实 Axios 实例
2. 逐个替换 `src/api/auth.js`、`src/api/sessions.js`、`src/api/reports.js` 中的 mock 函数为真实 Axios 调用
3. 在前端 `.env` 中设置 `VITE_API_BASE_URL=http://localhost:3001/api`
