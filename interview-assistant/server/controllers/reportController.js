const pool = require('../db/pool');
const { generateReport } = require('../services/claudeService');

exports.createReport = async (req, res, next) => {
  try {
    const { id: session_id } = req.params;

    const sessionRes = await pool.query(
      'SELECT * FROM sessions WHERE id = $1 AND user_id = $2',
      [session_id, req.user.id]
    );
    if (!sessionRes.rows[0]) return res.status(404).json({ error: 'Session not found' });
    const session = sessionRes.rows[0];

    const existing = await pool.query('SELECT * FROM reports WHERE session_id = $1', [session_id]);
    if (existing.rows[0]) return res.json({ report: existing.rows[0] });

    const [qRes, aRes] = await Promise.all([
      pool.query('SELECT * FROM questions WHERE session_id = $1 ORDER BY order_index', [session_id]),
      pool.query('SELECT * FROM answers WHERE session_id = $1', [session_id]),
    ]);

    const answerMap = {};
    aRes.rows.forEach((a) => { answerMap[a.question_id] = a; });

    const qaItems = qRes.rows.map((q) => ({
      question: q.content,
      question_type: q.question_type,
      answer: answerMap[q.id]?.content || '（未回答）',
      score: answerMap[q.id]?.score || 0,
    }));

    const reportData = await generateReport({
      job_title: session.job_title,
      company: session.company,
      qaItems,
    });

    const { rows } = await pool.query(
      `INSERT INTO reports (session_id, overall_score, overall_summary, strengths, improvements)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        session_id,
        reportData.overall_score,
        reportData.overall_summary,
        JSON.stringify(reportData.strengths),
        JSON.stringify(reportData.improvements),
      ]
    );

    res.status(201).json({ report: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const { id: session_id } = req.params;

    const sessionRes = await pool.query(
      'SELECT id FROM sessions WHERE id = $1 AND user_id = $2',
      [session_id, req.user.id]
    );
    if (!sessionRes.rows[0]) return res.status(404).json({ error: 'Session not found' });

    const reportRes = await pool.query('SELECT * FROM reports WHERE session_id = $1', [session_id]);
    if (!reportRes.rows[0]) return res.status(404).json({ error: 'Report not found' });

    const [qRes, aRes] = await Promise.all([
      pool.query('SELECT * FROM questions WHERE session_id = $1 ORDER BY order_index', [session_id]),
      pool.query('SELECT * FROM answers WHERE session_id = $1', [session_id]),
    ]);

    const answerMap = {};
    aRes.rows.forEach((a) => { answerMap[a.question_id] = a; });

    const items = qRes.rows.map((q) => ({
      question: {
        id: q.id,
        content: q.content,
        question_type: q.question_type,
        order_index: q.order_index,
      },
      answer: answerMap[q.id]
        ? {
            id: answerMap[q.id].id,
            content: answerMap[q.id].content,
            input_type: answerMap[q.id].input_type,
            score: answerMap[q.id].score,
            feedback_content: answerMap[q.id].feedback_content,
            feedback_structure: answerMap[q.id].feedback_structure,
            feedback_improvement: answerMap[q.id].feedback_improvement,
          }
        : null,
    }));

    res.json({ report: reportRes.rows[0], items });
  } catch (err) {
    next(err);
  }
};
