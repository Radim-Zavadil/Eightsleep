import React, { createContext, useState, useContext, ReactNode } from 'react';

interface VitaminDContextType {
  showVitaminDWidget: boolean;
  setShowVitaminDWidget: (show: boolean) => void;
}

const VitaminDContext = createContext<VitaminDContextType | undefined>(undefined);

interface VitaminDProviderProps {
  children: ReactNode;
}

export const VitaminDProvider: React.FC<VitaminDProviderProps> = ({ children }) => {
  const [showVitaminDWidget, setShowVitaminDWidget] = useState(false);
  
  return (
    <VitaminDContext.Provider value={{ showVitaminDWidget, setShowVitaminDWidget }}>
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