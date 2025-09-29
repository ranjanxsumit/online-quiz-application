const StartScreen = ({ onStart, loading, error }) => (
  <section className="card">
    <h1 className="title">Online Quiz Challenge</h1>
    <p className="subtitle">
      Test your knowledge across a handful of general trivia questions. You will have a limited time,
      so be quick and confident!
    </p>
    {error ? <p className="error">{error}</p> : null}
    <button className="primary" onClick={onStart} disabled={loading}>
      {loading ? 'Loading quiz…' : 'Start Quiz'}
    </button>
  </section>
);

export default StartScreen;
