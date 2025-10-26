import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { theme } from "../styles/theme";
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
    <View style={styles.container}>
      <Image
        source={require("../../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Creá tu cuenta en RappiFarma</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Registrarse</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={theme.colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
        />

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
            ¿Ya tenés una cuenta? <Text style={styles.registerLink}> Iniciá sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    transform: [{ translateX: -10 }], // ajustá si tu logo parece descentrado
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
});
