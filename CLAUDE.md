# CLAUDE.md

## 项目信息

### 项目简介
输入岗位和简历，AI 模拟真实面试官逐题提问，用户回答后获得即时评分与点评，面试结束后生成完整面试报告。

### 技术栈
| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + Tailwind CSS + React Router v6 |
| 后端 | Node.js + Express + JWT |
| 数据库 | PostgreSQL + node-postgres（pg） |
| AI | Claude API（claude-sonnet-4-6）via @anthropic-ai/sdk |
| 语音 | Web Speech API（浏览器原生） |

### 目录结构
```
interview-assistant/
├── client/          # React 前端
├── server/          # Node.js 后端
├── docs/            # 项目文档（只读，不可修改）
│   ├── Ques.md      # 项目题目
│   ├── research.md  # 市场调研报告
│   ├── PRD.md       # 产品需求文档
│   └── TDD.md       # 技术方案文档
├── .env             # 环境变量（不提交 git）
├── .env.example
└── CLAUDE.md
```

### 当前状态
文档阶段已完成，代码尚未开始。已完成文档：
- `docs/research.md` — 市场调研报告 ✓
- `docs/PRD.md` — 产品需求文档 ✓
- `docs/TDD.md` — 技术方案文档 ✓



---

## Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
