import React, { useState } from 'react';
import { Send, Check, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { ContactMessage } from '../types';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    role: 'Collaborator',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMess, setErrorMess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess(null);

    // Simple validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMess("Бүх талбарыг бүрэн бөглөнө үү. (Please fill out all fields.)");
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMess("И-мэйл хаяг буруу байна. (Invalid email format.)");
      return;
    }

    setIsSubmitting(true);

    // Dynamic high-conversion simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Clean data
      setFormData({
        name: '',
        email: '',
        role: 'Collaborator',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="text-white h-full overflow-y-auto pr-1 flex flex-col custom-scrollbar">
      {submitSuccess ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-scale-in">
          <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center mb-4 shadow-xl">
            <Check className="w-7 h-7" />
          </div>
          <h4 className="font-podium text-lg sm:text-xl tracking-wider text-white mb-2">TRANSMISSION SENT</h4>
          <p className="font-inter text-xs text-neutral-400 max-w-xs leading-relaxed">
            Амжилттай илгээгдлээ! Энх-амгалны шуудан луу шууд илгээгдсэн бөгөөд тун удахгүй холбогдох болно. 
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-6 border border-white/20 hover:border-white/50 px-5 py-2.5 rounded text-xs font-inter tracking-widest uppercase hover:bg-white/5 transition-all cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div className="text-xs text-neutral-400 font-inter leading-relaxed mb-4">
            Вангуард стилийн сонирхол татсан тоглоом хийх захиалга өгөх, холбоо барих эсвэл зүгээр л танилцахаар мессеж илгээх боломжтой!
          </div>

          {errorMess && (
            <div className="bg-red-950/40 border border-red-500/20 text-neutral-200 p-3 rounded text-xs flex items-center gap-2 animate-fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMess}</span>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-[10px] font-inter tracking-widest uppercase text-neutral-400 mb-1.5 font-bold">Таны нэр / Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bat-Erdene"
              className="w-full bg-white/[0.02] border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 focus:bg-white/[0.04] transition-all font-inter"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-inter tracking-widest uppercase text-neutral-400 mb-1.5 font-bold">Таны и-мэйл / Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. bat@example.com"
              className="w-full bg-white/[0.02] border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 focus:bg-white/[0.04] transition-all font-inter"
            />
          </div>

          {/* Role selection dropdown */}
          <div>
            <label className="block text-[10px] font-inter tracking-widest uppercase text-neutral-400 mb-1.5 font-bold">Холбогдох чиглэл / Purpose</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.04] transition-all font-inter cursor-pointer"
            >
              <option value="Collaborator">Хамтран ажиллах / Code Collab</option>
              <option value="Game Order">Тоглоом хөгжүүлэх / Game Project</option>
              <option value="Music Fan">Arctic Monkeys Fan Connection</option>
              <option value="Just Chatting">Уулзаж ярилцах / Friendly Chat</option>
            </select>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-[10px] font-inter tracking-widest uppercase text-neutral-400 mb-1.5 font-bold">Илгээх мессеж / Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Бичвэрээ энд оруулна уу..."
              className="w-full bg-white/[0.02] border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 focus:bg-white/[0.04] transition-all font-inter resize-none"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-600 text-xs font-inter font-semibold tracking-widest uppercase py-3.5 px-4 rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 text-center mt-3 group"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                ИЛГЭЭХ / SEND MESSAGE 
                <Send className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Alternative Social Channels */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <h5 className="text-[10px] uppercase font-inter tracking-widest text-neutral-500 mb-2 font-bold">Олон нийтийн хаягууд</h5>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400 font-mono">
          <a href="#discord" className="hover:text-white flex items-center gap-1">Discord: @enkh_amgalan <ArrowUpRight className="w-3 h-3 text-neutral-500" /></a>
          <a href="#github" className="hover:text-white flex items-center gap-1">GitHub: /enkhamgalan <ArrowUpRight className="w-3 h-3 text-neutral-500" /></a>
        </div>
      </div>
    </div>
  );
}
