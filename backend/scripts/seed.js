const { db, initializeSchema } = require('../src/db');

const quizData = {
  id: 1,
  title: 'General Knowledge Quiz',
  questions: [
    {
      text: 'What is the capital of France?',
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'Berlin', isCorrect: false },
        { text: 'Madrid', isCorrect: false },
        { text: 'Rome', isCorrect: false },
      ],
    },
    {
      text: 'Which planet is known as the Red Planet?',
      options: [
        { text: 'Venus', isCorrect: false },
        { text: 'Mars', isCorrect: true },
        { text: 'Jupiter', isCorrect: false },
        { text: 'Mercury', isCorrect: false },
      ],
    },
    {
      text: 'Who wrote "To Kill a Mockingbird"?',
      options: [
        { text: 'Harper Lee', isCorrect: true },
        { text: 'Mark Twain', isCorrect: false },
        { text: 'Ernest Hemingway', isCorrect: false },
        { text: 'Jane Austen', isCorrect: false },
      ],
    },
    {
      text: 'What is the largest ocean on Earth?',
      options: [
        { text: 'Atlantic Ocean', isCorrect: false },
        { text: 'Indian Ocean', isCorrect: false },
        { text: 'Pacific Ocean', isCorrect: true },
        { text: 'Arctic Ocean', isCorrect: false },
      ],
    },
    {
      text: 'Which gas do plants absorb from the atmosphere?',
      options: [
        { text: 'Oxygen', isCorrect: false },
        { text: 'Nitrogen', isCorrect: false },
        { text: 'Carbon Dioxide', isCorrect: true },
        { text: 'Hydrogen', isCorrect: false },
      ],
    },
  ],
};

const seed = () => {
  initializeSchema();

  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('DELETE FROM options;');
  db.exec('DELETE FROM questions;');
  db.exec('DELETE FROM quizzes;');
  db.exec('PRAGMA foreign_keys = ON;');

  const insertQuiz = db.prepare('INSERT INTO quizzes (id, title) VALUES (?, ?)');
  const insertQuestion = db.prepare(
    'INSERT INTO questions (quiz_id, text, correct_option_id) VALUES (?, ?, ?)' // placeholder value
  );
  const updateQuestionCorrect = db.prepare(
    'UPDATE questions SET correct_option_id = ? WHERE id = ?'
  );
  const insertOption = db.prepare('INSERT INTO options (question_id, text) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    insertQuiz.run(quizData.id, quizData.title);

    quizData.questions.forEach((question) => {
      const questionResult = insertQuestion.run(quizData.id, question.text, 0);
      const questionId = questionResult.lastInsertRowid;

      let correctOptionId = null;
      question.options.forEach((option) => {
        const optionResult = insertOption.run(questionId, option.text);
        if (option.isCorrect) {
          correctOptionId = optionResult.lastInsertRowid;
        }
      });

      if (correctOptionId == null) {
        throw new Error(`Question "${question.text}" is missing a correct option.`);
      }

      updateQuestionCorrect.run(correctOptionId, questionId);
    });
  });

  transaction();

  console.log('Database seeded successfully.');
};

seed();

db.close();
