const express = require('express');
const cors = require('cors');
const { initializeSchema } = require('./db');
const {
  getQuizQuestionsForPlayer,
  gradeQuizSubmission,
  normalizeAnswers,
} = require('./quizService');

initializeSchema();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/quizzes/:quizId/questions', (req, res) => {
  const quizId = Number.parseInt(req.params.quizId, 10);
  if (!Number.isInteger(quizId)) {
    return res.status(400).json({ message: 'Invalid quiz id' });
  }

  const data = getQuizQuestionsForPlayer(quizId);
  if (!data) {
    return res.status(404).json({ message: 'Quiz not found' });
  }

  return res.json(data);
});

app.post('/api/quizzes/:quizId/submit', (req, res) => {
  const quizId = Number.parseInt(req.params.quizId, 10);
  if (!Number.isInteger(quizId)) {
    return res.status(400).json({ message: 'Invalid quiz id' });
  }

  const answers = normalizeAnswers(req.body.answers);
  const result = gradeQuizSubmission(quizId, answers);

  if (!result) {
    return res.status(404).json({ message: 'Quiz not found' });
  }

  return res.json(result);
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Quiz API listening on port ${PORT}`);
  });
}

module.exports = app;
