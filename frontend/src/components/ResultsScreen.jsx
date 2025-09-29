const findOptionText = (question, optionId) => {
  if (optionId == null) {
    return 'No answer provided';
  }
  const option = question.options.find((item) => item.id === optionId);
  return option ? option.text : 'Unknown option';
};

const ResultsScreen = ({ quiz, questions, result, onRestart }) => (
  <section className="card results">
    <h2 className="title">Results: {quiz.title}</h2>
    <p className="score">
      You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong>
      {result.total > 0 ? ` (${Math.round((result.score / result.total) * 100)}%)` : ''}
    </p>

    <div className="answers-breakdown">
      {result.breakdown.map((entry, index) => {
        const question = questions.find((item) => item.id === entry.questionId);
        if (!question) {
          return null;
        }

        return (
          <article
            key={entry.questionId}
            className={`answer-card ${entry.isCorrect ? 'correct' : 'incorrect'}`}
          >
            <header>
              <span className="question-number">Question {index + 1}</span>
              <span className="status">{entry.isCorrect ? 'Correct' : 'Incorrect'}</span>
            </header>
            <h3 className="question-text">{question.text}</h3>
            <p>
              <strong>Your answer:</strong> {findOptionText(question, entry.selectedOptionId)}
            </p>
            <p>
              <strong>Correct answer:</strong> {findOptionText(question, entry.correctOptionId)}
            </p>
          </article>
        );
      })}
    </div>

    <button type="button" className="primary" onClick={onRestart}>
      Take Again
    </button>
  </section>
);

export default ResultsScreen;
