import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccessibilityProfile {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceFeedback: boolean;
  captions: boolean;
  simplifiedLanguage: boolean;
  hapticFeedback: boolean;
}

interface ProfileState {
  profile: AccessibilityProfile;
  hasCompletedOnboarding: boolean;
  updateProfile: (updates: Partial<AccessibilityProfile>) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const defaultProfile: AccessibilityProfile = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  voiceFeedback: false,
  captions: false,
  simplifiedLanguage: false,
  hapticFeedback: true,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      hasCompletedOnboarding: false,
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetProfile: () => set({ profile: defaultProfile, hasCompletedOnboarding: false }),
    }),
    {
      name: 'auxilia-accessibility-profile',
    }
  )
);
