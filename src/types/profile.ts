export interface Profile {
  id: string;
  email: string;
  phone?: string;
  dob?: string;
  cycle_length?: number;
  cycle_regularity?: string;
  goal?: string;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
} 