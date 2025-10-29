import { useState , useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image , Alert } from "react-native"; //son todos componentes nativos de react-n
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { theme } from "../styles/theme";
import { globalStyles } from "../styles/globalStyles";
import { validarMail } from "../utils/validarMail"; 
import PasswordInput from "../components/inputs/PasswordInput";

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Función para manejar el login
  const handleLogin = () => {
    if (!validarMail(email)) {
      Toast.show({
      type: "error",
      text1: "Correo inválido",
      text2: "Por favor, ingresá un correo electrónico válido.",});
      return;
    }
    if (password.length < 6) { //acordate que acá el atributo va sin ()
      Toast.show({
      type: "error",
      text1: "La contraseña debe tener al menos 6 caracteres.",});
      return;
    }
    // Si cumple todo, entra la función real de login
    Toast.show({
      type: "success",
      text1: "Login exitoso",
      text2: `Bienvenido ${email}`,
    });
    navigation.navigate("Home");
  };

  //recién acá arranca el return
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.formContainer}>
        <Image
          source={require("../../assets/adaptive-icon.png")}
          style={globalStyles.logo}
          resizeMode="contain"
        />
        <Text style={globalStyles.title}>RappiFarma Farmacias</Text>
        <Text style={globalStyles.subtitle}>Ingresá tus datos para acceder a tu cuenta</Text>

        <Text style={styles.Text}>Correo electrónico</Text>
        <TextInput /*este boton no lo puse en components porque no tiene nada custom*/
          style={styles.input}
          placeholder="farmacia@ejemplo.com"
          placeholderTextColor={theme.colors.textMuted}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.Text}>Contraseña</Text>
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
        />  

          <TouchableOpacity style={styles.button} onPress={() => handleLogin(email, password)}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        <Text style={styles.registerText}>
            ¿No tenés cuenta?          
        <TouchableOpacity onPress={() => navigation.navigate("Register")}> 
          <Text style={styles.registerLink}> Registrate</Text>
        </TouchableOpacity> {/*Acá abajo no es RegisterScreen porque en el AppNavigator le puse nombre "Register"*/}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Text: {
    color: theme.colors.text,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 2,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: theme.colors.secondary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    width:"40%",
    alignSelf:"center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    alignSelf:"center"
  },
  registerText: {
  marginTop: 15,
  color: theme.colors.text,
  textAlign: "center",
},
  registerLink: {
  color: theme.colors.primary,
  fontWeight: "bold",
},
});