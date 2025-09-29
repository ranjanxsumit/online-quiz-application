const { getQuizMeta, getQuizQuestions } = require('./quizRepository');

const normalizeAnswers = (answers = []) => {
  if (!Array.isArray(answers)) {
    return [];
  }

  return answers
    .filter((entry) =>
      entry && Number.isInteger(entry.questionId) && Number.isInteger(entry.optionId)
    )
    .map((entry) => ({
      questionId: entry.questionId,
      optionId: entry.optionId,
    }));
};

const evaluateResponses = (questions, answers) => {
  const answerMap = new Map();
  answers.forEach((answer) => {
    if (!answerMap.has(answer.questionId)) {
      answerMap.set(answer.questionId, answer.optionId);
    }
  });

  let score = 0;
  const breakdown = questions.map((question) => {
    const selectedOptionId = answerMap.get(question.id) ?? null;
    const isCorrect = selectedOptionId !== null && selectedOptionId === question.correctOptionId;
    if (isCorrect) {
      score += 1;
    }

    return {
      questionId: question.id,
      correctOptionId: question.correctOptionId,
      selectedOptionId,
      isCorrect,
    };
  });

  return {
    score,
    total: questions.length,
    breakdown,
  };
};

const getQuizQuestionsForPlayer = (quizId) => {
  const quiz = getQuizMeta(quizId);
  if (!quiz) {
    return null;
  }

  const questions = getQuizQuestions(quizId, { includeCorrectOption: false });
  return {
    quiz,
    questions,
  };
};

const gradeQuizSubmission = (quizId, answersPayload) => {
  const quiz = getQuizMeta(quizId);
  if (!quiz) {
    return null;
  }

  const questions = getQuizQuestions(quizId, { includeCorrectOption: true });
  if (questions.length === 0) {
    return {
      quiz,
      score: 0,
      total: 0,
      breakdown: [],
    };
  }

  const answers = normalizeAnswers(answersPayload);
  const result = evaluateResponses(questions, answers);

  return {
    quiz,
    ...result,
  };
};

module.exports = {
  getQuizQuestionsForPlayer,
  gradeQuizSubmission,
  evaluateResponses,
  normalizeAnswers,
};
