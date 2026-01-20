
export enum BibleVersion {
  KJA = 'King James Atualizada',
  NVI = 'NVI',
  ARA = 'ARA',
  NTLH = 'NTLH'
}

export interface UserStats {
  userName: string;
  streak: number;
  chaptersRead: number;
  booksCompleted: number;
  totalMinutes: number;
  history: { date: string; chapters: number }[];
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Devotional {
  id: string;
  title: string;
  verse: string;
  content: string;
  theme: string;
  duration: 'short' | 'medium';
}

export interface PlanTask {
  id: string;
  day: number;
  book: string;
  chapter: number;
  verses?: string; // Ex: "1-10" ou null para capítulo todo
  isCompleted: boolean;
}

export interface ReadingPlan {
  id: string;
  name: string;
  durationDays: number;
  progress: number;
  description: string;
  tasks: PlanTask[];
}
