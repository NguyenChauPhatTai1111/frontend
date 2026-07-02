interface StartScreenProps {
  onStart: () => void;
  onToggleCamera: () => void;
  useCamera: boolean;
}

export default function StartScreen({
  onStart,
  onToggleCamera,
  useCamera,
}: StartScreenProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 800,
        borderRadius: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #07111f, #10243f 60%, #081a2d)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
        color: 'white',
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 14,
          letterSpacing: 3,
          textTransform: 'uppercase',
          opacity: 0.75,
        }}
      >
        Hand Tracking Arcade
      </div>
      <h2 style={{ fontSize: 34, margin: '10px 0 8px', fontWeight: 800 }}>
        Save the sky from the swarm
      </h2>
      <p style={{ margin: '0 0 16px', opacity: 0.85, lineHeight: 1.6 }}>
        Move with your hand or keyboard, dodge enemies, collect power-ups, and
        push your score higher.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={onStart}
          style={{
            border: 'none',
            borderRadius: 999,
            padding: '12px 20px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            color: 'white',
          }}
        >
          🚀 Start game
        </button>
        <button
          onClick={onToggleCamera}
          style={{
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            padding: '12px 20px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
          }}
        >
          {useCamera ? 'Switch to keyboard' : 'Enable camera'}
        </button>
      </div>
    </div>
  );
}
