import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AppScreen = 'welcome' | 'play' | 'topics' | 'journey' | 'parents' | 'faq';

interface AppContextType {
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  stars: number;
  addStars: (n?: number) => void;
  selectedZone: number | null;
  setSelectedZone: (zone: number | null) => void;
  selectedPlay: string | null;
  setSelectedPlay: (play: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [stars, setStars] = useState(0);
  const [selectedZone, setSelectedZone] = useState<number | null>(1);
  const [selectedPlay, setSelectedPlay] = useState<string | null>('story');

  const addStars = (n = 1) => setStars(prev => prev + n);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        stars,
        addStars,
        selectedZone,
        setSelectedZone,
        selectedPlay,
        setSelectedPlay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
