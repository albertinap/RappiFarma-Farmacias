import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native"; //son todos componentes nativos de react-n


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 para mostrar/ocultar contraseña


  const handleLogin = () => { //función de login
    // Validación simple:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, ingresá un correo válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setError(""); // limpia el error si está todo bien
    console.log("Correo:", email);
    console.log("Contraseña:", password);
    // más adelante conectamos esto con Firebase
  };

  return ( //lo que va acá abajo es lo que muestra la app en pantalla
    <View style={styles.container}> 
      <View style={styles.card}>
        <Image
          source={require("../../assets/icon.png")} //el primer view es de fondo de pantalla, el segundo es de fondo de formulario
          style={styles.logo} 
        /> 
        
        <Text style={styles.title}>RappiFarma Farmacias</Text> 
        <Text style={styles.subtitle}> 
          Inicia sesión para acceder al panel de gestión
        </Text>

        <TextInput //campos de texto
          style={styles.input}
          placeholder="farmacia@ejemplo.com"
          placeholderTextColor="#b1b0b0ff" //esto lo agrego porque lo quería más clarito
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Campo de contraseña más completo */}
        <View style={styles.passwordContainer}>
            <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#b1b0b0ff"
            secureTextEntry={!showPassword} //oculta/muestra la contraseña mientras escribo--touchableOpacity es un boton tocable
            value={password}
            onChangeText={setPassword}
            />
            <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            <Text style={{ color: "#ff442b" }}>
              {showPassword ? "Ocultar" : "Ver"}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null} {/*operador ternario corta la bocha*/}

        <TouchableOpacity style={styles.button} onPress={handleLogin} /*onPress-> acción que dispara el botón*/ > 
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //ocupa toda la pantalla
    backgroundColor: "#fff8f3",
    justifyContent: "center", //centro verticalmente
    alignItems: "center", //y horizontalmente
  },
  card: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#ff442b",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  forgotText: {
    color: "#ff442b",
    marginTop: 15,
    fontSize: 13,
  },
});
