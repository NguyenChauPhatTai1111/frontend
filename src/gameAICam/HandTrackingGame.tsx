import { useEffect, useRef } from 'react';

export default function HandTrackingGame() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function initCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    initCamera();
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width={640} height={480} />
    </div>
  );
}
