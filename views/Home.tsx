
import React, { useState } from 'react';
import { ChevronRight, Play, Trophy, Flame, Bell, Sparkles, ChevronDown, ChevronUp, PlusCircle, BookOpen } from 'lucide-react';
import { UserStats, ReadingPlan } from '../types';

interface HomeProps {
  onNavigate: (tab: string) => void;
  stats: UserStats;
  onSelectPlan: (id: string) => void;
  plans: ReadingPlan[];
}

export const HomeView: React.FC<HomeProps> = ({ onNavigate, stats, onSelectPlan, plans }) => {
  const [showAllPlans, setShowAllPlans] = useState(false);

  // Define quais planos mostrar: apenas os 3 primeiros ou todos
  const visiblePlans = showAllPlans ? plans : plans.slice(0, 3);
  const hasPlans = plans.length > 0;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-1000">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black">CO</div>
          <span className="text-white font-black text-xs tracking-tighter uppercase opacity-80">Casa de Oração</span>
        </div>
        <button className="relative p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg active:scale-90 transition-transform">
          <Bell className="w-5 h-5 text-orange-400" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white/10 shadow-lg"></span>
        </button>
      </header>

      <section className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-orange-200/60 text-xs font-black tracking-[0.2em] uppercase mb-1">Bem-vindo à Casa,</h2>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-2xl max-w-[200px] truncate">
            {stats.userName}
          </h1>
        </div>
        <div className="flex flex-col items-center bg-orange-600/20 backdrop-blur-3xl text-orange-400 px-5 py-3 rounded-[2rem] border border-orange-500/30 shadow-[0_0_30px_rgba(234,88,12,0.1)]">
          <Flame className="w-6 h-6 fill-orange-500 text-orange-500 animate-pulse mb-1" />
          <span className="text-xs font-black tracking-tighter uppercase">{stats.streak} dias</span>
        </div>
      </section>

      {/* Welcoming Background Image for Verse of the Day */}
      <section className="relative overflow-hidden rounded-[3.5rem] p-10 text-white shadow-[0_30px_60px_rgba(249,115,22,0.3)] border border-white/20 group min-h-[220px] flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop" 
          alt="Sunset Peace" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/80 via-rose-900/70 to-orange-950/80 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-xl">
            Versículo do Dia
          </div>
          <p className="text-2xl font-serif italic leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            "Buscai primeiro o Reino de Deus e a sua justiça..."
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <div className="h-[2px] w-8 bg-orange-300/30"></div>
            <p className="text-xs font-black tracking-widest text-orange-100 uppercase bg-black/40 px-3 py-1 rounded-lg border border-white/10">Mateus 6:33</p>
            <div className="h-[2px] w-8 bg-orange-300/30"></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-5">
        <button onClick={() => onNavigate('daily-pause')} className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl hover:bg-white/10 transition-all group active:scale-95">
          <div className="w-16 h-16 bg-orange-500 text-white rounded-[1.5rem] flex items-center justify-center mb-4 shadow-2xl shadow-orange-500/40 group-hover:rotate-12 transition-transform">
            <Play className="w-7 h-7 fill-current ml-1" />
          </div>
          <span className="text-sm font-black text-white uppercase tracking-widest">Pausa</span>
          <span className="text-[9px] font-bold text-orange-400/80 mt-1 uppercase tracking-tighter">1 min oração</span>
        </button>

        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl hover:bg-white/10 transition-all group active:scale-95">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center mb-4 shadow-2xl shadow-amber-500/40 group-hover:rotate-[-12deg] transition-transform">
            <Trophy className="w-7 h-7" />
          </div>
          <span className="text-sm font-black text-white uppercase tracking-widest">Jornada</span>
          <span className="text-[9px] font-bold text-amber-400/80 mt-1 uppercase tracking-tighter">Conquistas</span>
        </button>
      </section>

      {/* Reading Plans */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
            <h3 className="text-xl font-black text-white tracking-tight drop-shadow-md">Planos de Leitura</h3>
          </div>
          {hasPlans && plans.length > 3 && (
            <button 
              onClick={() => setShowAllPlans(!showAllPlans)}
              className="flex items-center space-x-2 bg-white/10 text-orange-400 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl border border-white/5 hover:bg-white/20 transition-all active:scale-95"
            >
              <span>{showAllPlans ? 'Ver Menos' : 'Ver Todos'}</span>
              {showAllPlans ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
        
        <div className="space-y-4 pb-6">
          {hasPlans ? (
            visiblePlans.map((plan, index) => (
              <div 
                key={plan.id} 
                onClick={() => onSelectPlan(plan.id)}
                className={`bg-white/5 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/10 shadow-2xl flex items-center space-x-6 hover:bg-white/10 transition-all cursor-pointer group animate-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-sm border shadow-inner group-hover:scale-110 transition-transform ${
                  plan.progress === 100 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                }`}>
                  {plan.progress}%
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-black text-white text-[15px] mb-1 leading-tight tracking-tight truncate">{plan.name}</h4>
                  <p className="text-[10px] text-white/40 mb-3 line-clamp-1">{plan.description}</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden shadow-inner p-[1px]">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        plan.progress === 100 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : 'bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500'
                      }`}
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl text-orange-400 group-hover:translate-x-1 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border-2 border-dashed border-white/10 space-y-4 animate-in fade-in duration-1000">
               <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20 mb-2">
                 <BookOpen className="w-10 h-10 text-orange-400/40" />
               </div>
               <div className="text-center">
                 <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">Nenhum Plano Ativo</h4>
                 <p className="text-white/40 text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto">
                   Seus planos de leitura detalhados aparecerão aqui assim que forem adicionados.
                 </p>
               </div>
               <button 
                 onClick={() => onNavigate('bible')}
                 className="flex items-center space-x-3 px-6 py-3 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-orange-500 transition-all active:scale-95"
               >
                 <PlusCircle className="w-4 h-4" />
                 <span>Iniciar Nova Jornada</span>
               </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
