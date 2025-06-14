import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ScreenContextType {
  showScreenWidget: boolean;
  setShowScreenWidget: (show: boolean) => void;
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

interface ScreenProviderProps {
  children: ReactNode;
}

export const ScreenProvider: React.FC<ScreenProviderProps> = ({ children }) => {
  const [showScreenWidget, setShowScreenWidget] = useState(false);
  
  return (
    <ScreenContext.Provider value={{ showScreenWidget, setShowScreenWidget }}>
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