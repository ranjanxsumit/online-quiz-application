const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'quiz.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const initializeSchema = () => {
  const createQuizzesTable = `
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL
    );
  `;

  const createQuestionsTable = `
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY,
      quiz_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      correct_option_id INTEGER NOT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );
  `;

  const createOptionsTable = `
    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY,
      question_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
  `;

  db.exec(createQuizzesTable);
  db.exec(createQuestionsTable);
  db.exec(createOptionsTable);
};

module.exports = {
  db,
  initializeSchema,
};
