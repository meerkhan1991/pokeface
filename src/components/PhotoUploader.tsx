import React, { useRef, useState } from 'react';
import { Upload, Camera, Trash2, RefreshCw, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { CameraModal } from './CameraModal';

interface PhotoUploaderProps {
  onStartMatching: (imageDataUrl: string, mimeType: string) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onStartMatching, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Unsupported file format. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate File Size (5MB limit)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('Image is too large. Please select a photo under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
        setSelectedMimeType(file.type);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the image file. Please try another photo.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input so user can re-select same file if desired
    e.target.value = '';
  };

  const handleCameraCapture = (dataUrl: string, mimeType: string) => {
    setErrorMessage(null);
    setSelectedImage(dataUrl);
    setSelectedMimeType(mimeType);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setErrorMessage(null);
  };

  const handleTriggerAnalysis = () => {
    if (!selectedImage) return;
    onStartMatching(selectedImage, selectedMimeType);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Mobile Native Camera fallback */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera Live Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Attention</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {!selectedImage ? (
        /* Empty State / Photo Selection Box */
        <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-3xl p-6 sm:p-8 text-center transition-all shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-red-400 shadow-inner">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-white font-display mb-1.5">
            Choose Your Photo
          </h3>
          <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            JPG, PNG, or WebP up to 5 MB. Photos are never stored and only analyzed when you confirm.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-sm border border-slate-700 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4 text-slate-300" />
              Upload Photo
            </button>

            <button
              onClick={() => {
                // If on device with getUserMedia camera support
                if (typeof navigator?.mediaDevices?.getUserMedia === 'function') {
                  setIsCameraOpen(true);
                } else {
                  nativeCameraInputRef.current?.click();
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-md shadow-red-600/30 transition-all"
            >
              <Camera className="w-4 h-4" />
              Take Selfie
            </button>
          </div>
        </div>
      ) : (
        /* Selected Image Preview State */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div className="relative aspect-[3/4] sm:aspect-square w-full rounded-2xl overflow-hidden bg-black mb-4 border border-slate-800 shadow-inner group">
            <img
              src={selectedImage}
              alt="Selected selfie preview"
              className="w-full h-full object-cover"
            />

            {/* Quick action overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 transition-colors shadow-md disabled:opacity-50"
                title="Replace Photo"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 backdrop-blur-md border border-red-500/30 transition-colors shadow-md disabled:opacity-50"
                title="Remove Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-medium text-slate-300">
              Ready for analysis
            </div>
          </div>

          {/* Privacy Consent Disclosure Notice */}
          <div className="mb-5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">Privacy Notice:</strong> By clicking below, your photo will be sent to Gemini AI for styling analysis. We do not store or retain your image.
            </p>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleTriggerAnalysis}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-extrabold text-base shadow-xl shadow-red-600/30 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Find My Pokémon</span>
          </button>
        </div>
      )}
    </div>
  );
};
