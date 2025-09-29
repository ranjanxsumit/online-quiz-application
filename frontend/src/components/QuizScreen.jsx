import Timer from './Timer.jsx';

const QuizScreen = ({
  quiz,
  questions,
  currentIndex,
  answers,
  onSelectOption,
  onNext,
  onPrevious,
  onSubmit,
  secondsRemaining,
  isSubmitting,
  error,
}) => {
  const currentQuestion = questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id] ?? null;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <section className="card quiz">
      <header className="quiz-header">
        <div>
          <h2 className="title">{quiz.title}</h2>
          <p className="subtitle">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <Timer seconds={secondsRemaining} />
      </header>

      <article className="question-block">
        <h3 className="question-text">{currentQuestion.text}</h3>
        <form className="options">
          {currentQuestion.options.map((option) => (
            <label
              key={option.id}
              className={`option ${selectedOptionId === option.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => onSelectOption(currentQuestion.id, option.id)}
              />
              <span>{option.text}</span>
            </label>
          ))}
        </form>
        {error ? <p className="error">{error}</p> : null}
      </article>

      <footer className="quiz-footer">
        <button
          type="button"
          className="secondary"
          onClick={onPrevious}
          disabled={currentIndex === 0 || isSubmitting}
        >
          Previous
        </button>
        {!isLastQuestion ? (
          <button type="button" className="primary" onClick={onNext} disabled={isSubmitting}>
            Next
          </button>
        ) : (
          <button type="button" className="primary" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
        )}
      </footer>
    </section>
  );
};

export default QuizScreen;
