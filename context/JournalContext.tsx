import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Entry } from '@/types/journal';
import { supabase } from '@/utils/supabase';
import { useAuth } from './AuthContext';

interface JournalContextType {
  entries: Entry[];
  entryCount: number;
  addEntry: (entryData: { title: string; content: string }) => Promise<void>;
  updateEntry: (id: string, entryData: { title: string; content: string }) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
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

const getDayOffset = (dateString: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const entryDate = new Date(dateString);
  entryDate.setHours(0, 0, 0, 0);
  const diffTime = entryDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays.toString();
};

const formatDateYMD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const JournalProvider = ({ children }: JournalProviderProps) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch entries from Supabase on mount
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('journal_entries')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setEntries([]);
        } else if (data) {
          setEntries(
            data.map((row: any) => ({
              id: row.entry_id,
              title: row.title || (row.text_content?.split('\n')[0] || 'Journal Entry'),
              content: row.text_content,
              date: row.created_at || row.date,
            }))
          );
        }
        setLoading(false);
      });
  }, [user]);

  // Add entry to Supabase
  const addEntry = useCallback(async (entryData: { title: string; content: string }) => {
    if (!user) return;
    const text_content = entryData.title ? `${entryData.title}\n${entryData.content}` : entryData.content;
    const { error } = await supabase
      .from('journal_entries')
      .insert({
        profile_id: user.id,
        date: formatDateYMD(new Date()),
        text_content,
      });
    if (error) {
      console.error('Error inserting journal entry:', error);
      return;
    }
    // Always refetch after insert to ensure consistency
    const { data, error: fetchError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });
    if (fetchError) {
      console.error('Error fetching journal entries after insert:', fetchError);
      return;
    }
    if (data) {
      setEntries(
        data.map((row: any) => {
          const lines = (row.text_content || '').split('\n');
          return {
            id: row.entry_id,
            title: row.title || (lines[0] || 'Journal Entry'),
            content: lines.length > 1 ? lines.slice(1).join('\n') : '',
            date: row.created_at || row.date,
          };
        })
      );
    }
  }, [user]);

  // Update entry in Supabase
  const updateEntry = useCallback(async (id: string, entryData: { title: string; content: string }) => {
    if (!user) return;
    const text_content = entryData.title ? `${entryData.title}\n${entryData.content}` : entryData.content;
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        text_content,
        // title: entryData.title, // Uncomment if title column exists
      })
      .eq('entry_id', id)
      .eq('profile_id', user.id)
      .select('*')
      .single();
    if (!error && data) {
      setEntries(prev => prev.map(e => e.id === id ? {
        ...e,
        title: entryData.title,
        content: entryData.content,
        date: data.created_at || data.date,
      } : e));
    }
  }, [user]);

  // Delete entry from Supabase
  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('entry_id', id)
      .eq('profile_id', user.id);
    if (!error) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  }, [user]);

  const getEntryById = useCallback((id: string) => {
    return entries.find(entry => entry.id === id);
  }, [entries]);

  const getDailyEntryCounts = useCallback(() => {
    const counts: Record<string, number> = {
      '-6': 0, '-5': 0, '-4': 0, '-3': 0, '-2': 0, '-1': 0, '0': 0, '1': 0
    };
    entries.forEach(entry => {
      const dayOffset = getDayOffset(entry.date);
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