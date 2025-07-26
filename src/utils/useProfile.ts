import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import { Profile } from '../types/profile';

export function useProfile(user: { id: string } | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data && !data.dob && data.date_of_birth) {
          data.dob = data.date_of_birth;
        }
        setProfile(data as Profile);
        setProfileLoading(false);
      });
  }, [user]);

  return { profile, profileLoading };
} 