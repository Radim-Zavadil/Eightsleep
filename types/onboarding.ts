export interface OnboardingData {
  dateOfBirth: Date | null;
  weight: string;
  height: string;
  sportActivity: string;
  sleepGoal: number;
}

export interface OnboardingStep1Props {
  dateOfBirth: Date | null;
  onDateChange: (date: Date) => void;
  onContinue: () => void;
}

export interface OnboardingStep2Props {
  weight: string;
  onWeightChange: (weight: string) => void;
  onContinue: () => void;
}

export interface OnboardingStep3Props {
  height: string;
  onHeightChange: (height: string) => void;
  onContinue: () => void;
}

export interface OnboardingStep4Props {
  sportActivity: string;
  onSportActivityChange: (activity: string) => void;
  onContinue: () => void;
}

export interface OnboardingStep5Props {
  onboardingData: OnboardingData;
  onSleepGoalChange: (goal: number) => void;
  onComplete: () => void;
} 