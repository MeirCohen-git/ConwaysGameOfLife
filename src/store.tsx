import { create } from "zustand";
import { gridRow } from "./calcaulations/rules";

export type BolleanInt = 0 | 1;

interface LifeStore {
  isOnDrawing: boolean;
  generation: number;
  population: BolleanInt[];
  incrementGeneration: () => void;
  toggleIsOnDrawing: () => void;
  toggleCell: (cellNumber: number) => void;
  reset: () => void;
}

const grid = gridRow * gridRow;

const useLifeStore = create<LifeStore>((set, get) => {
  return {
    generation: 0,
    incrementGeneration: () => {
      set((state) => ({ generation: state.generation + 1 }));
    },
    isOnDrawing: true,
    toggleIsOnDrawing: () => {
      set({ isOnDrawing: !get().isOnDrawing });
    },
    population: Array.from({ length: grid }, () => 0),
    toggleCell: (cellNumber: number) => {
      set((state) => {
        const newPopulation = state.population.slice();
        newPopulation[cellNumber] = newPopulation[cellNumber] === 0 ? 1 : 0;
        return { population: newPopulation };
      });
    },
    reset: () =>
      set({
        isOnDrawing: true,
        generation: 0,
        population: Array.from({ length: grid }, () => 0),
      }),
  };
});

export { useLifeStore };
