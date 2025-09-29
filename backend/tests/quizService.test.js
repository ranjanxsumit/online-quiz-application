const { evaluateResponses, normalizeAnswers } = require('../src/quizService');

describe('evaluateResponses', () => {
  const sampleQuestions = [
    { id: 1, text: 'Question 1', correctOptionId: 10 },
    { id: 2, text: 'Question 2', correctOptionId: 20 },
    { id: 3, text: 'Question 3', correctOptionId: 30 },
  ];

  it('calculates perfect score when all answers are correct', () => {
    const answers = [
      { questionId: 1, optionId: 10 },
      { questionId: 2, optionId: 20 },
      { questionId: 3, optionId: 30 },
    ];

    const result = evaluateResponses(sampleQuestions, answers);

    expect(result.score).toBe(3);
    expect(result.total).toBe(3);
    expect(result.breakdown.every((item) => item.isCorrect)).toBe(true);
  });

  it('awards zero for unanswered or incorrect questions', () => {
    const answers = [
      { questionId: 1, optionId: 11 }, // incorrect
      // question 2 missing
      { questionId: 3, optionId: 999 }, // incorrect id
    ];

    const result = evaluateResponses(sampleQuestions, answers);

    expect(result.score).toBe(0);
    expect(result.total).toBe(3);
    expect(result.breakdown.find((item) => item.questionId === 2).selectedOptionId).toBeNull();
  });

  it('ignores duplicate answers for the same question after the first occurrence', () => {
    const answers = [
      { questionId: 1, optionId: 10 },
      { questionId: 1, optionId: 999 }, // should be ignored
    ];

    const result = evaluateResponses(sampleQuestions, answers);

    expect(result.score).toBe(1);
    const breakdownForFirstQuestion = result.breakdown.find((item) => item.questionId === 1);
    expect(breakdownForFirstQuestion.selectedOptionId).toBe(10);
  });
});

describe('normalizeAnswers', () => {
  it('filters out invalid entries and coerces the rest', () => {
    const input = [
      { questionId: 1, optionId: 2 },
      { questionId: 3, optionId: '4' },
      { foo: 'bar' },
      null,
      'string',
    ];

    const normalized = normalizeAnswers(input);
    expect(normalized).toEqual([
      { questionId: 1, optionId: 2 },
    ]);
  });

  it('returns an empty array when input is not an array', () => {
    expect(normalizeAnswers(undefined)).toEqual([]);
    expect(normalizeAnswers({})).toEqual([]);
  });
});
