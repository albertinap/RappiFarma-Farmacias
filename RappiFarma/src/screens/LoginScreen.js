import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import Toast from "react-native-toast-message";
import { theme } from "../styles/theme";
import { globalStyles } from "../styles/globalStyles";
import PasswordInput from "../components/PasswordInput";
import { loginWithEmail } from "../features/auth/actions";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const mail = email.trim().toLowerCase();
    const pass = password;        

    try {
      setLoading(true);
      await loginWithEmail(mail, pass);
      Toast.show({ type: "success", text1: "Login exitoso" });
      navigation.navigate("Home"); 
    } catch (e) {      
      const map = {
        "auth/invalid-credential": "Usuario o contraseña incorrectos",
        "auth/user-not-found": "Usuario no encontrado",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/too-many-requests": "Demasiados intentos. Probá más tarde",
        "auth/invalid-email": "Email inválido",
      };
      Toast.show({
        type: "error",
        text1: map[e?.code] || "Error al iniciar sesión",
        text2: e.message || "Intentá nuevamente.",
      });      
    } finally {
      setLoading(false);
    }
  };
  //el usuario y contraseña no encontrados no los tira más, por motivos de seguridad (firebase)

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
        <TextInput
          style={styles.input}
          placeholder="farmacia@ejemplo.com"
          placeholderTextColor={theme.colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.Text}>Contraseña</Text>
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "..." : "Iniciar sesión"}</Text>
        </TouchableOpacity>
        
        {/*
        <Text style={styles.registerText}>
          ¿No tenés cuenta?
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}> Registrate</Text>
          </TouchableOpacity>
        </Text>
        */}  

      </View>      
    </View>
  );
}

const styles = StyleSheet.create({
  Text: { color: theme.colors.text, fontWeight: "bold", textAlign: "left", marginBottom: 2 },
  input: {
    width: "100%", height: 50, borderColor: theme.colors.secondary, borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 10, marginBottom: 15,
  },
  button: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 10, width: "40%", alignSelf: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", alignSelf: "center" },
  registerText: { marginTop: 15, color: theme.colors.text, textAlign: "center" },
  registerLink: { color: theme.colors.primary, fontWeight: "bold" },
});
