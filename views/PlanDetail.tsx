
import React, { useMemo } from 'react';
import { ChevronLeft, CheckCircle2, Circle, TrendingUp, BookOpen, Bookmark } from 'lucide-react';
import { ReadingPlan, PlanTask } from '../types';

interface PlanDetailProps {
  plan: ReadingPlan;
  onBack: () => void;
  onToggleTask: (taskId: string) => void;
}

export const PlanDetailView: React.FC<PlanDetailProps> = ({ plan, onBack, onToggleTask }) => {
  const completedCount = useMemo(() => plan.tasks.filter(t => t.isCompleted).length, [plan.tasks]);
  const totalCount = plan.tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Agrupa as tarefas por livro para exibição vertical organizada
  const tasksByBook = useMemo(() => {
    const groups: { [key: string]: PlanTask[] } = {};
    plan.tasks.forEach(task => {
      if (!groups[task.book]) groups[task.book] = [];
      groups[task.book].push(task);
    });
    return groups;
  }, [plan.tasks]);

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-white animate-in fade-in duration-500">
      {/* HEADER FIXO */}
      <header className="p-6 flex items-center space-x-4 bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-30">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
          <ChevronLeft className="w-6 h-6 text-orange-400" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black tracking-tight truncate">{plan.name}</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Estrutura Completa</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* PROGRESSO NO TOPO */}
        <section className="p-6">
          <div className="bg-gradient-to-br from-orange-600 to-rose-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            {/* Elementos Decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 blur-2xl rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <div className="flex items-center space-x-2 text-white/80">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Seu Progresso Atual</span>
              </div>
              
              <div className="flex items-baseline space-x-1">
                <span className="text-7xl font-black text-white tracking-tighter">{percent}</span>
                <span className="text-2xl font-black text-white/60">%</span>
              </div>

              <div className="w-full max-w-[200px] h-2 bg-black/20 rounded-full mt-4 overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest pt-2">
                {completedCount} de {totalCount} capítulos lidos
              </p>
            </div>
          </div>
        </section>

        {/* LISTA VERTICAL DE LIVROS E CAPÍTULOS */}
        <div className="px-6 pb-24 space-y-10">
          {/* Changed Object.entries to Object.keys for more reliable type inference of 'tasks' array */}
          {Object.keys(tasksByBook).map((bookName) => {
            const tasks = tasksByBook[bookName];
            return (
              <div key={bookName} className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                {/* Cabeçalho do Livro */}
                <div className="flex items-center space-x-4">
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                  <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <Bookmark className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{bookName}</h3>
                  </div>
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>

                {/* Grid de Capítulos do Livro */}
                <div className="grid grid-cols-1 gap-3">
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] ${
                        task.isCompleted 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 shadow-lg'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                          task.isCompleted ? 'bg-green-500 text-white' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          <span className="text-sm font-black">{task.chapter}</span>
                        </div>
                        <div>
                          <h4 className={`text-sm font-black tracking-tight ${task.isCompleted ? 'text-white/40 line-through' : 'text-white'}`}>
                            Capítulo {task.chapter}
                          </h4>
                          <div className="flex items-center space-x-2">
                             <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Planejado para o</span>
                             <span className="text-[9px] text-orange-400/60 uppercase tracking-widest font-black">Dia {task.day}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`transition-all ${task.isCompleted ? 'text-green-400' : 'text-white/20'}`}>
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 fill-current" />
                        ) : (
                          <Circle className="w-6 h-6 stroke-[2px] group-hover:text-orange-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER INSPIRACIONAL */}
      <footer className="p-8 bg-white/5 border-t border-white/10 text-center">
         <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Meditação</p>
         <p className="text-white/40 text-[11px] leading-relaxed italic px-4">
           "Guardo a tua palavra no meu coração para não pecar contra ti." (Salmos 119:11)
         </p>
      </footer>
    </div>
  );
};
