import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CaffeineContextType {
  showCaffeineWidget: boolean;
  setShowCaffeineWidget: (show: boolean) => void;
}

const CaffeineContext = createContext<CaffeineContextType | undefined>(undefined);

interface CaffeineProviderProps {
  children: ReactNode;
}

export const CaffeineProvider: React.FC<CaffeineProviderProps> = ({ children }) => {
  const [showCaffeineWidget, setShowCaffeineWidget] = useState(false);
  
  return (
    <CaffeineContext.Provider value={{ showCaffeineWidget, setShowCaffeineWidget }}>
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