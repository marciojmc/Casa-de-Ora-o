
import React, { useState, useCallback, useEffect } from 'react';
import { HomeView } from './views/Home';
import { BibleView } from './views/Bible';
import { DevotionalView } from './views/Devotional';
import { DailyPauseView } from './views/DailyPause';
import { ProfileView } from './views/Profile';
import { PlanDetailView } from './views/PlanDetail';
import { NAVIGATION_TABS, READING_PLANS as INITIAL_PLANS } from './constants';
import { UserStats, ReadingPlan } from './types';

const STORAGE_KEYS = {
  STATS: 'co_fortaleza_stats_v1',
  PLANS: 'co_fortaleza_plans_v1'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Carrega os planos iniciais do storage ou usa os padrões
  const [plans, setPlans] = useState<ReadingPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { return INITIAL_PLANS; }
    }
    return INITIAL_PLANS;
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    const defaultStats = {
      userName: 'Irmão(ã)',
      streak: 0,
      chaptersRead: 0,
      booksCompleted: 0,
      totalMinutes: 0,
      history: []
    };
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { return defaultStats; }
    }
    return defaultStats;
  });

  // Persiste as mudanças automaticamente
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  const handleUpdateName = (newName: string) => {
    setStats(prev => ({ ...prev, userName: newName }));
  };

  const handleToggleTask = useCallback((planId: string, taskId: string) => {
    setPlans(prev => {
      const updatedPlans = prev.map(p => {
        if (p.id !== planId) return p;
        const newTasks = p.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t);
        const completed = newTasks.filter(t => t.isCompleted).length;
        const progress = Math.round((completed / newTasks.length) * 100);
        
        // Atualiza stats se uma tarefa foi marcada (apenas se for nova marcação)
        const taskBefore = p.tasks.find(t => t.id === taskId);
        if (taskBefore && !taskBefore.isCompleted) {
           setStats(s => ({ 
             ...s, 
             chaptersRead: s.chaptersRead + 1,
             history: [...s.history, { date: new Date().toISOString().split('T')[0], chapters: 1 }]
           }));
        }

        return { ...p, tasks: newTasks, progress };
      });
      return updatedPlans;
    });
  }, []);

  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setActiveTab('plan-detail');
  };

  const renderView = () => {
    if (activeTab === 'plan-detail' && selectedPlanId) {
      const plan = plans.find(p => p.id === selectedPlanId);
      if (plan) return (
        <div className="view-transition h-full">
          <PlanDetailView 
            plan={plan} 
            onBack={() => setActiveTab('home')} 
            onToggleTask={(taskId) => handleToggleTask(plan.id, taskId)}
          />
        </div>
      );
    }

    const content = (() => {
      switch (activeTab) {
        case 'home': return <HomeView onNavigate={setActiveTab} stats={stats} onSelectPlan={handleSelectPlan} plans={plans} />;
        case 'bible': return <BibleView onChapterRead={() => setStats(prev => ({ ...prev, chaptersRead: prev.chaptersRead + 1 }))} />;
        case 'devotional': return <DevotionalView />;
        case 'daily-pause': return <DailyPauseView />;
        case 'profile': return <ProfileView stats={stats} onUpdateName={handleUpdateName} plans={plans} />;
        default: return <HomeView onNavigate={setActiveTab} stats={stats} onSelectPlan={handleSelectPlan} plans={plans} />;
      }
    })();

    return <div className="view-transition">{content}</div>;
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden max-w-md mx-auto border-x border-white/10 bg-[#020617]">
      {/* VIBRANT MESH BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[50%] bg-orange-600 rounded-full blur-[120px] opacity-20 animate-pulse duration-[8s]"></div>
        <div className="absolute bottom-[10%] right-[-20%] w-[80%] h-[60%] bg-rose-600 rounded-full blur-[100px] opacity-15 animate-bounce duration-[15s]"></div>
        <div className="absolute top-[30%] left-[40%] w-[60%] h-[40%] bg-amber-400 rounded-full blur-[110px] opacity-15 animate-pulse duration-[10s]"></div>
      </div>

      <main className="relative flex-1 overflow-y-auto pb-24 no-scrollbar z-10">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      {activeTab !== 'plan-detail' && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/5 backdrop-blur-[40px] border-t border-white/10 px-4 py-4 flex justify-around items-center z-50 rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.5)]">
          {NAVIGATION_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center transition-all duration-500 group ${
                  isActive ? 'scale-110' : 'text-white/30 hover:text-white/50'
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl transition-all duration-500 mb-1 ${
                    isActive 
                      ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] ring-1 ring-orange-400/30' 
                      : 'bg-transparent text-inherit'
                  }`}
                >
                  {React.cloneElement(tab.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { 
                    size: isActive ? 22 : 24,
                    strokeWidth: isActive ? 2.5 : 2
                  })}
                </div>
                
                <span 
                  className={`text-[9px] uppercase tracking-widest transition-all duration-500 ${
                    isActive 
                      ? 'text-orange-400 font-black opacity-100 scale-100' 
                      : 'text-white/40 font-medium opacity-0 scale-90 translate-y-1'
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default App;
