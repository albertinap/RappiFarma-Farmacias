{/*import React, { useEffect, useState } from "react";
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

  // Escuchar OFERTAS desde Firebase
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

  // Escuchar REQUESTS desde Firebase
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

export default HomeScreen;*/}

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useUser } from "../context/UserContext";
import { listenPendingRequests, listenPendingOffers } from "../features/requests/listen"; 
import { listenInboxRequests } from "../features/inbox/listen"; 

import Sidebar from "../components/Sidebar";
import Solicitudes from "../screens/Solicitudes";
import Pendientes from "../screens/Pendientes";
import MisPedidos from "../screens/MisPedidos";
import Historial from "../screens/Historial";

const HomeScreen = () => {
  const [active, setActive] = useState("MisPedidos");
  const [offers, setOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [inbox, setInbox] = useState([]);
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

  // Escuchar OFERTAS 
  useEffect(() => {
    const unsubscribe = listenPendingOffers((offersData) => {
      setOffers(offersData);
    });

    return () => unsubscribe();
  }, []);

  // Escuchar REQUESTS 
  useEffect(() => {
    const unsubscribe = listenPendingRequests((requestsData) => {
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, []);

  // Escuchar INBOX - VERSIÓN CORREGIDA
  useEffect(() => {
    if (!userData?.uid) return; // Esperar a tener el UID
    
    const unsubscribe = listenInboxRequests(userData.uid, (inboxData) => {
      setInbox(inboxData);
    });

    return () => unsubscribe();
  }, [userData?.uid]); // Agregar dependencia del UID

  // Calcular counts y detectar cambios para newFlags
  useEffect(() => {
    if (!userData?.nombreFarmacia) return;

    console.log("Total de offers:", offers.length);
    console.log("Total de requests:", requests.length);
    console.log("Farmacia actual:", userData.nombreFarmacia);

    // Calcular nuevos counts - IMPORTANTE: usa los mismos filtros que en cada pantalla
    const solicitudesCount = requests.filter(request => 
      // AJUSTA ESTE FILTRO según lo que uses en Solicitudes
      request?.farmacia === userData.nombreFarmacia &&
      request?.state === "pendiente" // o el campo/valor correcto
    ).length;

    const pendientesCount = offers.filter(offer => 
      offer?.farmacia === userData.nombreFarmacia &&
      offer?.envioState === "Pendiente"
    ).length;

    const misPedidosCount = offers.filter(offer => {
      return offer?.farmacia === userData.nombreFarmacia &&
             offer?.envioState === "En preparación"; // o "En curso" según tu lógica
    }).length;

    const historialCount = offers.filter(offer => 
      offer?.farmacia === userData.nombreFarmacia &&
      offer?.envioState === "Entregado"
    ).length;

    const newCounts = {
      Solicitudes: solicitudesCount,
      Pendientes: pendientesCount,
      MisPedidos: misPedidosCount,
      Historial: historialCount,
    };

    console.log("📊 Counts calculados:", newCounts);

    // 🔔 LÓGICA PARA newFlags
    setCounts((prevCounts) => {
      const updatedFlags = { ...newFlags };
      
      Object.keys(newCounts).forEach((screen) => {
        const countIncreased = newCounts[screen] > prevCounts[screen];
        const isNotActiveScreen = screen !== active;
        
        if (countIncreased && isNotActiveScreen) {
          updatedFlags[screen] = true;
          console.log(`🎯 ${screen} marcado como NUEVO (count: ${prevCounts[screen]} → ${newCounts[screen]})`);
        }
      });

      setNewFlags(updatedFlags);
      return newCounts;
    });
  }, [offers, requests, userData?.nombreFarmacia, active]);

  const handleOpenScreen = (screen) => {
    console.log(`🔄 Cambiando a pantalla: ${screen}`);
    setActive(screen);
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
          request?.farmacia === userData.nombreFarmacia &&
          request?.state === "pendiente" // AJUSTA SEGÚN TU FILTRO REAL
        );
        return <Solicitudes requests={solicitudesFiltradas} />;

      case "Pendientes":
        const pendientesFiltradas = offers.filter(offer => 
          offer?.farmacia === userData.nombreFarmacia &&
          offer?.envioState === "Pendiente"
        );
        return <Pendientes offers={pendientesFiltradas} />;

      case "MisPedidos":
        const misPedidosFiltradas = offers.filter(offer => 
          offer?.farmacia === userData.nombreFarmacia &&
          offer?.envioState === "En preparación" // AJUSTA SEGÚN TU FILTRO REAL
        );
        return <MisPedidos offers={misPedidosFiltradas} />;

      case "Historial":
        const historialFiltradas = offers.filter(offer => 
          offer?.farmacia === userData.nombreFarmacia &&
          offer?.envioState === "Entregado"
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