const pool = require('../db/pool');

exports.createSession = async (req, res, next) => {
  try {
    const { job_title, company, resume_text } = req.body;
    if (!job_title || !resume_text) {
      return res.status(400).json({ error: 'job_title and resume_text required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO sessions (user_id, job_title, company, resume_text)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, job_title, company || null, resume_text]
    );
    res.status(201).json({ session: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.job_title, s.company, s.status, s.created_at, s.completed_at,
              COUNT(q.id)::int AS question_count,
              ROUND(EXTRACT(EPOCH FROM (COALESCE(s.completed_at, NOW()) - s.created_at)) / 60)::int AS duration_minutes,
              r.overall_score
       FROM sessions s
       LEFT JOIN questions q ON q.session_id = s.id
       LEFT JOIN reports r ON r.session_id = s.id
       WHERE s.user_id = $1
       GROUP BY s.id, r.overall_score
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    res.json({ sessions: rows });
  } catch (err) {
    next(err);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionRes = await pool.query(
      'SELECT * FROM sessions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (!sessionRes.rows[0]) return res.status(404).json({ error: 'Session not found' });

    const [questionsRes, answersRes] = await Promise.all([
      pool.query('SELECT * FROM questions WHERE session_id = $1 ORDER BY order_index', [id]),
      pool.query('SELECT * FROM answers WHERE session_id = $1 ORDER BY created_at', [id]),
    ]);

    res.json({
      session: sessionRes.rows[0],
      questions: questionsRes.rows,
      answers: answersRes.rows,
    });
  } catch (err) {
    next(err);
  }
};

exports.completeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE sessions SET status = 'completed', completed_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, status, completed_at`,
      [id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Session not found' });
    res.json({ session: rows[0] });
  } catch (err) {
    next(err);
  }
};
