import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { listenPendingOffers } from "../features/requests/listen";
import { useUser } from "../context/UserContext";
import { theme } from "../styles/theme"; 
import EstadoPedido from "../components/EstadoPedido";

const MisPedidos = () => {  
  const [offers, setOffers] = useState([]);
  const userData = useUser(); //datos de la farmacia que los busco una única vez

  useEffect(() => {
    const unsub = listenPendingOffers(setOffers);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header con el nombre de la farmacia */}
      <View style={styles.header}>
        <Text style={styles.title}>{userData?.nombreFarmacia || "Cargando..."} </Text>
        <Text style={styles.subtitle}>Administración y gestión de pedidos adjudicados</Text>
        <Text style={styles.description}>
          Actualiza el estado de cada pedido en tiempo real
        </Text>
      </View>      

      {/* Los pedidos que está administrando ahora la farmacia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis pedidos</Text>

        {Array.isArray(offers) && offers.length === 0 ? (
          <Text style={styles.noPedidos}>
            No tienes pedidos adjudicados en este momento.
          </Text>
        ) : (
          (offers || [])
            .filter((offer) => {
              const estado = offer?.envioState?.toLowerCase();
              return estado !== "pendiente" && estado !== "entregado";
            })
            .map((offer, index) => {     
            console.log("STATE de cada offer:", offer.envioState);
            console.log("!!!!!!OFFER DATA:", offer);       
            return (
              <View
                key={offer?.id ?? String(Math.random())}
                style={styles.pedidoCard}
              >
                {/* Header del pedido */}
                <View style={styles.pedidoHeader}>
                  <Text style={styles.pedidoNumero}>Pedido #{index + 1}</Text>
                  <Text style={styles.pedidoFecha}>
                    {offer?.timeStamp
                      ? `${offer.timeStamp.toDate().toLocaleDateString()} - ${offer.timeStamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs`
                    : "Sin fecha"}
                  </Text>
                </View>              

                {/* Información del cliente */}
                <View style={styles.clienteSection}>
                  <Text style={styles.sectionLabel}>Información del Cliente</Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.clienteInfo}>Nombre y apellido: </Text>
                    {offer.user
                      ? `${offer.user.nombre ?? ""} ${offer.user.apellido ?? ""}`.trim()
                    : `Cliente #${index + 1}`} 
                  </Text>
                                    
                  <Text style={styles.clienteInfo}>
                    📞 {`${offer.user.telefono}`.trim() || "Teléfono no disponible"}
                  </Text>

                  <Text style={styles.clienteInfo}>
                    📍 { `${offer.user.direccion}`.trim() || "Dirección no disponible"}
                  </Text>
                </View>

                {/* Medicamentos solicitados */}
                <View style={styles.medicamentosSection}>
                  <Text style={styles.sectionLabel}>Medicamentos Solicitados</Text>
                  {offer?.medicamentos?.length > 0 ? (
                    offer.medicamentos.map((med, medIndex) => (
                      <View key={medIndex} style={styles.medicamentoItem}>
                        <Text style={styles.medicamentoNombre}>
                          💊 {med.nombreydosis || "Medicamento no especificado"}
                        </Text>
                        <Text style={styles.medicamentoDetalle}>
                          Cantidad: {med.cantidad || "No especificada"} • 
                          Precio: $ {med.precio || "0.00"}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noMedicamentos}>
                      No se especificaron medicamentos
                    </Text>
                  )}
                </View>                

                {/* Información de la cotización */}
                <View style={styles.cotizacionSection}>
                  <Text style={styles.sectionLabel}>Mi Cotización</Text>
                  <View style={styles.cotizacionInfo}>
                    <Text style={styles.cotizacionMonto}>
                      Monto total: $ {offer?.preciototal || "0.00"}
                    </Text>
                    <Text style={styles.cotizacionTiempo}>
                      ⏱️ Tiempo estimado: {offer?.tiempoEspera || "No especificado"} min
                    </Text>
                  </View>
                </View>

                {/* Estado del pedido */}
                <View style={styles.estadoSection}>
                  <Text style={styles.sectionLabel}>Estado Actual</Text>
                  <EstadoPedido
                      offerId={offer?.id}
                      initialEstado={offer?.envioState ?? "En preparación"}
                   />
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingBottom: 16,
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
    color: theme.colors.primary,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  noPedidos: {
    color: theme.colors.textMuted,
    textAlign: "center",
    padding: 40,
    fontSize: 16,
  },
  pedidoCard: {
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
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pedidoNumero: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  pedidoFecha: {
    fontSize: 12,
    color: "#666666",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  clienteSection: {
    marginBottom: 16,
  },
  clienteInfo: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
  },
  notasText: {
    fontSize: 13,
    color: "#666666",
    fontStyle: "italic",
    marginTop: 4,
  },
  medicamentosSection: {
    marginBottom: 16,
  },
  medicamentoItem: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  medicamentoNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  medicamentoDetalle: {
    fontSize: 12,
    color: "#666666",
  },
  noMedicamentos: {
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
    textAlign: "center",
    padding: 12,
  },
  imagenesSection: {
    marginBottom: 16,
  },
  recetaImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  masImagenes: {
    fontSize: 12,
    color: "#007AFF",
    textAlign: "center",
  },
  cotizacionSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#28A745",
  },
  cotizacionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cotizacionMonto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
  },
  cotizacionTiempo: {
    fontSize: 14,
    color: "#666666",
  },
  estadoSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
});

export default MisPedidos;