import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginEmailScreen from '../screens/LoginEmailScreen';
import LoginPasswordScreen from '../screens/LoginPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LoginEmail" component={LoginEmailScreen} />
      <Stack.Screen name="LoginPassword" component={LoginPasswordScreen} />
    </Stack.Navigator>
  );
} 