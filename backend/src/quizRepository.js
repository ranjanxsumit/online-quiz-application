const { db } = require('./db');

const mapQuestionRows = (rows, { includeCorrectOption }) => {
  const questions = [];
  const byId = new Map();

  rows.forEach((row) => {
    if (!byId.has(row.questionId)) {
      const question = {
        id: row.questionId,
        text: row.questionText,
        options: [],
      };

      if (includeCorrectOption) {
        question.correctOptionId = row.correctOptionId;
      }

      byId.set(row.questionId, question);
      questions.push(question);
    }

    byId.get(row.questionId).options.push({
      id: row.optionId,
      text: row.optionText,
    });
  });

  return questions;
};

const getQuizMeta = (quizId) => {
  const stmt = db.prepare('SELECT id, title FROM quizzes WHERE id = ?');
  return stmt.get(quizId);
};

const getQuizQuestions = (quizId, { includeCorrectOption = false } = {}) => {
  const stmt = db.prepare(`
    SELECT
      q.id AS questionId,
      q.text AS questionText,
      q.correct_option_id AS correctOptionId,
      o.id AS optionId,
      o.text AS optionText
    FROM questions q
    JOIN options o ON o.question_id = q.id
    WHERE q.quiz_id = ?
    ORDER BY q.id, o.id
  `);

  const rows = stmt.all(quizId);
  return mapQuestionRows(rows, { includeCorrectOption });
};

module.exports = {
  getQuizMeta,
  getQuizQuestions,
};
