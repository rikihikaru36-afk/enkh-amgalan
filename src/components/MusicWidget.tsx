import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { Disc, Play, Square, Volume2, Sparkles, AlertCircle } from 'lucide-react';

export default function MusicWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [synthError, setSynthError] = useState<string | null>(null);
  
  // Audio Context references for synthesis
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<OscillatorNode[]>([]);
  const isPlayingRef = useRef(false);
  const synthTimerRef = useRef<number | null>(null);

  const playlist: Song[] = [
    {
      title: "Do I Wanna Know?",
      album: "AM",
      year: 2013,
      duration: "4:32",
      // Riff frequencies for a chunky synth approximation: G minor motif
      // G3 (196Hz), Bb3 (233Hz), C4 (261Hz), D4 (293Hz), Bb3 (233Hz), G3 (196Hz)
      riffNotes: [196, 0, 196, 233, 261, 293, 233, 196, 0, 196, 233, 196]
    },
    {
      title: "505",
      album: "Favourite Worst Nightmare",
      year: 2007,
      duration: "4:13",
      // Dm to Em chord oscillation
      riffNotes: [293, 293, 329, 329, 293, 293, 329, 329]
    },
    {
      title: "Fluorescent Adolescent",
      album: "Favourite Worst Nightmare",
      year: 2007,
      duration: "2:57",
      // Fast happy riff
      riffNotes: [392, 440, 494, 392, 440, 494, 392, 330]
    },
    {
      title: "R U Mine?",
      album: "AM",
      year: 2013,
      duration: "3:20",
      // Fast heavy minor riffs
      riffNotes: [185, 185, 220, 220, 207, 185, 220, 185]
    }
  ];

  const currentSong = playlist[currentSongIndex];

  // Stop synthetic audio when component unmounts
  useEffect(() => {
    return () => {
      stopSynthesizer();
    };
  }, []);

  const stopSynthesizer = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    
    activeNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    activeNodesRef.current = [];
  };

  const playSynthesizer = () => {
    try {
      stopSynthesizer();
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        setSynthError("Web Audio not supported in this browser format.");
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsPlaying(true);
      isPlayingRef.current = true;

      const riff = currentSong.riffNotes;
      let noteIndex = 0;

      // Play matching riff on timer
      const timer = setInterval(() => {
        if (!isPlayingRef.current) {
          clearInterval(timer);
          return;
        }

        const freq = riff[noteIndex % riff.length];
        
        if (freq > 0) {
          // Double oscillator for heavy Arctic Monkeys electric guitar sound!
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.value = freq;
          
          osc2.type = 'triangle';
          osc2.frequency.value = freq / 2; // Bass double

          gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start();
          osc2.start();

          activeNodesRef.current.push(osc1, osc2);

          // Cleanup oscillators after short lifetime
          setTimeout(() => {
            try { osc1.stop(); } catch(e) {}
            try { osc2.stop(); } catch(e) {}
            activeNodesRef.current = activeNodesRef.current.filter(n => n !== osc1 && n !== osc2);
          }, 400);
        }

        noteIndex++;
      }, 350) as unknown as number;

      synthTimerRef.current = timer;

    } catch (err: any) {
      console.error(err);
      setSynthError("Could not start audio engine. Click again to retry.");
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSynthesizer();
    } else {
      playSynthesizer();
    }
  };

  const selectSong = (index: number) => {
    stopSynthesizer();
    setCurrentSongIndex(index);
    // Auto-play the new song's synth riff to make it super interactive
    setTimeout(() => {
      // Small timeout to allow state reset
      if (isPlayingRef.current === false) {
        // Only if it doesn't auto-stop
      }
    }, 100);
  };

  return (
    <div className="text-white h-full overflow-y-auto pr-1 flex flex-col custom-scrollbar">
      {/* Arctic Monkeys Aesthetic Banner */}
      <div className="bg-neutral-900 border border-white/5 rounded-lg p-5 mb-6 text-center relative overflow-hidden group">
        {/* Background waveform visualization */}
        <div className="absolute inset-0 flex items-center justify-around opacity-10 pointer-events-none px-4">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`w-0.5 bg-white transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'h-4'
              }`}
              style={{ 
                height: isPlaying ? `${Math.random() * 40 + 5}px` : '12px',
                animationDelay: `${i * 40}ms`
              }} 
            />
          ))}
        </div>

        {/* Vinyl Record */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className={`w-28 h-28 rounded-full bg-neutral-950 border-4 border-neutral-800 flex items-center justify-center shadow-2xl relative ${
              isPlaying ? 'animate-spin' : ''
            }`} style={{ animationDuration: '8s' }}>
              <div className="w-10 h-10 rounded-full bg-white border-2 border-neutral-800 flex items-center justify-center font-bold text-[8px] text-black tracking-tighter">
                AM
              </div>
              {/* Grooves on vinyl */}
              <div className="absolute inset-2 border border-neutral-900/30 rounded-full pointer-events-none" />
              <div className="absolute inset-4 border border-neutral-900/50 rounded-full pointer-events-none" />
              <div className="absolute inset-6 border border-neutral-950/40 rounded-full pointer-events-none" />
            </div>

            {/* Arm Stylus Needle */}
            <div className={`absolute -right-2 top-0 h-14 w-2 bg-neutral-700 origin-top rounded transition-all duration-500 transform ${
              isPlaying ? 'rotate-12' : 'rotate-0'
            }`} />
          </div>
        </div>

        {/* Active Song Info */}
        <div className="relative z-10 mt-1">
          <h4 className="font-podium text-base tracking-wider text-white truncate">{currentSong.title}</h4>
          <p className="font-inter text-xs text-white/50 tracking-wider uppercase mt-1">
            {currentSong.album} — {currentSong.year}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mt-5 relative z-10">
          <button
            onClick={togglePlayback}
            className="w-12 h-12 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            {isPlaying ? (
              <Square className="w-4 h-4 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Technical Explainer */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-neutral-400 font-mono tracking-wider">
          <Volume2 className="w-3.5 h-3.5 text-white/60" />
          <span>REAL-TIME WEB AUDIO SYNTH ACTIVATED</span>
        </div>
      </div>

      {synthError && (
        <div className="bg-white/5 border border-white/20 p-2 rounded text-[10px] text-neutral-300 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <span>{synthError}</span>
        </div>
      )}

      {/* Playlist tracks */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 px-1 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-white/50" />
          <h5 className="font-inter text-xs tracking-widest uppercase text-white/70">Favorites Tracklist</h5>
        </div>

        {playlist.map((song, idx) => (
          <button
            key={song.title}
            onClick={() => selectSong(idx)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
              currentSongIndex === idx 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 truncate pr-2">
              <span className="font-mono text-xs text-neutral-500 w-4 block">{String(idx + 1).padStart(2, '0')}</span>
              <div className="truncate">
                <p className="font-inter text-xs font-semibold truncate text-white">{song.title}</p>
                <p className="font-inter text-[10px] text-neutral-500 truncate mt-0.5">{song.album}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
              {currentSongIndex === idx && isPlaying && (
                <Disc className="w-3.5 h-3.5 animate-spin text-white" />
              )}
              <span>{song.duration}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="font-inter text-[10px] text-neutral-500 text-center leading-relaxed mt-4 px-2">
        "I bet that you look good on the dancefloor..." — Arctic Monkeys-ийн дуунууд миний бүтээлч байдал, Код бичих хэв маягт хамгийн ихээр нөлөөлдөг!
      </div>
    </div>
  );
}
