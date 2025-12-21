import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Bookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: Date;
  highlight?: 'yellow' | 'green' | 'blue' | 'pink';
}

export interface Note {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: Date;
}

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Bible reading
  currentBook: string;
  currentChapter: number;
  setCurrentBook: (bookId: string) => void;
  setCurrentChapter: (chapter: number) => void;
  
  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (bookId: string, chapter: number, verse: number) => boolean;
  
  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  removeNote: (id: string) => void;
  
  // Font size
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('bible-app-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Bible reading state
  const [currentBook, setCurrentBook] = useState('gen');
  const [currentChapter, setCurrentChapter] = useState(1);
  
  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('bible-app-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Notes
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('bible-app-notes');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Font size
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem('bible-app-font-size');
    return (saved as 'small' | 'medium' | 'large') || 'medium';
  });
  
  // Effects for persistence
  useEffect(() => {
    localStorage.setItem('bible-app-dark-mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    localStorage.setItem('bible-app-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  useEffect(() => {
    localStorage.setItem('bible-app-notes', JSON.stringify(notes));
  }, [notes]);
  
  useEffect(() => {
    localStorage.setItem('bible-app-font-size', fontSize);
  }, [fontSize]);
  
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setBookmarks(prev => [...prev, newBookmark]);
  };
  
  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };
  
  const isBookmarked = (bookId: string, chapter: number, verse: number) => {
    return bookmarks.some(b => b.bookId === bookId && b.chapter === chapter && b.verse === verse);
  };
  
  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
  };
  
  const removeNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <AppContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      currentBook,
      currentChapter,
      setCurrentBook,
      setCurrentChapter,
      bookmarks,
      addBookmark,
      removeBookmark,
      isBookmarked,
      notes,
      addNote,
      removeNote,
      fontSize,
      setFontSize,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
