'use client';

import { useEffect, useRef, useState } from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon, MicrophoneIcon, LanguageIcon, UserIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon, CubeIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAudioUrl = (text: string, language: string) => {
  return `${API_BASE_URL}/tts?text=${encodeURIComponent(text)}&lang=${language}`;
};

export default function TextToSpeech() {
  const [text, setText] = useState("In the ancient land of Eldoria, where skies shimmered and forests whispered secrets...");
  const [lang, setLang] = useState<'english'|'arabic'>('english');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = async () => {
    if (!text.trim()) { 
      alert("Please enter some text"); 
      return; 
    }
    
    try {
      // Toggle play/pause if audio is already loaded
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
        return;
      }

      // Create new audio instance
      const audio = new Audio();
      const audioUrl = getAudioUrl(text, lang);
      
      // Set up event handlers before setting src to ensure they're registered
      audio.oncanplaythrough = () => {
        audio.play().catch(e => {
          console.error('Play failed:', e);
          setIsLoading(false);
          alert('Failed to play audio. Please check your connection and try again.');
        });
      };
      
      audio.onplaying = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
        audioRef.current = null;
        alert("Error playing audio. Please try again or check your internet connection.");
      };

      // Set the audio source and start loading
      audio.crossOrigin = 'anonymous';
      audio.src = audioUrl;
      audio.load(); // Start loading the audio
      
      audioRef.current = audio;
      setIsLoading(true);
      
      // Preload the audio before playing
      await new Promise((resolve, reject) => {
        audio.oncanplay = resolve;
        audio.onerror = reject;
      });
      
      await audio.play();
      
    } catch (e) {
      console.error('Playback error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      audioRef.current = null;
      alert("Could not play audio. Please check your internet connection and try again.");
    }
  };

  const stopAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.pause();
        // Don't set audioRef.current to null here to allow resuming
      } catch (e) {
        console.error('Error pausing audio:', e);
      }
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const downloadAudio = () => {
    if (!text.trim()) { 
      alert("Please enter some text"); 
      return; 
    }
    const url = getAudioUrl(text, lang);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tts_${lang}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Highlight keywords by color: blue / purple
  const highlightTokens = (input: string) => {
    if (!input) return <span className="text-gray-400">Type or paste your text here...</span>;
    const keywordsBlue = ["voice","speech","audio","Eleven","AI","agent","agents","model"];
    const keywordsPurple = ["Eldoria","Ancient","Eldoria,","Eldoria."];

    // keep spaces & newlines
    const tokens = input.split(/(\s+)/);

    return tokens.map((t, i) => {
      const clean = t.replace(/\W/g, "");
      if (keywordsPurple.some(k => k.toLowerCase() === clean.toLowerCase())) {
        return <span key={i} className="text-purple-600 font-medium">{t}</span>;
      }
      if (keywordsBlue.some(k => k.toLowerCase() === clean.toLowerCase())) {
        return <span key={i} className="text-sky-600 font-medium">{t}</span>;
      }
      return <span key={i} className="text-gray-900">{t}</span>;
    });
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">

      <main className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Hero block (top) */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold hero-title">The most realistic voice AI platform</h1>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            AI voice models and products powering developers, creators, and enterprises — from low-latency conversational agents to studio-quality voice generation.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button className="px-6 py-2 rounded-full bg-black text-white font-semibold hero-cta">Sign up</button>
            <button className="px-6 py-2 rounded-full border border-gray-200 font-semibold hover:bg-gray-50">Contact sales</button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Text to Speech', icon: DocumentTextIcon, active: true },
                { name: 'Agents', icon: CubeIcon, active: false },
                { name: 'Music', icon: MusicalNoteIcon, active: false },
                { name: 'Speech to Text', icon: MicrophoneIcon, active: false },
                { name: 'Dubbing', icon: LanguageIcon, active: false },
                { name: 'Voice Cloning', icon: UserIcon, active: false },
                { name: 'Eleven Reader', icon: BookOpenIcon, active: false }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      tab.active 
                        ? 'bg-black text-white' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${tab.active ? 'text-white' : 'text-gray-500'}`} />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Text to Speech</h2>
                <p className="text-sm text-gray-500">Generate natural-sounding speech in any voice and language.</p>
              </div>
              <div className="text-sm text-gray-500">{text.length} characters</div>
            </div>

            {/* Text area container */}
            <div className="relative bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="absolute inset-0 p-4 text-sm leading-relaxed text-gray-400 pointer-events-none">
                {text ? (
                  <span className="text-transparent">{text}</span>
                ) : (
                  <span>Type or paste your text here...</span>
                )}
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="relative z-10 w-full h-56 p-4 text-sm leading-relaxed bg-transparent border-0 focus:ring-0 resize-none"
                placeholder=""
              />
              
              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { text: 'Samara • Narrate a story', icon: UserIcon },
                  { text: 'Spuds • Recount an old story', icon: UserIcon },
                  { text: 'Jessica • Provide customer support', icon: UserIcon },
                  { text: 'Announcer • Voiceover a game', icon: MicrophoneIcon }
                ].map((chip, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setText(chip.text)}
                  >
                    <chip.icon className="h-3.5 w-3.5 text-gray-500" />
                    {chip.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src="https://flagcdn.com/w20/us.png" 
                    alt="" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://flagcdn.com/w20/un.png';
                    }}
                  />
                </div>
                <select 
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'english'|'arabic')}
                  className="bg-transparent border-0 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer"
                >
                  <option value="english">English</option>
                  <option value="arabic">Arabic</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={isPlaying ? stopAudio : playAudio}
                  disabled={isLoading || !text.trim()}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full ${!text.trim() || isLoading 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 active:scale-95 transition-all'}`}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : isPlaying ? (
                    <PauseIcon className="h-5 w-5" />
                  ) : (
                    <PlayIcon className="h-5 w-5" />
                  )}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={downloadAudio}
                  disabled={isLoading || !text.trim()}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border ${!text.trim() || isLoading 
                    ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* powered text with multi-color gradient */}
          <div className="relative py-3 text-sm text-gray-500">
            <div className="absolute inset-0 bg-gradient-to-l from-orange-200 via-purple-200 via-blue-200 to-white"></div>
            <div className="relative text-center">
              Powered by Eleven v3 (alpha)
            </div>
          </div>

          
        </div>

        {/* Bottom CTA - Moved outside the card */}
        <div className="mt-8 text-center">
          <div className="mb-3 text-sm font-semibold text-gray-800">EXPERIENCE THE FULL AUDIO AI PLATFORM</div>
          <button className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">SIGN UP</button>
        </div>
      </main>
    </section>
  );
}
