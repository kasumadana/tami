"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useHandLandmarker } from "@/utils/mediapipe-helper";
import {
  updateQuadrantTargetPhysics,
  updateShapePhysics,
  QuadrantTarget,
  Shape,
} from "@/utils/canvas-physics";
import { Camera, MouseSimple, WarningCircle } from "@phosphor-icons/react";
import { Loader } from "@cloudflare/kumo/components/loader";

interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface MediaPipeTrackerProps {
  technique: "hover" | "pinch";
  options: string[];
  activeQuestionKey: string;
  onAnswerSelected: (optionKey: string) => void;
  onFallbackToClick: () => void;
}

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20],
  [0, 5], [5, 9], [9, 13], [13, 17], [0, 17],
];

export const OPTION_COLOR_PALETTE: Record<string, { bg: string; border: string; text: string }> = {
  A: { bg: "rgba(59, 130, 246, 0.25)", border: "#3b82f6", text: "#60a5fa" },
  B: { bg: "rgba(34, 197, 94, 0.25)", border: "#22c55e", text: "#4ade80" },
  C: { bg: "rgba(255, 90, 0, 0.25)", border: "#ff5a00", text: "#ff8038" },
  D: { bg: "rgba(139, 92, 246, 0.25)", border: "#8b5cf6", text: "#a78bfa" },
};

export function MediaPipeTracker({
  technique,
  options,
  activeQuestionKey,
  onAnswerSelected,
  onFallbackToClick,
}: MediaPipeTrackerProps) {
  const t = useTranslations("learn");
  const trackerState = useHandLandmarker();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);

  const hoverTimeRef = useRef<number>(0);
  const activeQuadrantRef = useRef<string | null>(null);
  const lastTimeRef = useRef<number>(0);

  const smoothedCursorRef = useRef({ x: 320, y: 240 });
  const smoothedPinchDistanceRef = useRef<number>(100);

  // Quadrant Targets for Hover Mode
  const targetsRef = useRef<QuadrantTarget[]>([
    { key: "A", color: "#3b82f6", pos: { x: 160, y: 120, vx: 1.2, vy: 1.0 } },
    { key: "B", color: "#22c55e", pos: { x: 480, y: 120, vx: -1.0, vy: 1.2 } },
    { key: "C", color: "#ff5a00", pos: { x: 160, y: 360, vx: 1.0, vy: -1.2 } },
    { key: "D", color: "#8b5cf6", pos: { x: 480, y: 360, vx: -1.2, vy: -1.0 } },
  ]);

  // Bubbles for Pinch Mode
  const shapesRef = useRef<Shape[]>([
    { x: 160, y: 160, vx: 1.5, vy: 1.4, radius: 52, color: "#3b82f6", type: "A" },
    { x: 480, y: 160, vx: -1.4, vy: 1.6, radius: 52, color: "#22c55e", type: "B" },
    { x: 160, y: 320, vx: 1.6, vy: -1.4, radius: 52, color: "#ff5a00", type: "C" },
    { x: 480, y: 320, vx: -1.5, vy: -1.5, radius: 52, color: "#8b5cf6", type: "D" },
  ]);

  // Reset positions on question switch
  useEffect(() => {
    hoverTimeRef.current = 0;
    activeQuadrantRef.current = null;
  }, [activeQuestionKey]);

  // Start webcam
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              videoRef.current?.play();
              setIsCameraActive(true);
            }
          };
        }
      } catch (err) {
        if (mounted) {
          const msg =
            err instanceof Error ? err.message : "Tidak dapat mengakses webcam.";
          setCameraError(msg);
          setIsCameraActive(false);
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Main Detection Loop
  useEffect(() => {
    if (!isCameraActive || !trackerState.landmarker || trackerState.isLoading) {
      return;
    }

    const landmarker = trackerState.landmarker;
    lastTimeRef.current = performance.now();

    function renderLoop(time: number) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        requestRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Run Hand Detection
      const detectionResult = landmarker.detectForVideo(video, time);
      let handLandmarks: Landmark[] | null = null;
      if (detectionResult.landmarks && detectionResult.landmarks.length > 0) {
        handLandmarks = detectionResult.landmarks[0] as unknown as Landmark[];
      }

      // Cursor calculation (Mirrored coordinates)
      let rawCursorX = smoothedCursorRef.current.x;
      let rawCursorY = smoothedCursorRef.current.y;
      let rawPinchDist = smoothedPinchDistanceRef.current;

      if (handLandmarks) {
        const indexTip = handLandmarks[8];
        const thumbTip = handLandmarks[4];

        // Mirror X
        const detectedX = (1 - indexTip.x) * w;
        const detectedY = indexTip.y * h;

        // Smooth cursor
        rawCursorX += (detectedX - rawCursorX) * 0.45;
        rawCursorY += (detectedY - rawCursorY) * 0.45;
        smoothedCursorRef.current = { x: rawCursorX, y: rawCursorY };

        // Pinch distance
        const thumbX = (1 - thumbTip.x) * w;
        const thumbY = thumbTip.y * h;
        const dx = thumbX - detectedX;
        const dy = thumbY - detectedY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        rawPinchDist += (dist - rawPinchDist) * 0.45;
        smoothedPinchDistanceRef.current = rawPinchDist;

        // Draw Skeleton Lines
        ctx.strokeStyle = "rgba(255, 90, 0, 0.75)";
        ctx.lineWidth = 3;
        for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
          const p1 = handLandmarks[startIdx];
          const p2 = handLandmarks[endIdx];
          ctx.beginPath();
          ctx.moveTo((1 - p1.x) * w, p1.y * h);
          ctx.lineTo((1 - p2.x) * w, p2.y * h);
          ctx.stroke();
        }

        // Draw Landmark Points
        ctx.fillStyle = "#ffffff";
        for (const pt of handLandmarks) {
          ctx.beginPath();
          ctx.arc((1 - pt.x) * w, pt.y * h, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // 2. Render Targets and Check Collisions
      if (technique === "hover") {
        updateQuadrantTargetPhysics(targetsRef.current, 52, w, h);

        let hoveredKey: string | null = null;
        for (const target of targetsRef.current) {
          if (!options.includes(target.key)) continue;

          const palette = OPTION_COLOR_PALETTE[target.key] || {
            bg: "rgba(255,255,255,0.2)",
            border: "#fff",
            text: "#fff",
          };

          const dx = rawCursorX - target.pos.x;
          const dy = rawCursorY - target.pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const isHovered = dist < 52;

          if (isHovered) {
            hoveredKey = target.key;
          }

          // Target Circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(target.pos.x, target.pos.y, 52, 0, 2 * Math.PI);
          ctx.fillStyle = isHovered ? palette.bg.replace("0.25", "0.6") : palette.bg;
          ctx.fill();
          ctx.lineWidth = isHovered ? 4 : 2;
          ctx.strokeStyle = palette.border;
          ctx.stroke();

          // Target Letter
          ctx.font = "bold 28px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(target.key, target.pos.x, target.pos.y);
          ctx.restore();
        }

        // Dwell Lock calculation
        if (hoveredKey) {
          if (activeQuadrantRef.current === hoveredKey) {
            hoverTimeRef.current += dt;
          } else {
            activeQuadrantRef.current = hoveredKey;
            hoverTimeRef.current = 0;
          }

          // Progress Arc
          const activeTarget = targetsRef.current.find((t) => t.key === hoveredKey);
          if (activeTarget) {
            const progress = Math.min(hoverTimeRef.current / 1.5, 1.0);
            ctx.save();
            ctx.beginPath();
            ctx.arc(
              activeTarget.pos.x,
              activeTarget.pos.y,
              58,
              -Math.PI / 2,
              -Math.PI / 2 + progress * 2 * Math.PI
            );
            ctx.strokeStyle = "rgba(255, 90, 0, 0.9)";
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.restore();

            if (progress >= 1.0) {
              onAnswerSelected(hoveredKey);
              hoverTimeRef.current = 0;
              activeQuadrantRef.current = null;
            }
          }
        } else {
          hoverTimeRef.current = 0;
          activeQuadrantRef.current = null;
        }
      } else {
        // Pinch Mode
        updateShapePhysics(shapesRef.current, w, h);
        const isPinching = rawPinchDist < 42;

        for (const shape of shapesRef.current) {
          if (!options.includes(shape.type)) continue;

          const palette = OPTION_COLOR_PALETTE[shape.type] || {
            bg: "rgba(255,255,255,0.2)",
            border: "#fff",
            text: "#fff",
          };

          const dx = rawCursorX - shape.x;
          const dy = rawCursorY - shape.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const isIntersecting = dist < shape.radius;

          ctx.save();
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
          ctx.fillStyle = isIntersecting && isPinching ? palette.border : palette.bg;
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = palette.border;
          ctx.stroke();

          ctx.font = "bold 26px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(shape.type, shape.x, shape.y);
          ctx.restore();

          if (isIntersecting && isPinching) {
            onAnswerSelected(shape.type);
            break;
          }
        }
      }

      // Draw active cursor
      if (handLandmarks) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(rawCursorX, rawCursorY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#ff5a00";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.restore();
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    }

    requestRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isCameraActive, trackerState.landmarker, trackerState.isLoading, technique, options, onAnswerSelected]);

  return (
    <div className="relative w-full aspect-4/3 max-w-xl mx-auto rounded-2xl overflow-hidden bg-black ring-1 ring-[var(--color-tami-line)]/50 shadow-md">
      {/* Background Video Element (Mirrored via CSS) */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover -scale-x-100 opacity-70"
      />

      {/* Interactive Overlay Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Loading Overlay */}
      {trackerState.isLoading && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center space-y-3">
          <Loader size="lg" />
          <p className="text-xs text-white/80 font-medium">
            {t("trackerLoading")}
          </p>
        </div>
      )}

      {/* Error State Banner */}
      {(cameraError || trackerState.error) && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <WarningCircle size={32} weight="fill" className="text-[var(--color-tami-red)]" />
          <p className="text-xs text-white/90 max-w-xs leading-relaxed">
            {cameraError || trackerState.error}
          </p>
          <button
            type="button"
            onClick={onFallbackToClick}
            className="px-4 py-2 rounded-full bg-[var(--color-tami-orange)] text-white text-xs font-semibold cursor-pointer min-h-[44px] flex items-center gap-1.5"
          >
            <MouseSimple size={16} weight="bold" />
            <span>{t("trackerFallbackClick")}</span>
          </button>
        </div>
      )}

      {/* Header HUD Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium ring-1 ring-white/20">
          <Camera size={14} className="text-[var(--color-tami-green)] animate-pulse" />
          <span>{technique === "hover" ? t("trackerHoverHud") : t("trackerPinchHud")}</span>
        </span>

        <button
          type="button"
          onClick={onFallbackToClick}
          className="pointer-events-auto px-3 py-1 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white text-xs font-medium ring-1 ring-white/20 cursor-pointer flex items-center gap-1"
        >
          <MouseSimple size={13} />
          <span>{t("trackerClickHud")}</span>
        </button>
      </div>

      {/* Instructions Bottom Banner */}
      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-center text-xs text-white/90 ring-1 ring-white/15">
        {technique === "hover"
          ? t("trackerHoverInstruction")
          : t("trackerPinchInstruction")}
      </div>
    </div>
  );
}
