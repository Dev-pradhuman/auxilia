import { create } from 'zustand';

interface ErrorState {
  showRateLimitDialog: boolean;
  triggerRateLimitError: () => void;
  closeRateLimitDialog: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  showRateLimitDialog: false,
  triggerRateLimitError: () => set({ showRateLimitDialog: true }),
  closeRateLimitDialog: () => set({ showRateLimitDialog: false }),
}));
