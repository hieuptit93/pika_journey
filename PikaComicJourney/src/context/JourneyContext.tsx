import React, { createContext, useContext, useState, ReactNode } from 'react';
import { KidData, InteractionState, ScreenId } from '../types';

interface JourneyContextType {
  kid: KidData;
  setKid: React.Dispatch<React.SetStateAction<KidData>>;
  interaction: InteractionState;
  setInteraction: React.Dispatch<React.SetStateAction<InteractionState>>;
  currentScreen: ScreenId;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenId>>;
}

const defaultKid: KidData = {
  name: '',
  age: '',
  duration: '',
  extra: '',
  speaking: 0,
  vocab: 0,
  grammar: 0,
};

const defaultInteraction: InteractionState = {
  lessonsOpened: 0,
  fitChoice: '',
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [kid, setKid] = useState<KidData>(defaultKid);
  const [interaction, setInteraction] = useState<InteractionState>(defaultInteraction);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(0);

  return (
    <JourneyContext.Provider
      value={{
        kid,
        setKid,
        interaction,
        setInteraction,
        currentScreen,
        setCurrentScreen,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
