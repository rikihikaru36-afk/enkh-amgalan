import React, { useState, useEffect, useRef } from 'react';
import { Game } from '../types';
import { Gamepad2, Play, RefreshCw, Trophy, Sparkles, CheckCircle, Hourglass } from 'lucide-react';

export default function GamesCabinet() {
  const [activeTab, setActiveTab] = useState<'info' | 'play'>('info');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('vanguard_game_highscore') || '0');
  });
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  
  // Game list data
  const mockGames: Game[] = [
    {
      id: 'neon-rebel',
      title: 'NEON REBEL',
      genre: 'Cyberpunk Action-Platformer',
      platform: 'WebGL / Web',
      description: 'Dodge terminal fire walls and hack servers in a fast-paced dystopian arcade.',
      progress: 100,
      tags: ['Sleek', 'Hardcore', 'Synthwave']
    },
    {
      id: 'step-shadow',
      title: 'SHADOW OF THE STEPPE',
      genre: 'Nomadic Stealth RPG',
      platform: 'Android / iOS',
      description: 'Control an ancient warrior sneaking through camps in historical Mongolia.',
      progress: 45,
      tags: ['Stunning', 'Tactical', 'History']
    },
    {
      id: 'arctic-beat',
      title: 'MONKEY BRAIN RHYTHM',
      genre: 'Reflex Sync Rhythm Game',
      platform: 'WebGL / PC',
      description: 'Match high-intensity guitar riffs in a game honoring Arctic Monkeys.',
      progress: 80,
      tags: ['Music', 'Fast', 'Indie']
    }
  ];

  // Canvas Game Engine References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerX, setPlayerX] = useState(150);
  const requestRef = useRef<number | null>(null);
  const enemiesRef = useRef<{ x: number; y: number; size: number; speed: number; color: string }[]>([]);
  const gameScoreRef = useRef(0);
  const playerXRef = useRef(150);

  // Keyboard listeners for canvas game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerXRef.current = Math.max(15, playerXRef.current - 20);
        setPlayerX(playerXRef.current);
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerXRef.current = Math.min(285, playerXRef.current + 20);
        setPlayerX(playerXRef.current);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset references
    enemiesRef.current = [];
    gameScoreRef.current = 0;
    playerXRef.current = 150;
    setPlayerX(150);
    setScore(0);

    let frameCount = 0;

    const updateGame = () => {
      frameCount++;
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines for cyberpunk neon aesthetic
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Add a falling enemy block
      if (frameCount % 24 === 0) {
        const colors = ['#ffffff', '#a3a3a3', '#6b7280', '#e5e5e5'];
        enemiesRef.current.push({
          x: Math.random() * (canvas.width - 24) + 12,
          y: 0,
          size: Math.random() * 14 + 10,
          speed: Math.random() * 2 + 2.5 + (gameScoreRef.current / 150),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      // Update enemies
      enemiesRef.current.forEach((enemy, idx) => {
        enemy.y += enemy.speed;

        // Draw enemies (Neon blocks)
        ctx.shadowColor = enemy.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);
        ctx.shadowBlur = 0;

        // Check collision
        const pX = playerXRef.current;
        const pY = canvas.height - 35;
        const dist = Math.hypot(enemy.x - pX, enemy.y - pY);
        
        // Simple collision box
        if (enemy.y > pY - 15 && enemy.y < pY + 15 && Math.abs(enemy.x - pX) < (enemy.size / 2 + 10)) {
          setGameState('gameover');
          if (gameScoreRef.current > highScore) {
            setHighScore(gameScoreRef.current);
            localStorage.setItem('vanguard_game_highscore', String(gameScoreRef.current));
          }
        }
      });

      // Clear far gone enemies & award points
      const initialLength = enemiesRef.current.length;
      enemiesRef.current = enemiesRef.current.filter(e => e.y < canvas.height + 20);
      const cleared = initialLength - enemiesRef.current.length;
      if (cleared > 0) {
        gameScoreRef.current += cleared * 10;
        setScore(gameScoreRef.current);
      }

      // Draw player spaceship (clean wireframe triangle)
      const pX = playerXRef.current;
      const pY = canvas.height - 35;
      
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(pX, pY - 12);
      ctx.lineTo(pX - 10, pY + 10);
      ctx.lineTo(pX + 10, pY + 10);
      ctx.closePath();
      ctx.fill();

      // Core engine fire particle
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(pX, pY + 13 + (frameCount % 6), 3 + (frameCount % 3), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // HUD Score display inside canvas
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px "Inter"';
      ctx.fillText(`SCORE: ${gameScoreRef.current}`, 15, 25);
      ctx.fillText(`HI: ${highScore}`, 240, 25);

      if (gameState === 'playing') {
        requestRef.current = requestAnimationFrame(updateGame);
      }
    };

    requestRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, highScore]);

  // Manual touch buttons for mobile players
  const moveLeft = () => {
    if (gameState !== 'playing') return;
    playerXRef.current = Math.max(20, playerXRef.current - 35);
    setPlayerX(playerXRef.current);
  };

  const moveRight = () => {
    if (gameState !== 'playing') return;
    playerXRef.current = Math.min(280, playerXRef.current + 35);
    setPlayerX(playerXRef.current);
  };

  return (
    <div className="text-white h-full overflow-y-auto pr-1 flex flex-col custom-scrollbar">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 mb-6 gap-4">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 font-inter text-xs tracking-widest uppercase transition-colors relative cursor-pointer ${
            activeTab === 'info' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          My Creations
          {activeTab === 'info' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('play');
            setGameState('idle');
          }}
          className={`pb-3 font-inter text-xs tracking-widest uppercase flex items-center gap-1.5 transition-colors relative cursor-pointer ${
            activeTab === 'play' ? 'text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          Play Arcade (Demo)
          <span className="inline-block bg-white/20 text-white text-[8px] tracking-normal font-sans py-0.5 px-1 rounded">Live</span>
          {activeTab === 'play' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />
          )}
        </button>
      </div>

      {activeTab === 'info' ? (
        <div className="space-y-4 flex-1">
          {mockGames.map((game, i) => (
            <div 
              key={game.id} 
              className="bg-white/[0.02] border border-white/10 p-5 rounded-lg hover:border-white/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2 gap-3">
                <div>
                  <h4 className="font-podium text-sm sm:text-base tracking-wider text-white">{game.title}</h4>
                  <p className="text-[10px] text-white/50 tracking-wider font-mono mt-0.5">{game.genre} — {game.platform}</p>
                </div>
                <div className="flex items-center gap-1">
                  {game.progress === 100 ? (
                    <span className="flex items-center gap-1 text-[10px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded font-inter tracking-wider uppercase">
                      <CheckCircle className="w-3 h-3 text-neutral-200" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded font-inter tracking-wider uppercase">
                      <Hourglass className="w-3 h-3 text-neutral-500 animate-pulse" /> {game.progress}% Dev
                    </span>
                  )}
                </div>
              </div>

              <p className="font-inter text-xs text-neutral-400 leading-normal mb-4">
                {game.description}
              </p>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5">
                {game.tags.map(tag => (
                  <span key={tag} className="bg-white/[0.03] text-[9px] text-neutral-400 font-inter px-2 py-1 rounded border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Stats Banner */}
          <div className="border border-white/5 bg-white/[0.01] p-4 rounded-lg flex items-center justify-between text-xs mt-3">
            <div className="flex items-center gap-2 text-white/60">
              <Trophy className="w-4 h-4 text-white" />
              <span>My Highscore: <strong className="text-white">{highScore} pts</strong></span>
            </div>
            <button 
              onClick={() => setActiveTab('play')}
              className="text-white hover:underline text-[10px] uppercase font-inter tracking-widest flex items-center gap-1 cursor-pointer"
            >
              Beat It <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-1">
          {/* Main Arcade Frame */}
          <div className="bg-neutral-950 border-2 border-white/20 rounded-xl overflow-hidden p-3 w-full max-w-[320px] shadow-2xl relative">
            <div className="flex justify-between items-center px-1 pb-2 border-b border-white/10 mb-2">
              <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">CABINET #15</span>
              <span className="text-[9px] font-mono text-white tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> NEON REBEL DODGE
              </span>
            </div>

            {gameState === 'idle' ? (
              <div className="h-[200px] w-full bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
                <Gamepad2 className="w-10 h-10 mb-3 text-white/40" />
                <h5 className="font-podium text-sm tracking-widest mb-1 text-white">READY PLAYER ONE</h5>
                <p className="text-[10px] text-neutral-400 font-inter mb-4">Dodge the descending digital firewall grids. Use keys A/D, arrows, or touch buttons.</p>
                <button 
                  onClick={() => setGameState('playing')}
                  className="bg-white text-black hover:bg-neutral-200 px-4 py-2 text-xs font-inter tracking-widest uppercase transition-all duration-200 flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-black text-black" /> START GAME
                </button>
              </div>
            ) : gameState === 'gameover' ? (
              <div className="h-[200px] w-full bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
                <span className="text-[10px] text-red-500 font-mono tracking-[0.2em] mb-1">REBEL DESTROYED</span>
                <h5 className="font-podium text-xl tracking-widest text-white mb-2">GAME OVER</h5>
                <div className="text-[10px] font-inter text-neutral-400 space-y-1 mb-4">
                  <div>Your Score: <strong className="text-white">{score}</strong></div>
                  <div>High Score: <strong className="text-white">{highScore}</strong></div>
                </div>
                <button 
                  onClick={() => setGameState('playing')}
                  className="bg-white text-black hover:bg-neutral-200 px-4 py-2 text-xs font-inter tracking-widest uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> TRY AGAIN
                </button>
              </div>
            ) : (
              <div>
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={200}
                  className="w-full bg-neutral-950 block border border-white/10 rounded"
                />
                
                {/* Mobile Touch Control Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <button 
                    onMouseDown={moveLeft}
                    onTouchStart={moveLeft}
                    className="bg-white/15 active:bg-white/30 border border-white/20 text-white py-3 rounded text-center text-xs font-inter tracking-widest cursor-pointer select-none"
                  >
                    ◀ LEFT
                  </button>
                  <button 
                    onMouseDown={moveRight}
                    onTouchStart={moveRight}
                    className="bg-white/15 active:bg-white/30 border border-white/20 text-white py-3 rounded text-center text-xs font-inter tracking-widest cursor-pointer select-none"
                  >
                    RIGHT ▶
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-center text-neutral-500 font-mono mt-3 max-w-[280px]">
            *Developed completely in-house with standard react hooks and pure canvas algorithms.
          </div>
        </div>
      )}
    </div>
  );
}
