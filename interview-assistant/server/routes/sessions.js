const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createSession,
  getSessions,
  getSession,
  completeSession,
} = require('../controllers/sessionController');
const { generateNextQuestion } = require('../controllers/questionController');
const { createReport, getReport } = require('../controllers/reportController');

router.post('/sessions', auth, createSession);
router.get('/sessions', auth, getSessions);
router.get('/sessions/:id', auth, getSession);
router.patch('/sessions/:id/complete', auth, completeSession);
router.post('/sessions/:id/questions', auth, generateNextQuestion);
router.post('/sessions/:id/report', auth, createReport);
router.get('/sessions/:id/report', auth, getReport);

module.exports = router;
