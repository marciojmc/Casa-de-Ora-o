
import React, { useState, useEffect, useRef } from 'react';
import { Settings, ChevronLeft, ChevronRight, BookOpen, Share2, Loader2 } from 'lucide-react';
import { fetchBibleText } from '../services/geminiService';
import { MOCK_BIBLE_BOOKS, BIBLE_STRUCTURE } from '../constants';
import { BibleVersion } from '../types';

interface BibleViewProps {
  onChapterRead: () => void;
}

export const BibleView: React.FC<BibleViewProps> = ({ onChapterRead }) => {
  const [book, setBook] = useState('João');
  const [chapter, setChapter] = useState(1);
  const [version, setVersion] = useState<BibleVersion>(BibleVersion.KJA);
  const [verses, setVerses] = useState<{verse: number, text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const contentRef = useRef<HTMLDivElement>(null);

  const getBookData = (bookName: string) => BIBLE_STRUCTURE.find(b => b.name === bookName);

  const loadText = async (targetBook: string, targetChapter: number, isPrefetch = false) => {
    const bookData = getBookData(targetBook);
    if (!bookData || targetChapter > bookData.chapters || targetChapter < 1) return;

    if (!isPrefetch) setLoading(true);
    
    try {
      const data = await fetchBibleText(targetBook, targetChapter, version);
      if (data && data.length > 0) {
        if (!isPrefetch) {
          setVerses(data);
          onChapterRead();
          contentRef.current?.scrollTo(0, 0);
          
          // Pré-carregamento apenas se o próximo capítulo existir
          if (targetChapter < bookData.chapters) {
            setTimeout(() => {
              loadText(targetBook, targetChapter + 1, true);
            }, 3000);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load bible text", error);
    } finally {
      if (!isPrefetch) setLoading(false);
    }
  };

  useEffect(() => {
    loadText(book, chapter);
  }, [book, chapter, version]);

  const handleNextChapter = () => {
    const bookData = getBookData(book);
    if (!bookData) return;

    if (chapter < bookData.chapters) {
      setChapter(prev => prev + 1);
    } else {
      // Vai para o próximo livro
      const bookIndex = BIBLE_STRUCTURE.findIndex(b => b.name === book);
      if (bookIndex < BIBLE_STRUCTURE.length - 1) {
        setBook(BIBLE_STRUCTURE[bookIndex + 1].name);
        setChapter(1);
      }
    }
  };

  const handlePrevChapter = () => {
    if (chapter > 1) {
      setChapter(prev => prev - 1);
    } else {
      // Vai para o livro anterior, no último capítulo
      const bookIndex = BIBLE_STRUCTURE.findIndex(b => b.name === book);
      if (bookIndex > 0) {
        const prevBook = BIBLE_STRUCTURE[bookIndex - 1];
        setBook(prevBook.name);
        setChapter(prevBook.chapters);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <header className="px-6 py-6 border-b border-white/10 flex items-center justify-between bg-black/10 backdrop-blur-3xl sticky top-0 z-20">
        <button 
          onClick={() => setShowSelector(!showSelector)}
          className="flex items-center space-x-3 font-black text-white group"
        >
          <span className="text-xl group-hover:text-orange-400 transition-colors drop-shadow-2xl">{book} {chapter}</span>
          <BookOpen className="w-5 h-5 text-orange-500" />
        </button>
        <div className="flex items-center space-x-4">
          <select 
            value={version}
            onChange={(e) => setVersion(e.target.value as BibleVersion)}
            className="text-[10px] font-black bg-white/10 text-orange-400 border border-white/10 rounded-xl px-3 py-2 outline-none backdrop-blur-md uppercase tracking-widest"
          >
            {Object.values(BibleVersion).map(v => (
              <option key={v} value={v} className="bg-slate-900">{v}</option>
            ))}
          </select>
          <button onClick={() => setFontSize(prev => prev >= 32 ? 16 : prev + 2)} className="text-white/60 hover:text-orange-400 bg-white/10 p-2.5 rounded-2xl transition-all active:rotate-90">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {showSelector && (
        <div className="fixed inset-0 top-20 z-40 bg-black/90 backdrop-blur-3xl p-6 overflow-y-auto animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-white tracking-tight uppercase">Livros</h3>
            <button onClick={() => setShowSelector(false)} className="text-orange-500 font-bold uppercase text-[10px] tracking-widest">Fechar</button>
          </div>
          <div className="grid grid-cols-2 gap-4 pb-20">
            {MOCK_BIBLE_BOOKS.map(b => (
              <button 
                key={b}
                onClick={() => { setBook(b); setChapter(1); setShowSelector(false); }}
                className={`p-5 rounded-[2rem] text-sm font-black border transition-all ${
                  book === b 
                    ? 'bg-orange-600 text-white border-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.4)] scale-105' 
                    : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <div 
        ref={contentRef}
        className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar bg-black/5"
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="relative">
               <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
               <div className="absolute inset-0 bg-orange-500/30 blur-2xl animate-pulse"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400 drop-shadow-lg">Inspirando...</p>
          </div>
        ) : (
          <div className="font-serif leading-[2.1] text-white/95 selection:bg-orange-500/40 selection:text-white" style={{ fontSize: `${fontSize}px` }}>
            {verses.map((v) => (
              <p key={v.verse} className="mb-10 relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
                <span className="absolute -left-10 top-2 text-orange-500 font-sans font-black text-[0.4em] tracking-tighter bg-orange-950/40 border border-orange-500/20 px-2 py-1 rounded-lg shadow-2xl opacity-80">
                   {v.verse}
                </span>
                <span className="relative drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {v.text}
                </span>
              </p>
            ))}
            {verses.length === 0 && !loading && (
              <div className="text-center p-10 opacity-50">
                <p className="text-sm font-sans uppercase tracking-widest">Capítulo não encontrado.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="p-6 border-t border-white/10 flex justify-between bg-black/20 backdrop-blur-3xl items-center z-20">
        <button 
          onClick={handlePrevChapter}
          className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-orange-400 transition-all active:scale-90 hover:bg-white/10 shadow-2xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-orange-400 active:scale-90 transition-all hover:bg-white/10 shadow-2xl">
          <Share2 className="w-6 h-6" />
        </button>

        <button 
          onClick={handleNextChapter}
          className="flex items-center space-x-4 px-10 py-5 bg-orange-600 text-white rounded-[1.5rem] font-black shadow-[0_15px_40px_rgba(234,88,12,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
          <span>Avançar</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
