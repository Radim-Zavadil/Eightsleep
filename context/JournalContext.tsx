import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Entry } from '@/types/journal';

interface JournalContextType {
  entries: Entry[];
  entryCount: number;
  addEntry: (entryData: { title: string; content: string }) => void;
  updateEntry: (id: string, entryData: { title: string; content: string }) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => Entry | undefined;
  getDailyEntryCounts: () => Record<string, number>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournalContext = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournalContext must be used within a JournalProvider');
  }
  return context;
};

interface JournalProviderProps {
  children: ReactNode;
}

// Helper function to get day offset from today
const getDayOffset = (dateString: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const entryDate = new Date(dateString);
  entryDate.setHours(0, 0, 0, 0);
  
  const diffTime = entryDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays.toString();
};

// Helper function to format a date as YYYY-MM-DD
const formatDateYMD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const JournalProvider = ({ children }: JournalProviderProps) => {
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: '1',
      title: 'Title',
      content: 'About today...',
      date: new Date().toISOString(),
    },
  ]);

  const addEntry = useCallback((entryData: { title: string; content: string }) => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      title: entryData.title,
      content: entryData.content,
      date: new Date().toISOString(),
    };
    
    setEntries(prevEntries => [newEntry, ...prevEntries]);
  }, []);

  const updateEntry = useCallback((id: string, entryData: { title: string; content: string }) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id 
          ? { ...entry, title: entryData.title, content: entryData.content }
          : entry
      )
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  }, []);

  const getEntryById = useCallback((id: string) => {
    return entries.find(entry => entry.id === id);
  }, [entries]);

  // Calculate daily entry counts for the past week
  const getDailyEntryCounts = useCallback(() => {
    // Initialize with default counts for last 6 days, today, and tomorrow
    const counts: Record<string, number> = {
      '-6': 0, '-5': 0, '-4': 0, '-3': 0, '-2': 0, '-1': 0, '0': 0, '1': 0
    };
    
    // Group entries by day offset from today
    entries.forEach(entry => {
      const dayOffset = getDayOffset(entry.date);
      // Only count if within our range (-6 to +1 days)
      if (parseInt(dayOffset) >= -6 && parseInt(dayOffset) <= 1) {
        counts[dayOffset] = (counts[dayOffset] || 0) + 1;
      }
    });
    
    return counts;
  }, [entries]);

  return (
    <JournalContext.Provider 
      value={{ 
        entries, 
        entryCount: entries.length,
        addEntry, 
        updateEntry, 
        deleteEntry,
        getEntryById,
        getDailyEntryCounts,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};