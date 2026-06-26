import React from 'react';
import { Crown, Gamepad2, Heart, Music, Sparkles } from 'lucide-react';

interface ProfilePanelProps {
  onClose: () => void;
}

export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const skills = ["React", "TypeScript", "Tailwind CSS", "Vite", "Unity / WebGL", "Pixel Art", "UI Design"];
  
  return (
    <div className="text-white h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* Bio Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500/20 via-black to-emerald-500/20 flex items-center justify-center border border-white/20 shadow-xl overflow-hidden group">
            <img 
              src="/src/assets/images/enkh_amgalan_avatar_1782281477031.jpg" 
              alt="Enkh-amgalan Avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-full border border-black">
            <Crown className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-podium text-xl tracking-wider text-white">Enkh-amgalan</h3>
            <span className="bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full font-inter tracking-widest uppercase">Нас 15</span>
          </div>
          <p className="text-xs text-white/50 tracking-wider font-inter mt-1">CREATIVE DEVELOPER & GAMER</p>
        </div>
      </div>

      {/* Premium Minecraft 3D Voxel Avatar Card */}
      <div className="mb-6 relative overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 p-4 shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Avatar Image container */}
          <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/50 group flex items-center justify-center">
            <img 
              src="/src/assets/images/enkh_amgalan_avatar_1782281477031.jpg" 
              alt="3D Minecraft Character Avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest text-emerald-400 border border-emerald-500/30">
              3D_VOXEL
            </div>
          </div>

          {/* Details */}
          <div className="w-full sm:w-3/5 space-y-2 font-mono">
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest">AVATAR ID</span>
              <span className="text-[10px] text-white font-semibold">EA-15-MGL</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest">ROLE CLASS</span>
              <span className="text-[10px] text-white font-semibold">VANGUARD CREATOR</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest">HOBBY STATUS</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PLAYING_GAMES
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest">SONG PAIRING</span>
              <span className="text-[9px] text-violet-400 font-semibold truncate max-w-[120px]" title="Arctic Monkeys">
                ARCTIC MONKEYS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quote / Manifesto */}
      <div className="border-l-2 border-white/30 pl-4 py-1 mb-8 animate-fade-in">
        <p className="font-inter text-sm text-neutral-300 italic leading-relaxed">
          "Би бол тоглоом тоглох, мөрөөдлийнхөө дижитал ертөнцийг кодлох дуртай 15 настай девелопер. Vanguard-ийн хурц өнгө аястай, ирээдүйг чиглэсэн технологиудыг суралцах эрмэлзэлтэй."
        </p>
      </div>

      {/* About Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-lg hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <Gamepad2 className="w-4 h-4 text-white" />
            <h4 className="font-inter text-xs tracking-wider uppercase font-semibold">Миний Хобби (Hobby)</h4>
          </div>
          <p className="font-inter text-xs text-neutral-400 leading-relaxed">
            Тоглоом тоглох болон дизайн хийх. Төрөл бүрийн сонирхолтой ертөнцийг судалж, өөрийн гэсэн тоглоомыг шинээр бүтээхийг зорьдог.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-lg hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <Music className="w-4 h-4 text-white" />
            <h4 className="font-inter text-xs tracking-wider uppercase font-semibold">Сонсох дуртай (Band)</h4>
          </div>
          <p className="font-inter text-xs text-neutral-400 leading-relaxed">
            <strong className="text-white">Arctic Monkeys</strong> хамтлагийн идэвхтэй сонсогч. Тэдний хэмнэл, гитарын гоцлол нь миний код бичих шилдэг хамтрагч болдог.
          </p>
        </div>
      </div>

      {/* Tech Stack Skills */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-white/60" />
          <h4 className="font-podium text-sm tracking-wider uppercase text-white/90">Skills & Tech Stack</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span 
              key={skill}
              className="font-inter text-xs bg-white/5 border border-white/10 hover:border-white/30 px-3 py-1.5 rounded text-neutral-300 hover:text-white transition-all cursor-default"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Aspirations */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-lg flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-white fill-white/20 animate-pulse" />
          <h4 className="font-inter text-xs tracking-widest uppercase font-bold text-white">Мөрөөдлийн зорилго</h4>
        </div>
        <p className="font-inter text-xs text-neutral-400 leading-normal">
          Хамгийн өндөр чанартай, идэвхтэй сонирхолтой тоглоомуудыг бие даан гаргаж, Монголын тоглоом хөгжүүлэлтийн салбарт Vanguard (анхдагч) болох.
        </p>
      </div>
    </div>
  );
}
