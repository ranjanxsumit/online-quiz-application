const pad = (value) => value.toString().padStart(2, '0');

const Timer = ({ seconds }) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  const danger = safeSeconds <= 10;

  return (
    <div className={`timer ${danger ? 'danger' : ''}`}>
      ⏱ {pad(minutes)}:{pad(remainingSeconds)}
    </div>
  );
};

export default Timer;
