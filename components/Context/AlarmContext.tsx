import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Alarm } from '@/types/alarm';

interface AlarmContextType {
  showSmartWidget: boolean;
  setShowSmartWidget: (show: boolean) => void;
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
  const [showSmartWidget, setShowSmartWidget] = useState(false);
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