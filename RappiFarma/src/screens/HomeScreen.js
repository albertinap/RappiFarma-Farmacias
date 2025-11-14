
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

  // Escuchar REQUESTS (para otras pantallas)
  useEffect(() => {
    const unsubscribe = listenPendingRequests((requestsData) => {
      setRequests(requestsData);
    });
    return () => unsubscribe();
  }, []);

  // Escuchar INBOX - para SOLICITUDES
  useEffect(() => {
    if (!userData?.uid) return;
    
    const unsubscribe = listenInboxRequests(userData.uid, (inboxData) => {
      setInbox(inboxData);
    });

    return () => unsubscribe();
  }, [userData?.uid]);

  // Calcular counts y detectar cambios para newFlags
  useEffect(() => {
    if (!userData?.nombreFarmacia) return;

    console.log("Total de offers:", offers.length);
    console.log("Total de requests:", requests.length);
    console.log("Total de inbox:", inbox.length);
    console.log("Farmacia actual:", userData.nombreFarmacia);

    // CALCULAR COUNTS CON LOS FILTROS CORRECTOS:

    // 1. SOLICITUDES - usa INBOX (ya viene filtrada por farmacia desde listenInboxRequests)
    const solicitudesCount = inbox.length;

    // 2. PENDIENTES - usa OFFERS filtradas por farmacia y estado
    const pendientesCount = offers.filter(offer => 
      offer?.farmacia === userData.nombreFarmacia &&
      offer?.envioState === "Pendiente"
    ).length;

    // 3. MIS PEDIDOS - usa OFFERS filtradas por farmacia y estado
    const misPedidosCount = offers.filter(offer => {
      const estado = offer?.state?.toLowerCase();
      const estadoEnvio = offer?.envioState?.toLowerCase();
      return estado === "aceptada" && 
            estadoEnvio !== "entregado" && 
            offer?.farmacia === userData.nombreFarmacia;
    }).length;

    // 4. HISTORIAL - usa OFFERS filtradas por farmacia y estado
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
  }, [offers, requests, inbox, userData?.nombreFarmacia, active]); // Agregar inbox como dependencia

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
        // Para SOLICITUDES usar INBOX (ya viene filtrada por la farmacia)
        return <Solicitudes requests={inbox} />;

      case "Pendientes":
        const pendientesFiltradas = offers.filter(offer => 
          offer?.farmacia === userData.nombreFarmacia &&
          offer?.envioState === "Pendiente"
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