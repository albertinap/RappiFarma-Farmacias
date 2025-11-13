{/*import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Sidebar from "../components/Sidebar";
import MisPedidos from "./MisPedidos";
import Solicitudes from "./Solicitudes";
import Pendientes from "./Pendientes";
import Historial from "./Historial";

export default function HomeScreen() {
  const [active, setActive] = useState("MisPedidos");

  const renderContent = () => {
    switch (active) {    
      case "Solicitudes":
        return <Solicitudes />;
      case "MisPedidos":
        return <MisPedidos />;
      case "Pendientes":
        return <Pendientes />;  
      case "Historial":
        return <Historial />;            
      default:
        return <MisPedidos />;
    }
  };

  return (
    <View style={styles.container}>
      {/*<Sidebar active={active} setActive={setActive} />*/}
      {/*
      <Sidebar
        active={active}
        setActive={setActive}
        counts={{
          "Solicitudes": 3,
          "Pendientes": 5,
          "Mis pedidos": 2,
          "Historial": 0,
        }}
        newFlags={{
          "Solicitudes": true,   // muestra en naranja (nuevo)
          "Pendientes": false,
          "Mis pedidos": false,
          "Historial": false,
          
        }}
/>
      
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
});*/}


import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

import Sidebar from "../components/Sidebar";
import Solicitudes from "../screens/Solicitudes";
import Pendientes from "../screens/Pendientes";
import MisPedidos from "../screens/MisPedidos";
import Historial from "../screens/Historial";

  export default function HomeScreen() {
    const [active, setActive] = useState("Mis pedidos");
    const [counts, setCounts] = useState({
      Solicitudes: 0,
      Pendientes: 0,
      "Mis pedidos": 0,
      Historial: 0,
    });
    const [newFlags, setNewFlags] = useState({
      Solicitudes: false,
      Pendientes: false,
      "Mis pedidos": false,
      Historial: false,
    });

    const handleCountChange = (screen, count) => {
      setCounts((prev) => {
        const prevCount = prev[screen] ?? 0;

        // 🧠 Evita el parpadeo 1→0→1: solo actualiza si el nuevo valor es distinto
        // y además ignora cambios momentáneos a 0 si antes había un número >0
        if (count === 0 && prevCount > 0) {
          // ignorar actualizaciones "vacías" temporales
          return prev;
        }

        // 🔸 Si aumentó el número y no estamos en la pantalla actual → marcar como nuevo
        if (count > prevCount && active !== screen) {
          setNewFlags((f) => ({ ...f, [screen]: true }));
        }

        // 🔸 Si es el mismo o menor, mantenemos los flags actuales
        if (count === prevCount) return prev;

        return { ...prev, [screen]: count };
      });
    };


    // 🔸 Cuando el usuario entra a una screen, solo limpiamos el flag, NO tocamos los counts
    const handleOpenScreen = (screen) => {
      setActive(screen);
      setNewFlags((prev) => ({ ...prev, [screen]: false }));
    };

    const renderContent = () => {
      switch (active) {
        case "Solicitudes":
          return (
            <Solicitudes
              onCountChange={(c) => handleCountChange("Solicitudes", c)}
            />
          );
        case "Pendientes":
          return (
            <Pendientes
              onCountChange={(c) => handleCountChange("Pendientes", c)}
            />
          );
        case "Mis pedidos":
          return (
            <MisPedidos
              onCountChange={(c) => handleCountChange("Mis pedidos", c)}
            />
          );
        case "Historial":
          return (
            <Historial
              onCountChange={(c) => handleCountChange("Historial", c)}
            />
          );
        default:
          return (
            <MisPedidos
              onCountChange={(c) => handleCountChange("Mis pedidos", c)}
            />
          );
      }
    };



    return (
      <View style={styles.container}>
        <Sidebar
          active={active}
          counts={counts}
          newFlags={newFlags}
          onOpenScreen={handleOpenScreen}
        />
        <View style={styles.content}>{renderContent()}</View>
      </View>
    );
  }




const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
});
