import { NavigationContainer } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
}
