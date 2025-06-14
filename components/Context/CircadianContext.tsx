import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CircadianContextType {
  showCircadianWidget: boolean;
  setShowCircadianWidget: (show: boolean) => void;
}

const CircadianContext = createContext<CircadianContextType | undefined>(undefined);

interface CircadianProviderProps {
  children: ReactNode;
}

export const CircadianProvider: React.FC<CircadianProviderProps> = ({ children }) => {
  const [showCircadianWidget, setShowCircadianWidget] = useState(false);
  
  return (
    <CircadianContext.Provider value={{ showCircadianWidget, setShowCircadianWidget }}>
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