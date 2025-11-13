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



{/*import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

import Sidebar from "../components/Sidebar";
import Solicitudes from "../screens/Solicitudes";
import Pendientes from "../screens/Pendientes";
import MisPedidos from "../screens/MisPedidos";
import Historial from "../screens/Historial";

const HomeScreen = () => {
  const [active, setActive] = useState("MisPedidos");
  const [offers, setOffers] = useState([]); // Estado para las ofertas

  const [counts, setCounts] = useState({
    Solicitudes: 0,
    Pendientes: 0,
    MisPedidos: 0,
    Historial: 0,
  });

  const [newFlags, setNewFlags] = useState({
    Solicitudes: false,
    Pendientes: false,
    MisPedidos: false,
    Historial: false,
  });

  // 🔥 Escuchar ofertas desde Firebase
  useEffect(() => {
    const q = query(collection(db, "offers")); // Ajusta según tu estructura
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const offersData = [];
      querySnapshot.forEach((doc) => {
        offersData.push({ id: doc.id, ...doc.data() });
      });
      setOffers(offersData);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Calcular counts cuando cambian las ofertas
  useEffect(() => {
    if (!Array.isArray(offers)) return;

    // Definir claramente qué envioState corresponde a cada pantalla
    const nuevas = offers.filter((o) => o.state === "Abierto" || o.state === "Abierto").length;
    const pendientes = offers.filter((o) => o.envioState === "Pendiente" || o.envioState === "pendiente").length;
    const misPedidos = offers.filter((o) => o.envioState === "Pendiente" || o.envioState === "en curso").length;
    const entregados = offers.filter((o) => o.envioState === "Entregado" || o.envioState === "entregado").length;

    const newCounts = {
      Solicitudes: nuevas,
      Pendientes: pendientes,
      MisPedidos: misPedidos,
      Historial: entregados,
    };

    console.log("📊 Calculando counts:", newCounts); // Para debug
    console.log("SOLICITUDES ANASHEEEE:", nuevas); // Para debug

    // 🔔 Detectar cambios para mostrar notificaciones
    setCounts((prevCounts) => {
      const updatedFlags = { ...newFlags };
      
      Object.keys(newCounts).forEach((key) => {
        // Si el count aumentó Y no es la pantalla activa, marcar como nuevo
        if (newCounts[key] > (prevCounts[key] || 0) && active !== key) {
          updatedFlags[key] = true;
        }
      });

      setNewFlags(updatedFlags);
      return newCounts;
    });
  }, [offers, active]);


  const handleOpenScreen = (screen) => {
    setActive(screen);
    // Al abrir la pantalla, quitar el flag "nuevo"
    setNewFlags((prev) => ({ ...prev, [screen]: false }));
  };

  const renderScreen = () => {
    switch (active) {
      case "Solicitudes":
        return <Solicitudes offers={offers.filter(o => o.envioState === "Nuevo" || o.envioState === "nuevo")} />;
      case "Pendientes":
        return <Pendientes offers={offers.filter(o => o.envioState === "Pendiente" || o.envioState === "pendiente")} />;
      case "MisPedidos":
        return <MisPedidos offers={offers.filter(o => o.envioState === "En curso" || o.envioState === "en curso")} />;
      case "Historial":
        return <Historial offers={offers.filter(o => o.envioState === "Entregado" || o.envioState === "entregado")} />;
      default:
        return <MisPedidos offers={offers.filter(o => o.envioState === "En curso" || o.envioState === "en curso")} />;
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
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </View>
  );
};

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

export default HomeScreen;*/}
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUser } from "../context/UserContext";

import Sidebar from "../components/Sidebar";
import Solicitudes from "../screens/Solicitudes";
import Pendientes from "../screens/Pendientes";
import MisPedidos from "../screens/MisPedidos";
import Historial from "../screens/Historial";

const HomeScreen = () => {
  const [active, setActive] = useState("MisPedidos");
  const [offers, setOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const userData = useUser();

  const [counts, setCounts] = useState({
    Solicitudes: 0,
    Pendientes: 0,
    MisPedidos: 0,
    Historial: 0,
  });

  const [newFlags, setNewFlags] = useState({
    Solicitudes: false,
    Pendientes: false,
    MisPedidos: false,
    Historial: false,
  });

  // 🔥 Escuchar OFERTAS desde Firebase
  useEffect(() => {
    const q = query(collection(db, "offers"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const offersData = [];
      querySnapshot.forEach((doc) => {
        offersData.push({ id: doc.id, ...doc.data() });
      });
      setOffers(offersData);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Escuchar REQUESTS desde Firebase
  useEffect(() => {
    const q = query(collection(db, "requests"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsData = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({ id: doc.id, ...doc.data() });
      });
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Calcular counts y detectar cambios para newFlags
  useEffect(() => {
    if (!userData?.nombreFarmacia) return;

    console.log("Total de offers:", offers.length);
    console.log("Total de requests:", requests.length);
    console.log("Farmacia actual:", userData.nombreFarmacia);

    // Calcular nuevos counts
    const solicitudesCount = requests.filter(request => 
      request?.state === "pendiente" && 
      request?.farmacia === userData.nombreFarmacia
    ).length;

    const pendientesCount = offers.filter(offer => 
      offer?.state === "Pendiente" && 
      offer?.farmacia === userData.nombreFarmacia
    ).length;

    const misPedidosCount = offers.filter(offer => {
      const estado = offer?.state?.toLowerCase();
      const estadoEnvio = offer?.envioState?.toLowerCase();
      return estado === "aceptada" && 
             estadoEnvio !== "entregado" && 
             offer?.farmacia === userData.nombreFarmacia;
    }).length;

    const historialCount = offers.filter(offer => 
      offer?.envioState === "Entregado" && 
      offer?.farmacia === userData.nombreFarmacia
    ).length;

    const newCounts = {
      Solicitudes: solicitudesCount,
      Pendientes: pendientesCount,
      MisPedidos: misPedidosCount,
      Historial: historialCount,
    };

    console.log("📊 Counts calculados:", newCounts);

    // 🔔 LÓGICA MEJORADA PARA newFlags
    setCounts((prevCounts) => {
      const updatedFlags = { ...newFlags };
      
      // Verificar cada pantalla
      Object.keys(newCounts).forEach((screen) => {
        const countIncreased = newCounts[screen] > prevCounts[screen];
        const isNotActiveScreen = screen !== active;
        
        // Si el count aumentó Y no es la pantalla activa, marcar como nuevo
        if (countIncreased && isNotActiveScreen) {
          updatedFlags[screen] = true;
          console.log(`🎯 ${screen} marcado como NUEVO (count: ${prevCounts[screen]} → ${newCounts[screen]})`);
        }
      });

      // Actualizar los flags
      setNewFlags(updatedFlags);
      
      return newCounts;
    });
  }, [offers, requests, userData?.nombreFarmacia, active]); // Agregar active como dependencia

  const handleOpenScreen = (screen) => {
    console.log(`🔄 Cambiando a pantalla: ${screen}`);
    setActive(screen);
    // Al abrir la pantalla, quitar el flag "nuevo" de esa pantalla
    setNewFlags((prev) => {
      const updated = { ...prev, [screen]: false };
      console.log(`✅ ${screen} ya no es nuevo`);
      return updated;
    });
  };

  const renderScreen = () => {
    if (!userData?.nombreFarmacia) {
      return <Text>Cargando...</Text>;
    }

    switch (active) {
      case "Solicitudes":
        const solicitudesFiltradas = requests.filter(request => 
          request?.state === "pendiente" && 
          request?.farmacia === userData.nombreFarmacia
        );
        return <Solicitudes requests={solicitudesFiltradas} />;

      case "Pendientes":
        const pendientesFiltradas = offers.filter(offer => 
          offer?.state === "Pendiente" && 
          offer?.farmacia === userData.nombreFarmacia
        );
        return <Pendientes offers={pendientesFiltradas} />;

      case "MisPedidos":
        const misPedidosFiltradas = offers.filter(offer => {
          const estado = offer?.state?.toLowerCase();
          const estadoEnvio = offer?.envioState?.toLowerCase();
          return estado === "aceptada" && 
                 estadoEnvio !== "entregado" && 
                 offer?.farmacia === userData.nombreFarmacia;
        });
        return <MisPedidos offers={misPedidosFiltradas} />;

      case "Historial":
        const historialFiltradas = offers.filter(offer => 
          offer?.envioState === "Entregado" && 
          offer?.farmacia === userData.nombreFarmacia
        );
        return <Historial offers={historialFiltradas} />;

      default:
        return <MisPedidos offers={[]} />;
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
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </View>
  );
};

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

export default HomeScreen;