const router = require('express').Router();
const auth = require('../middleware/auth');
const { submitAnswer } = require('../controllers/answerController');

router.post('/questions/:question_id/answers', auth, submitAnswer);

module.exports = router;
