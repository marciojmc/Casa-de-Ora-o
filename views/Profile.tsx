
import React, { useState, useEffect } from 'react';
import { UserStats, ReadingPlan } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Award, BookOpen, Flame, MapPin, Edit3, Check, X, Download, ShieldCheck, Database } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  onUpdateName: (name: string) => void;
  plans: ReadingPlan[];
}

export const ProfileView: React.FC<ProfileProps> = ({ stats, onUpdateName, plans }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(stats.userName);
  const [showSuccess, setShowSuccess] = useState(false);

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

  // FUNÇÃO DE EXPORTAÇÃO CORRIGIDA - Evita arquivo em branco
  const handleExportData = () => {
    try {
      const exportContent = {
        app: "Casa de Oração Fortaleza - Bíblia",
        exportDate: new Date().toISOString(),
        stats: stats,
        plansProgress: plans.map(p => ({
          id: p.id,
          name: p.name,
          progress: p.progress,
          completedTasks: p.tasks.filter(t => t.isCompleted).length
        }))
      };

      const jsonString = JSON.stringify(exportContent, null, 2);
      
      // Validação: se a string estiver vazia ou for apenas "{}", não prossegue
      if (!jsonString || jsonString === "{}") {
        alert("Erro: Não há dados suficientes para exportar.");
        return;
      }

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_biblia_co_${stats.userName.toLowerCase().replace(/\s+/g, '_')}.json`;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error("Falha na exportação:", error);
      alert("Houve um erro ao gerar seu arquivo de backup.");
    }
  };

  // Garante que o gráfico tenha dados válidos para não quebrar a UI
  const chartData = stats.history && stats.history.length > 0 
    ? stats.history.slice(-7) 
    : [{ date: 'Hoje', chapters: 0 }];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col items-center text-center space-y-6 pt-6">
        <div className="relative">
          <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border-4 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center group">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.userName}`} 
              alt="Avatar" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-3 rounded-2xl shadow-xl border border-white/20">
             <Flame className="w-5 h-5 fill-white" />
          </div>
        </div>

        <div className="w-full max-w-sm px-4">
          {isEditing ? (
            <div className="flex flex-col items-center space-y-4">
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Seu nome..."
                className="w-full bg-white/5 border-2 border-orange-500/30 rounded-[2rem] px-6 py-4 text-white text-center font-black text-xl outline-none focus:border-orange-500"
              />
              <div className="flex space-x-3 w-full">
                <button onClick={handleSave} className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>Salvar</span>
                </button>
                <button onClick={handleCancel} className="p-4 bg-white/10 text-white rounded-2xl">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setIsEditing(true)}>
                <h2 className="text-3xl font-black text-white tracking-tight truncate max-w-[220px]">
                  {stats.userName}
                </h2>
                <Edit3 className="w-5 h-5 text-orange-400 opacity-50" />
              </div>
              <div className="flex items-center text-orange-200/60 text-[10px] font-black tracking-widest uppercase">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>Fortaleza, CE</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-5">
        <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center">
          <Flame className="w-7 h-7 text-orange-500 mb-4" />
          <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1">Ofensiva</p>
          <p className="text-2xl font-black text-white">{stats.streak} dias</p>
        </div>
        <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center">
          <BookOpen className="w-7 h-7 text-amber-500 mb-4" />
          <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-1">Capítulos</p>
          <p className="text-2xl font-black text-white">{stats.chaptersRead}</p>
        </div>
      </section>

      {/* Growth Chart */}
      <section className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 overflow-hidden">
        <h3 className="font-black text-white uppercase text-xs tracking-widest mb-8">Evolução Semanal</h3>
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="115%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '15px', color: '#fff', fontSize: '10px' }}
              />
              <Area 
                type="monotone" 
                dataKey="chapters" 
                stroke="#f97316" 
                strokeWidth={4}
                fill="url(#colorOrange)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* NOVO: Backup e Configurações */}
      <section className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 space-y-6">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-indigo-400" />
          <h3 className="font-black text-white uppercase text-xs tracking-widest">Configurações & Backup</h3>
        </div>
        
        <p className="text-[10px] text-white/40 leading-relaxed font-medium">
          Mantenha seus dados seguros. Você pode exportar seu progresso de leitura para importar em outro dispositivo futuramente.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={handleExportData}
            className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-white font-black text-xs uppercase tracking-widest">Exportar Backup</span>
                <span className="text-[9px] text-white/30 font-medium">Salvar em arquivo .json</span>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-indigo-500/50" />
          </button>
        </div>
      </section>

      <footer className="flex flex-col items-center pt-8 pb-12 space-y-2 opacity-30">
         <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">Edificando Vidas • Casa de Oração</p>
      </footer>
    </div>
  );
};
