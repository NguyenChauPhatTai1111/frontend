import type { RefObject } from 'react';

interface GameCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export default function GameCanvas({ canvasRef, videoRef }: GameCanvasProps) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.18)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
      }}
    >
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: 800,
          height: 'auto',
        }}
      />
    </div>
  );
}
