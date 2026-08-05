export interface KidData {
  name: string;
  age: '4-5' | '6-7' | '8-9' | '10+' | '';
  duration: '<6m' | '6-12m' | '1-2y' | '2y+' | '';
  extra: 'center' | 'online' | 'none' | '';
  speaking: number; // 1-5
  vocab: number; // 1-5
  grammar: number; // 1-5
}

export interface InteractionState {
  lessonsOpened: number;
  fitChoice: 'yes' | 'maybe' | 'auto' | '';
}

export type PikaMood = 'happy' | 'wave' | 'thinking' | 'surprised' | 'excited' | 'teaching';

export type ScreenId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'f' | 'home' | 'qr';
