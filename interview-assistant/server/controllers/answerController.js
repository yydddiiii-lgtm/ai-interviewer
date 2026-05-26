const pool = require('../db/pool');
const { evaluateAnswer } = require('../services/claudeService');

exports.submitAnswer = async (req, res, next) => {
  try {
    const { question_id } = req.params;
    const { content, input_type } = req.body;

    if (!content || !input_type) {
      return res.status(400).json({ error: 'content and input_type required' });
    }

    const qRes = await pool.query(
      `SELECT q.*, s.user_id FROM questions q
       JOIN sessions s ON s.id = q.session_id
       WHERE q.id = $1 AND s.user_id = $2`,
      [question_id, req.user.id]
    );
    if (!qRes.rows[0]) return res.status(404).json({ error: 'Question not found' });
    const question = qRes.rows[0];

    const evaluation = await evaluateAnswer({
      question_content: question.content,
      answer_content: content,
    });

    const { rows } = await pool.query(
      `INSERT INTO answers
         (session_id, question_id, content, input_type, score, feedback_content, feedback_structure, feedback_improvement)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        question.session_id,
        question_id,
        content,
        input_type,
        evaluation.score,
        evaluation.feedback_content,
        evaluation.feedback_structure,
        evaluation.feedback_improvement,
      ]
    );

    res.status(201).json({ answer: rows[0] });
  } catch (err) {
    next(err);
  }
};
