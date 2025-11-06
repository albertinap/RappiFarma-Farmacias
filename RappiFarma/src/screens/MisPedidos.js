import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { listenPendingRequests } from "../features/requests/listen";
import { theme } from "../styles/theme"; 
import EstadoPedido from "../components/EstadoPedido";


const MisPedidos = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsub = listenPendingRequests(setRequests);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header con el nombre de la farmacia */}
      <View style={styles.header}>
        <Text style={styles.title}>Farmacia Central</Text>
        <Text style={styles.subtitle}>Administración y gestión de pedidos adjudicados </Text>
        <Text style={styles.description}>
          Actualiza el estado de cada pedido en tiempo real
        </Text>
      </View>      

      {/* Los pedidos que está administrando ahora la farmacia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis pedidos</Text>

        {Array.isArray(requests) && requests.length === 0 ? (
          <Text style={{ color: theme.colors.textMuted }}>
            No tienes pedidos adjudicados en este momento.
          </Text>
        ) : (
          (requests || []).map((req, index) => {
            const firstImage =
              Array.isArray(req?.images) &&
              req.images.length > 0 &&
              typeof req.images[0] === "string"
                ? req.images[0]
                : null;

            return (
              <View
                key={req?.id ?? String(Math.random())}
                style={styles.activityItem}
              >
                <View style={styles.activityLeft}>
                  {firstImage ? (
                    <Image
                      source={{ uri: firstImage }}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 8,
                        marginRight: 10,
                      }}
                    />
                  ) : (
                    <View style={styles.activityIcon} />
                  )}
                  <View>
                    <Text style={styles.activityName}>Pedido #{index + 1} </Text>
                    <Text style={styles.activityDetail}>
                      {(req?.status ?? "pendiente")} ·{" "}
                      {(req?.images?.length ?? 0)} imagen(es)
                    </Text>
                  </View>
                </View>

                {/*componente (sólo visual) para cambiar el estado*/}
                <View style={styles.activityRight}>
                  <EstadoPedido />
                </View>
                                             
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default MisPedidos;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#1A1A1A" 
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: theme.colors.primary, 
    marginTop: 4 
  },
  description: { 
    fontSize: 14, 
    color: "#666666", 
    marginTop: 8,
    lineHeight: 20 
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 5,
  },
  cardChange: {
    fontSize: 12,
    color: "#777",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityRight: {
    alignItems: "flex-end",
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
});

