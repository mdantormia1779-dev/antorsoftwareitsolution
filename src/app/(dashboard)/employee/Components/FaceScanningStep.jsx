"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export default function FaceScanningStep({ onVerified, onFail }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const mountedRef = useRef(false);
  const processingRef = useRef(false);

  // Keep latest callbacks without restarting scanner
  const onVerifiedRef = useRef(onVerified);
  const onFailRef = useRef(onFail);

  const [loadingModels, setLoadingModels] = useState(true);
  const [statusText, setStatusText] = useState("Loading AI Models...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  useEffect(() => {
    onFailRef.current = onFail;
  }, [onFail]);

  // ==========================================
  // STOP CAMERA
  // ==========================================
  const stopCamera = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
      videoRef.current.srcObject = null;
    }
  }, []);

  // ==========================================
  // SAVE FACE TO DATABASE (Registration Mode)
  // ==========================================
  const saveFaceToDatabase = useCallback(
    async (userId, descriptor) => {
      try {
        setStatusText("Saving face data...");

        const response = await fetch("/api/employee/save-face", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            faceDescriptor: descriptor,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.message || "Failed to save face.");
        }

        // Update local user session
        if (data.data) {
          localStorage.setItem("user", JSON.stringify(data.data));
        } else {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          currentUser.faceEmbeddingId = JSON.stringify(descriptor);
          localStorage.setItem("user", JSON.stringify(currentUser));
        }

        setProgress(100);
        setStatusText("Face Registered Successfully! 🎉");

        stopCamera();

        setTimeout(() => {
          if (mountedRef.current) {
            onVerifiedRef.current?.();
          }
        }, 800);
      } catch (error) {
        console.error("SAVE FACE ERROR:", error);
        processingRef.current = false;
        setStatusText(error?.message || "Failed to save face.");
        onFailRef.current?.();
      }
    },
    [stopCamera]
  );

  // ==========================================
  // MAIN SCANNER EFFECT
  // ==========================================
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    let faceapi = null;
    let registrationProgress = 0;
    let verificationProgress = 0;

    const startScanner = async () => {
      try {
        setStatusText("Loading AI Models...");
        faceapi = await import("@vladmandic/face-api");

        if (!mountedRef.current) return;
        const MODEL_URL = "/models";

        // Load Models
        setStatusText("Loading Face Detector...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

        setStatusText("Loading Face Landmark...");
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        setStatusText("Loading Face Recognition...");
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        if (!mountedRef.current) return;

        // Get Current User Session
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("User session not found. Please login again.");
        }

        let currentUser;
        try {
          currentUser = JSON.parse(storedUser);
        } catch {
          throw new Error("Invalid user session.");
        }

        // Start Camera
        setStatusText("Starting Camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (!mountedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (!videoRef.current) throw new Error("Video element not found.");

        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          const video = videoRef.current;
          if (video.readyState >= 3 && video.videoWidth > 0) {
            resolve();
            return;
          }
          video.onloadedmetadata = () => resolve();
        });

        await videoRef.current.play();
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (!mountedRef.current) return;

        setLoadingModels(false);
        setStatusText("Please look straight at the camera...");

        // Detection Loop Function
        const detectFace = async () => {
          if (!mountedRef.current || processingRef.current) return;

          try {
            const video = videoRef.current;
            if (!video || video.readyState < 2 || video.videoWidth === 0) {
              scheduleNext();
              return;
            }

            const detection = await faceapi
              .detectSingleFace(
                video,
                new faceapi.TinyFaceDetectorOptions({
                  inputSize: 416,
                  scoreThreshold: 0.35,
                })
              )
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (!detection) {
              setStatusText("No face detected. Please look at the camera.");
              setProgress(0);
              registrationProgress = 0;
              verificationProgress = 0;
              scheduleNext();
              return;
            }

            const liveDescriptor = Array.from(detection.descriptor);

            // --- REGISTRATION MODE ---
            if (!currentUser.faceEmbeddingId) {
              setStatusText("Face detected! Registering your face...");
              registrationProgress += 20;
              if (registrationProgress > 100) registrationProgress = 100;
              setProgress(registrationProgress);

              if (registrationProgress >= 100) {
                processingRef.current = true;
                await saveFaceToDatabase(currentUser.id, liveDescriptor);
                return;
              }
            } 
            // --- VERIFICATION MODE ---
            else {
              setStatusText("Face detected! Verifying...");

              let savedEmbedding;
              try {
                savedEmbedding =
                  typeof currentUser.faceEmbeddingId === "string"
                    ? JSON.parse(currentUser.faceEmbeddingId)
                    : currentUser.faceEmbeddingId;
              } catch (error) {
                setStatusText("Saved face data is invalid.");
                stopCamera();
                onFailRef.current?.();
                return;
              }

              if (!Array.isArray(savedEmbedding) || savedEmbedding.length !== 128) {
                setStatusText("Invalid face descriptor.");
                stopCamera();
                onFailRef.current?.();
                return;
              }

              const savedDescriptor = new Float32Array(savedEmbedding);
              const distance = faceapi.euclideanDistance(
                detection.descriptor,
                savedDescriptor
              );

              const MATCH_THRESHOLD = 0.6;

              if (distance < MATCH_THRESHOLD) {
                verificationProgress += 25;
                if (verificationProgress > 100) verificationProgress = 100;

                setProgress(verificationProgress);
                setStatusText(`Face matched! ${verificationProgress}% verified...`);

                if (verificationProgress >= 100) {
                  processingRef.current = true;
                  stopCamera();
                  setStatusText("Face Verified Successfully! 🎉");

                  setTimeout(() => {
                    if (mountedRef.current) {
                      onVerifiedRef.current?.();
                    }
                  }, 800);

                  return;
                }
              } else {
                setStatusText("Face does not match. Please try again.");
                verificationProgress = 0;
                setProgress(0);
              }
            }
          } catch (error) {
            console.error("FACE DETECTION ERROR:", error);
            setStatusText("Face detection error. Please try again.");
          }

          scheduleNext();
        };

        function scheduleNext() {
          if (!mountedRef.current || processingRef.current) return;
          timerRef.current = setTimeout(detectFace, 700);
        }

        detectFace();
      } catch (error) {
        console.error("FACE SCANNER ERROR:", error);
        if (!mountedRef.current) return;

        setLoadingModels(false);
        if (error?.name === "NotAllowedError") {
          setStatusText("Camera permission denied. Please allow camera access.");
        } else if (error?.name === "NotFoundError") {
          setStatusText("No camera found.");
        } else {
          setStatusText(error?.message || "Camera or AI Error!");
        }

        onFailRef.current?.();
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      stopCamera();
    };
  }, [saveFaceToDatabase, stopCamera]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Face Verification</h2>
        <p className="mt-1 text-sm font-medium text-blue-600">{statusText}</p>
      </div>

      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover -scale-x-100"
        />

        {loadingModels && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium">Preparing AI...</p>
          </div>
        )}

        {!loadingModels && (
          <>
            <div className="absolute inset-6 rounded-full border-2 border-blue-400/70 pointer-events-none" />
            <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-blue-400/80 animate-pulse pointer-events-none" />
          </>
        )}
      </div>

      <div className="w-64">
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-1">
          <span className="text-xs font-semibold text-slate-600">Scanning</span>
          <span className="text-xs font-semibold text-slate-600">{progress}%</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center max-w-sm">
        Keep your face inside the circle and look directly at the camera.
      </p>
    </div>
  );
}