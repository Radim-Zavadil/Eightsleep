import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface CircadianContextType {
  showCircadianWidget: boolean;
  setShowCircadianWidget: (show: boolean) => void;
  loading: boolean;
}

const CircadianContext = createContext<CircadianContextType | undefined>(undefined);

interface CircadianProviderProps {
  children: ReactNode;
}

export const CircadianProvider: React.FC<CircadianProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [showCircadianWidget, setShowCircadianWidgetState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWidget = async () => {
      if (!user) {
        setShowCircadianWidgetState(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('user_widgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('widget_id', 'circadian')
        .single();
      setShowCircadianWidgetState(!!data);
      setLoading(false);
    };
    fetchWidget();
  }, [user]);

  const setShowCircadianWidget = useCallback(
    async (show: boolean) => {
      if (!user) return;
      setShowCircadianWidgetState(show);
      if (show) {
        await supabase.from('user_widgets').upsert([
          {
            user_id: user.id,
            widget_id: 'circadian',
          }
        ], { onConflict: 'user_id,widget_id' });
      } else {
        await supabase
          .from('user_widgets')
          .delete()
          .eq('user_id', user.id)
          .eq('widget_id', 'circadian');
      }
    },
    [user]
  );

  return (
    <CircadianContext.Provider value={{ showCircadianWidget, setShowCircadianWidget, loading }}>
      {children}
    </CircadianContext.Provider>
  );
};

export const useCircadianContext = (): CircadianContextType => {
  const context = useContext(CircadianContext);
  if (context === undefined) {
    throw new Error('useCircadianContext must be used within a CircadianProvider');
  }
  return context;
};