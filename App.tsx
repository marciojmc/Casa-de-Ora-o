
import React, { useState, useCallback } from 'react';
import { HomeView } from './views/Home';
import { BibleView } from './views/Bible';
import { DevotionalView } from './views/Devotional';
import { DailyPauseView } from './views/DailyPause';
import { ProfileView } from './views/Profile';
import { PlanDetailView } from './views/PlanDetail';
import { NAVIGATION_TABS, READING_PLANS as INITIAL_PLANS } from './constants';
import { UserStats, ReadingPlan } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<ReadingPlan[]>(INITIAL_PLANS);
  
  const [stats, setStats] = useState<UserStats>({
    userName: 'Irmão(ã)',
    streak: 5,
    chaptersRead: 42,
    booksCompleted: 2,
    totalMinutes: 120,
    history: [
      { date: '2024-05-15', chapters: 2 },
      { date: '2024-05-16', chapters: 3 },
      { date: '2024-05-17', chapters: 5 },
      { date: '2024-05-18', chapters: 2 },
      { date: '2024-05-19', chapters: 4 },
      { date: '2024-05-20', chapters: 1 },
      { date: '2024-05-21', chapters: 6 },
    ]
  });

  const handleUpdateName = (newName: string) => {
    setStats(prev => ({ ...prev, userName: newName }));
  };

  const handleToggleTask = useCallback((planId: string, taskId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const newTasks = p.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t);
      const completed = newTasks.filter(t => t.isCompleted).length;
      const progress = Math.round((completed / newTasks.length) * 100);
      
      // Update global stats if a task was checked
      const task = p.tasks.find(t => t.id === taskId);
      if (task && !task.isCompleted) {
         setStats(s => ({ ...s, chaptersRead: s.chaptersRead + 1 }));
      }

      return { ...p, tasks: newTasks, progress };
    }));
  }, []);

  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setActiveTab('plan-detail');
  };

  const renderView = () => {
    if (activeTab === 'plan-detail' && selectedPlanId) {
      const plan = plans.find(p => p.id === selectedPlanId);
      if (plan) return (
        <PlanDetailView 
          plan={plan} 
          onBack={() => setActiveTab('home')} 
          onToggleTask={(taskId) => handleToggleTask(plan.id, taskId)}
        />
      );
    }

    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} stats={stats} onSelectPlan={handleSelectPlan} plans={plans} />;
      case 'bible': return <BibleView onChapterRead={() => setStats(prev => ({ ...prev, chaptersRead: prev.chaptersRead + 1 }))} />;
      case 'devotional': return <DevotionalView />;
      case 'daily-pause': return <DailyPauseView />;
      case 'profile': return <ProfileView stats={stats} onUpdateName={handleUpdateName} />;
      default: return <HomeView onNavigate={setActiveTab} stats={stats} onSelectPlan={handleSelectPlan} plans={plans} />;
    }
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden max-w-md mx-auto border-x border-orange-100 bg-[#0f172a]">
      {/* VIBRANT MESH BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[50%] bg-orange-600 rounded-full blur-[120px] opacity-40 animate-pulse duration-[8s]"></div>
        <div className="absolute bottom-[10%] right-[-20%] w-[80%] h-[60%] bg-rose-600 rounded-full blur-[100px] opacity-30 animate-bounce duration-[15s]"></div>
        <div className="absolute top-[30%] left-[40%] w-[60%] h-[40%] bg-amber-400 rounded-full blur-[110px] opacity-30 animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[70%] h-[40%] bg-indigo-600 rounded-full blur-[120px] opacity-10"></div>
      </div>

      <main className="relative flex-1 overflow-y-auto pb-24 no-scrollbar z-10">
        {renderView()}
      </main>

      {/* Persistent Bottom Navigation Refined */}
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
                      ? 'bg-amber-400/20 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/30' 
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
                      ? 'text-amber-400 font-black opacity-100 scale-100' 
                      : 'text-white/40 font-medium opacity-0 scale-90 translate-y-1'
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-in fade-in zoom-in duration-500"></div>
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
