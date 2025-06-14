import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SmartContextType {
  showSmartWidget: boolean;
  setShowSmartWidget: (show: boolean) => void;
}

const SmartContext = createContext<SmartContextType | undefined>(undefined);

interface SmartProviderProps {
  children: ReactNode;
}

export const SmartProvider: React.FC<SmartProviderProps> = ({ children }) => {
  const [showSmartWidget, setShowSmartWidget] = useState(false);
  
  return (
    <SmartContext.Provider value={{ showSmartWidget, setShowSmartWidget }}>
      {children}
    </SmartContext.Provider>
  );
};

export const useSmartContext = (): SmartContextType => {
  const context = useContext(SmartContext);
  if (context === undefined) {
    throw new Error('useSmartContext must be used within a SmartProvider');
  }
  return context;
};