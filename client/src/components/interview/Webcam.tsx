import { useEffect, useRef } from 'react';
import {
  nets,
  matchDimensions,
  detectSingleFace,
} from 'face-api.js';
import useSocket from "@/socket/useSocket";
import { toast } from '@/hooks/use-toast';
import { ExpressionScores } from '@/types/ExpressionScores';
import { useLocation } from 'react-router-dom';

function isLightingGood(video: HTMLVideoElement, threshold = 80): boolean {
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    console.warn("Video dimensions are not available yet.");
    return false;
  }
  // Create an off-screen canvas to compute luminance.
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let totalLuminance = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += luminance;
  }

  const avgLuminance = totalLuminance / pixelCount;
  return avgLuminance > threshold;
}

function evaluateEmotionalState(expressions: ExpressionScores): string {
  const weights: Record<string, Partial<Record<keyof ExpressionScores, number>>> = {
    nervous: { fearful: 0.7, sad: 0.5, surprised: 0.3 },
    anxious: { fearful: 0.6, surprised: 0.4 },
    frustrated: { angry: 1.0, disgusted: 0.8 },
    confident: { happy: 0.6, neutral: 0.4 },
    excited: { happy: 0.7, surprised: 0.5 },
    sad: { sad: 1.0 },
    neutral: { neutral: 1.0 },
  };

  const scores: { [state: string]: number } = {};
  for (const [state, exprWeights] of Object.entries(weights)) {
    scores[state] = 0;
    for (const [expr, weight] of Object.entries(exprWeights)) {
      scores[state] += expressions[expr as keyof ExpressionScores] * (weight ?? 0);
    }
  }

  const sortedStates = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topState, topScore] = sortedStates[0];
  const secondScore = sortedStates.length > 1 ? sortedStates[1][1] : 0;

  const MIN_CONFIDENCE = 0.3;
  const DIFF_THRESHOLD = 0.1;

  if (topScore < MIN_CONFIDENCE || (topScore - secondScore) < DIFF_THRESHOLD) {
    return 'undetermined';
  }

  return topState;
}

function Webcam({ questionAnswerIndex, videoWidth, videoHeight, height, width }: { questionAnswerIndex: number, videoWidth: number, videoHeight: number, height: number, width: number }) {
  const location = useLocation();
  const socket = useSocket();
  const MODEL_URL = '/models';
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  async function loadModels() {
    await Promise.all([
      nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
  }

  async function startWebcam() {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: videoWidth, height: videoHeight }
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  }

  async function detectFace() {
    await loadModels();
    await startWebcam();

    const video = videoRef.current;
    if (!video) return;

    // Define the event handler for when video metadata is loaded.
    const handleLoadedMetadata = () => {
      video.play();

      // Check lighting once metadata is available.
      if (!isLightingGood(video)) {
        toast({
          title: "🌞 Poor lighting detected",
        });
      }

      // Use the JSX canvas.
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("Canvas not available");
        return;
      }
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      matchDimensions(canvas, displaySize);

      let lastDetectionTime = 0;
      const detectionInterval = 300; // milliseconds

      const processVideoFrame = async () => {
        const now = performance.now();
        if (now - lastDetectionTime > detectionInterval) {
          lastDetectionTime = now;
          const detection = await detectSingleFace(video)
            .withFaceLandmarks()
            .withFaceExpressions();

          if (detection) {
            const { expressions } = detection;
            const newEmotionalState = evaluateEmotionalState(expressions);
            socket.emit("face-expression-data", {
              expressionState: newEmotionalState,
              timeStamp: Date.now(),
              questionAnswerIndex,
            });
          } else {
            console.warn("No face detected 😢");
          }

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
        animationFrameId.current = requestAnimationFrame(processVideoFrame);
      };

      processVideoFrame();
    };

    // If metadata is already available, call the handler immediately.
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Return the handler so we can remove it during cleanup.
    return handleLoadedMetadata;
  }

  useEffect(() => {
    if (!location.pathname.includes("/interview")) return;

    // Capture the current nodes.
    const videoElement = videoRef.current;
    let handleLoadedMetadata: (() => void) | undefined;

    detectFace().then((handler) => {
      handleLoadedMetadata = handler;
    });

    return () => {
      // Cancel the animation frame.
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      // Stop the video stream using the captured videoElement.
      if (videoElement && videoElement.srcObject) {
        (videoElement.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoElement.srcObject = null;
      }

      // Remove the loadedmetadata event listener if it was added.
      if (videoElement && handleLoadedMetadata) {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }

      // Dispose of the loaded models.
      try {
        nets.ssdMobilenetv1?.dispose();
        nets.faceLandmark68Net?.dispose();
        nets.faceExpressionNet?.dispose();
      } catch (error) {
        console.warn("Error disposing models:", error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, questionAnswerIndex, socket]);

  return (
    <div className="bg-transparent" style={{ position: "relative" }}>
      {location.pathname.includes("/interview") && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Live camera feed for emotion detection"
            style={{ width: width, height: height }}
          />
          <canvas
            ref={canvasRef}
            aria-label="Face detection overlay"
            style={{
              display: "none",
              position: "absolute",
              top: 0,
              left: 0,
              width: 640,
              height: 480,
            }}
          />
        </>
      )}
    </div>
  );
}

export default Webcam;
