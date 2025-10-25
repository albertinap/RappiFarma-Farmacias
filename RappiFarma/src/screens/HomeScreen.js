/*Aca va a estar el dashboard principal*/
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../styles/theme"; // Importamos nuestros colores globales

// Este componente simula el "Dashboard Principal" de la farmacia
const HomeScreen = () => {
  return (
    // ScrollView permite hacer scroll si el contenido es largo
    <ScrollView style={styles.container}>

      {/* Header con el nombre de la farmacia */}
      <View style={styles.header}>
        <Text style={styles.title}>Farmacia Central</Text>
        <Text style={styles.subtitle}>Dashboard Principal</Text>
        <Text style={styles.description}>
          Vista general de pedidos activos, pendientes y completados
        </Text>
      </View>

      {/* Sección de tarjetas de resumen (Pedidos pendientes, enviados, etc.) */}
      <View style={styles.cardsContainer}>

        {/* Tarjeta 1 */}
        <View style={[styles.card, { backgroundColor: "#FFF5E6" }]}>
          <Text style={styles.cardTitle}>Pedidos Pendientes</Text>
          <Text style={styles.cardValue}>2</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>

        {/* Tarjeta 2 */}
        <View style={[styles.card, { backgroundColor: "#E6EEFF" }]}>
          <Text style={styles.cardTitle}>Cotizaciones Enviadas</Text>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>

        {/* Tarjeta 3 */}
        <View style={[styles.card, { backgroundColor: "#E6FFF0" }]}>
          <Text style={styles.cardTitle}>Pedidos Adjudicados</Text>
          <Text style={styles.cardValue}>3</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>

        {/* Tarjeta 4 */}
        <View style={[styles.card, { backgroundColor: "#F5E6FF" }]}>
          <Text style={styles.cardTitle}>Pedidos Entregados</Text>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>
      </View>

      {/* Sección de actividad reciente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>

        {/* Pedido 1 */}
        <View style={styles.activityItem}>
          <View style={styles.activityLeft}>
            <View style={styles.activityIcon} />
            <View>
              <Text style={styles.activityName}>María García</Text>
              <Text style={styles.activityDetail}>Amoxicilina 500mg</Text>
            </View>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.activityLocation}>Miraflores</Text>
            <Text style={[styles.status, { backgroundColor: "#FFF8E1", color: "#9A7400" }]}>
              Pendiente
            </Text>
          </View>
        </View>

        {/* Pedido 2 */}
        <View style={styles.activityItem}>
          <View style={styles.activityLeft}>
            <View style={styles.activityIcon} />
            <View>
              <Text style={styles.activityName}>Juan Pérez</Text>
              <Text style={styles.activityDetail}>Ibuprofeno 400mg</Text>
            </View>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.activityLocation}>San Isidro</Text>
            <Text style={[styles.status, { backgroundColor: "#E3F2FD", color: "#0D47A1" }]}>
              En preparación
            </Text>
          </View>
        </View>

        {/* Pedido 3 */}
        <View style={styles.activityItem}>
          <View style={styles.activityLeft}>
            <View style={styles.activityIcon} />
            <View>
              <Text style={styles.activityName}>Ana Torres</Text>
              <Text style={styles.activityDetail}>Paracetamol 500mg</Text>
            </View>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.activityLocation}>Surco</Text>
            <Text style={[styles.status, { backgroundColor: "#E8F5E9", color: "#1B5E20" }]}>
              Listo para envío
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // permite que se ajusten al ancho de la pantalla
    justifyContent: "space-between",
  },
  card: {
    width: "47%", // dos tarjetas por fila
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: theme.colors.text,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 4,
  },
  cardChange: {
    fontSize: 12,
    color: "green",
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colors.text,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 12,
    height: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    marginRight: 10,
  },
  activityName: {
    fontWeight: "bold",
    color: theme.colors.text,
  },
  activityDetail: {
    color: theme.colors.textMuted,
  },
  activityRight: {
    alignItems: "flex-end",
  },
  activityLocation: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  status: {
    marginTop: 3,
    fontWeight: "bold",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
});
