import { ScrollView, View, Text, StyleSheet, Image , Modal , Pressable , TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { listenPendingRequests } from "../features/requests/listen";
import CotizacionButton from "../components/CotizacionButton";
import RechazarButton from "../components/RechazarButton";

const Solicitudes = () => {
  const [requests, setRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const unsub = listenPendingRequests(setRequests);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  // Manejador de cotización (todavia no se usa pues no hay bd)
  const handleQuoteSubmit = (quoteData) => {
    Toast.show({
      type: "success",
      text1: "Cotización enviada",
      text2: `Has cotizado $${quoteData.monto}`,
      position: "top",
    });
  };

  // Manejador de rechazo (todavia no se usa pues no hay bd)
  const handleReject = (data) => {
    Toast.show({
      type: "info",
      text1: "Pedido rechazado",    
      position: "top",
    });
  };

  // Para expandir la imagen de receta
  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  // Para comprimir la imagen de receta (una vez expandida)
  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Farmacia Central</Text>
          <Text style={styles.subtitle}>Solicitudes pendientes</Text>
          <Text style={styles.description}>
            Solicitudes de clientes de pedidos de medicamentos con receta — Envía tu mejor oferta
          </Text>
        </View>

        {/* Lista de solicitudes */}
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
                  {/* Título */}
                  <Text style={styles.medicationName}>Solicitud #{index + 1}</Text>
                  
                  {firstImage && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImage(firstImage);
                      setModalVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: firstImage }}
                      style={styles.miniImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
                  

                  {/* Contenido principal: datos + botones */}
                  <View style={styles.infoRow}>
                    {/* Columna izquierda - datos */}
                    <View style={styles.infoColumn}>
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
                        {req?.createdAt?.toDate().toLocaleDateString() }
                      </Text>
                    </View>

                    {/* Columna derecha - botones */}
                    <View style={styles.buttonsColumn}>
                      <CotizacionButton
                        request={req}
                        onQuoteSubmit={handleQuoteSubmit}
                        buttonText="Enviar Cotización"
                      />
                      <RechazarButton
                        request={req}
                        onReject={handleReject}
                        buttonStyle={{ marginTop: 8 }}
                      />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
        {/* Modal para ver imagen completa */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
      </ScrollView>      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  noRequests: {
    color: "#999",
    fontStyle: "italic",
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  miniImage: {
    width: 140,  
    height: 100,
    alignSelf: "left",
    marginBottom: 10,
  },  
  requestImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#EEE",
  },
  placeholderImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#EEE",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  infoColumn: {
    flex: 1,
  },
  buttonsColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#222",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "95%",
    height: "80%",
    borderRadius: 8,
  },
});

export default Solicitudes;
