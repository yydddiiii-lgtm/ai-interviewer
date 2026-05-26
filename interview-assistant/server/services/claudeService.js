const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

function extractJSON(text) {
  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`AI response did not contain valid JSON: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]);
}

async function generateQuestion({ job_title, company, resume_text, previousQA }) {
  const companyStr = company ? `（${company}）` : '';
  const history = previousQA.length
    ? previousQA.map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join('\n\n')
    : '（这是第一道题，尚无对话记录）';

  const prompt = `你是一位经验丰富的${job_title}${companyStr}岗位面试官。
请根据候选人简历和已有对话，生成下一道面试题。

候选人简历：
${resume_text}

已有问答记录：
${history}

要求：
1. 只生成一道题目，不要编号或前缀
2. 题目类型从以下选择：behavioral（行为面试题）、technical（技术题）、resume_based（基于简历追问）、followup（对上一题的追问）
3. 第一道题优先选择 resume_based 或 behavioral
4. 不要重复已有题目
5. 仅返回 JSON，不要其他文字，格式：{"content": "题目内容", "question_type": "类型"}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  return extractJSON(response.choices[0].message.content);
}

async function evaluateAnswer({ question_content, answer_content }) {
  const prompt = `你是一位经验丰富的面试官，请对候选人的回答进行评分和点评。

面试题：${question_content}
候选人回答：${answer_content}

请从以下三个维度评价，仅返回 JSON，不要其他文字：
{
  "score": 评分（1到10的整数）,
  "feedback_content": "对回答内容质量和相关性的点评（50-100字）",
  "feedback_structure": "对回答结构（如STAR法则运用）的点评（30-80字）",
  "feedback_improvement": "具体改进建议（30-80字）"
}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return extractJSON(response.choices[0].message.content);
}

async function generateReport({ job_title, company, qaItems }) {
  const companyStr = company ? `（${company}）` : '';
  const items = qaItems
    .map((item, i) =>
      `Q${i + 1}（${item.question_type}）: ${item.question}\n候选人回答: ${item.answer}\nAI评分: ${item.score}`
    )
    .join('\n\n');

  const prompt = `你是一位经验丰富的${job_title}${companyStr}岗位面试官，请基于完整的面试记录生成最终评估报告。

面试记录：
${items}

仅返回 JSON，不要其他文字，格式如下：
{
  "overall_score": 综合评分（1.0到10.0，保留一位小数的数字，不是字符串）,
  "overall_summary": "综合评价段落（100-200字）",
  "strengths": ["优势条目1", "优势条目2", "优势条目3"],
  "improvements": ["改进方向1", "改进方向2", "改进方向3"]
}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  return extractJSON(response.choices[0].message.content);
}

module.exports = { generateQuestion, evaluateAnswer, generateReport };
