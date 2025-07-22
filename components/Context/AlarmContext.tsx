import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Alarm } from '@/types/alarm';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface AlarmContextType {
  showSmartWidget: boolean;
  setShowSmartWidget: (show: boolean) => void;
  loading: boolean;
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

interface AlarmProviderProps {
  children: ReactNode;
}

export const SmartProvider: React.FC<AlarmProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [showSmartWidget, setShowSmartWidgetState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      name: 'Wake Me Up',
      time: '08:00',
      isEnabled: true,
      repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Weekend Alarm',
      time: '09:30',
      isEnabled: false,
      repeatDays: ['Sat', 'Sun'],
      createdAt: new Date().toISOString(),
    },
  ]);

  // Fetch widget state from Supabase on mount
  useEffect(() => {
    const fetchWidget = async () => {
      if (!user) {
        setShowSmartWidgetState(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('user_widgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('widget_id', 'smart_alarm')
        .single();
      setShowSmartWidgetState(!!data);
      setLoading(false);
    };
    fetchWidget();
  }, [user]);

  // Update both local state and Supabase
  const setShowSmartWidget = useCallback(
    async (show: boolean) => {
      if (!user) return;
      setShowSmartWidgetState(show);
      if (show) {
        await supabase.from('user_widgets').upsert([
          {
            user_id: user.id,
            widget_id: 'smart_alarm',
          }
        ], { onConflict: 'user_id,widget_id' });
      } else {
        await supabase
          .from('user_widgets')
          .delete()
          .eq('user_id', user.id)
          .eq('widget_id', 'smart_alarm');
      }
    },
    [user]
  );

  const addAlarm = useCallback((alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAlarms(prev => [...prev, newAlarm]);
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id 
          ? { ...alarm, isEnabled: !alarm.isEnabled }
          : alarm
      )
    );
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  }, []);

  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id 
          ? { ...alarm, ...updates }
          : alarm
      )
    );
  }, []);

  return (
    <AlarmContext.Provider value={{ 
      showSmartWidget, 
      setShowSmartWidget, 
      loading,
      alarms, 
      addAlarm, 
      toggleAlarm, 
      deleteAlarm, 
      updateAlarm 
    }}>
      {children}
    </AlarmContext.Provider>
  );
};

export const useSmartContext = (): AlarmContextType => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useSmartContext must be used within a SmartProvider');
  }
  return context;
};