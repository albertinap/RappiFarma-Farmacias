import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from "react-native-toast-message";
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>        
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Registro' }}
        />
      </Stack.Navigator>
      <Toast/>
    </NavigationContainer>
  );
}

