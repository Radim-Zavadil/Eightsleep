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

// Helper function to parse text_content into title and content
const parseTextContent = (textContent: string): { title: string; content: string } => {
  const lines = textContent.split('\n');
  const title = lines[0] || 'Journal Entry';
  const content = lines.slice(1).join('\n');
  return { title, content };
};

// Helper function to combine title and content into text_content
const combineTitleAndContent = (title: string, content: string): string => {
  if (title && title !== 'Journal Entry') {
    return `${title}\n${content}`;
  }
  return content;
};

export const JournalProvider = ({ children }: JournalProviderProps) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch entries from Supabase on mount
  useEffect(() => {
    if (!user) {
      console.log('JournalContext: No user found, skipping fetch');
      return;
    }
    setLoading(true);
    
    const fetchEntries = async () => {
      try {
        console.log('JournalContext: Fetching entries for user:', user.id);
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching journal entries:', error);
          setEntries([]);
        } else if (data) {
          console.log('JournalContext: Fetched entries:', data.length);
          const parsedEntries = data.map((row: any) => {
            const { title, content } = parseTextContent(row.text_content || '');
            return {
              id: row.entry_id,
              title,
              content,
              date: row.created_at || row.date,
            };
          });
          setEntries(parsedEntries);
        }
      } catch (error) {
        console.error('Error in fetchEntries:', error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  // Add entry to Supabase
  const addEntry = useCallback(async (entryData: { title: string; content: string }) => {
    if (!user) {
      console.error('No user found, cannot add entry');
      return;
    }

    try {
      const text_content = combineTitleAndContent(entryData.title, entryData.content);
      console.log('JournalContext: Adding entry with text_content:', text_content);
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          profile_id: user.id,
          date: formatDateYMD(new Date()),
          text_content,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting journal entry:', error);
        return;
      }

      if (data) {
        console.log('JournalContext: Entry inserted successfully:', data);
        const { title, content } = parseTextContent(data.text_content);
        const newEntry: Entry = {
          id: data.entry_id,
          title,
          content,
          date: data.created_at || data.date,
        };
        
        setEntries(prev => [newEntry, ...prev]);
      }
    } catch (error) {
      console.error('Error in addEntry:', error);
    }
  }, [user]);

  // Update entry in Supabase
  const updateEntry = useCallback(async (id: string, entryData: { title: string; content: string }) => {
    if (!user) {
      console.error('No user found, cannot update entry');
      return;
    }

    try {
      const text_content = combineTitleAndContent(entryData.title, entryData.content);
      
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          text_content,
        })
        .eq('entry_id', id)
        .eq('profile_id', user.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating journal entry:', error);
        return;
      }

      if (data) {
        const { title, content } = parseTextContent(data.text_content);
        setEntries(prev => prev.map(e => e.id === id ? {
          ...e,
          title,
          content,
          date: data.created_at || data.date,
        } : e));
      }
    } catch (error) {
      console.error('Error in updateEntry:', error);
    }
  }, [user]);

  // Delete entry from Supabase
  const deleteEntry = useCallback(async (id: string) => {
    if (!user) {
      console.error('No user found, cannot delete entry');
      return;
    }

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('entry_id', id)
        .eq('profile_id', user.id);

      if (error) {
        console.error('Error deleting journal entry:', error);
        return;
      }

      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error in deleteEntry:', error);
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