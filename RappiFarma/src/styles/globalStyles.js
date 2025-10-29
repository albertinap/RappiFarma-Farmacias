/*Estilos base para toda la app*/
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background3,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: { //el formulario
    width: "30%",
    minWidth: 350, //si lo minimizan, que no se deforme
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 25,
    color: theme.colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign:"center",
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textMuted,
    marginBottom: 20,
    textAlign:"center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: "center",
    transform: [{ translateX: -20 }], // mueve 20px hacia la izquierda, para que parezca centrado
  },
});

