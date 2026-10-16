import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string, mimeType: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Start video stream
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setCapturedImage(null);
      setErrorMsg(null);
      return;
    }

    let isMounted = true;

    async function initCamera() {
      setIsLoading(true);
      setErrorMsg(null);
      stopStream();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Camera access error:', err);
        setErrorMsg(
          err.name === 'NotAllowedError'
            ? 'Camera permission was denied. Please allow camera access in your browser settings or upload a file directly.'
            : 'Could not access camera on this device. Please use the "Upload Photo" option instead.'
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [isOpen, facingMode]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image horizontally
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopStream();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Restart camera
    setFacingMode((prev) => prev); // triggers useEffect
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage, 'image/jpeg');
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-white font-display">Take a Selfie</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-[3/4] bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-sm text-red-400">
              <p className="font-semibold mb-2">Camera Unavailable</p>
              <p className="text-xs text-slate-400 mb-4">{errorMsg}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close & Upload Photo Instead
              </button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Selfie snapshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? '-scale-x-100' : ''
                }`}
              />
              {/* Framing Oval Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-72 border-2 border-dashed border-white/40 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-sm text-slate-300">
                  Starting camera...
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-600/30 transition-all"
              >
                <Check className="w-4 h-4" />
                Use Photo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleCamera}
                disabled={isLoading || Boolean(errorMsg)}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-40"
                title="Flip Camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleTakeSnapshot}
                disabled={isLoading || Boolean(errorMsg)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all disabled:opacity-40"
              >
                <Camera className="w-5 h-5" />
                Capture Selfie
              </button>

              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
