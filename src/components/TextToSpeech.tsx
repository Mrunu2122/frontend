'use client';

import { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
// Import only what's needed from audioService

// Audio file interface moved to audioService.ts

const TextToSpeech = () => {
  // State for the text input
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [supportedLanguages] = useState<string[]>(['english', 'arabic']);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Clean up audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    setIsLoading(true);

    try {
      // Create a new audio element with the TTS URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const audioUrl = `${baseUrl}/tts?text=${encodeURIComponent(text)}&lang=${selectedLanguage}`;
      console.log('TTS Audio URL:', audioUrl);

      const audio = new Audio(audioUrl);

      audio.onplay = () => {
        console.log('Playback started');
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        alert('Error playing audio. Please try again.');
      };

      audio.onended = () => {
        console.log('Playback ended');
        setIsPlaying(false);
      };

      // Start playback
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback failed:', error);
          setIsLoading(false);
          alert('Playback failed. Please check your audio output and try again.');
        });
      }

      audioRef.current = audio;

    } catch (error) {
      console.error('Error in TTS playback:', error);
      setIsLoading(false);
      alert('Failed to convert text to speech. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!text.trim()) {
      alert('Please enter some text to download');
      return;
    }

    try {
      // Create a download link for the TTS audio
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const audioUrl = `${baseUrl}/tts?text=${encodeURIComponent(text)}&lang=${selectedLanguage}`;

      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts_${selectedLanguage}_${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error downloading TTS audio:', error);
      alert('Failed to download audio. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with logo only - login/signup is handled by the main Header component */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">
              ElevenLabs
              <span className="ml-2 text-orange-500">CLONE</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-black py-4 px-1 text-sm font-medium text-black">
              Text to Speech
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Voice Lab
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Voice Library
            </button>
          </nav>
        </div>

        {/* Text input area */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-900">Text to Speech</h2>
            <span className="text-sm text-gray-500">{text.length} characters</span>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {supportedLanguages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayPause}
              className={`flex items-center px-6 py-2 rounded-md text-sm font-medium text-white ${!text ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
              disabled={!text || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isPlaying ? 'Playing...' : 'Loading...'}
                </>
              ) : isPlaying ? (
                <>
                  <PauseIcon className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              disabled={!text}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Hidden audio element for playback - we're creating Audio elements dynamically */}
      </main>
    </div>
  );
};

export default TextToSpeech;
