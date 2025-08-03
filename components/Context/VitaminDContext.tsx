import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface VitaminDContextType {
  showVitaminDWidget: boolean;
  setShowVitaminDWidget: (show: boolean) => void;
  loading: boolean;
}

const VitaminDContext = createContext<VitaminDContextType | undefined>(undefined);

interface VitaminDProviderProps {
  children: ReactNode;
}

export const VitaminDProvider: React.FC<VitaminDProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [showVitaminDWidget, setShowVitaminDWidgetState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWidget = async () => {
      if (!user) {
        setShowVitaminDWidgetState(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('user_widgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('widget_id', 'vitamin_d')
        .single();
      setShowVitaminDWidgetState(!!data);
      setLoading(false);
    };
    fetchWidget();
  }, [user]);

  const setShowVitaminDWidget = useCallback(
    async (show: boolean) => {
      if (!user) return;
      setShowVitaminDWidgetState(show);
      if (show) {
        await supabase.from('user_widgets').upsert([
          {
            user_id: user.id,
            widget_id: 'vitamin_d',
          }
        ], { onConflict: 'user_id,widget_id' });
      } else {
        await supabase
          .from('user_widgets')
          .delete()
          .eq('user_id', user.id)
          .eq('widget_id', 'vitamin_d');
      }
    },
    [user]
  );

  return (
    <VitaminDContext.Provider value={{ showVitaminDWidget, setShowVitaminDWidget, loading }}>
      {children}
    </VitaminDContext.Provider>
  );
};

export const useVitaminDContext = (): VitaminDContextType => {
  const context = useContext(VitaminDContext);
  if (context === undefined) {
    throw new Error('useVitaminDContext must be used within a VitaminDProvider');
  }
  return context;
};