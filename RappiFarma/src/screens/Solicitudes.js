import { ScrollView, View, Text, StyleSheet, TouchableOpacity , Image } from "react-native";
import React, { useEffect, useState } from "react";
import { listenPendingRequests } from "../features/requests/listen";; 
import { theme } from "../styles/theme"; 
import { globalStyles } from "../styles/globalStyles"; 
import CotizacionButton from "../components/CotizacionButton";
import Toast from "react-native-toast-message";

const Solicitudes = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsub = listenPendingRequests(setRequests);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  // Función personalizada para manejar el envío de cotizaciones
  const handleQuoteSubmit = (quoteData) => {
    console.log("Cotización enviada:", quoteData);   
    Toast.show({
            type: "success",
            text1: "Cotización enviada",
            text2: `Has cotizado $ ${quoteData.monto} para ${quoteData.medication}`,
          });     
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Farmacia Central</Text>
        <Text style={styles.subtitle}>Solicitudes pendientes</Text>
        <Text style={styles.description}>
          Solicitudes de clientes de pedidos de medicamentos con receta - Envía tu mejor oferta
        </Text>
      </View>

      {/* Solicitudes pendientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitudes</Text>

          
        {Array.isArray(requests) && requests.length === 0 ? (
          <Text style={styles.noRequests}>
            No tienes solicitudes de pedidos en este momento.
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
                style={styles.requestCard}
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

                {/* Medicamento y botón */}
                <View style={styles.medicationRow}> 
                  <Text style={styles.medicationName}>
                    {`Medicamento #${index + 1}`}
                  </Text>
                  <CotizacionButton
                    request={req}
                    onQuoteSubmit={handleQuoteSubmit}
                    buttonText="Enviar Cotización"                  
                  />
                </View>   

                {/* Detalles del cliente */}
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Cliente: </Text>
                    {req?.clientName || `Cliente #${index + 1}`}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Zona: </Text>
                    {req?.district || "Sin especificar"}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Fecha: </Text>
                    {req?.date || "27/10/2025"}      
                  </Text>          
                </View>                                                   
              </View>               
            </View>
          )}
      ))}
      </View>
    </ScrollView>   
       
  );
};

export default Solicitudes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  noRequests: {
    color: theme.colors.textMuted,
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  medicationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 12,
  },
  quoteButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
  },
  quoteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  detailsContainer: {
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    paddingLeft: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
    lineHeight: 20,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#333333",
  },
  additionalInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  additionalText: {
    fontSize: 12,
    color: "#888888",
    fontStyle: "italic",
  },
});

