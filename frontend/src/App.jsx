import { useEffect, useRef, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import QuizScreen from './components/QuizScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const QUIZ_ID = 1;
const QUIZ_DURATION_SECONDS = 120; // 2 minutes

const toAnswersArray = (answersMap) =>
  Object.entries(answersMap).map(([questionId, optionId]) => ({
    questionId: Number(questionId),
    optionId,
  }));

function App() {
  const [status, setStatus] = useState('start');
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSubmittedRef = useRef(false);

  const startQuiz = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${QUIZ_ID}/questions`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Unable to load quiz.');
      }

      const data = await response.json();
      setQuizData(data);
      setAnswers({});
      setCurrentIndex(0);
      setTimerSeconds(QUIZ_DURATION_SECONDS);
      autoSubmittedRef.current = false;
      setStatus('quiz');
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while starting the quiz.');
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async ({ auto = false } = {}) => {
    if (!quizData || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${QUIZ_ID}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: toAnswersArray(answers) }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Failed to submit quiz.');
      }

      const payload = await response.json();
      setResult(payload);
      setStatus('result');
    } catch (submissionError) {
      const friendlyMessage = auto
        ? 'Time is up, but we could not submit your answers automatically. Please try again.'
        : submissionError.message || 'Submission failed. Please try again.';
      setError(friendlyMessage);
      if (auto) {
        autoSubmittedRef.current = true;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status !== 'quiz') {
      return undefined;
    }

    if (timerSeconds <= 0) {
      if (!autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        submitQuiz({ auto: true });
      }
      return undefined;
    }

    const intervalId = setInterval(() => {
      setTimerSeconds((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, timerSeconds]);

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
  };

  const handleNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, (quizData?.questions.length ?? 1) - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const handleSubmit = () => submitQuiz();

  const handleRestart = () => {
    setStatus('start');
    setResult(null);
    setAnswers({});
    setError('');
  };

  if (status === 'start') {
    return <StartScreen onStart={startQuiz} loading={loading} error={error} />;
  }

  if (status === 'quiz' && quizData) {
    return (
      <QuizScreen
        quiz={quizData.quiz}
        questions={quizData.questions}
        currentIndex={currentIndex}
        answers={answers}
        onSelectOption={handleSelectOption}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        secondsRemaining={timerSeconds}
        isSubmitting={isSubmitting}
        error={error}
      />
    );
  }

  if (status === 'result' && quizData && result) {
    return (
      <ResultsScreen
        quiz={quizData.quiz}
        questions={quizData.questions}
        result={result}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

export default App;
