import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { theme } from "../styles/theme";
import PasswordInput from "../components/inputs/PasswordInput";
import Toast from "react-native-toast-message";
import { signUpPharmacy } from "../features/auth/actions";

export default function RegisterScreen({ navigation }) {
  const [nombreFarmacia, setNombreFarmacia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const nf = nombreFarmacia.trim();
    const tel = telefono.trim();
    const dir = direccion.trim();
    const mail = email.trim();
    const pass = password;

    if (!nf || !tel || !dir || !mail) {
      Toast.show({ type: "error", text1: "Completá todos los campos" });
      return;
    }
    if (!pass || pass.length < 6) {
      Toast.show({ type: "error", text1: "Contraseña mínima 6 caracteres" });
      return;
    }

    try {
      setLoading(true);
      await signUpPharmacy(mail, pass, nf, tel, dir);
      Toast.show({ type: "success", text1: "Registro exitoso" });
      navigation.navigate("Login");
    } catch (e) {
      const map = {
        "auth/email-already-in-use": "El correo ya está registrado",
        "auth/invalid-email": "Email inválido",
        "auth/weak-password": "Contraseña débil",
      };
      Toast.show({ type: "error", text1: map[e?.code] || "Error al registrar" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icon.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>Creá tu cuenta en RappiFarma</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Registrarse</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de farmacia"
          placeholderTextColor={theme.colors.textMuted}
          value={nombreFarmacia}
          onChangeText={setNombreFarmacia}
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor={theme.colors.textMuted}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Dirección"
          placeholderTextColor={theme.colors.textMuted}
          value={direccion}
          onChangeText={setDireccion}
        />

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

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "..." : "Crear cuenta"}</Text>
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
  container:{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#E8F0FE", padding:20 },
  logo:{ width:120, height:120, marginBottom:10, transform:[{ translateX:-10 }] },
  subtitle:{ fontSize:16, color:"#333", marginBottom:20 },
  formContainer:{
    width:"90%", maxWidth:400, backgroundColor:"#fff", borderRadius:20, padding:25,
    shadowColor:"#000", shadowOpacity:0.15, shadowOffset:{ width:0, height:2 }, shadowRadius:5, elevation:5
  },
  title:{ fontSize:22, color:theme.colors.primary, fontWeight:"bold", marginBottom:20, textAlign:"center" },
  input:{
    width:"100%", height:50, borderColor:theme.colors.secondary, borderWidth:1,
    borderRadius:10, paddingHorizontal:10, marginBottom:15, color: theme.colors.text
  },
  button:{ backgroundColor:theme.colors.primary, padding:15, borderRadius:10, marginTop:10 },
  buttonText:{ color:"#fff", fontWeight:"bold", textAlign:"center" },
  registerText:{ marginTop:15, color:"#555", textAlign:"center" },
  registerLink:{ color:theme.colors.primary, fontWeight:"bold" },
});
