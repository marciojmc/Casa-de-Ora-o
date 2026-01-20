
import React, { useState, useEffect } from 'react';
import { generateDailyPause } from '../services/geminiService';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';

export const DailyPauseView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const fetchPause = async () => {
    setLoading(true);
    try {
      const res = await generateDailyPause();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPause();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 space-y-6">
        <div className="relative">
           <Clock className="w-20 h-20 text-orange-400 animate-pulse" />
           <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full"></div>
        </div>
        <h2 className="text-2xl font-black text-white text-center tracking-tight">Preparando sua Pausa Diária...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8 flex flex-col bg-transparent">
      <header className="mb-12 flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Pausa Diária</h1>
          <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest">A sós com Deus</p>
        </div>
        <button onClick={fetchPause} className="p-3 bg-white/10 text-white rounded-2xl hover:rotate-180 transition-transform duration-700">
          <RefreshCw className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 space-y-12 flex flex-col justify-center">
        {/* Step 1: Verse */}
        <div className="space-y-4 animate-in slide-in-from-left duration-500 bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400 bg-black/30 px-3 py-1.5 rounded-lg">Passo 1: Meditar</span>
          <p className="text-3xl font-serif italic text-white leading-[1.3] drop-shadow-xl">
            "{data?.verse}"
          </p>
          <p className="text-xs font-black text-orange-300/60 uppercase tracking-widest">{data?.reference}</p>
        </div>

        {/* Step 2: Reflection */}
        <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-200 bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400 bg-black/30 px-3 py-1.5 rounded-lg">Passo 2: Refletir</span>
          <p className="text-lg text-white font-medium leading-relaxed">
            {data?.reflection}
          </p>
        </div>

        {/* Step 3: Action */}
        <div className="space-y-4 animate-in slide-in-from-left duration-1000 delay-500 bg-orange-600/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-orange-500/30">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400 bg-black/30 px-3 py-1.5 rounded-lg">Passo 3: Praticar</span>
          <p className="text-xl font-black text-white leading-tight">
            {data?.question}
          </p>
        </div>
      </div>

      <button 
        onClick={() => setCompleted(true)}
        className={`mt-12 w-full py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all duration-500 shadow-2xl ${
          completed ? 'bg-green-600 text-white scale-95 opacity-80' : 'bg-orange-600 text-white shadow-orange-600/30'
        }`}
      >
        {completed ? (
          <>
            <CheckCircle className="w-6 h-6" />
            <span>Pausa Concluída!</span>
          </>
        ) : (
          <span>Concluir Pausa</span>
        )}
      </button>
    </div>
  );
};
