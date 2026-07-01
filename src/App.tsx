/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Award, Crown, X, Sliders, Check } from 'lucide-react';
import ProfilePanel from './components/ProfilePanel';
import GamesCabinet from './components/GamesCabinet';
import MusicWidget from './components/MusicWidget';
import ContactForm from './components/ContactForm';
import AIChat from './components/AIChat';

type SectionType = 'profile' | 'games' | 'music' | 'contact' | 'ai';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);

  // Background Customization States
  const [bgVibe, setBgVibe] = useState<'charcoal' | 'purple' | 'cyan' | 'gold' | 'green'>('charcoal');
  const [brightness, setBrightness] = useState<number>(80);
  const [showGrid, setShowGrid] = useState(true);
  const [showScanlines, setShowScanlines] = useState(false);
  const [showGrain, setShowGrain] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  // Staggered menu items matching Enkh-amgalan's portfolio:
  const navItems = [
    { id: 'profile' as SectionType, label: 'Profile', desc: 'Би хэн бэ' },
    { id: 'games' as SectionType, label: 'Games', desc: 'Миний тоглоомууд' },
    { id: 'music' as SectionType, label: 'Music', desc: 'Дуртай хамтлаг' },
    { id: 'ai' as SectionType, label: 'AI Helper', desc: 'AI-тай ярилцах' },
    { id: 'contact' as SectionType, label: 'Contact', desc: 'Холбоо барих' }
  ];

  const handleNavClick = (sectionId: SectionType) => {
    setActiveSection(sectionId);
    setMenuOpen(false);
  };

  const closeSection = () => {
    setActiveSection(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-inter select-none bg-black">
      {/* 1. Fullscreen Looping Background Video with Custom Brightness */}
      <video
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all duration-700"
        style={{ filter: `brightness(${brightness}%)` }}
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4" type="video/mp4" />
      </video>

      {/* 2. Sleek overlay for high-contrast readability with customizable colors */}
      <div className={`absolute inset-0 z-1 pointer-events-none transition-all duration-700 ${
        bgVibe === 'charcoal' ? 'bg-gradient-to-t from-black via-black/40 to-black/75' :
        bgVibe === 'purple' ? 'bg-gradient-to-tr from-purple-950/85 via-black/30 to-violet-950/65' :
        bgVibe === 'cyan' ? 'bg-gradient-to-br from-cyan-950/85 via-black/40 to-blue-950/60' :
        bgVibe === 'gold' ? 'bg-gradient-to-t from-stone-950/90 via-black/45 to-amber-950/50' :
        'bg-gradient-to-b from-neutral-950 via-emerald-950/40 to-black/85'
      }`} />

      {/* 2b. Upper Area Header Vignette (дээд тал) - Ensures absolute high-contrast styling for logo and tabs with premium dynamic glow */}
      <div className="absolute top-0 left-0 right-0 h-48 z-1 pointer-events-none overflow-hidden select-none">
        {/* Dynamic laser thin neon bar at the absolute top */}
        <div className={`absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-1000 ${
          bgVibe === 'charcoal' ? 'bg-white/20' :
          bgVibe === 'purple' ? 'bg-violet-500/50 shadow-[0_1px_10px_2px_rgba(139,92,246,0.3)]' :
          bgVibe === 'cyan' ? 'bg-cyan-400/50 shadow-[0_1px_10px_2px_rgba(34,211,238,0.3)]' :
          bgVibe === 'gold' ? 'bg-amber-400/50 shadow-[0_1px_10px_2px_rgba(251,191,36,0.3)]' :
          'bg-emerald-400/50 shadow-[0_1px_10px_2px_rgba(52,211,153,0.3)]'
        }`} />
        
        {/* Ambient background light flare centered at the top */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-36 rounded-full filter blur-[70px] opacity-15 transition-all duration-1000 pointer-events-none ${
          bgVibe === 'charcoal' ? 'bg-white/10' :
          bgVibe === 'purple' ? 'bg-violet-600' :
          bgVibe === 'cyan' ? 'bg-cyan-500' :
          bgVibe === 'gold' ? 'bg-amber-500' :
          'bg-emerald-500'
        }`} />

        {/* Deep, rich overlay fading from dark to clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/45 to-transparent border-b border-white/[0.03] backdrop-blur-[0.5px]" />
      </div>

      {/* 2c. Custom interactive overlays: Scanlines & Film Grain */}
      {showScanlines && (
        <div className="absolute inset-0 z-2 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-15" />
      )}
      {showGrain && (
        <div className="absolute inset-0 z-2 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
      )}

      {/* 3. Static/Interactive HUD Grid elements (design accent for vanguard theme) */}
      {showGrid && (
        <div className="absolute inset-0 z-1 opacity-10 pointer-events-none hidden lg:block">
          <div className="w-full h-full border border-white/5 grid grid-cols-4 grid-rows-4">
            {[...Array(16)].map((_, idx) => (
              <div key={idx} className="border border-white/5 relative">
                {idx === 0 && <span className="absolute top-2 left-2 text-[8px] tracking-widest font-mono text-white/50">SYS_VANGUARD_V1.15</span>}
                {idx === 3 && <span className="absolute top-2 right-2 text-[8px] tracking-widest font-mono text-white/40">HUD_BG_ACTIVE</span>}
                {idx === 12 && <span className="absolute bottom-2 left-2 text-[8px] tracking-widest font-mono text-white/40">ALT_47.91°_N</span>}
                {idx === 15 && <span className="absolute bottom-2 right-2 text-[8px] tracking-widest font-mono text-white/50">MGL_UBN_621</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Main Nav Container */}
      <nav className="relative z-30 w-full flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 lg:py-7">
        {/* Left: Brand logo */}
        <div 
          onClick={closeSection} 
          className="font-podium text-white bold uppercase text-2xl sm:text-3xl tracking-wider cursor-pointer hover:opacity-80 transition-opacity select-none leading-none flex items-center gap-1"
        >
          VANGUARD
        </div>

        {/* Center: Interactive Nav Items (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-inter text-xs tracking-widest uppercase transition-all duration-300 relative py-1 cursor-pointer group ${
                activeSection === item.id 
                  ? 'text-white font-semibold' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="block">{item.label}</span>
              <span className="block text-[8px] text-neutral-500 font-mono tracking-normal leading-tight group-hover:text-white/40 transition-colors">{item.desc}</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-white transition-all duration-300 ${
                activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
        </div>

        {/* Right: Get In Touch (desktop / md+) */}
        <div className="hidden md:block">
          <button
            onClick={() => handleNavClick('contact')}
            className={`font-inter flex items-center gap-2 border px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
              activeSection === 'contact'
                ? 'bg-white text-black border-white'
                : 'border-white/30 text-white hover:border-white/60 hover:bg-white/10'
            }`}
          >
            GET IN TOUCH
            <ArrowUpRight className="w-3.5 h-3.5 text-current" />
          </button>
        </div>

        {/* Right: Hamburger Button (mobile / below md) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col justify-center items-end gap-1.5 p-2 focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-white transition-transform duration-300" />
          <div className="w-6 h-0.5 bg-white transition-transform duration-300" />
          <div className="w-4 h-0.5 bg-white transition-transform duration-300" />
        </button>
      </nav>

      {/* 5. Mobile Menu Overlay (below md only) */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between transition-all duration-500 ease-in-out md:hidden ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="font-podium text-white bold uppercase text-2xl tracking-wider">
            VANGUARD
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu links - centered vertically */}
        <div className="flex flex-col items-center justify-center gap-6 px-6">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="group text-center cursor-pointer focus:outline-none"
              style={{
                transitionDelay: `${i * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transitionProperty: 'opacity, transform',
                transitionDuration: '500s' // handled by custom classes or CSS transitions
              }}
            >
              <span className="font-podium text-4xl sm:text-5xl text-white uppercase tracking-widest block group-hover:opacity-85 transition-opacity">
                {item.label}
              </span>
              <span className="font-inter text-xs tracking-widest text-neutral-500 uppercase block mt-1">
                {item.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Action Button */}
        <div className="px-6 py-10 flex justify-center">
          <button
            onClick={() => handleNavClick('contact')}
            className="font-inter flex items-center justify-center gap-2 border border-white/30 text-white w-full max-w-sm py-4 text-xs tracking-widest uppercase hover:bg-white/10 active:bg-white/20 transition-all rounded"
            style={{
              transitionDelay: `${navItems.length * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionProperty: 'opacity, transform'
            }}
          >
            GET IN TOUCH
            <ArrowUpRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 6. Dynamic Main Grid Layout containing Hero Content and interactive Side Panels */}
      <main className="relative z-10 w-full h-[calc(100vh-80px)] flex flex-col md:flex-row items-center px-6 sm:px-10 lg:px-16 pb-8 md:pb-12">
        
        {/* Left Section: Infinite Vanguard Hero Copy */}
        <div className={`w-full h-full flex flex-col justify-center transition-all duration-500 ease-in-out ${
          activeSection ? 'md:w-[45%] opacity-40 md:opacity-100 hidden md:flex' : 'w-full'
        }`}>
          {/* Tagline / Founder Identity Block with Avatar */}
          <div className="animate-fade-up flex items-center gap-4 mb-6 lg:mb-8 select-none">
            <div 
              className="relative group cursor-pointer active:scale-95 transition-transform duration-200" 
              onClick={() => handleNavClick('profile')}
            >
              <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden bg-gradient-to-tr from-violet-500/20 via-black to-emerald-500/20 ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-300 shadow-xl">
                <img 
                  src="/src/assets/images/enkh_amgalan_avatar_1782281477031.jpg" 
                  alt="Enkh-amgalan Minecraft Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white text-black p-0.5 rounded-full border border-black shadow">
                <Crown className="w-3 h-3" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[9px] font-mono uppercase tracking-widest leading-none mb-1">FOUNDER & DEVELOPER</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="text-white text-sm sm:text-base font-inter tracking-wide font-semibold hover:text-white/80 transition-colors cursor-pointer" 
                  onClick={() => handleNavClick('profile')}
                >
                  Enkh-amgalan
                </span>
                <span className="text-white/20 text-xs hidden sm:inline">•</span>
                <span className="text-white/60 text-xs font-inter uppercase tracking-[0.1em] text-[10px] hidden sm:inline">
                  World-Class Digital Collective
                </span>
              </div>
            </div>
          </div>

          {/* Main Display Heading */}
          <h1 className="animate-fade-up-delay-1 font-podium text-white uppercase leading-[0.92] tracking-tight text-[clamp(2.5rem,7.5vw,6rem)] flex flex-col mb-4">
            <span>Design.</span>
            <span>Disrupt.</span>
            <span>Conquer.</span>
          </h1>

          {/* Subtext description with dynamic highlight */}
          <p className="animate-fade-up-delay-2 text-white/70 text-xs sm:text-sm lg:text-base font-inter leading-relaxed max-w-md mt-4">
            We build fierce brand identities<br />
            that don't just turn heads — <strong className="text-white">they lead.</strong>
          </p>

          {/* Call To Action buttons Row */}
          <div className="animate-fade-up-delay-3 mt-8 lg:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => handleNavClick('games')}
              className="group font-inter flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-widest uppercase transition-all duration-300 font-semibold cursor-pointer shadow-2xl hover:scale-[1.02]"
            >
              SEE MY WORK
              <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>

            {/* Award badge */}
            <div className="hidden sm:flex items-center gap-3 border-l border-white/20 pl-5">
              <Award className="w-8 h-8 text-white/50" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white tracking-widest font-bold">TOP-RATED</span>
                <span className="text-[9px] text-white/50 tracking-wider font-mono">CREATIVE CODER</span>
              </div>
            </div>
          </div>

          {/* Metric Stats Section */}
          <div className="animate-fade-up-delay-4 mt-8 sm:mt-10 lg:mt-14 flex flex-wrap gap-8 sm:gap-12 lg:gap-16">
            <div>
              <div className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">15 Y/O</div>
              <div className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">Enkh-amgalan Age</div>
            </div>
            <div>
              <div className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">95%</div>
              <div className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">Reflex Rate</div>
            </div>
            <div>
              <div className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">100+</div>
              <div className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">Hours Codified</div>
            </div>
          </div>
        </div>

        {/* Right Section: Active Slide Over Modal Cards with extreme aesthetic styling */}
        {activeSection && (
          <div className="w-full md:w-[55%] h-full flex items-center justify-center md:justify-end animate-scale-in z-20">
            <div className="w-full max-w-lg h-[92%] sm:h-[88%] bg-neutral-950/90 border border-white/10 p-6 sm:p-8 rounded-xl flex flex-col relative shadow-2xl backdrop-blur-md">
              
              {/* Card Header row with dynamic title */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5 flex-shrink-0">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase leading-none">VANGUARD INITIATIVE</span>
                  <h2 className="font-podium text-xl tracking-wider text-white uppercase mt-1.5">
                    {activeSection === 'profile' && 'PROFILE_CARD'}
                    {activeSection === 'games' && 'ARCADE_CABINET'}
                    {activeSection === 'music' && 'PLAYLIST_TRIBUTE'}
                    {activeSection === 'ai' && 'AI_PORTFOLIO_HELPER'}
                    {activeSection === 'contact' && 'INQUIRE_TRANSMIT'}
                  </h2>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={closeSection}
                  className="p-1 px-2.5 py-1 text-white/50 hover:text-white hover:bg-white/5 border border-white/10 rounded transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-mono"
                  aria-label="Close section"
                >
                  ESC <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Sub-renderer based on active section */}
              <div className="flex-1 overflow-hidden">
                {activeSection === 'profile' && <ProfilePanel onClose={closeSection} />}
                {activeSection === 'games' && <GamesCabinet />}
                {activeSection === 'music' && <MusicWidget />}
                {activeSection === 'ai' && <AIChat />}
                {activeSection === 'contact' && <ContactForm />}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 7. Subtle corner metadata logs for high-fidelity designer polish */}
      <div className="absolute bottom-3 left-6 z-10 text-[8px] font-mono text-white/30 space-x-4 hidden lg:block">
        <span>LOC: EN-AM_MGL</span>
        <span>STATUS: LIVE</span>
        <span>ENGINE: REACT_VITE_TW4</span>
      </div>

      {/* 8. Modern Background Customizer HUD (conversion-focused designer feature) */}
      <div className="absolute bottom-3 right-6 z-30 font-mono text-xs">
        <button
          onClick={() => setConfigOpen(!configOpen)}
          className="bg-neutral-950/85 hover:bg-neutral-900 border border-white/10 hover:border-white/30 text-white/50 hover:text-white px-3 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer leading-none uppercase text-[9px] tracking-widest active:scale-95"
        >
          <Sliders className="w-3 h-3 text-white" />
          <span>BG_SETTING : {bgVibe.toUpperCase()}</span>
        </button>

        {configOpen && (
          <div className="absolute bottom-9 right-0 w-64 bg-neutral-950/95 border border-white/15 p-4 rounded-lg shadow-2xl backdrop-blur-md animate-scale-in text-white space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] tracking-widest font-bold uppercase text-neutral-400">Background Vibe</span>
              <button onClick={() => setConfigOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vibe Selection chips */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold font-mono">Presets</span>
              <div className="grid grid-cols-2 gap-1 font-inter">
                {(['charcoal', 'purple', 'cyan', 'gold', 'green'] as const).map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setBgVibe(vibe)}
                    className={`px-2 py-1.5 rounded text-[10px] text-left transition-all flex items-center justify-between cursor-pointer ${
                      bgVibe === vibe
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <span className="capitalize">{vibe}</span>
                    {bgVibe === vibe && <Check className="w-3 h-3 text-black font-bold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brightness Adjustment */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-neutral-500 uppercase tracking-widest font-bold font-mono">
                <span>Intensity</span>
                <span className="text-white">{brightness}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Interactive Overlays */}
            <div className="space-y-2 border-t border-white/5 pt-2">
              <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest block font-bold mb-1">Overlays</span>
              
              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded border-white/15 bg-neutral-900 text-white focus:ring-0 w-3 h-3 cursor-pointer"
                />
                <span className="font-mono text-[9px] tracking-wider">HUD GRID LINES</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showScanlines}
                  onChange={(e) => setShowScanlines(e.target.checked)}
                  className="rounded border-white/15 bg-neutral-900 text-white focus:ring-0 w-3 h-3 cursor-pointer"
                />
                <span className="font-mono text-[9px] tracking-wider">CRT SCANLINES</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showGrain}
                  onChange={(e) => setShowGrain(e.target.checked)}
                  className="rounded border-white/15 bg-neutral-900 text-white focus:ring-0 w-3 h-3 cursor-pointer"
                />
                <span className="font-mono text-[9px] tracking-wider">FILM GRAIN NOISE</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
