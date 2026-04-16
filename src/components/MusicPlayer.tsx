import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { Track } from '../types';
import { GlitchText } from './GlitchText';
import { cn } from '../lib/utils';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'SYNTHETIC_DREAM_01',
    artist: 'NEURAL_LINK',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/synth1/200/200',
  },
  {
    id: '2',
    title: 'CYBER_PULSE_X',
    artist: 'VOID_RUNNER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/synth2/200/200',
  },
  {
    id: '3',
    title: 'GLITCH_IN_THE_SHELL',
    artist: 'DATA_GHOST',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/synth3/200/200',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-between gap-8">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Now Playing */}
      <div className="flex items-center gap-4 w-[250px]">
        <div className="relative w-12 h-12 flex-shrink-0 rounded border border-neon-blue shadow-[0_0_10px_var(--color-neon-blue)] overflow-hidden">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={cn("w-full h-full object-cover opacity-70", isPlaying && "animate-pulse")}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[13px] font-semibold block truncate text-neon-blue">{currentTrack.title}</span>
          <span className="text-[11px] opacity-50 truncate block">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-[600px]">
        <div className="flex items-center gap-8">
          <button onClick={prevTrack} className="text-white/70 hover:text-neon-blue transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-11 h-11 rounded-full bg-neon-blue text-black flex items-center justify-center shadow-[0_0_15px_var(--color-neon-blue)] hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-white/70 hover:text-neon-blue transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-neon-blue shadow-[0_0_5px_var(--color-neon-blue)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Volume/Meta */}
      <div className="w-[250px] flex justify-end items-center gap-4 opacity-70">
        <Volume2 size={18} className="text-neon-blue" />
        <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="w-[70%] h-full bg-white" />
        </div>
      </div>
    </div>
  );
};
