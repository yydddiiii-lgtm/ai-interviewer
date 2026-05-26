const pool = require('../db/pool');
const { generateQuestion } = require('../services/claudeService');

exports.generateNextQuestion = async (req, res, next) => {
  try {
    const { id: session_id } = req.params;

    const sessionRes = await pool.query(
      'SELECT * FROM sessions WHERE id = $1 AND user_id = $2',
      [session_id, req.user.id]
    );
    if (!sessionRes.rows[0]) return res.status(404).json({ error: 'Session not found' });
    const session = sessionRes.rows[0];

    const [qRes, aRes] = await Promise.all([
      pool.query('SELECT * FROM questions WHERE session_id = $1 ORDER BY order_index', [session_id]),
      pool.query('SELECT * FROM answers WHERE session_id = $1', [session_id]),
    ]);

    const answerMap = {};
    aRes.rows.forEach((a) => { answerMap[a.question_id] = a.content; });

    const previousQA = qRes.rows.map((q) => ({
      question: q.content,
      answer: answerMap[q.id] || '（未回答）',
    }));

    const order_index = qRes.rows.length + 1;

    const { content, question_type } = await generateQuestion({
      job_title: session.job_title,
      company: session.company,
      resume_text: session.resume_text,
      previousQA,
    });

    const { rows } = await pool.query(
      `INSERT INTO questions (session_id, content, question_type, order_index)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [session_id, content, question_type, order_index]
    );

    res.status(201).json({ question: rows[0] });
  } catch (err) {
    next(err);
  }
};
