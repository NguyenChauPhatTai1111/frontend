interface GameHUDProps {
  score: number;
  hp: number;
  bulletLevel: number;
  difficulty: number;
  useCamera: boolean;
  isPlaying: boolean;
  gameOver: boolean;
  onToggleCamera: () => void;
  onRestart: () => void;
}

export default function GameHUD({
  score,
  hp,
  bulletLevel,
  difficulty,
  useCamera,
  isPlaying,
  gameOver,
  onToggleCamera,
  onRestart,
}: GameHUDProps) {
  const hpColor = hp > 60 ? '#4ade80' : hp > 30 ? '#fbbf24' : '#f87171';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 800,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
        padding: '12px 16px',
        borderRadius: 16,
        background: 'rgba(5, 15, 35, 0.8)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 110 }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Score</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{score}</div>
        </div>
        <div style={{ minWidth: 110 }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>HP</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: hpColor }}>
            {hp}%
          </div>
        </div>
        <div style={{ minWidth: 110 }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Bullet level</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>x{bulletLevel}</div>
        </div>
        <div style={{ minWidth: 110 }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Difficulty</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Lv {difficulty}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={onToggleCamera}
          style={{
            border: 'none',
            borderRadius: 999,
            padding: '10px 14px',
            cursor: 'pointer',
            fontWeight: 600,
            background: useCamera ? '#fde68a' : '#38bdf8',
            color: '#07111f',
          }}
        >
          {useCamera ? 'Switch to keyboard' : 'Use camera'}
        </button>
        {gameOver && (
          <button
            onClick={onRestart}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: 700,
              background: '#fb923c',
              color: 'white',
            }}
          >
            Play again
          </button>
        )}
        {!isPlaying && !gameOver && (
          <span
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 13,
            }}
          >
            Ready to launch
          </span>
        )}
      </div>
    </div>
  );
}
