import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export default function GameAI() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef(0);
  const hpRef = useRef(100);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const gameOverRef = useRef(false);
  const [useCamera, setUseCamera] = useState(false);
  const hitEffectRef = useRef(0);
  const gameOverFrameRef = useRef(0);
  const bulletLevelRef = useRef(1);
  const bonusesRef = useRef<
    {
      x: number;
      y: number;
      value: number;
    }[]
  >([]);
  const enemiesRef = useRef<
    {
      x: number;
      y: number;
      width: number;
      height: number;
    }[]
  >([]);

  const playerRef = useRef({
    x: 400,
    y: 520,
    width: 60,
    height: 40,
  });
  const bulletsRef = useRef<
    {
      x: number;
      y: number;
    }[]
  >([]);

  useEffect(() => {
    const bonusInterval = setInterval(() => {
      bonusesRef.current.push({
        x: Math.random() * 740,
        y: -50,
        value: Math.floor(Math.random() * 3) + 1, // +1 +2 +3
      });
    }, 8000);

    return () => clearInterval(bonusInterval);
  }, []);

  useEffect(() => {
    const bulletInterval = window.setInterval(() => {
      const level = bulletLevelRef.current;

      for (let i = 0; i < level; i++) {
        bulletsRef.current.push({
          x: playerRef.current.x + (i - (level - 1) / 2) * 15,
          y: playerRef.current.y,
        });
      }
    }, 250);

    return () => clearInterval(bulletInterval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (useCamera) return;

      if (e.key === 'ArrowLeft') {
        playerRef.current.x -= 25;
      }

      if (e.key === 'ArrowRight') {
        playerRef.current.x += 25;
      }

      playerRef.current.x = Math.max(30, Math.min(770, playerRef.current.x));
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [useCamera]);

  async function toggleCamera() {
    if (useCamera) {
      stopCamera();
    } else {
      await startCamera();
    }
  }

  useEffect(() => {
    const enemyInterval = window.setInterval(() => {
      for (let i = 0; i < 5; i++) {
        enemiesRef.current.push({
          x: Math.random() * 740,
          y: -50 - i * 60, // tránh chồng lên nhau
          width: 40,
          height: 40,
        });
      }
    }, 600);

    return () => clearInterval(enemyInterval);
  }, []);

  async function initHandTracking() {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
    );

    handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      },
      runningMode: 'VIDEO',
      numHands: 1,
    });
  }
  function isColliding(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    bx: number,
    by: number,
    bw: number,
    bh: number,
  ) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  function gameLoop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !handLandmarkerRef.current) {
      requestAnimationFrame(gameLoop);
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      requestAnimationFrame(gameLoop);
      return;
    }
    if (gameOverRef.current) {
      gameOverFrameRef.current++;

      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = 1 + Math.sin(gameOverFrameRef.current * 0.1) * 0.1;

      ctx.save();

      ctx.translate(400, 250);

      ctx.scale(scale, scale);

      ctx.fillStyle = 'red';

      ctx.font = 'bold 60px Arial';

      ctx.textAlign = 'center';

      ctx.fillText('GAME OVER', 0, 0);

      ctx.restore();

      ctx.fillStyle = 'white';

      ctx.font = '32px Arial';

      ctx.textAlign = 'center';

      ctx.fillText(`Final Score: ${scoreRef.current}`, 400, 340);

      ctx.font = '20px Arial';

      ctx.fillText('Refresh page to play again', 400, 390);

      requestAnimationFrame(gameLoop);

      return;
    }
    let result = null;

    if (useCamera && video && video.readyState >= 2) {
      result = handLandmarkerRef.current.detectForVideo(
        video,
        performance.now(),
      );
    }

    for (let i = bonusesRef.current.length - 1; i >= 0; i--) {
      const bonus = bonusesRef.current[i];

      if (
        isColliding(
          playerRef.current.x - 30,
          playerRef.current.y,
          60,
          40,
          bonus.x - 20,
          bonus.y - 20,
          40,
          40,
        )
      ) {
        bulletLevelRef.current += bonus.value;

        bonusesRef.current.splice(i, 1);
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const enemy of enemiesRef.current) {
      enemy.y += 3;
    }
    ctx.fillStyle = 'gold';

    for (const bonus of bonusesRef.current) {
      bonus.y += 2;

      ctx.beginPath();
      ctx.arc(bonus.x, bonus.y, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillText(`+${bonus.value}`, bonus.x - 10, bonus.y + 5);

      ctx.fillStyle = 'gold';
    }
    let shakeX = 0;
    let shakeY = 0;

    if (hitEffectRef.current > 0) {
      shakeX = (Math.random() - 0.5) * 10;
      shakeY = (Math.random() - 0.5) * 10;

      hitEffectRef.current--;
    }
    ctx.save();
    ctx.translate(shakeX, shakeY);
    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      const enemy = enemiesRef.current[i];

      if (
        isColliding(
          playerRef.current.x - 30,
          playerRef.current.y,
          60,
          40,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height,
        )
      ) {
        hpRef.current -= 10;
        hitEffectRef.current = 10;
        enemiesRef.current.splice(i, 1);

        if (hpRef.current <= 0) {
          hpRef.current = 0;
          gameOverRef.current = true;
        }
      }
    }

    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
      for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
        const bullet = bulletsRef.current[i];
        const enemy = enemiesRef.current[j];

        if (
          isColliding(
            bullet.x,
            bullet.y,
            4,
            12,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height,
          )
        ) {
          bulletsRef.current.splice(i, 1);
          enemiesRef.current.splice(j, 1);

          scoreRef.current += 10;

          break;
        }
      }
    }

    for (const bullet of bulletsRef.current) {
      bullet.y -= 10;
    }
    ctx.fillStyle = 'red';
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';

    ctx.fillText(`Score: ${scoreRef.current}`, 20, 40);
    ctx.fillStyle = '#444';
    ctx.fillRect(20, 60, 200, 20);

    ctx.fillStyle = 'lime';
    ctx.fillRect(20, 60, hpRef.current * 2, 20);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(20, 60, 200, 20);

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`HP ${hpRef.current}%`, 90, 76);
    for (const bullet of bulletsRef.current) {
      ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
    }
    ctx.fillStyle = 'orange';

    for (const enemy of enemiesRef.current) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
    enemiesRef.current = enemiesRef.current.filter(
      (enemy) => enemy.y < canvas.height + 100,
    );
    bulletsRef.current = bulletsRef.current.filter((bullet) => bullet.y > -20);
    if (result && result.landmarks.length > 0) {
      const palm = result.landmarks[0][9];

      playerRef.current.x = (1 - palm.x) * canvas.width;
    }

    ctx.fillStyle = 'cyan';

    ctx.beginPath();

    ctx.moveTo(playerRef.current.x, playerRef.current.y);

    ctx.lineTo(playerRef.current.x - 30, playerRef.current.y + 40);

    ctx.lineTo(playerRef.current.x + 30, playerRef.current.y + 40);

    ctx.closePath();

    ctx.fill();
    ctx.restore();
    requestAnimationFrame(gameLoop);
  }

  useEffect(() => {
    async function init() {
      await initHandTracking();

      gameLoop();
    }

    init();
  }, []);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    setUseCamera(true);
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject as MediaStream | null;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setUseCamera(false);
  }

  for (const enemy of enemiesRef.current) {
    enemy.y += 3;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          display: 'none',
        }}
      />

      <button
        onClick={toggleCamera}
        style={{
          marginBottom: 20,
          padding: '10px 20px',
        }}
      >
        {useCamera ? 'Tắt Camera - Dùng Bàn Phím' : 'Bật Camera - Dùng Tay'}
      </button>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: '2px solid #333',
        }}
      />
    </div>
  );
}
