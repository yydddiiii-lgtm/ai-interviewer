/**
 * End-to-end API test script.
 * Prerequisites: server running on PORT 3001, .env configured with real DB + API key.
 * Run: node test.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const http = require('http');

const BASE = `http://localhost:${process.env.PORT || 3001}/api`;
const EMAIL = `test_${Date.now()}@example.com`;
const PASSWORD = 'testpass123';

let token = '';
let sessionId = '';
let q1Id = '';
let q2Id = '';

function request(method, path, body, authToken) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function assert(label, condition, detail) {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    console.error(`  ✗ ${label}`, detail || '');
    process.exitCode = 1;
  }
}

async function run() {
  console.log('\n=== API Test Suite ===\n');

  // 1. Register
  console.log('1. POST /auth/register');
  {
    const r = await request('POST', '/auth/register', { email: EMAIL, password: PASSWORD });
    assert('status 201', r.status === 201, r.status);
    assert('has token', typeof r.body.token === 'string');
    assert('has user.id', r.body.user?.id);
    token = r.body.token;
  }

  // 2. Login
  console.log('\n2. POST /auth/login');
  {
    const r = await request('POST', '/auth/login', { email: EMAIL, password: PASSWORD });
    assert('status 200', r.status === 200, r.status);
    assert('has token', typeof r.body.token === 'string');
    token = r.body.token;
  }

  // 3. Create session
  console.log('\n3. POST /sessions');
  {
    const r = await request(
      'POST',
      '/sessions',
      {
        job_title: '前端工程师',
        company: '测试公司',
        resume_text: '3年React开发经验，熟悉TypeScript，有大型电商项目经验。',
      },
      token
    );
    assert('status 201', r.status === 201, r.status);
    assert('has session.id', r.body.session?.id);
    assert('status is active', r.body.session?.status === 'active');
    sessionId = r.body.session.id;
    console.log(`   session_id: ${sessionId}`);
  }

  // 4. Generate question 1
  console.log('\n4. POST /sessions/:id/questions (第1题, 调用 Claude)');
  {
    const r = await request('POST', `/sessions/${sessionId}/questions`, null, token);
    assert('status 201', r.status === 201, r.status);
    assert('has question.id', r.body.question?.id);
    assert('has content', r.body.question?.content?.length > 0);
    assert('valid question_type', ['behavioral','technical','resume_based','followup'].includes(r.body.question?.question_type));
    assert('order_index is 1', r.body.question?.order_index === 1);
    q1Id = r.body.question.id;
    console.log(`   Q1 [${r.body.question.question_type}]: ${r.body.question.content.slice(0, 60)}...`);
  }

  // 5. Submit answer to question 1
  console.log('\n5. POST /questions/:id/answers (第1题回答, 调用 Claude)');
  {
    const r = await request(
      'POST',
      `/questions/${q1Id}/answers`,
      {
        content: '我在上家公司负责核心电商首页的性能优化，使用React.memo和虚拟列表将页面加载时间从3秒降到1秒，用户留存率提升15%。',
        input_type: 'text',
      },
      token
    );
    assert('status 201', r.status === 201, r.status);
    assert('has answer.id', r.body.answer?.id);
    assert('score is 1-10', r.body.answer?.score >= 1 && r.body.answer?.score <= 10, r.body.answer?.score);
    assert('has feedback_content', r.body.answer?.feedback_content?.length > 0);
    assert('has feedback_structure', r.body.answer?.feedback_structure?.length > 0);
    assert('has feedback_improvement', r.body.answer?.feedback_improvement?.length > 0);
    console.log(`   score: ${r.body.answer.score}, feedback: ${r.body.answer.feedback_content?.slice(0, 50)}...`);
  }

  // 6. Generate question 2
  console.log('\n6. POST /sessions/:id/questions (第2题)');
  {
    const r = await request('POST', `/sessions/${sessionId}/questions`, null, token);
    assert('status 201', r.status === 201, r.status);
    assert('order_index is 2', r.body.question?.order_index === 2);
    q2Id = r.body.question.id;
    console.log(`   Q2 [${r.body.question.question_type}]: ${r.body.question.content.slice(0, 60)}...`);
  }

  // 7. Submit answer to question 2
  console.log('\n7. POST /questions/:id/answers (第2题回答)');
  {
    const r = await request(
      'POST',
      `/questions/${q2Id}/answers`,
      {
        content: '我擅长使用TypeScript进行类型设计，在团队中推广了代码规范，减少了约30%的运行时错误。',
        input_type: 'text',
      },
      token
    );
    assert('status 201', r.status === 201, r.status);
    assert('score is 1-10', r.body.answer?.score >= 1 && r.body.answer?.score <= 10);
  }

  // 8. Complete session
  console.log('\n8. PATCH /sessions/:id/complete');
  {
    const r = await request('PATCH', `/sessions/${sessionId}/complete`, null, token);
    assert('status 200', r.status === 200, r.status);
    assert('status is completed', r.body.session?.status === 'completed');
    assert('has completed_at', r.body.session?.completed_at);
  }

  // 9. Generate report
  console.log('\n9. POST /sessions/:id/report (生成报告, 调用 Claude)');
  {
    const r = await request('POST', `/sessions/${sessionId}/report`, null, token);
    assert('status 201', r.status === 201, r.status);
    assert('has overall_score', r.body.report?.overall_score != null);
    assert('score in range', r.body.report?.overall_score >= 1 && r.body.report?.overall_score <= 10);
    assert('has overall_summary', r.body.report?.overall_summary?.length > 0);
    assert('has strengths array', Array.isArray(r.body.report?.strengths));
    assert('has improvements array', Array.isArray(r.body.report?.improvements));
    console.log(`   overall_score: ${r.body.report.overall_score}`);
  }

  // 10. Get report
  console.log('\n10. GET /sessions/:id/report');
  {
    const r = await request('GET', `/sessions/${sessionId}/report`, null, token);
    assert('status 200', r.status === 200, r.status);
    assert('has report', r.body.report?.id);
    assert('has items array', Array.isArray(r.body.items));
    assert('items has question+answer', r.body.items[0]?.question?.content && r.body.items[0]?.answer?.score != null);
  }

  // 11. Get session detail
  console.log('\n11. GET /sessions/:id');
  {
    const r = await request('GET', `/sessions/${sessionId}`, null, token);
    assert('status 200', r.status === 200, r.status);
    assert('has questions array', Array.isArray(r.body.questions) && r.body.questions.length === 2);
    assert('has answers array', Array.isArray(r.body.answers) && r.body.answers.length === 2);
  }

  // 12. Get sessions list
  console.log('\n12. GET /sessions (历史列表)');
  {
    const r = await request('GET', '/sessions', null, token);
    assert('status 200', r.status === 200, r.status);
    assert('has sessions array', Array.isArray(r.body.sessions));
    const s = r.body.sessions.find((x) => x.id === sessionId);
    assert('new session in list', !!s);
    assert('has question_count', s?.question_count === 2);
    assert('has overall_score', s?.overall_score != null);
  }

  // 13. Idempotency: generate report again returns existing
  console.log('\n13. POST /sessions/:id/report (幂等检查)');
  {
    const r = await request('POST', `/sessions/${sessionId}/report`, null, token);
    assert('status 200 (existing report returned)', r.status === 200, r.status);
    assert('same report id', r.body.report?.session_id === sessionId);
  }

  console.log('\n=== Done ===\n');
}

run().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
