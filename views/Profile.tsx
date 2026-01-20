
import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Award, BookOpen, Flame, MapPin, Edit3, Check, X, UserPlus } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  onUpdateName: (name: string) => void;
}

export const ProfileView: React.FC<ProfileProps> = ({ stats, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(stats.userName);
  const [showSuccess, setShowSuccess] = useState(false);

  // Ativa modo edição automaticamente se o nome for o padrão
  useEffect(() => {
    if (stats.userName === 'Irmão(ã)') {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    const finalName = tempName.trim() || 'Irmão(ã)';
    onUpdateName(finalName);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setTempName(stats.userName);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header with Name Registration / Profile Info */}
      <header className="flex flex-col items-center text-center space-y-6 pt-6">
        <div className="relative">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-[3.5rem] border-4 border-white/20 shadow-2xl overflow-hidden flex items-center justify-center group">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.userName}`} 
              alt="Avatar" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-3 rounded-2xl shadow-xl shadow-orange-600/40 border border-white/20">
             <Flame className="w-5 h-5 fill-white" />
          </div>
        </div>

        <div className="w-full max-w-sm px-4">
          {isEditing ? (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-full relative">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Como gostaria de ser chamado?"
                  autoFocus
                  className="w-full bg-white/5 backdrop-blur-2xl border-2 border-orange-500/30 rounded-[2rem] px-6 py-4 text-white text-center font-black text-xl outline-none focus:border-orange-500 shadow-2xl transition-all placeholder:text-white/20"
                />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  Seu Nome
                </div>
              </div>
              
              <div className="flex space-x-3 w-full">
                <button 
                  onClick={handleSave} 
                  className="flex-1 bg-gradient-to-r from-orange-600 to-rose-600 text-white py-4 rounded-2xl shadow-xl shadow-orange-600/30 font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <Check className="w-5 h-5" />
                  <span>Salvar Nome</span>
                </button>
                {stats.userName !== 'Irmão(ã)' && (
                  <button 
                    onClick={handleCancel} 
                    className="p-4 bg-white/10 text-white rounded-2xl border border-white/10 shadow-lg active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-tighter italic">
                O nome será usado para personalizar sua experiência.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              {showSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500">
                  Nome atualizado com sucesso!
                </div>
              )}
              
              <div 
                className="flex items-center space-x-3 group cursor-pointer bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all shadow-xl" 
                onClick={() => setIsEditing(true)}
              >
                <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-2xl truncate max-w-[220px]">
                  {stats.userName}
                </h2>
                <Edit3 className="w-5 h-5 text-orange-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-orange-200/60 text-[10px] font-black tracking-[0.2em] uppercase">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Casa de Oração Fortaleza</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-2 gap-5">
        <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center text-center group hover:bg-white/10 transition-all">
          <div className="w-14 h-14 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-4 border border-orange-600/30 group-hover:scale-110 transition-transform">
            <Flame className="w-7 h-7 text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-orange-400 font-black uppercase tracking-[0.2em] mb-1 opacity-70">Ofensiva</p>
          <p className="text-2xl font-black text-white">{stats.streak} dias</p>
        </div>
        <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center text-center group hover:bg-white/10 transition-all">
          <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/30 group-hover:scale-110 transition-transform">
            <BookOpen className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.2em] mb-1 opacity-70">Lidos</p>
          <p className="text-2xl font-black text-white">{stats.chaptersRead} cap.</p>
        </div>
      </section>

      {/* Growth Chart */}
      <section className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h3 className="font-black text-white tracking-tight uppercase text-xs tracking-[0.2em]">Crescimento Semanal</h3>
          <div className="px-4 py-1.5 bg-orange-600/20 text-orange-400 text-[9px] font-black rounded-full border border-orange-500/30 uppercase tracking-widest shadow-inner">
            Consistência
          </div>
        </div>
        <div className="h-48 w-full -ml-4 relative z-10">
          <ResponsiveContainer width="115%" height="100%">
            <AreaChart data={stats.history}>
              <defs>
                <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)', 
                  fontWeight: '900',
                  color: '#fff'
                }}
                itemStyle={{ color: '#f97316' }}
              />
              <Area 
                type="monotone" 
                dataKey="chapters" 
                stroke="#f97316" 
                strokeWidth={5}
                fillOpacity={1} 
                fill="url(#colorOrange)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Badges Section */}
      <section className="space-y-6 px-2 pb-10">
        <h3 className="font-black text-white uppercase text-xs tracking-[0.3em] opacity-60">Jornada Espiritual</h3>
        <div className="grid grid-cols-4 gap-5">
          {[
            { id: 1, color: 'bg-orange-500 shadow-orange-500/40', label: 'Chamado', icon: <Award className="w-7 h-7" /> },
            { id: 2, color: 'bg-rose-500 shadow-rose-500/40', label: 'Fiel', icon: <Award className="w-7 h-7" /> },
            { id: 3, color: 'bg-white/5 grayscale opacity-30', label: 'Sábio', icon: <Award className="w-7 h-7" />, locked: true },
            { id: 4, color: 'bg-white/5 grayscale opacity-30', label: 'Elias', icon: <Award className="w-7 h-7" />, locked: true },
          ].map(badge => (
            <div key={badge.id} className="flex flex-col items-center space-y-3">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${badge.color} border border-white/10`}>
                {badge.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${badge.locked ? 'text-white/20' : 'text-orange-400'}`}>{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <div className="flex flex-col items-center pt-8 pb-12 space-y-3 opacity-30">
         <img src="logo.png" alt="Logo" className="h-6 invert brightness-0" />
         <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">Edificando Vidas • Fortaleza</p>
      </div>
    </div>
  );
};
