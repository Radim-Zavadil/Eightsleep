import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, Link } from 'react-native-feather';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { getSleepGoalFromBirthdate } from '../utils/getSleepGoalFromBirthdate';

const SleepDebtComponent = () => {
  const { user } = useAuth();
  const [sleepDebt, setSleepDebt] = useState<string>('-6h 6m');
  const [sleepGoal, setSleepGoal] = useState<number>(0);
  const [todaysSleepDuration, setTodaysSleepDuration] = useState<number>(0);
  const [lastSleepStartTime, setLastSleepStartTime] = useState<Date | null>(null);
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    const fetchSleepData = async () => {
      if (!user) return;

      try {
        // Fetch user profile for date of birth to calculate sleep goal
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('id', user.id)
          .single();

        let goalHours = 8; // Default
        if (!profileError && profileData?.date_of_birth) {
          const goalString = getSleepGoalFromBirthdate(profileData.date_of_birth);
          // Extract hours from string like "8h 30m" or "8 hours"
          const hoursMatch = goalString.match(/(\d+(?:\.\d+)?)\s*h/);
          const minutesMatch = goalString.match(/(\d+)\s*m/);
          
          if (hoursMatch) {
            goalHours = parseFloat(hoursMatch[1]);
            if (minutesMatch) {
              goalHours += parseInt(minutesMatch[1]) / 60;
            }
          }
        }
        setSleepGoal(goalHours);

        // Get today's date range (start of today to start of tomorrow)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch today's sleep sessions
        const { data: sleepData, error: sleepError } = await supabase
          .from('sleep_sessions')
          .select('duration')
          .eq('profile_id', user.id)
          .not('end_time', 'is', null)
          .gte('end_time', today.toISOString())
          .lt('end_time', tomorrow.toISOString())
          .order('end_time', { ascending: false });

        if (!sleepError && sleepData && sleepData.length > 0) {
          // Sum all sleep sessions for today (in case there are multiple naps)
          const totalDuration = sleepData.reduce((sum, session) => sum + (session.duration || 0), 0);
          setTodaysSleepDuration(totalDuration);
        } else {
          setTodaysSleepDuration(0);
        }

        // Fetch the most recent sleep session start time
        const { data: lastSleepData, error: lastSleepError } = await supabase
          .from('sleep_sessions')
          .select('start_time')
          .eq('profile_id', user.id)
          .not('start_time', 'is', null)
          .order('start_time', { ascending: false })
          .limit(1);

        if (!lastSleepError && lastSleepData && lastSleepData.length > 0) {
          setLastSleepStartTime(new Date(lastSleepData[0].start_time));
        }

      } catch (error) {
        console.error('Error fetching sleep data:', error);
        setSleepGoal(8);
        setTodaysSleepDuration(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      // Calculate sleep debt: sleep goal - today's total sleep
      const debt = sleepGoal - todaysSleepDuration;
      
      // Convert to hours and minutes
      const hours = Math.floor(Math.abs(debt));
      const minutes = Math.round((Math.abs(debt) - hours) * 60);
      
      // Format the display string
      const sign = debt >= 0 ? '+' : '-';
      setSleepDebt(`${sign}${hours}h ${minutes}m`);

      // Calculate recommendation text
      if (lastSleepStartTime) {
        // FIXED: Just use the sleep goal for wake up time calculation
        // The wake up time should be start time + sleep goal duration
        const wakeUpTime = new Date(lastSleepStartTime.getTime() + sleepGoal * 60 * 60 * 1000);
        
        // Calculate number of 20-minute naps needed to cover debt (only if debt is positive)
        const napsNeeded = Math.max(0, Math.ceil(Math.max(0, debt) / (20/60))); // 20 minutes = 1/3 hour
        
        const startTimeFormatted = formatTime(lastSleepStartTime);
        const wakeUpTimeFormatted = formatTime(wakeUpTime);
        const goalFormatted = formatDuration(sleepGoal);
        
        if (debt > 0 && napsNeeded > 0) {
          // If there's a positive debt, suggest naps
          setRecommendationText(
            `Sleep between ${startTimeFormatted} - ${wakeUpTimeFormatted} tonight, to get a minimum recommended sleep of ${goalFormatted} of sleep or take ${napsNeeded}x 20m naps.`
          );
        } else {
          // If no debt or negative debt (surplus sleep), just show the normal recommendation
          setRecommendationText(
            `Sleep between ${startTimeFormatted} - ${wakeUpTimeFormatted} tonight, to get a minimum recommended sleep of ${goalFormatted} of sleep.`
          );
        }
      } else {
        setRecommendationText(
          `Get a minimum recommended sleep of ${formatDuration(sleepGoal)} of sleep tonight.`
        );
      }
    }
  }, [sleepGoal, todaysSleepDuration, lastSleepStartTime, loading]);

  // Determine color based on sleep debt
  const getSleepDebtColor = () => {
    if (loading) return '#30FA48'; // Default color while loading
    
    const debt = sleepGoal - todaysSleepDuration;
    return debt >= 0 ? '#E2706E' : '#30FA48';
  };

  // Function to render recommendation text with proper styling
  const renderRecommendationText = () => {
    if (!recommendationText) return null;

    // Split the text and identify parts that should be white
    const parts = recommendationText.split(/(\d{1,2}:\d{2}\s*[AP]M|\d+h\s*\d*m?|\d+x\s*20m)/g);
    
    return (
      <Text style={{
        color: '#8E8E93',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: "Inter"
      }}>
        {parts.map((part, index) => {
          // Check if this part should be white (times, durations, naps)
          const isHighlight = /(\d{1,2}:\d{2}\s*[AP]M|\d+h\s*\d*m?|\d+x\s*20m)/.test(part);
          
          return (
            <Text 
              key={index}
              style={{ 
                color: isHighlight ? 'white' : '#8E8E93' 
              }}
            >
              {part}
            </Text>
          );
        })}
      </Text>
    );
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
        
        {renderRecommendationText()}
      </View>
    </TouchableOpacity>
  );
};

export default SleepDebtComponent;