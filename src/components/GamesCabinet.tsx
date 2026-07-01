import React, { useState, useEffect, useRef } from 'react';
import { Game } from '../types';
import { 
  Gamepad2, 
  Play, 
  RefreshCw, 
  Trophy, 
  Sparkles, 
  CheckCircle, 
  Hourglass, 
  Heart, 
  Clock, 
  Flame, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  HelpCircle,
  Zap,
  Image,
  Video,
  Send,
  Keyboard,
  ListFilter,
  Check,
  X
} from 'lucide-react';

interface AnimeQuestion {
  id: number;
  emojis: string;
  answer: string;
  answers: string[];
  options: string[];
  hint: string;
  image?: string;
  video?: string;
}

const getProxiedImageUrl = (url?: string): string => {
  if (!url) return '';
  // Use images.weserv.nl proxy to bypass referer/CORS hotlink blocking of JustWatch images
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};

const animeQuestions: AnimeQuestion[] = [
  {
    id: 1,
    emojis: "🏴‍☠️🍖👒",
    answer: "One Piece",
    answers: ["one piece", "onepiece", "ван пийс", "ванпийс", "1 piece"],
    options: ["One Piece", "Naruto", "Bleach", "Dragon Ball"],
    hint: "Аварга том далайн эрдэнэсийг хайж буй сүрлэн малгайт хүү.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjx-ISfpABtSXJne2RNQR8i5mFDIn60lmvMhWKwt3sqKF3QOu5QntCP7zL&s=10",
    video: "https://www.youtube.com/embed/S8_YwFLCh4Y"
  },
  {
    id: 2,
    emojis: "🦊🍥⚡👁️",
    answer: "Naruto",
    answers: ["naruto", "наруто"],
    options: ["Naruto", "My Hero Academia", "Jujutsu Kaisen", "Hunter x Hunter"],
    hint: "Есөн сүүлт үнэгний сүнсийг биедээ агуулсан нинжа хүү.",
    image: "https://m.media-amazon.com/images/M/MV5BNTk3MDA1ZjAtNTRhYS00YzNiLTgwOGEtYWRmYTQ3NjA0NTAwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    video: "https://www.youtube.com/embed/cXEbImgP_E4"
  },
  {
    id: 3,
    emojis: "📓🍎💀✍️",
    answer: "Death Note",
    answers: ["death note", "deathnote", "дэт ноут", "үхлийн дэвтэр"],
    options: ["Death Note", "Code Geass", "Tokyo Ghoul", "Monster"],
    hint: "Нэрийг нь бичихэд л үхдэг шидэт дэвтэр ба алимд дуртай Шингами.",
    image: "https://m.media-amazon.com/images/M/MV5BYTgyZDhmMTEtZDFhNi00MTc4LTg3NjUtYWJlNGE5Mzk2NzMxXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
    video: "https://www.youtube.com/embed/kY-f6gSInS0"
  },
  {
    id: 4,
    emojis: "🧱🧗‍♂️⚔️👹",
    answer: "Attack on Titan",
    answers: ["attack on titan", "shingeki no kyojin", "атак он титан", "титан"],
    options: ["Attack on Titan", "Kabaneri of the Iron Fortress", "Vinland Saga", "Berserk"],
    hint: "Аварга биетүүдээс хамгаалсан гурван давхар хэрэм ба хана.",
    image: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    video: "https://www.youtube.com/embed/CID-sSg9YFA"
  },
  {
    id: 5,
    emojis: "⚔️👺🐗⚡🌸",
    answer: "Demon Slayer",
    answers: ["demon slayer", "kimetsu no yaiba", "демон слэйер", "чөтгөрийн ангууч"],
    options: ["Demon Slayer", "Jujutsu Kaisen", "Inuyasha", "Bleach"],
    hint: "Чөтгөр болсон дүүгээ аврахаар аялж буй усан амьсгалт хүү.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT_jt5kt60xJxQAzIwYHJCBc91Trj7hNXYb6IO93s9EHPWa1wfxk6DIBE&s=10",
    video: "https://www.youtube.com/embed/gp3x_X6Wzgc"
  },
  {
    id: 6,
    emojis: "🐉🟠⚡💪💥",
    answer: "Dragon Ball",
    answers: ["dragon ball", "dragonball", "драгонбол", "драгон бол", "лууны бөмбөлөг"],
    options: ["Dragon Ball", "One Punch Man", "Bleach", "Toriko"],
    hint: "Долоон ширхэг лууны бөмбөлөг ба Супэр Сайян.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkfPzuCEyUE2H4kC64HbPYTm85S28-gksSK_5K6Z3Mk-QfrG5blfi8BTmc&s=10",
    video: "https://www.youtube.com/embed/sfKi8L_S-9E"
  },
  {
    id: 7,
    emojis: "👁️🤞👅🏫👹",
    answer: "Jujutsu Kaisen",
    answers: ["jujutsu kaisen", "jjk", "жүжүцү кайсен", "жужуцу кайсен"],
    options: ["Jujutsu Kaisen", "Chainsaw Man", "Mob Psycho 100", "Tokyo Ghoul"],
    hint: "Сукунагийн хурууг залгиж, хараалын сургуульд орсон хүү.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO5X8INKNniDB5IRtGmTV1aXCOpEPpgAFVOU_o5n-oUg&s=10",
    video: "https://www.youtube.com/embed/v8b3YrokKxg"
  },
  {
    id: 8,
    emojis: "☕🎭🩸🧑‍🦳🕷️",
    answer: "Tokyo Ghoul",
    answers: ["tokyo ghoul", "токио гүүл", "токио гуул"],
    options: ["Tokyo Ghoul", "Parasyte", "Deadman Wonderland", "Another"],
    hint: "Махан идэшт Гуул болж хувирсан кофены газарт ажилладаг залуу.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUaLyhjsgBysopQhmG5pRzaLAvp44lvEGss8AHz5-Pw&s=10",
    video: "https://www.youtube.com/embed/7aMOurgDB-o"
  },
  {
    id: 9,
    emojis: "🌙🐱🎀👗💫",
    answer: "Sailor Moon",
    answers: ["sailor moon", "сейлор мүүн", "сейлормун"],
    options: ["Sailor Moon", "Cardcaptor Sakura", "Madoka Magica", "Precure"],
    hint: "Сарны нэрээр чөтгөрүүдийг шийтгэх охидын хамтлаг.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ88HpeGy3oEYGtfMYu6vXEB3N-UGlv2fJLof6vualqFg&s=10",
    video: "https://www.youtube.com/embed/6_6v9Wn2K1Y"
  },
  {
    id: 10,
    emojis: "🥦🦸‍♂️🏫✊💥",
    answer: "My Hero Academia",
    answers: ["my hero academia", "mha", "миний баатарлаг академи", "боку но хиро"],
    options: ["My Hero Academia", "One Punch Man", "Black Clover", "Fire Force"],
    hint: "Супер хүчгүй төрж, Дэлхийн хамгийн шилдэг баатрын хүчийг өвлөн авсан хүү.",
    image: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    video: "https://www.youtube.com/embed/9a6P3TAsB3w"
  },
  {
    id: 11,
    emojis: "⚙️🦾👦🤖🩸",
    answer: "Fullmetal Alchemist",
    answers: ["fullmetal alchemist", "fma", "ган төмөр алхимич", "алхимич"],
    options: ["Fullmetal Alchemist", "Steins;Gate", "Neon Genesis Evangelion", "Gurren Lagann"],
    hint: "Ээжийгээ сэргээх гэж хувиргалт хийгээд дүүгийнхээ биеийг, өөрийнхөө гар хөлийг алдсан ах дүү хоёр.",
    image: "https://m.media-amazon.com/images/M/MV5BNDczZWMyMjEtZDI0ZS00YThjLWE2MjEtNTIxNmVmZDhkNDg5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    video: "https://www.youtube.com/embed/2uq34TeWEdQ"
  },
  {
    id: 12,
    emojis: "🎣🕷️⚡🃏🍃",
    answer: "Hunter x Hunter",
    answers: ["hunter x hunter", "hxh", "хантер хантер", "хантер х хантер"],
    options: ["Hunter x Hunter", "Yu Yu Hakusho", "Fairy Tail", "Bleach"],
    hint: "Аавыгаа олохоор Хантерын шалгалтанд орсон Килуагийн хамгийн сайн найз.",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1e/Hunter-x-hunter-phantom-rouge-poster.png",
    video: "https://www.youtube.com/embed/faqmNMCkG0Y"
  },
  {
    id: 13,
    emojis: "☄️🎀🛤️🏙️⏰",
    answer: "Your Name",
    answers: ["your name", "kimi no na wa", "чиний нэр"],
    options: ["Your Name", "Weathering With You", "A Silent Voice", "5 Centimeters per Second"],
    hint: "Солирын бороо ба бие нь солигддог хөдөөний охин, хотын хүү хоёрын хайрын түүх.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSD-uFQmXyXF6VBIg7IMa3TIUMfvf69Ty2d7YxWshYjFwgMhxcpqnOdM4&s=10",
    video: "https://www.youtube.com/embed/PDSkFeMV4Fg"
  },
  {
    id: 14,
    emojis: "🪚🐶🩸😈🍔",
    answer: "Chainsaw Man",
    answers: ["chainsaw man", "хөрөөт хүн", "чэйнсоу мэн", "хөрөө залуу"],
    options: ["Chainsaw Man", "Dorohedoro", "Devilman Crybaby", "Hellsing"],
    hint: "Почита нэртэй хөрөөт чөтгөртэй нэгдэж, чөтгөрийн ангууч болсон Дэнжи.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6BPZi8-3oF99baT5qdC4x2sMXWucN1S9bDUtqkU9p0H896DFHtm_E7-Jw&s=10",
    video: "https://www.youtube.com/embed/GrH7N8p2998"
  },
  {
    id: 15,
    emojis: "🎮⚔️🏰🌌💻",
    answer: "Sword Art Online",
    answers: ["sword art online", "sao", "суорд арт онлайн"],
    options: ["Sword Art Online", "Log Horizon", "Overlord", "No Game No Life"],
    hint: "Виртуал тоглоомонд түгжигдэж, үхвэл бодит амьдрал дээр ч бас үхдэг Айнкрад цайз.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqpYPEpkZBQbje0rNHmI8OA4_5OixiWIN9Fc_9Pfx3DTkL2y6parlbVNip&s=10",
    video: "https://www.youtube.com/embed/KId6eunoiWk"
  }
];

// Helper to shuffle any array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Procedural synthesizer helper for sound effects (safely runs on user interactions)
const playSound = (type: 'ding' | 'buzz') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'ding') {
      // High pitched sweet chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Low dual buzzer sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    console.warn("AudioContext audio playback blocked or failed:", e);
  }
};

export default function GamesCabinet() {
  const [activeTab, setActiveTab] = useState<'info' | 'play'>('info');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('vanguard_game_highscore') || '0');
  });

  // Game list data (Added Anime Guesser)
  const mockGames: Game[] = [
    {
      id: 'anime-guesser',
      title: 'ANIME GUESSER',
      genre: 'Anime Trivia & Speed Run',
      platform: 'WebGL / Web Mobile',
      description: 'The ultimate Otaku speed-trivia challenge! 15s timer, 3 lives, progressive multipliers, and glowing visual cues.',
      progress: 100,
      tags: ['Otaku', 'Trivia', 'Music', 'High-Octane']
    },
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

  // Global Arcade state
  const [currentGame, setCurrentGame] = useState<'neon-rebel' | 'anime-guesser' | null>(null);

  // sound mute toggle state
  const [soundMuted, setSoundMuted] = useState(false);

  // Game 1: NEON REBEL DODGE States
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerX, setPlayerX] = useState(150);
  const requestRef = useRef<number | null>(null);
  const enemiesRef = useRef<{ x: number; y: number; size: number; speed: number; color: string }[]>([]);
  const gameScoreRef = useRef(0);
  const playerXRef = useRef(150);

  // Game 2: ANIME GUESSER States
  const [animeHighScore, setAnimeHighScore] = useState(() => {
    return Number(localStorage.getItem('vanguard_anime_highscore') || '0');
  });
  const [animeGameState, setAnimeGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [shuffledQuestions, setShuffledQuestions] = useState<AnimeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFeedbackState, setIsFeedbackState] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [lives, setLives] = useState(3);
  const [animeScore, setAnimeScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showBonusSparkle, setShowBonusSparkle] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameMode, setGameMode] = useState<'multiple-choice' | 'typing'>('multiple-choice');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [revealImage, setRevealImage] = useState(false);
  const [revealVideo, setRevealVideo] = useState(false);
  const [showCorrectReveal, setShowCorrectReveal] = useState(false);
  const [revealStatus, setRevealStatus] = useState<'correct' | 'incorrect' | 'timeout' | null>(null);

  // Keyboard listeners for original Neon Rebel dodge game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentGame !== 'neon-rebel' || gameState !== 'playing') return;
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
  }, [gameState, currentGame]);

  // Neon Rebel dodge game loop
  useEffect(() => {
    if (currentGame !== 'neon-rebel' || gameState !== 'playing') {
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

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; canvas.width > i; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; canvas.height > i; i += 30) {
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
        
        // Simple collision box
        if (enemy.y > pY - 15 && pY + 15 > enemy.y && (enemy.size / 2 + 10) > Math.abs(enemy.x - pX)) {
          setGameState('gameover');
          if (gameScoreRef.current > highScore) {
            setHighScore(gameScoreRef.current);
            localStorage.setItem('vanguard_game_highscore', String(gameScoreRef.current));
          }
        }
      });

      // Clear far gone enemies & award points
      const initialLength = enemiesRef.current.length;
      enemiesRef.current = enemiesRef.current.filter(e => (canvas.height + 20 > e.y));
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

      if (gameState === 'playing' && currentGame === 'neon-rebel') {
        requestRef.current = requestAnimationFrame(updateGame);
      }
    };

    requestRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, highScore, currentGame]);

  // Anime Guesser Timer Effect
  useEffect(() => {
    if (currentGame === 'anime-guesser' && animeGameState === 'playing' && !isFeedbackState) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [animeGameState, currentQuestionIndex, isFeedbackState, currentGame]);

  // Anime Guesser Logic Handlers
  const startAnimeGame = () => {
    const shuffled = shuffleArray(animeQuestions);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setAnimeScore(0);
    setLives(3);
    setStreak(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setRevealImage(false);
    setRevealVideo(false);
    setShowCorrectReveal(false);
    setRevealStatus(null);
    setIsFeedbackState(false);
    setTimeLeft(15);
    setShowHint(false);
    setAnimeGameState('playing');
    
    if (shuffled.length > 0) {
      setShuffledOptions(shuffleArray(shuffled[0].options));
    }
  };

  const handleAnswerClick = (option: string) => {
    if (isFeedbackState) return;
    
    setSelectedOption(option);
    setIsFeedbackState(true);
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.answer;
    
    let nextStreak = streak;
    
    if (isCorrect) {
      if (!soundMuted) playSound('ding');
      nextStreak = streak + 1;
      setStreak(nextStreak);
      setRevealStatus('correct');
      
      let pts = 10;
      if (nextStreak > 0 && nextStreak % 3 === 0) {
        pts += 20; 
        setShowBonusSparkle(true);
        setTimeout(() => setShowBonusSparkle(false), 1200);
      }
      setAnimeScore(prev => prev + pts);
    } else {
      if (!soundMuted) playSound('buzz');
      setStreak(0);
      setLives(prev => prev - 1);
      setRevealStatus('incorrect');
    }
    
    setTimeout(() => {
      setShowCorrectReveal(true);
    }, 1000);
  };

  const submitTypedAnswer = () => {
    if (isFeedbackState) return;
    if (!typedAnswer.trim()) return;

    setIsFeedbackState(true);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    const sanitizedInput = typedAnswer.trim().toLowerCase();
    const isCorrect = currentQuestion.answers.some(ans => ans.trim().toLowerCase() === sanitizedInput);

    let nextStreak = streak;

    if (isCorrect) {
      if (!soundMuted) playSound('ding');
      nextStreak = streak + 1;
      setStreak(nextStreak);
      setRevealStatus('correct');
      setSelectedOption(currentQuestion.answer);
      
      let pts = 10;
      if (nextStreak > 0 && nextStreak % 3 === 0) {
        pts += 20;
        setShowBonusSparkle(true);
        setTimeout(() => setShowBonusSparkle(false), 1200);
      }
      setAnimeScore(prev => prev + pts);
    } else {
      if (!soundMuted) playSound('buzz');
      setStreak(0);
      setLives(prev => prev - 1);
      setRevealStatus('incorrect');
      setSelectedOption(""); // represents incorrect
    }

    setTimeout(() => {
      setShowCorrectReveal(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    setShowCorrectReveal(false);
    setRevealStatus(null);
    setSelectedOption(null);
    setTypedAnswer('');
    setRevealImage(false);
    setRevealVideo(false);
    setIsFeedbackState(false);
    setShowHint(false);

    // If lives are out, transition to gameover screen
    if (lives <= 0) {
      setAnimeGameState('gameover');
      if (animeScore > animeHighScore) {
        setAnimeHighScore(animeScore);
        localStorage.setItem('vanguard_anime_highscore', String(animeScore));
      }
      return;
    }

    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= shuffledQuestions.length) {
      setAnimeGameState('gameover');
      if (animeScore > animeHighScore) {
        setAnimeHighScore(animeScore);
        localStorage.setItem('vanguard_anime_highscore', String(animeScore));
      }
    } else {
      setCurrentQuestionIndex(nextIdx);
      setShuffledOptions(shuffleArray(shuffledQuestions[nextIdx].options));
      setTimeLeft(15);
    }
  };

  const handleTimeout = () => {
    setIsFeedbackState(true);
    setSelectedOption(""); // Timed out, empty means no choice
    
    if (!soundMuted) playSound('buzz');
    setStreak(0);
    setLives(prev => prev - 1);
    setRevealStatus('timeout');
    
    setTimeout(() => {
      setShowCorrectReveal(true);
    }, 1000);
  };

  const moveLeft = () => {
    if (currentGame !== 'neon-rebel' || gameState !== 'playing') return;
    playerXRef.current = Math.max(20, playerXRef.current - 35);
    setPlayerX(playerXRef.current);
  };

  const moveRight = () => {
    if (currentGame !== 'neon-rebel' || gameState !== 'playing') return;
    playerXRef.current = Math.min(280, playerXRef.current + 35);
    setPlayerX(playerXRef.current);
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="text-white h-full overflow-y-auto pr-1 flex flex-col custom-scrollbar">
      {/* Injecting CSS Keyframes dynamically for fully-contained shake and slide-in effect */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.2); }
          50% { text-shadow: 0 0 25px rgba(255,255,255,0.6); }
        }
        .animate-glow-pulse {
          animation: glowPulse 2s infinite;
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 15px #facc15); }
        }
        .animate-sparkle {
          animation: sparkle 0.6s infinite alternate;
        }
      `}</style>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 mb-6 gap-4 flex-shrink-0">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 font-inter text-xs tracking-widest uppercase transition-colors relative cursor-pointer ${
            activeTab === 'info' ? 'text-white font-semibold' : 'text-neutral-500 hover:text-neutral-300'
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
            setCurrentGame(null); // Back to selection initially
          }}
          className={`pb-3 font-inter text-xs tracking-widest uppercase flex items-center gap-1.5 transition-colors relative cursor-pointer ${
            activeTab === 'play' ? 'text-white font-semibold' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          Play Arcade
          <span className="inline-block bg-white/20 text-white text-[8px] tracking-normal font-sans py-0.5 px-1 rounded">2 Games</span>
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
          <div className="border border-white/5 bg-white/[0.01] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs mt-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white/60">
                <Trophy className="w-4 h-4 text-white" />
                <span>Neon Rebel Highscore: <strong className="text-white">{highScore} pts</strong></span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Anime Guesser Highscore: <strong className="text-white">{animeHighScore} pts</strong></span>
              </div>
            </div>
            <button 
              onClick={() => {
                setActiveTab('play');
                setCurrentGame('anime-guesser');
              }}
              className="text-white hover:underline text-[10px] uppercase font-inter tracking-widest flex items-center gap-1 cursor-pointer self-start sm:self-center"
            >
              Play Anime Quiz <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-1 w-full">
          
          {/* Game Selection Menu */}
          {currentGame === null && (
            <div className="w-full max-w-[420px] bg-neutral-950 border border-white/10 rounded-xl p-5 shadow-2xl animate-slide-in">
              <div className="text-center mb-6">
                <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-white/75" />
                <h3 className="font-podium text-base tracking-widest uppercase text-white">VANGUARD ARCADE</h3>
                <p className="text-[10px] text-neutral-400 font-mono uppercase mt-1">Select A Game Cabinet To Play</p>
              </div>

              <div className="space-y-3.5">
                {/* Anime Guesser Play Card */}
                <button
                  onClick={() => {
                    setCurrentGame('anime-guesser');
                    setAnimeGameState('idle');
                  }}
                  className="w-full text-left bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-white/30 rounded-lg p-4 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-podium text-xs sm:text-sm tracking-widest text-white group-hover:text-amber-300 transition-colors">🎮 ANIME GUESSER</span>
                    <span className="text-[9px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded uppercase">Otaku Quiz</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-inter mb-3 line-clamp-2">
                    Test your anime speeds! 15s timer, 3 lives, score multipliers, consecutive bonus multipliers, and interactive SFX.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/50 border-t border-white/5 pt-2">
                    <span>RECORD: {animeHighScore} pts</span>
                    <span className="text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">PLAY NOW →</span>
                  </div>
                </button>

                {/* Neon Rebel Play Card */}
                <button
                  onClick={() => {
                    setCurrentGame('neon-rebel');
                    setGameState('idle');
                  }}
                  className="w-full text-left bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-white/30 rounded-lg p-4 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-podium text-xs sm:text-sm tracking-widest text-white group-hover:text-cyan-300 transition-colors">🚀 NEON REBEL DODGE</span>
                    <span className="text-[9px] font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 px-2 py-0.5 rounded uppercase">Canvas Arcade</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-inter mb-3 line-clamp-2">
                    Retro neon block-dodging terminal game. Dodge digital firewall grids and climb the leaderboard.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/50 border-t border-white/5 pt-2">
                    <span>RECORD: {highScore} pts</span>
                    <span className="text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">PLAY NOW →</span>
                  </div>
                </button>
              </div>

              <div className="text-[9px] text-center text-neutral-600 font-mono mt-6">
                VANGUARD LABS • MULTI-GAME PLATFORM V1.2
              </div>
            </div>
          )}

          {/* GAME 1: NEON REBEL CABINET FRAME */}
          {currentGame === 'neon-rebel' && (
            <div className="bg-neutral-950 border-2 border-white/20 rounded-xl overflow-hidden p-3 w-full max-w-[320px] shadow-2xl relative animate-slide-in">
              <div className="flex justify-between items-center px-1 pb-2 border-b border-white/10 mb-2">
                <button 
                  onClick={() => setCurrentGame(null)}
                  className="text-[9px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-2.5 h-2.5" /> EXIT
                </button>
                <span className="text-[9px] font-mono text-white tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> NEON REBEL DODGE
                </span>
              </div>

              {gameState === 'idle' ? (
                <div className="h-[200px] w-full bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
                  <Gamepad2 className="w-10 h-10 mb-3 text-white/40 animate-bounce" />
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
          )}

          {/* GAME 2: ANIME GUESSER CABINET FRAME */}
          {currentGame === 'anime-guesser' && (
            <div className="bg-neutral-950 border-2 border-white/20 rounded-xl overflow-hidden p-4 w-full max-w-[360px] sm:max-w-[400px] shadow-2xl relative animate-slide-in">
              
              {/* Cabinet Header bar */}
              <div className="flex justify-between items-center pb-2.5 border-b border-white/10 mb-4 flex-shrink-0">
                <button 
                  onClick={() => setCurrentGame(null)}
                  className="text-[9px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-all duration-200"
                >
                  <ArrowLeft className="w-3 h-3" /> EXIT TO LOBBY
                </button>
                <div className="flex items-center gap-3">
                  {/* Sound Toggle Icon */}
                  <button
                    onClick={() => setSoundMuted(!soundMuted)}
                    className="text-neutral-500 hover:text-white p-1 transition-all"
                    title={soundMuted ? "Unmute sounds" : "Mute sounds"}
                  >
                    {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[9px] font-mono text-amber-400 tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> ANIME GUESSER
                  </span>
                </div>
              </div>

              {/* IDLE/WELCOME SCREEN */}
              {animeGameState === 'idle' && (
                <div className="py-4 text-center">
                  <div className="w-14 h-14 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-400/30">
                    <Gamepad2 className="w-7 h-7 text-amber-400 animate-pulse" />
                  </div>
                  <h4 className="font-podium text-sm sm:text-base tracking-[0.2em] mb-1 text-white uppercase">Ready Player One</h4>
                  <p className="text-[10px] text-neutral-400 font-mono tracking-wider mb-5">ТА ШИЛДЭГ OTAKU МӨН ҮҮ?</p>

                  {/* Mode selector toggle */}
                  <div className="mb-5 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">ТОГЛОХ ГОРИМ</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setGameMode('multiple-choice')}
                        className={`py-2 px-3 rounded text-[10px] font-inter font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          gameMode === 'multiple-choice'
                            ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                            : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <ListFilter className="w-3.5 h-3.5" /> Сонгох
                      </button>
                      <button
                        onClick={() => setGameMode('typing')}
                        className={`py-2 px-3 rounded text-[10px] font-inter font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          gameMode === 'typing'
                            ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                            : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Keyboard className="w-3.5 h-3.5" /> Бичих
                      </button>
                    </div>
                  </div>

                  {/* Rules list */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg text-left text-[11px] font-inter space-y-2 mb-6">
                    <div className="flex justify-between text-neutral-400 border-b border-white/5 pb-1.5 mb-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-widest">RULE SET</span>
                      <span className="font-mono text-[9px] text-amber-400">VANGUARD OFFICIAL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span><strong>⏱️ ХУГАЦАА:</strong> Асуулт бүрт 15 секунд (хоцорвол буруу)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      <span><strong>❤️ АМЬ:</strong> 3 амьтай (3 удаа буруу хариулбал дуусна)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span><strong>⭐ ОНОО:</strong> Зөв хариулт бүр +10 оноо</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                      <span><strong>🔥 BONUS:</strong> Дараалан 3 зөв бол +20 оноо ба Multiplier!</span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button 
                    onClick={startAnimeGame}
                    className="w-full bg-amber-400 text-black hover:bg-amber-300 active:scale-95 py-3 rounded-lg text-xs font-inter font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_20px_rgba(251,191,36,0.25)]"
                  >
                    <Play className="w-3.5 h-3.5 fill-black text-black" /> START MISSION
                  </button>
                </div>
              )}

              {/* GAME PLAYING ACTIVE STATE */}
              {animeGameState === 'playing' && currentQuestion && (
                <div key={currentQuestionIndex} className="animate-slide-in flex flex-col h-full">
                  
                  {/* Stats Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/5 pb-3 mb-3 text-neutral-400">
                    <div>
                      Q: <span className="text-white font-bold">{currentQuestionIndex + 1}/{shuffledQuestions.length}</span>
                    </div>
                    
                    {/* Lives Counter (Hearts) */}
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <Heart 
                          key={i} 
                          className={`w-3.5 h-3.5 transition-all duration-300 ${
                            i < lives ? 'text-red-500 fill-red-500 scale-100' : 'text-neutral-700 scale-90'
                          }`} 
                        />
                      ))}
                    </div>

                    {/* Streak Counter */}
                    <div className="flex items-center gap-1 font-bold">
                      {streak > 0 ? (
                        <span className="text-orange-400 flex items-center gap-0.5 animate-pulse bg-orange-400/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                          <Flame className="w-3 h-3 fill-orange-400 text-orange-400" /> STREAK {streak}
                        </span>
                      ) : (
                        <span className="text-neutral-600 font-normal">No streak</span>
                      )}
                    </div>

                    <div>
                      SCORE: <span className="text-white font-bold">{animeScore}</span>
                    </div>
                  </div>

                  {/* Smooth countdown progress bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-4 relative">
                    <div 
                      className={`h-full transition-all duration-1000 ease-linear ${
                        timeLeft > 8 ? 'bg-emerald-500' : timeLeft > 4 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                      }`}
                      style={{ width: `${(timeLeft / 15) * 100}%` }}
                    />
                  </div>

                  {/* Timer text indicator */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mb-2">
                    <span className="uppercase">Mission Clock</span>
                    <span className={`font-bold ${timeLeft <= 4 ? 'text-red-400 animate-pulse text-xs' : 'text-white'}`}>
                      {timeLeft} SECONDS LEFT
                    </span>
                  </div>

                  {showCorrectReveal ? (
                    /* CORRECT ANSWER REVEAL SCREEN WITH MEDIA */
                    <div className="flex flex-col gap-4 animate-slide-in py-1">
                      {revealStatus === 'correct' ? (
                        <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
                          <span className="text-4xl mb-1.5 animate-bounce block">🎉</span>
                          <h4 className="font-podium text-xs sm:text-sm tracking-[0.2em] text-emerald-400 uppercase mb-1">ЗӨВ ХАРИУЛЛАА!</h4>
                          <h3 className="text-base sm:text-lg font-bold font-inter text-white">
                            {currentQuestion.answer}
                          </h3>
                        </div>
                      ) : revealStatus === 'timeout' ? (
                        <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none" />
                          <span className="text-4xl mb-1.5 animate-bounce block">⏱️</span>
                          <h4 className="font-podium text-xs sm:text-sm tracking-[0.2em] text-amber-400 uppercase mb-1">ЦАГ ДУУСЛАА!</h4>
                          <div className="text-[10px] text-neutral-400 mb-1">ЗӨВ ХАРИУЛТ:</div>
                          <h3 className="text-base sm:text-lg font-bold font-inter text-white">
                            {currentQuestion.answer}
                          </h3>
                        </div>
                      ) : (
                        <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none" />
                          <span className="text-4xl mb-1.5 animate-bounce block">❌</span>
                          <h4 className="font-podium text-xs sm:text-sm tracking-[0.2em] text-red-400 uppercase mb-1">БУРУУ ХАРИУЛЛАА!</h4>
                          <div className="text-[10px] text-neutral-400 mb-1">ЗӨВ ХАРИУЛТ:</div>
                          <h3 className="text-base sm:text-lg font-bold font-inter text-white">
                            {currentQuestion.answer}
                          </h3>
                        </div>
                      )}

                      {/* Media Reveal Section (Beautifully formatted to display Poster & Video side-by-side with correct aspect ratios and equal heights) */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                        {/* Anime Image (Fully Unblurred & Complete Poster) */}
                        {currentQuestion.image && (
                          <div className={`md:col-span-5 rounded-xl overflow-hidden border shadow-lg bg-neutral-950 flex flex-col transition-all duration-500 h-[280px] md:h-[320px] ${
                            revealStatus === 'correct' 
                              ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]' 
                              : revealStatus === 'timeout'
                              ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
                              : 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.12)]'
                          }`}>
                            <div className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 px-3 py-1.5 border-b border-white/5 bg-neutral-900/40 uppercase flex items-center gap-1.5 select-none">
                              🖼️ ОФФИЦИАЛ ПОСТЕР
                            </div>
                            <div className="flex-1 min-h-0 bg-neutral-950 flex items-center justify-center p-2">
                              <img 
                                src={getProxiedImageUrl(currentQuestion.image)} 
                                referrerPolicy="no-referrer"
                                alt={currentQuestion.answer}
                                className="h-full max-h-full object-contain animate-fade-in rounded-lg"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (target.src.includes('images.weserv.nl') && currentQuestion.image) {
                                    // Fallback to original direct link if proxy fails
                                    target.src = currentQuestion.image;
                                  } else {
                                    // Fallback to beautiful anime art placeholder if everything fails
                                    target.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=60";
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* YouTube Original Intro Theme Video */}
                        {currentQuestion.video && (
                          <div className={`md:col-span-7 rounded-xl overflow-hidden border shadow-lg bg-black flex flex-col transition-all duration-500 h-[280px] md:h-[320px] ${
                            revealStatus === 'correct' 
                              ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]' 
                              : revealStatus === 'timeout'
                              ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
                              : 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.12)]'
                          }`}>
                            <div className="text-[9px] font-mono font-bold tracking-widest text-red-400 px-3 py-1.5 border-b border-white/5 bg-neutral-900/40 uppercase flex items-center gap-1.5 select-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                              📺 ОРИГИНАЛ АНИМЭ ИНТРО / ДУУ
                            </div>
                            <div className="flex-1 min-h-0 bg-black relative">
                              <iframe
                                src={`${currentQuestion.video}?autoplay=1&enablejsapi=1`}
                                title={`${currentQuestion.answer} Intro Theme`}
                                className="absolute inset-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={handleNextQuestion}
                        className="w-full bg-emerald-400 text-black hover:bg-emerald-300 active:scale-95 py-3 rounded-lg text-xs font-inter font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.25)]"
                      >
                        {lives <= 0 || currentQuestionIndex + 1 >= shuffledQuestions.length ? "Үр дүнг харах ➔" : "Дараагийн асуулт ➔"}
                      </button>
                    </div>
                  ) : (
                    /* REGULAR PLAYING SCREEN with clues and inputs */
                    <>
                      {/* Question Title Card (Featuring Big Emojis) */}
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center mb-4 relative overflow-hidden text-center min-h-[100px]">
                        {/* Background grid accent inside question card */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_8px] opacity-10 pointer-events-none" />
                        
                        <span className="text-4xl sm:text-5xl tracking-widest filter drop-shadow-[0_0_12px_rgba(251,191,36,0.3)] select-none animate-bounce mb-2 z-10">
                          {currentQuestion.emojis}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest z-10">Анимэний Эможи код</span>
                      </div>

                      {/* Clues & Media Section */}
                      <div className="flex flex-col gap-2 mb-4 z-10">
                        <div className="flex flex-wrap gap-1.5">
                          {/* Standard text hint */}
                          {!showHint ? (
                            <button
                              onClick={() => setShowHint(true)}
                              className="text-[9px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-all cursor-pointer bg-amber-400/5 hover:bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20"
                            >
                              <HelpCircle className="w-3 h-3" /> TEXT CLUE
                            </button>
                          ) : (
                            <div className="w-full text-[10px] font-inter text-amber-300 bg-amber-400/[0.04] border border-amber-400/30 rounded px-2.5 py-1.5 leading-relaxed animate-slide-in mb-1">
                              <strong>💡 CLUE:</strong> {currentQuestion.hint}
                            </div>
                          )}

                          {/* Image Clue with hover unblur */}
                          {currentQuestion.image && !revealImage && (
                            <button
                              onClick={() => setRevealImage(true)}
                              className="text-[9px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer bg-cyan-400/5 hover:bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20"
                            >
                              <Image className="w-3 h-3" /> IMAGE CLUE
                            </button>
                          )}

                          {/* Video Clue (YouTube intro theme) */}
                          {currentQuestion.video && !revealVideo && (
                            <button
                              onClick={() => setRevealVideo(true)}
                              className="text-[9px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 transition-all cursor-pointer bg-red-400/5 hover:bg-red-400/10 px-2 py-1 rounded border border-red-400/20"
                            >
                              <Video className="w-3 h-3" /> 🎵 INTRO CLUE
                            </button>
                          )}
                        </div>

                        {/* Image Clue display */}
                        {revealImage && currentQuestion.image && (
                          <div className="bg-neutral-950 border border-cyan-500/20 rounded-xl p-2 flex flex-col items-center justify-center animate-slide-in relative group overflow-hidden h-48 sm:h-56">
                            <img
                              src={getProxiedImageUrl(currentQuestion.image)}
                              referrerPolicy="no-referrer"
                              alt="Clue Preview"
                              className="h-full object-contain rounded border border-white/5 filter blur-[6px] hover:blur-none active:blur-none transition-all duration-500 cursor-pointer"
                              title="Дарж эсвэл хулганаа аваачиж тодруулна уу!"
                              onClick={(e) => e.currentTarget.classList.toggle('blur-[6px]')}
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src.includes('images.weserv.nl') && currentQuestion.image) {
                                  target.src = currentQuestion.image;
                                } else {
                                  target.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=60";
                                }
                              }}
                            />
                            <div className="absolute bottom-2 right-2 bg-black/85 border border-cyan-400/30 text-[7px] font-mono text-cyan-300 px-1.5 py-0.5 rounded uppercase tracking-wider select-none pointer-events-none">
                              Дарж тодруулна
                            </div>
                          </div>
                        )}

                        {/* Video Trailer display */}
                        {revealVideo && currentQuestion.video && (
                          <div className="w-full bg-neutral-900 border border-red-400/20 rounded p-1 flex flex-col items-center animate-slide-in">
                            <iframe
                              src={currentQuestion.video}
                              title="Anime Intro Theme"
                              className="w-full h-36 rounded border border-white/5"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>

                      {/* Interactive Inputs depending on active Mode */}
                      {gameMode === 'multiple-choice' ? (
                        /* MULTIPLE CHOICE MODE */
                        <div className="space-y-2 mb-2">
                          {shuffledOptions.map((opt, index) => {
                            const isCorrectAnswer = opt === currentQuestion.answer;
                            const isSelected = selectedOption === opt;
                            const isAnswered = selectedOption !== null;

                            let btnStyle = "bg-white/[0.02] border-white/10 hover:border-white/30 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] text-white";

                            if (isAnswered) {
                              if (isSelected) {
                                if (isCorrectAnswer) {
                                  btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]";
                                } else {
                                  btnStyle = "bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-shake";
                                }
                              } else {
                                // Highlight the actual correct answer to let user learn, dim the rest
                                if (isCorrectAnswer) {
                                  btnStyle = "bg-emerald-950/40 border-emerald-600/80 text-emerald-300";
                                } else {
                                  btnStyle = "bg-white/[0.01] border-white/5 text-neutral-500 scale-98";
                                }
                              }
                            }

                            return (
                              <button
                                key={index}
                                disabled={isAnswered}
                                onClick={() => handleAnswerClick(opt)}
                                className={`w-full text-left p-3 rounded-lg border text-xs font-inter leading-relaxed transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-between group ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isAnswered ? (
                                  <div className="flex items-center gap-1.5 font-inter text-[10px] font-bold select-none">
                                    {isCorrectAnswer ? (
                                      isSelected ? (
                                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 animate-pulse">
                                          <Check className="w-3.5 h-3.5 text-emerald-400" /> ЗӨВ
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                          <Check className="w-3.5 h-3.5 text-emerald-400" /> ЗӨВ ХАРИУЛТ
                                        </span>
                                      )
                                    ) : (
                                      isSelected && (
                                        <span className="flex items-center gap-1 text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-400/30">
                                          <X className="w-3.5 h-3.5 text-red-400" /> БУРУУ
                                        </span>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <span className="opacity-0 group-hover:opacity-100 text-neutral-500 font-mono text-[9px] transition-opacity uppercase tracking-wider">
                                    SELECT
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        /* TEXT TYPING INPUT MODE */
                        <div className="space-y-3 mb-2">
                          <form onSubmit={(e) => { e.preventDefault(); submitTypedAnswer(); }} className="relative flex items-center">
                            <input
                              type="text"
                              disabled={isFeedbackState}
                              value={typedAnswer}
                              onChange={(e) => setTypedAnswer(e.target.value)}
                              placeholder="Анимэний нэрийг бичээд Enter дарна уу..."
                              className={`w-full bg-neutral-950 border text-xs sm:text-sm font-inter leading-relaxed p-3.5 pr-12 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all ${
                                isFeedbackState
                                  ? selectedOption === currentQuestion.answer
                                    ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                    : "border-red-500 bg-red-950/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-shake"
                                  : "border-white/10 hover:border-white/30 focus:border-amber-400 focus:ring-amber-400/50 shadow-[0_0_10px_rgba(255,255,255,0.02)]"
                              }`}
                            />
                            <button
                              type="submit"
                              disabled={isFeedbackState || !typedAnswer.trim()}
                              className="absolute right-2 p-2 rounded-md hover:bg-white/5 active:scale-95 text-neutral-400 hover:text-white transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                          <div className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest text-center">
                            Хичээгээрэй! Монгол эсвэл Англиар бичиж болно
                          </div>
                        </div>
                      )}

                      {/* Feedback Overlay Text */}
                      <div className="h-6 flex items-center justify-center text-center">
                        {isFeedbackState && (
                          <span className="animate-slide-in font-mono text-[10px] tracking-widest uppercase">
                            {selectedOption === "" ? (
                              <span className="text-red-400">⏱️ OUT OF TIME! (-1 LIFE)</span>
                            ) : selectedOption === currentQuestion.answer ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1 animate-glow-pulse">
                                <Sparkles className="w-3.5 h-3.5" /> CORRECT! (+10 PTS)
                              </span>
                            ) : (
                              <span className="text-red-400">WRONG ANSWER! (-1 LIFE)</span>
                            )}
                          </span>
                        )}

                        {/* Streak bonus pop up */}
                        {showBonusSparkle && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/60 z-20 animate-slide-in">
                            <div className="text-center p-6 bg-neutral-900 border border-amber-400/30 rounded-xl max-w-[200px] shadow-2xl">
                              <Flame className="w-10 h-10 mx-auto text-orange-500 animate-sparkle" />
                              <h4 className="font-podium text-xs tracking-wider text-white uppercase mt-2">STREAK MULTIPLIER!</h4>
                              <p className="text-[14px] text-amber-300 font-mono font-bold mt-1">+20 BONUS</p>
                            </div>
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* GAME OVER STATE */}
              {animeGameState === 'gameover' && (
                <div className="py-4 text-center animate-slide-in">
                  <div className="mb-4">
                    {lives <= 0 ? (
                      <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                        <Trophy className="w-7 h-7 text-red-500" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <Sparkles className="w-7 h-7 text-emerald-400 animate-bounce" />
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] font-mono tracking-[0.3em] uppercase block mb-1">
                    {lives <= 0 ? "SURVIVAL ENDED" : "MISSION COMPLETED"}
                  </span>
                  <h4 className="font-podium text-xl tracking-widest text-white mb-4">
                    {lives <= 0 ? "GAME OVER" : "VICTORY!"}
                  </h4>

                  {/* Score Board Card */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center space-y-2 mb-6">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Final Stats Summary</p>
                    <div className="grid grid-cols-2 gap-4 text-left pt-2 border-t border-white/5">
                      <div className="bg-white/[0.01] p-2.5 rounded border border-white/5">
                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider block">Your Score</span>
                        <strong className="text-base font-inter text-white">{animeScore} pts</strong>
                      </div>
                      <div className="bg-white/[0.01] p-2.5 rounded border border-white/5">
                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider block">Cabinet Record</span>
                        <strong className="text-base font-inter text-amber-300">{animeHighScore} pts</strong>
                      </div>
                    </div>

                    {animeScore >= animeHighScore && animeScore > 0 && (
                      <div className="mt-3 bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-mono py-1.5 rounded uppercase tracking-wider flex items-center justify-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-300 animate-pulse" /> NEW HIGH SCORE RECORDED!
                      </div>
                    )}
                  </div>

                  {/* Buttons Row */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <button 
                      onClick={startAnimeGame}
                      className="bg-white text-black hover:bg-neutral-200 active:scale-95 px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-inter font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> REPLAY
                    </button>
                    <button 
                      onClick={() => setCurrentGame(null)}
                      className="bg-white/10 text-white hover:bg-white/15 active:scale-95 px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-inter tracking-widest uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border border-white/10"
                    >
                      EXIT LOBBY
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-[10px] text-center text-neutral-500 font-mono mt-3 max-w-[280px]">
            *Developed completely in-house with standard React hooks and programmatic sound generation algorithms.
          </div>
        </div>
      )}
    </div>
  );
}
