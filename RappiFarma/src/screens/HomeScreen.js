import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Sidebar from "../components/Sidebar";
import MisPedidos from "./MisPedidos";
import Solicitudes from "./Solicitudes";
//import Gestion from "./"
// en el futuro: import CotizacionesContent, AdjudicadosContent, etc.

export default function HomeScreen() {
  const [active, setActive] = useState("MisPedidos");

  const renderContent = () => {
    switch (active) {    
      case "Solicitudes":
        return <Solicitudes />;
      case "MisPedidos":
        return <MisPedidos />;      
      default:
        return <MisPedidos />;
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar active={active} setActive={setActive} />
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // sidebar izquierda + contenido derecha
  },
  content: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
