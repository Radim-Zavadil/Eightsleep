import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface ScreenContextType {
  showScreenWidget: boolean;
  setShowScreenWidget: (show: boolean) => void;
  loading: boolean;
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

interface ScreenProviderProps {
  children: ReactNode;
}

export const ScreenProvider: React.FC<ScreenProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [showScreenWidget, setShowScreenWidgetState] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch widget state from Supabase on mount
  useEffect(() => {
    const fetchWidget = async () => {
      if (!user) {
        setShowScreenWidgetState(false);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('user_widgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('widget_id', 'screentime')
        .single();
      setShowScreenWidgetState(!!data);
      setLoading(false);
    };
    fetchWidget();
  }, [user]);

  // Update both local state and Supabase
  const setShowScreenWidget = useCallback(
    async (show: boolean) => {
      if (!user) return;
      setShowScreenWidgetState(show);
      if (show) {
        // Add to Supabase
        await supabase.from('user_widgets').upsert([
          {
            user_id: user.id,
            widget_id: 'screentime',
          }
        ], { onConflict: 'user_id,widget_id' });
      } else {
        // Remove from Supabase
        await supabase
          .from('user_widgets')
          .delete()
          .eq('user_id', user.id)
          .eq('widget_id', 'screentime');
      }
    },
    [user]
  );

  return (
    <ScreenContext.Provider value={{ showScreenWidget, setShowScreenWidget, loading }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreenContext = (): ScreenContextType => {
  const context = useContext(ScreenContext);
  if (context === undefined) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }
  return context;
};