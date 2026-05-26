-- 启用 pgcrypto 扩展（gen_random_uuid）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 面试会话表
CREATE TABLE IF NOT EXISTS sessions (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES users(id),
  job_title    VARCHAR(255) NOT NULL,
  company      VARCHAR(255),
  resume_text  TEXT         NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 面试题目表
CREATE TABLE IF NOT EXISTS questions (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID         NOT NULL REFERENCES sessions(id),
  content       TEXT         NOT NULL,
  question_type VARCHAR(30)  NOT NULL CHECK (question_type IN ('behavioral', 'technical', 'resume_based', 'followup')),
  order_index   INTEGER      NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 用户回答表（含 AI 评分与点评）
CREATE TABLE IF NOT EXISTS answers (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id           UUID         NOT NULL REFERENCES sessions(id),
  question_id          UUID         NOT NULL REFERENCES questions(id),
  content              TEXT         NOT NULL,
  input_type           VARCHAR(10)  NOT NULL CHECK (input_type IN ('text', 'voice')),
  score                INTEGER      CHECK (score BETWEEN 1 AND 10),
  feedback_content     TEXT,
  feedback_structure   TEXT,
  feedback_improvement TEXT,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 面试报告表（每个会话最多一份）
CREATE TABLE IF NOT EXISTS reports (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID          NOT NULL UNIQUE REFERENCES sessions(id),
  overall_score   NUMERIC(4,1)  NOT NULL,
  overall_summary TEXT          NOT NULL,
  strengths       JSONB         NOT NULL DEFAULT '[]',
  improvements    JSONB         NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
