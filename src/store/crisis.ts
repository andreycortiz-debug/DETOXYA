import { create } from 'zustand';
import type { CrisisLevel } from '../engine/crisis';

interface CrisisState {
  active: boolean;
  level: CrisisLevel;
  source: string | null;
  open: (level: CrisisLevel, source: string) => void;
  close: () => void;
}

export const useCrisisStore = create<CrisisState>((set) => ({
  active: false,
  level: 'none',
  source: null,
  open: (level, source) => set({ active: true, level, source }),
  close: () => set({ active: false, level: 'none', source: null }),
}));
