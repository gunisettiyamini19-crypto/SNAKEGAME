import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';
import { Terminal, Cpu, Zap, Activity, Music } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col bg-dark-bg text-text-main overflow-hidden">
      <div className="scanlines" />
      
      {/* Header */}
      <header className="h-20 border-b-2 border-neon-blue flex items-center justify-between px-10 bg-gradient-to-r from-dark-bg to-dark-surface shadow-[0_0_20px_rgba(0,229,255,0.2)] z-10">
        <div className="text-2xl font-extrabold uppercase tracking-[4px] text-neon-blue [text-shadow:0_0_10px_var(--color-neon-blue)]">
          <GlitchText text="NeonSync" />
        </div>
        <div className="flex gap-12 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Score</span>
            <span className="text-2xl text-neon-green [text-shadow:0_0_8px_var(--color-neon-green)]">0420</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/50 uppercase tracking-wider">High_Score</span>
            <span className="text-2xl text-neon-green [text-shadow:0_0_8px_var(--color-neon-green)]">1280</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-[280px_1fr] p-8 gap-8 overflow-hidden z-10">
        {/* Sidebar */}
        <aside className="bg-dark-surface rounded-xl border border-white/10 p-5 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xs uppercase tracking-[2px] mb-2 text-neon-pink">Neural_Playlist</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn(
                "p-3 rounded-lg bg-white/5 border border-transparent cursor-pointer flex items-center gap-3 transition-all",
                i === 1 && "border-neon-blue bg-neon-blue/5"
              )}>
                <div className="w-10 h-10 bg-black/40 rounded flex items-center justify-center border border-white/10 text-xs" style={{ color: i === 1 ? 'var(--color-neon-green)' : i === 2 ? 'var(--color-neon-pink)' : 'var(--color-neon-blue)' }}>
                  0{i}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] font-semibold block truncate">TRACK_DATA_0{i}</span>
                  <span className="text-[11px] opacity-50 truncate">AI_COMPOSER_v{i}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto p-4 neon-border bg-black/20 rounded-lg">
            <div className="flex items-center gap-2 text-neon-blue mb-2">
              <Terminal size={14} />
              <span className="font-pixel text-[8px]">SYS_LOG</span>
            </div>
            <div className="font-terminal text-[10px] text-neon-blue/60 space-y-1">
              <div>{'>'} INITIALIZING...</div>
              <div>{'>'} SYNC_COMPLETE</div>
              <div>{'>'} READY_FOR_INPUT</div>
            </div>
          </div>
        </aside>

        {/* Game Area */}
        <section className="bg-black rounded-xl border-4 border-dark-surface relative flex items-center justify-center overflow-hidden shadow-[inset_0_0_50px_rgba(57,255,20,0.05)]">
          <SnakeGame />
        </section>
      </main>

      {/* Footer */}
      <footer className="h-[100px] bg-dark-surface border-t border-white/10 px-10 flex items-center justify-between z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}
