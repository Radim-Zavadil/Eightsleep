import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, Link } from 'react-native-feather';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

const SleepDebtComponent = () => {
  const { user } = useAuth();
  const [sleepDebt, setSleepDebt] = useState<string>('-6h 6m');
  const [sleepGoal, setSleepGoal] = useState<number>(0);
  const [lastSleepDuration, setLastSleepDuration] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSleepData = async () => {
      if (!user) return;

      try {
        // Fetch sleep goal from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('sleep_goal_hours')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData?.sleep_goal_hours) {
          setSleepGoal(profileData.sleep_goal_hours);
        } else {
          // Default sleep goal if not set
          setSleepGoal(8);
        }

        // Fetch last sleep session
        const { data: sleepData, error: sleepError } = await supabase
          .from('sleep_sessions')
          .select('duration')
          .eq('profile_id', user.id)
          .not('end_time', 'is', null)
          .order('end_time', { ascending: false })
          .limit(1)
          .single();

        if (!sleepError && sleepData?.duration) {
          setLastSleepDuration(sleepData.duration);
        } else {
          setLastSleepDuration(0);
        }
      } catch (error) {
        console.error('Error fetching sleep data:', error);
        setSleepGoal(8);
        setLastSleepDuration(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      // Calculate sleep debt: sleep goal - last sleep length
      const debt = sleepGoal - lastSleepDuration;
      
      // Convert to hours and minutes
      const hours = Math.floor(Math.abs(debt));
      const minutes = Math.round((Math.abs(debt) - hours) * 60);
      
      // Format the display string
      const sign = debt >= 0 ? '+' : '-';
      setSleepDebt(`${sign}${hours}h ${minutes}m`);
    }
  }, [sleepGoal, lastSleepDuration, loading]);

  // Determine color based on sleep debt
  const getSleepDebtColor = () => {
    if (loading) return '#30FA48'; // Default color while loading
    
    const debt = sleepGoal - lastSleepDuration;
    return debt >= 0 ? '#E2706E' : '#30FA48';
  };

  return (
    <TouchableOpacity 
      style={{
        height: 138,
        borderRadius: 20,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: "#141414",
        overflow: 'hidden',
        marginTop: 5
      }}
    >
      <Image
        source={require('../assets/images/whiteBlurs.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
      
      <View style={{
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
              }}
            >
              <Text 
                style={{
                color: '#FFFFFF',
                fontSize: 10,
                letterSpacing: 1,
                fontWeight: '500',
                fontFamily: "Inter",
                opacity: 0.9
                }}
              >
                SLEEP DEBT
              </Text>
            </View>
          <ChevronRight width={24} height={24} color="#8E8E93" />
        </View>
        
        <Text style={{
          color: getSleepDebtColor(),
          fontSize: 30,
          fontWeight: '500',
          textAlign: 'center',
          fontFamily: "Inter"
        }}>
          {sleepDebt}
        </Text>
        
        <Text style={{
          color: '#8E8E93',
          fontSize: 12,
          textAlign: 'center',
          fontFamily: "Inter"
        }}>
          Sleep between <Text style={{ color: 'white' }}>1:59 AM - 2:29 AM</Text> tonight, to get a minimum recommended sleep of <Text style={{ color: 'white' }}>6h 45m</Text> of sleep.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SleepDebtComponent;