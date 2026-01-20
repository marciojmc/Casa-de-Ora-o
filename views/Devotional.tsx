
import React, { useState } from 'react';
import { generateDevotional } from '../services/geminiService';
import { Sparkles, Share2, Heart, RefreshCcw } from 'lucide-react';

const THEMES = ['Fé', 'Família', 'Ansiedade', 'Propósito', 'Oração', 'Perdão'];

export const DevotionalView: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('Fé');
  const [devotional, setDevotional] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchNew = async (theme: string) => {
    setLoading(true);
    try {
      const data = await generateDevotional(theme);
      setDevotional(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNew(selectedTheme);
  }, []);

  return (
    <div className="p-8 space-y-8 bg-transparent">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-xl">Devocionais</h1>
          <p className="text-orange-400 text-xs font-black uppercase tracking-widest mt-1">Alimento para alma</p>
        </div>
        <button 
          onClick={() => fetchNew(selectedTheme)}
          className="p-3 bg-white/10 rounded-2xl border border-white/10 text-white active:rotate-90 transition-transform"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </header>

      {/* Themes horizontal scroll */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
        {THEMES.map(theme => (
          <button
            key={theme}
            onClick={() => { setSelectedTheme(theme); fetchNew(theme); }}
            className={`px-6 py-3 rounded-2xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${
              selectedTheme === theme 
                ? 'bg-orange-600 text-white shadow-[0_10px_25px_rgba(234,88,12,0.4)] scale-105 border border-orange-500' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Devotional Card - Glass */}
      <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-400 animate-pulse" />
            </div>
            <p className="text-orange-400 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Preparando Edificação...</p>
          </div>
        ) : devotional ? (
          <div className="animate-in slide-in-from-bottom-12 duration-700">
            <div className="h-48 relative overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop" 
                alt="Bible study" 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
              <Sparkles className="w-24 h-24 text-white/20 relative z-10" />
            </div>
            
            <div className="p-10 -mt-16 relative z-10">
              <h2 className="text-3xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-xl">{devotional.title}</h2>
              <div className="bg-black/40 backdrop-blur-xl text-orange-200 px-6 py-5 rounded-[2rem] mb-8 text-sm italic font-serif leading-relaxed border border-white/10 shadow-2xl">
                "{devotional.verse}"
              </div>
              <div className="prose prose-invert prose-sm text-white/80 leading-[1.8] whitespace-pre-wrap font-medium">
                {devotional.content}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                <button className="flex items-center space-x-3 text-white/50 hover:text-rose-500 transition-colors group px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                  <Heart className="w-5 h-5 group-hover:fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Favoritar</span>
                </button>
                <button className="flex items-center space-x-3 text-orange-400 px-6 py-2 bg-white/10 rounded-xl border border-white/10 font-black active:scale-95 transition-all shadow-xl">
                  <Share2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center flex items-center justify-center h-full">
            <button 
              onClick={() => fetchNew(selectedTheme)}
              className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl active:scale-95 transition-all"
            >
              Iniciar Devocional
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
