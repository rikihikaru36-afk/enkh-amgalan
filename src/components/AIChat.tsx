import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Trash2, Bot, User, ArrowRight, Music, Gamepad2, Mic } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type CharacterType = 'enkh_amgalan' | 'alex_turner';

export default function AIChat() {
  const [character, setCharacter] = useState<CharacterType>('enkh_amgalan');
  
  const getInitialMessage = (char: CharacterType): Message => {
    if (char === 'alex_turner') {
      return {
        role: 'assistant',
        content: "Alright, mate? Үг бүрийг чинь сонслоо. Заримдаа энэ дэлхий хэтэрхий хурдан эргэлдэж, бүх зүйл чамаас түрүүлээд гүйчихэж байгаа юм шиг санагддаг уу? Хүн бүр чамаас ямар нэгэн зүйл хүлээгээд, харин чи тэр дунд өөрийнхөө дуу хоолойг хайж ядаж байна уу? Нааш суу, би чамд нэг зүйл ярьж өгье. 🎸🎸\n\nБиднийг анх Шэффилдийн нэгэн жижигхэн пабад гитараа бариад зогсож байхад хэн ч биднийг 'рок одод' болно гэж бодоогүй. Би зүгээр л өөрийнхөө харсан, мэдэрсэн зүйлсээ цаасан дээр буулгаж, түүнийгээ хөгжим болгохыг хүссэн нэгэн байлаа. Чамд уран бүтээлийн түүх, амьдралын зөвлөгөө, эсвэл рок-н-роллын тухай юу ярьж өгөх үү?",
        timestamp: new Date()
      };
    }
    return {
      role: 'assistant',
      content: "Сайн уу! Би бол Enkh-amgalan-ий AI туслах байна. Надаас түүний сонирхол, тоглоом хөгжүүлэлтийн төслүүд, эсвэл дуртай Arctic Monkeys хамтлагийнх нь талаар юу ч хамаагүй асуугаарай. Танд туслахдаа таатай байх болно! 🎮🎸",
      timestamp: new Date()
    };
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage('enkh_amgalan')]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle character switch
  const handleCharacterChange = (newChar: CharacterType) => {
    setCharacter(newChar);
    setMessages([getInitialMessage(newChar)]);
    setError(null);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: history,
          character: character 
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Сервер холбогдоход алдаа гарлаа: ${response.status}`);
      }

      const data = await response.json();
      setIsFallback(!!data.isFallback);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }]);

    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  const clearChat = () => {
    if (window.confirm("Ярианы түүхийг устгах уу?")) {
      setMessages([getInitialMessage(character)]);
      setError(null);
    }
  };

  const suggestions = character === 'alex_turner' ? [
    "Өөрийнхөө түүхийг өөрөө бич гэж юу гэсэн үг вэ?",
    "Өөрчлөлтөөс бүү ай гэдэг жишээгээ яриач?",
    "505 дууны түүхээс хуваалцаач?",
    "Амьдралын зөвлөгөө өгөөч, Алекс"
  ] : [
    "Энх-амгалангийн тухай ярьж өгөөч?",
    "Ямар тоглоомууд тоглох дуртай вэ?",
    "Arctic Monkeys-ийн 505 дууны юунд нь дуртай вэ?",
    "Түүний мөрөөдөл юу вэ?"
  ];

  return (
    <div className="flex flex-col h-full text-white font-inter" id="ai-chat-widget">
      {/* Engine Status Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">AI_ENGINE_CORE</span>
        </div>
        <div className="flex items-center gap-2">
          {isFallback === true ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-neutral-900 border border-amber-500/30 text-amber-400" title="Gemini API Key is not configured yet. Running on local expert responder.">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              LOCAL_VANGUARD
            </span>
          ) : isFallback === false ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-neutral-900 border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              GEMINI_ONLINE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-neutral-900 border border-white/10 text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" />
              STANDBY
            </span>
          )}
        </div>
      </div>

      {/* Premium Studio Controller Character Selector Switch */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-950/80 border border-white/5 rounded-lg mb-4">
        <button
          onClick={() => handleCharacterChange('enkh_amgalan')}
          className={`flex items-center justify-center gap-2 py-1.5 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
            character === 'enkh_amgalan'
              ? 'bg-neutral-800 text-emerald-400 border border-white/5 shadow-inner shadow-black/40'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Enkh-amgalan AI</span>
        </button>
        <button
          onClick={() => handleCharacterChange('alex_turner')}
          className={`flex items-center justify-center gap-2 py-1.5 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
            character === 'alex_turner'
              ? 'bg-neutral-800 text-amber-400 border border-white/5 shadow-inner shadow-black/40'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Alex Turner AI</span>
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4 pb-2">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar badge */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 text-xs ${
              msg.role === 'user' 
                ? 'bg-neutral-800 border-white/20 text-white' 
                : character === 'alex_turner'
                  ? 'bg-amber-950/40 border-amber-500/20 text-amber-400'
                  : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : character === 'alex_turner' ? (
                <Mic className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Message balloon */}
            <div className={`rounded-xl p-3 text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-white/10 text-white rounded-tr-none' 
                : 'bg-neutral-900 border border-white/5 text-neutral-200 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="block text-[8px] text-neutral-500 font-mono mt-1.5 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 text-xs ${
              character === 'alex_turner' ? 'bg-amber-950/40 border-amber-500/20 text-amber-400' : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
            }`}>
              {character === 'alex_turner' ? <Mic className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className="bg-neutral-900 border border-white/5 rounded-xl p-3 text-xs rounded-tl-none flex items-center gap-2 text-neutral-400">
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${character === 'alex_turner' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="font-mono text-[10px] tracking-widest uppercase animate-pulse">
                {character === 'alex_turner' ? 'ALEX_RESPONDING...' : 'EA_AI_RESPONDING...'}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-lg text-xs text-red-300">
            <strong>Системийн алдаа:</strong> {error}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="mb-4 space-y-2">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">САНАЛ БОЛГОХ АСУУЛТУУД:</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-neutral-300 px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 group text-left"
              >
                <span>{sug}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-white shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls block */}
      <div className="flex items-center gap-2 border-t border-white/10 pt-4 flex-shrink-0">
        <button
          onClick={clearChat}
          title="Ярианы түүхийг устгах"
          className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/30 rounded-lg text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={character === 'alex_turner' ? "Ask Alex Turner..." : "Энд асуултаа бичнэ үү..."}
            className="w-full bg-neutral-950 border border-white/10 hover:border-white/20 focus:border-white/40 focus:ring-0 focus:outline-none rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 font-inter pr-10 transition-colors"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded transition-all ${
              inputValue.trim() && !isLoading
                ? character === 'alex_turner'
                  ? 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
