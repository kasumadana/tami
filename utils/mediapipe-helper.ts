"use client";

import { useEffect, useState, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export interface HandTrackerState {
  isModelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  landmarker: HandLandmarker | null;
}

export function useHandLandmarker() {
  const [state, setState] = useState<HandTrackerState>({
    isModelLoaded: false,
    isLoading: true,
    error: null,
    landmarker: null,
  });

  const landmarkerRef = useRef<HandLandmarker | null>(null);

  useEffect(() => {
    let active = true;

    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
        );

        if (!active) return;

        const modelAssetPath =
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        if (!active) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        setState({
          isModelLoaded: true,
          isLoading: false,
          error: null,
          landmarker,
        });
      } catch (err) {
        const errMsg =
          err instanceof Error
            ? err.message
            : "Gagal memuat sistem pelacakan sensor tangan MediaPipe.";
        if (active) {
          setState({
            isModelLoaded: false,
            isLoading: false,
            error: errMsg,
            landmarker: null,
          });
        }
      }
    }

    initMediaPipe();

    return () => {
      active = false;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, []);

  return state;
}
