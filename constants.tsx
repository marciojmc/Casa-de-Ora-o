
import React from 'react';
import { Book, Heart, Calendar, Clock, User } from 'lucide-react';
import { ReadingPlan, PlanTask } from './types';

export const COLORS = {
  primary: '#f97316', 
  primaryDeep: '#c2410c',
  secondary: '#fbbf24', 
  accent: '#ea580c',
  background: '#fffaf5',
  card: '#ffffff',
};

export const NAVIGATION_TABS = [
  { id: 'home', label: 'Início', icon: <Heart className="w-6 h-6" /> },
  { id: 'bible', label: 'Bíblia', icon: <Book className="w-6 h-6" /> },
  { id: 'devotional', label: 'Devocional', icon: <Calendar className="w-6 h-6" /> },
  { id: 'daily-pause', label: 'Pausa', icon: <Clock className="w-6 h-6" /> },
  { id: 'profile', label: 'Perfil', icon: <User className="w-6 h-6" /> },
];

export const BIBLE_STRUCTURE = [
  { name: "Gênesis", chapters: 50 }, { name: "Êxodo", chapters: 40 }, { name: "Levítico", chapters: 27 },
  { name: "Números", chapters: 36 }, { name: "Deuteronômio", chapters: 34 }, { name: "Josué", chapters: 24 },
  { name: "Juízes", chapters: 21 }, { name: "Rute", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Reis", chapters: 22 }, { name: "2 Reis", chapters: 25 },
  { name: "1 Crônicas", chapters: 29 }, { name: "2 Crônicas", chapters: 36 }, { name: "Esdras", chapters: 10 },
  { name: "Neemias", chapters: 13 }, { name: "Ester", chapters: 10 }, { name: "Jó", chapters: 42 },
  { name: "Salmos", chapters: 150 }, { name: "Provérbios", chapters: 31 }, { name: "Eclesiastes", chapters: 12 },
  { name: "Cantares", chapters: 8 }, { name: "Isaías", chapters: 66 }, { name: "Jeremias", chapters: 52 },
  { name: "Lamentações", chapters: 5 }, { name: "Ezequiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Oseias", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amós", chapters: 9 },
  { name: "Obadias", chapters: 1 }, { name: "Jonas", chapters: 4 }, { name: "Miqueias", chapters: 7 },
  { name: "Naum", chapters: 3 }, { name: "Habacuque", chapters: 3 }, { name: "Sofonias", chapters: 3 },
  { name: "Ageu", chapters: 2 }, { name: "Zacarias", chapters: 14 }, { name: "Malaquias", chapters: 4 },
  { name: "Mateus", chapters: 28 }, { name: "Marcos", chapters: 16 }, { name: "Lucas", chapters: 24 },
  { name: "João", chapters: 21 }, { name: "Atos", chapters: 28 }, { name: "Romanos", chapters: 16 },
  { name: "1 Coríntios", chapters: 16 }, { name: "2 Coríntios", chapters: 13 }, { name: "Gálatas", chapters: 6 },
  { name: "Efésios", chapters: 6 }, { name: "Filipenses", chapters: 4 }, { name: "Colossenses", chapters: 4 },
  { name: "1 Tessalonicenses", chapters: 5 }, { name: "2 Tessalonicenses", chapters: 3 }, { name: "1 Timóteo", chapters: 6 },
  { name: "2 Timóteo", chapters: 4 }, { name: "Tito", chapters: 3 }, { name: "Filemom", chapters: 1 },
  { name: "Hebreus", chapters: 13 }, { name: "Tiago", chapters: 5 }, { name: "1 Pedro", chapters: 5 },
  { name: "2 Pedro", chapters: 3 }, { name: "1 João", chapters: 5 }, { name: "2 João", chapters: 1 },
  { name: "3 João", chapters: 1 }, { name: "Judas", chapters: 1 }, { name: "Apocalipse", chapters: 22 }
];

export const MOCK_BIBLE_BOOKS = BIBLE_STRUCTURE.map(b => b.name);

// Função genérica para criar planos baseada em um intervalo de livros e dias
const generateCustomPlanTasks = (planId: string, startBookName: string, endBookName: string, durationDays: number): PlanTask[] => {
  const tasks: PlanTask[] = [];
  const startIndex = BIBLE_STRUCTURE.findIndex(b => b.name === startBookName);
  const endIndex = BIBLE_STRUCTURE.findIndex(b => b.name === endBookName);
  
  const selectedBooks = BIBLE_STRUCTURE.slice(startIndex, endIndex + 1);
  const allChapters: { book: string, chapter: number }[] = [];
  
  selectedBooks.forEach(book => {
    for (let i = 1; i <= book.chapters; i++) {
      allChapters.push({ book: book.name, chapter: i });
    }
  });

  const totalChapters = allChapters.length;

  for (let day = 1; day <= durationDays; day++) {
    const start = Math.floor((day - 1) * (totalChapters / durationDays));
    const end = Math.floor(day * (totalChapters / durationDays));
    const dayChapters = allChapters.slice(start, end);

    dayChapters.forEach((ch, idx) => {
      tasks.push({
        id: `plan-${planId}-day${day}-ch${idx}-${ch.book}-${ch.chapter}`,
        day: day,
        book: ch.book,
        chapter: ch.chapter,
        isCompleted: false
      });
    });
  }
  return tasks;
};

export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'bible-1y',
    name: 'Bíblia Completa em 1 Ano',
    description: 'A jornada definitiva: do Gênesis ao Apocalipse em 365 dias, cobrindo todos os 1.189 capítulos.',
    durationDays: 365,
    progress: 0,
    tasks: generateCustomPlanTasks('1y', 'Gênesis', 'Apocalipse', 365)
  },
  {
    id: 'ot-270d',
    name: 'Antigo Testamento em 9 meses',
    description: 'Explore as origens e as promessas: de Gênesis a Malaquias em uma jornada de 270 dias.',
    durationDays: 270,
    progress: 0,
    tasks: generateCustomPlanTasks('ot', 'Gênesis', 'Malaquias', 270)
  },
  {
    id: 'pent-60d',
    name: 'O Pentateuco em 60 dias',
    description: 'Os cinco livros da Lei: a base da fé de Gênesis a Deuteronômio em 2 meses intensivos.',
    durationDays: 60,
    progress: 0,
    tasks: generateCustomPlanTasks('pent', 'Gênesis', 'Deuteronômio', 60)
  },
  {
    id: 'psalms-60d',
    name: 'Salmos em 60 dias',
    description: 'Uma jornada de louvor e oração através dos 150 salmos em 2 meses.',
    durationDays: 60,
    progress: 0,
    tasks: generateCustomPlanTasks('psalms', 'Salmos', 'Salmos', 60)
  },
  {
    id: 'proverbs-31d',
    name: 'Provérbios em 31 dias',
    description: 'Sabedoria diária: um capítulo por dia para um mês repleto de conselhos divinos.',
    durationDays: 31,
    progress: 0,
    tasks: generateCustomPlanTasks('prov', 'Provérbios', 'Provérbios', 31)
  },
  {
    id: 'psalms-prov-90d',
    name: 'Salmos & Provérbios em 90 dias',
    description: 'O equilíbrio perfeito entre adoração e sabedoria em uma jornada de 3 meses.',
    durationDays: 90,
    progress: 0,
    tasks: generateCustomPlanTasks('psp', 'Salmos', 'Provérbios', 90)
  },
  {
    id: 'nt-90d',
    name: 'Novo Testamento em 90 dias',
    description: 'Foco total na nova aliança: de Mateus ao Apocalipse em uma jornada de 3 meses.',
    durationDays: 90,
    progress: 0,
    tasks: generateCustomPlanTasks('nt', 'Mateus', 'Apocalipse', 90)
  },
  {
    id: 'gospels-30d',
    name: 'Evangelhos em 30 dias',
    description: 'A vida, morte e ressurreição de Cristo contada pelos quatro evangelistas em um mês.',
    durationDays: 30,
    progress: 0,
    tasks: generateCustomPlanTasks('gsp', 'Mateus', 'João', 30)
  }
];
