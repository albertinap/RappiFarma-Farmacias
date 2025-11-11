import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Mis pantallas
// import RegisterScreen from "../screens/RegisterScreen"; // ya no va mas
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen"; 
import { UserProvider } from "../context/UserContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <UserProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        {/*<Stack.Screen name="Register" component={RegisterScreen} />*/}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </UserProvider>
  );
}

