import {ScrollView, View, Text, StyleSheet, Image, Modal, Pressable, TouchableOpacity} from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { listenPendingRequests } from "../features/requests/listen";
import { aceptarSolicitud, rechazarSolicitud } from "../features/offers/actions";
import { useUser } from "../context/UserContext";
import RechazarButton from "../components/buttons/RechazarButton";
import CotizacionButton from "../components/buttons/CotizacionButton";
import CotizacionForm from "../components/CotizacionForm";
import { theme } from "../styles/theme";


  const Solicitudes = () => {
    const [requests, setRequests] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cotizacionModalVisible, setCotizacionModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const userData = useUser(); //datos de la farmacia que los busco una única vez


    useEffect(() => {
      const unsub = listenPendingRequests(setRequests);
      return () => typeof unsub === "function" && unsub();
    }, []);

    //cuando aprieto el boton hago visible el form de cotizacion
    const handleQuotePress = (request) => {
      setSelectedRequest(request);
      setCotizacionModalVisible(true);
    };

    //funcion que dispara el form
    const handleQuoteSubmit = async (cotizacionData) => {
    try {
      await aceptarSolicitud(selectedRequest, cotizacionData, userData?.nombreFarmacia);
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));

      Toast.show({
        type: "success",
        text1: "Cotización enviada",
        text2: `Monto total: $ ${cotizacionData.montoTotal.toFixed(2)}`,
        position: "top",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al enviar cotización",
        text2: error.message || "Intentá nuevamente.",
      });
    } finally {
      setCotizacionModalVisible(false);
      setSelectedRequest(null);
    }
  };

  const handleRejectConfirm = async (request, motivo) => {
    try {
      await rechazarSolicitud(request, userData?.nombreFarmacia, motivo);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));

      Toast.show({
        type: "info",
        text1: "Solicitud rechazada",
        text2: motivo,
        position: "top",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al rechazar",
        text2: error.message || "Intentá de nuevo",
      });
    } finally {
      setSelectedRequest(null);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{userData?.nombreFarmacia || "Cargando..."} </Text>
          <Text style={styles.subtitle}>Solicitudes pendientes</Text>
          <Text style={styles.description}>
            Solicitudes de clientes de pedidos de medicamentos con receta
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solicitudes</Text>

          {requests.length === 0 ? (
            <Text style={styles.noRequests}>
              No tienes solicitudes de pedidos en este momento.
            </Text>
          ) : (
            requests.map((req, index) => {
              const firstImage = Array.isArray(req?.images) && req.images.length > 0
                ? req.images[0]
                : null;

              return (
                <View key={req?.id ?? index} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <Text style={styles.medicationName}>
                      {`Solicitud #${index + 1}`}
                    </Text>                                        
                  </View>

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
                        resizeMode="cover" 
                      />
                      <Text style={styles.imageHint}>
                        (Presiona para ampliar la imagen)
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Contenido principal: datos + botones */}
                  <View style={styles.infoRow}>
                    {/* Columna izquierda - datos */}
                    <View style={styles.infoColumn}>
                      <Text style={styles.detailText}>
                        <Text style={styles.detailText}>
                          <Text style={styles.detailLabel}>Cliente: </Text>
                          {req.user
                            ? `${req.user.nombre ?? ""} ${req.user.apellido ?? ""}`.trim()
                            : `Cliente #${index + 1}`} 
                        </Text>
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Ubicación: </Text>
                        {req.user?.direccion ?? "Sin especificar"}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Fecha y hora: </Text>
                        <Text>{req?.createdAt
                          ? `${req.createdAt.toDate().toLocaleDateString()} - ${req.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs`
                        : "Sin fecha"}</Text>
                      </Text>
                    </View>

                    {/* Columna derecha - botones */}
                    <View style={styles.buttonsColumn}>
                      <CotizacionButton
                        request={req}
                        onQuoteSubmit={() => handleQuotePress(req)}
                        buttonText="Enviar Cotización"
                        buttonStyle={styles.quoteButton}
                      />
                      <RechazarButton
                        request={req}
                        buttonStyle={styles.rejectButton}
                        onConfirm={async (motivo) => await handleRejectConfirm(req, motivo)}
                      />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>                
      </ScrollView>

      {/* Modal para ver imagen completa */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="fade" 
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalBackground} 
          onPress={() => setModalVisible(false)}
        >
          {selectedImage && (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.fullImage} 
              resizeMode="contain" 
            />
          )}
        </Pressable>
      </Modal>

      {/* Modal de cotización (componente separado) */}
      <CotizacionForm
        visible={cotizacionModalVisible}
        onClose={() => setCotizacionModalVisible(false)}
        onSubmit={handleQuoteSubmit}
        request={selectedRequest}
      />

    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FAFAFA" 
  },
  header: { 
    padding: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1, 
    borderBottomColor: "#E0E0E0" 
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
  section: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "600", 
    color: "#1A1A1A", 
    marginBottom: 16 
  },
  noRequests: { 
    color: "#999999", 
    fontStyle: "italic",
    textAlign: "center",
    padding: 40,
    fontSize: 16 
  },
  requestCard: { 
    backgroundColor: "white", 
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
  },
  requestHeader: {
    marginBottom: 12,
  },
  medicationName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333333", 
    marginBottom: 4 
  },
  clientName: {
    fontSize: 14,
    color: "#666666",
  },
  miniImage: { 
    width: "25%", 
    alignSelf: "left",
    height: 350, 
    borderRadius: 8, 
    marginBottom: 8 
  },  
  imageHint: {
    fontSize: 12,
    color: "#50a3fbff",
    textAlign: "left",
    marginLeft: 5,
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
  quoteButton: {
    flex: 2,
    margin: 3,
    width: "100%",
  },
  rejectButton: {
    flex: 2,
    margin: 3,
    width: "100%",
  },
  modalBackground: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.9)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  fullImage: { 
    width: "95%", 
    height: "80%", 
    borderRadius: 8 
  },
});

export default Solicitudes;