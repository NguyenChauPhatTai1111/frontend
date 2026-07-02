import { useCallback, useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import GameCanvas from './components/GameCanvas';
import GameHUD from './components/GameHUD';
import StartScreen from './components/StartScreen';

type Bonus = {
  x: number;
  y: number;
  value: number;
};

type Enemy = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Bullet = {
  x: number;
  y: number;
};

const CANVAS_WIDTH = 800;
const PLAYER_START_X = 400;
const PLAYER_START_Y = 520;

export default function GameAI() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreRef = useRef(0);
  const hpRef = useRef(100);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const gameOverRef = useRef(false);
  const [useCamera, setUseCamera] = useState(false);
  const hitEffectRef = useRef(0);
  const gameOverFrameRef = useRef(0);
  const bulletLevelRef = useRef(1);
  const difficultyRef = useRef(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [bulletLevel, setBulletLevel] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const playerImage = useRef(new Image());
  const bonusesRef = useRef<Bonus[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const playerRef = useRef({
    x: PLAYER_START_X,
    y: PLAYER_START_Y,
    width: 60,
    height: 40,
  });

  const resetGameState = useCallback(() => {
    scoreRef.current = 0;
    hpRef.current = 100;
    bulletLevelRef.current = 1;
    difficultyRef.current = 1;
    gameOverRef.current = false;
    gameOverFrameRef.current = 0;
    hitEffectRef.current = 0;
    bonusesRef.current = [];
    enemiesRef.current = [];
    bulletsRef.current = [];
    playerRef.current = {
      x: PLAYER_START_X,
      y: PLAYER_START_Y,
      width: 60,
      height: 40,
    };

    setScore(0);
    setHp(100);
    setBulletLevel(1);
    setDifficulty(1);
    setGameOver(false);
  }, []);

  useEffect(() => {
    playerImage.current.crossOrigin = 'anonymous';
    playerImage.current.src =
      'img/U6-vggECenb8ih6BErbozlJdmuRxXueO0XpBbKGhV4j15Fw1OrE459h__OTGqBFfSsPl9ZmIUeRjxXIveNSu4X_0XGnMu-Q2ubisOLoTCkVJRqcVAJbyjmZzwR43Qtom89vnNd8xnv0K14nLye2C5-yD0UDw1Z32txCHzzLjpZBW8O9DNi07ySw18YfNs2Er.jpg';
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (useCamera || !isPlaying || gameOverRef.current) return;

      if (event.key === 'ArrowLeft') {
        playerRef.current.x -= 25;
      }

      if (event.key === 'ArrowRight') {
        playerRef.current.x += 25;
      }

      playerRef.current.x = Math.max(
        30,
        Math.min(CANVAS_WIDTH - 30, playerRef.current.x),
      );
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, useCamera]);

  const initHandTracking = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
      );

      handLandmarkerRef.current = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        },
      );
    } catch (error) {
      console.error('Failed to initialize hand tracking', error);
    }
  }, []);

  const isColliding = useCallback(
    (
      ax: number,
      ay: number,
      aw: number,
      ah: number,
      bx: number,
      by: number,
      bw: number,
      bh: number,
    ) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by,
    [],
  );

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Camera is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setUseCamera(true);
    } catch (error) {
      console.error('Camera access failed', error);
      alert(
        'Unable to access camera. Please allow camera permission or use keyboard controls.',
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setUseCamera(false);
  }, []);

  const toggleCamera = useCallback(async () => {
    if (useCamera) {
      stopCamera();
    } else {
      await startCamera();
    }
  }, [startCamera, stopCamera, useCamera]);

  const startGame = useCallback(() => {
    resetGameState();
    setIsPlaying(true);
  }, [resetGameState]);

  useEffect(() => {
    let animationFrameId = 0;
    let enemyAccumulator = 0;
    let bonusAccumulator = 0;
    let bulletAccumulator = 0;
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas) {
        animationFrameId = window.requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        animationFrameId = window.requestAnimationFrame(loop);
        return;
      }

      if (gameOverRef.current) {
        gameOverFrameRef.current += 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scale = 1 + Math.sin(gameOverFrameRef.current * 0.08) * 0.08;
        ctx.save();
        ctx.translate(CANVAS_WIDTH / 2, 220);
        ctx.scale(scale, scale);
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 56px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 0, 0);
        ctx.restore();

        ctx.fillStyle = 'white';
        ctx.font = '28px Arial';
        ctx.fillText(`Final score: ${scoreRef.current}`, CANVAS_WIDTH / 2, 320);
        ctx.font = '20px Arial';
        ctx.fillText(
          'Press play again to try a new run',
          CANVAS_WIDTH / 2,
          360,
        );

        animationFrameId = window.requestAnimationFrame(loop);
        return;
      }

      if (isPlaying) {
        enemyAccumulator += delta;
        bonusAccumulator += delta;
        bulletAccumulator += delta;

        const enemySpawnDelay = Math.max(
          0.2,
          0.75 - difficultyRef.current * 0.05,
        );
        const bulletFireRate = 0.25;

        if (enemyAccumulator > enemySpawnDelay) {
          enemyAccumulator = 0;
          const enemyCount = Math.max(
            2,
            Math.min(6, 2 + Math.floor(difficultyRef.current / 2)),
          );

          for (let i = 0; i < enemyCount; i++) {
            enemiesRef.current.push({
              x: Math.random() * (CANVAS_WIDTH - 60),
              y: -40 - i * 50,
              width: 44,
              height: 44,
            });
          }
        }

        if (bonusAccumulator > 5) {
          bonusAccumulator = 0;
          bonusesRef.current.push({
            x: Math.random() * (CANVAS_WIDTH - 80) + 40,
            y: -40,
            value: Math.floor(Math.random() * 3) + 1,
          });
        }

        if (bulletAccumulator > bulletFireRate) {
          bulletAccumulator = 0;
          const level = bulletLevelRef.current;

          for (let i = 0; i < level; i++) {
            bulletsRef.current.push({
              x: playerRef.current.x + (i - (level - 1) / 2) * 15,
              y: playerRef.current.y - 10,
            });
          }
        }
      }

      for (let i = bonusesRef.current.length - 1; i >= 0; i--) {
        const bonus = bonusesRef.current[i];
        bonus.y += 2 + difficultyRef.current * 0.2;

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
          setBulletLevel(bulletLevelRef.current);
          bonusesRef.current.splice(i, 1);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#07111f');
      skyGradient.addColorStop(0.6, '#10243f');
      skyGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = 0.22;
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#fff' : '#38bdf8';
        ctx.fillRect(
          ((i * 70 + timestamp / 20) % (canvas.width + 80)) - 40,
          40 + (i % 7) * 70,
          2,
          2,
        );
      }
      ctx.restore();

      for (const enemy of enemiesRef.current) {
        enemy.y += 2 + difficultyRef.current * 0.3;
      }

      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const enemy = enemiesRef.current[i];

        if (
          isColliding(
            playerRef.current.x - 28,
            playerRef.current.y - 20,
            56,
            40,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height,
          )
        ) {
          hpRef.current -= 10;
          setHp(hpRef.current);
          hitEffectRef.current = 10;
          enemiesRef.current.splice(i, 1);

          if (hpRef.current <= 0) {
            hpRef.current = 0;
            setHp(0);
            gameOverRef.current = true;
            setGameOver(true);
            setIsPlaying(false);
          }
        }
      }

      for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
        const bullet = bulletsRef.current[i];
        bullet.y -= 10;

        for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
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
            setScore(scoreRef.current);
            const nextDifficulty = Math.min(
              8,
              1 + Math.floor(scoreRef.current / 150),
            );
            if (nextDifficulty !== difficultyRef.current) {
              difficultyRef.current = nextDifficulty;
              setDifficulty(nextDifficulty);
            }
            break;
          }
        }
      }

      for (const bonus of bonusesRef.current) {
        ctx.beginPath();
        ctx.arc(bonus.x, bonus.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(`+${bonus.value}`, bonus.x - 10, bonus.y + 5);
      }

      let shakeX = 0;
      let shakeY = 0;
      if (hitEffectRef.current > 0) {
        shakeX = (Math.random() - 0.5) * 10;
        shakeY = (Math.random() - 0.5) * 10;
        hitEffectRef.current -= 1;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);
      ctx.fillStyle = '#fb923c';
      for (const enemy of enemiesRef.current) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
      ctx.restore();

      for (const bullet of bulletsRef.current) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
      }

      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Wave ${difficultyRef.current}`, 20, 24);

      if (
        useCamera &&
        video &&
        video.readyState >= 2 &&
        handLandmarkerRef.current
      ) {
        const result = handLandmarkerRef.current.detectForVideo(
          video,
          performance.now(),
        );
        if (result?.landmarks?.length) {
          const palm = result.landmarks[0][9];
          playerRef.current.x = (1 - palm.x) * CANVAS_WIDTH;
        }
      }

      playerRef.current.x = Math.max(
        30,
        Math.min(CANVAS_WIDTH - 30, playerRef.current.x),
      );

      ctx.drawImage(
        playerImage.current,
        playerRef.current.x - 32,
        playerRef.current.y - 32,
        64,
        64,
      );

      enemiesRef.current = enemiesRef.current.filter(
        (enemy) => enemy.y < canvas.height + 100,
      );
      bulletsRef.current = bulletsRef.current.filter(
        (bullet) => bullet.y > -30,
      );
      bonusesRef.current = bonusesRef.current.filter(
        (bonus) => bonus.y < canvas.height + 80,
      );

      animationFrameId = window.requestAnimationFrame(loop);
    };

    animationFrameId = window.requestAnimationFrame(loop);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [initHandTracking, isColliding, isPlaying, useCamera]);

  useEffect(() => {
    async function initialize() {
      await initHandTracking();
    }

    void initialize();
  }, [initHandTracking]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        padding: '24px 16px 40px',
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #1e3a8a 0%, #0f172a 45%, #020617 100%)',
      }}
    >
      {!isPlaying && !gameOver && (
        <StartScreen
          onStart={startGame}
          onToggleCamera={toggleCamera}
          useCamera={useCamera}
        />
      )}

      {isPlaying && (
        <GameHUD
          score={score}
          hp={hp}
          bulletLevel={bulletLevel}
          difficulty={difficulty}
          useCamera={useCamera}
          isPlaying={isPlaying}
          gameOver={gameOver}
          onToggleCamera={toggleCamera}
          onRestart={startGame}
        />
      )}

      {gameOver && (
        <GameHUD
          score={score}
          hp={hp}
          bulletLevel={bulletLevel}
          difficulty={difficulty}
          useCamera={useCamera}
          isPlaying={isPlaying}
          gameOver={gameOver}
          onToggleCamera={toggleCamera}
          onRestart={startGame}
        />
      )}

      <GameCanvas canvasRef={canvasRef} videoRef={videoRef} />
    </div>
  );
}
