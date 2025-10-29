import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { theme } from "../styles/theme";
import { globalStyles } from "../styles/globalStyles";
import { validarMail } from "../utils/validarMail";
import PasswordInput from "../components/inputs/PasswordInput";
import Toast from "react-native-toast-message";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!validarMail(email)) {
      Toast.show({
        type: "error",
        text1: "Correo inválido",
        text2: "Ingresá un correo electrónico válido.",
      });
      return;
    }

    if (password.trim() === "" || confirmPassword.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Campos vacíos",
        text2: "Completá todos los campos antes de continuar.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Contraseñas no coinciden",
        text2: "Asegurate de escribir la misma contraseña en ambos campos.",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Registro exitoso",
      text2: "Ya podés iniciar sesión en RappiFarma.",
    });

    // Navegar al login una vez registrado
    navigation.navigate("Login");
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.formContainer}>
        <Image
          source={require("../../assets/adaptive-icon.png")}
          style={globalStyles.logo}
          resizeMode="contain"
        />
        <Text style={globalStyles.title}>Registrarse</Text>
        <Text style={globalStyles.subtitle}>Creá tu cuenta en RappiFarma</Text>
        
        <Text style={styles.Text}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="farmacia@ejemplo.com"
          placeholderTextColor={theme.colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.Text}>Ingrese una contraseña (debe tener al menos 6 caracteres)</Text>
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
        />

        <Text style={styles.Text}>Reescriba la contraseña para confirmar</Text>
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmar contraseña"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.registerText}>
            ¿Ya tenés una cuenta? <Text style={styles.registerLink}> Iniciá sesión</Text> {/*Este link se llama register porque es el mismo estilo nada más */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  registerText: {
    marginTop: 15,
    color: "#555",
    textAlign: "center",
  },
  registerLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  Text: {
    color: theme.colors.text,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 2,
  },
});
