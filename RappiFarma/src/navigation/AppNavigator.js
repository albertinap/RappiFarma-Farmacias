import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import PrincipalScreen from "../screens/PrincipalScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Principal" component={PrincipalScreen} />
    </Stack.Navigator>
  );
/*Este navegador se encarga de contener el stack principal
 (decide si mostrar Login o Dashboard, según si hay sesión iniciada).*/}
