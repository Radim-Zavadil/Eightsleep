import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingCycleLengthScreen from '../screens/OnboardingCycleLengthScreen';
import OnboardingCycleRegularityScreen from '../screens/OnboardingCycleRegularityScreen';
import OnboardingDOBScreen from '../screens/OnboardingDOBScreen';
import OnboardingEmailScreen from '../screens/OnboardingEmailScreen';
import OnboardingGoalScreen from '../screens/OnboardingGoalScreen';
import OnboardingNotificationsScreen from '../screens/OnboardingNotificationsScreen';
import OnboardingPasswordScreen from '../screens/OnboardingPasswordScreen';
import OnboardingPhoneScreen from '../screens/OnboardingPhoneScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingEmail" component={OnboardingEmailScreen} />
      <Stack.Screen name="OnboardingPassword" component={OnboardingPasswordScreen} />
      <Stack.Screen name="OnboardingDOB" component={OnboardingDOBScreen} />
      <Stack.Screen name="OnboardingPhone" component={OnboardingPhoneScreen} />
      <Stack.Screen name="OnboardingCycleLength" component={OnboardingCycleLengthScreen} />
      <Stack.Screen name="OnboardingCycleRegularity" component={OnboardingCycleRegularityScreen} />
      <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
      <Stack.Screen name="OnboardingNotifications" component={OnboardingNotificationsScreen} />
    </Stack.Navigator>
  );
} 