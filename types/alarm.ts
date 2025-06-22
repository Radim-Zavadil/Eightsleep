export interface Alarm {
  id: string;
  name: string;
  time: string; // Format: "HH:MM"
  isEnabled: boolean;
  repeatDays: string[]; // Array of day abbreviations: ["Mon", "Wed", "Fri"]
  createdAt: string;
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; 