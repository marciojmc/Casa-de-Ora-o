
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

const DEFAULT_STATS: UserStats = {
  userName: 'Irmão(ã)',
  streak: 0,
  chaptersRead: 0,
  booksCompleted: 0,
  totalMinutes: 0,
  history: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const [plans, setPlans] = useState<ReadingPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      return saved ? JSON.parse(saved) : INITIAL_PLANS;
    } catch(e) { 
      return INITIAL_PLANS; 
    }
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge profundo para garantir que novos campos sejam adicionados a usuários antigos
        return { ...DEFAULT_STATS, ...parsed };
      }
    } catch(e) { }
    return DEFAULT_STATS;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats)); } catch(e) {}
  }, [stats]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans)); } catch(e) {}
  }, [plans]);

  const handleUpdateName = (newName: string) => {
    setStats(prev => ({ ...prev, userName: newName }));
  };

  const handleToggleTask = useCallback((planId: string, taskId: string) => {
    setPlans(prev => {
      return prev.map(p => {
        if (p.id !== planId) return p;
        const newTasks = p.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t);
        const completed = newTasks.filter(t => t.isCompleted).length;
        const progress = Math.round((completed / newTasks.length) * 100);
        
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

    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} stats={stats} onSelectPlan={handleSelectPlan} plans={plans} />;
      case 'bible': return <BibleView onChapterRead={() => setStats(prev => ({ ...prev, chaptersRead: prev.chaptersRead + 1 }))} />;
      case 'devotional': return <DevotionalView />;
      case 'daily-pause': return <DailyPauseView />;
      case 'profile': return <ProfileView stats={stats} onUpdateName={handleUpdateName} plans={plans} />;
      default: return <HomeView onNavigate={setActiveTab} stats={stats} onSelectPlan={handleSelectPlan} plans={plans} />;
    }
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden max-w-md mx-auto border-x border-white/10 bg-[#020617]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[50%] bg-orange-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-20%] w-[80%] h-[60%] bg-rose-600 rounded-full blur-[100px] opacity-15"></div>
      </div>

      <main className="relative flex-1 overflow-y-auto pb-24 no-scrollbar z-10">
        <div className="view-transition">
          {renderView()}
        </div>
      </main>

      {activeTab !== 'plan-detail' && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/5 backdrop-blur-[40px] border-t border-white/10 px-4 py-4 flex justify-around items-center z-50 rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.5)]">
          {NAVIGATION_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive ? 'scale-110' : 'text-white/30 hover:text-white/50'
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl transition-all duration-300 mb-1 ${
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
                
                <span className={`text-[9px] uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-orange-400 font-black' : 'opacity-0'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default App;
