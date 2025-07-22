import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface CaffeineContextType {
  showCaffeineWidget: boolean;
  setShowCaffeineWidget: (show: boolean) => void;
  loading: boolean;
}

const CaffeineContext = createContext<CaffeineContextType | undefined>(undefined);

interface CaffeineProviderProps {
  children: ReactNode;
}

export const CaffeineProvider: React.FC<CaffeineProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [showCaffeineWidget, setShowCaffeineWidgetState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWidget = async () => {
      if (!user) {
        setShowCaffeineWidgetState(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('user_widgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('widget_id', 'caffeine')
        .single();
      setShowCaffeineWidgetState(!!data);
      setLoading(false);
    };
    fetchWidget();
  }, [user]);

  const setShowCaffeineWidget = useCallback(
    async (show: boolean) => {
      if (!user) return;
      setShowCaffeineWidgetState(show);
      if (show) {
        await supabase.from('user_widgets').upsert([
          {
            user_id: user.id,
            widget_id: 'caffeine',
          }
        ], { onConflict: 'user_id,widget_id' });
      } else {
        await supabase
          .from('user_widgets')
          .delete()
          .eq('user_id', user.id)
          .eq('widget_id', 'caffeine');
      }
    },
    [user]
  );

  return (
    <CaffeineContext.Provider value={{ showCaffeineWidget, setShowCaffeineWidget, loading }}>
      {children}
    </CaffeineContext.Provider>
  );
};

export const useCaffeineContext = (): CaffeineContextType => {
  const context = useContext(CaffeineContext);
  if (context === undefined) {
    throw new Error('useCaffeineContext must be used within a CaffeineProvider');
  }
  return context;
};