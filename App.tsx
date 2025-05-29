
import React, { useState, useEffect, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { AudioPreview } from './components/AudioPreview';
import { ImagePreview } from './components/ImagePreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultDisplay } from './components/ResultDisplay';
import { mockSynchronizeMedia } from './services/mockMediaService';
import { UploadIcon, SparklesIcon, AlertTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null); // Renamed from outputImageUrl
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [audioPreviewUrl, imagePreviewUrl]);

  const handleAudioFileSelect = useCallback((file: File) => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioFile(file);
    setAudioPreviewUrl(URL.createObjectURL(file));
    setOutputVideoUrl(null); // Clear previous result
    setError(null);
  }, [audioPreviewUrl]);

  const handleImageFileSelect = useCallback((file: File) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setOutputVideoUrl(null); // Clear previous result
    setError(null);
  }, [imagePreviewUrl]);

  const handleSynchronize = async () => {
    if (!audioFile || !imageFile) {
      setError('Please upload both an audio file and an image file.');
      return;
    }
    setError(null);
    setIsProcessing(true);
    setOutputVideoUrl(null);

    try {
      // imageFile and audioFile would be used by a real service.
      // For simulation, mockSynchronizeMedia now returns a video URL.
      const result = await mockSynchronizeMedia(audioFile, imageFile);
      setOutputVideoUrl(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during synchronization.');
      setOutputVideoUrl(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          AI Voice-Image Synchronizer
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          Upload audio and an image, then watch them (simulated) come to life as a video!
        </p>
      </header>

      <main className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FileUpload
            id="audio-upload"
            label="Upload Audio"
            accept="audio/*"
            onFileSelect={handleAudioFileSelect}
            icon={<UploadIcon className="w-6 h-6 mr-2" />}
          />
          <FileUpload
            id="image-upload"
            label="Upload Image"
            accept="image/*"
            onFileSelect={handleImageFileSelect}
            icon={<UploadIcon className="w-6 h-6 mr-2" />}
          />
        </div>

        {(audioFile || imageFile) && (
          <div className="mb-8 p-6 bg-slate-700 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-slate-200">Previews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audioFile && audioPreviewUrl && (
                <AudioPreview file={audioFile} previewUrl={audioPreviewUrl} />
              )}
              {imageFile && imagePreviewUrl && (
                <ImagePreview file={imageFile} previewUrl={imagePreviewUrl} />
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-300 border border-red-500 rounded-lg flex items-center">
            <AlertTriangleIcon className="w-6 h-6 mr-3 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-center mb-8">
          <button
            onClick={handleSynchronize}
            disabled={!audioFile || !imageFile || isProcessing}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            <SparklesIcon className="w-6 h-6 mr-2" />
            {isProcessing ? 'Synchronizing...' : 'Synchronize Media'}
          </button>
        </div>

        {isProcessing && <LoadingSpinner />}

        {outputVideoUrl && !isProcessing && ( // Changed from outputImageUrl
           <ResultDisplay outputVideoUrl={outputVideoUrl} originalImageFileName={imageFile?.name || "your image"}/>
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Media Tools Inc. Simulation only.</p>
        <p>This is a conceptual demonstration. Actual AI-driven audio-visual synchronization requires complex backend processing and would produce a video file.</p>
      </footer>
    </div>
  );
};

export default App;
