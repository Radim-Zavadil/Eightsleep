import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BedroomScoreContextType {
  score: number;
  setScore: (score: number) => void;
}

const BedroomScoreContext = createContext<BedroomScoreContextType | undefined>(undefined);

export const BedroomScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);
  return (
    <BedroomScoreContext.Provider value={{ score, setScore }}>
      {children}
    </BedroomScoreContext.Provider>
  );
};

export const useBedroomScore = () => {
  const context = useContext(BedroomScoreContext);
  if (!context) {
    throw new Error('useBedroomScore must be used within a BedroomScoreProvider');
  }
  return context;
}; 