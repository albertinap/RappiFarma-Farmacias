import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { theme } from "../styles/theme";
import { listenPendingRequests } from "../features/requests/listen";

const HomeScreen = () => {
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
        <Text style={styles.subtitle}>Dashboard Principal</Text>
        <Text style={styles.description}>
          Vista general de pedidos activos, pendientes y completados
        </Text>
      </View>

      {/* Tarjetas de resumen */}
      <View style={styles.cardsContainer}>
        <View style={[styles.card, { backgroundColor: "#FFF5E6" }]}>
          <Text style={styles.cardTitle}>Pedidos Pendientes</Text>
          <Text style={styles.cardValue}>{requests.length}</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#E6EEFF" }]}>
          <Text style={styles.cardTitle}>Cotizaciones Enviadas</Text>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#E6FFF0" }]}>
          <Text style={styles.cardTitle}>Pedidos Adjudicados</Text>
          <Text style={styles.cardValue}>3</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#F5E6FF" }]}>
          <Text style={styles.cardTitle}>Pedidos Entregados</Text>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>
      </View>

      {/* Actividad Reciente (mock) */}
      <View style={styles.section}>
        {/* tu lista estática previa */}
      </View>

      {/* Solicitudes nuevas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitudes nuevas</Text>

        {Array.isArray(requests) && requests.length === 0 ? (
          <Text style={{ color: theme.colors.textMuted }}>Sin solicitudes pendientes</Text>
        ) : (
          (requests || []).map((req) => {
            const firstImage =
              Array.isArray(req?.images) && req.images.length > 0 && typeof req.images[0] === "string"
                ? req.images[0]
                : null;

            return (
              <View key={req?.id ?? String(Math.random())} style={styles.activityItem}>
                <View style={styles.activityLeft}>
                  {firstImage ? (
                    <Image
                      source={{ uri: firstImage }}
                      style={{ width: 56, height: 56, borderRadius: 8, marginRight: 10 }}
                    />
                  ) : (
                    <View style={styles.activityIcon} />
                  )}
                  <View>
                    <Text style={styles.activityName}>
                      {`Solicitud #${(req?.id ?? "").slice(0, 6) || "----"}`}
                    </Text>
                    <Text style={styles.activityDetail}>
                      {(req?.status ?? "pendiente")} · {(req?.images?.length ?? 0)} imagen(es)
                    </Text>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <Text style={[styles.status, { backgroundColor: "#FFF8E1", color: "#9A7400" }]}>
                    Pendiente
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primaryText,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  cardChange: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primaryText,
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#EEE",
    marginRight: 10,
  },
  activityName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  activityDetail: {
    fontSize: 13,
    color: "#666",
  },
  activityRight: {},
  status: {
    fontSize: 13,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: "hidden",
    textAlign: "center",
  },
});
