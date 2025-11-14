import React, { useState } from "react";
import { TouchableOpacity, Text, Modal, View, TextInput, StyleSheet, Alert } from "react-native";
import { theme } from "../../styles/theme";
import { auth, db } from "../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

const RechazarButton = ({ request, onConfirm }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [motivo, setMotivo] = useState("");

  const handlePress = () => setModalVisible(true);

  const handleConfirm = async () => {
    const motivoLimpio = motivo.trim();
    if (!motivoLimpio) {
      Toast.show({
              type: "error",
              text1: "Debe ingresar un motivo de rechazo.",
              position: "top",
            });
      return;
    }

    const uidFarmacia = auth.currentUser?.uid;
    const requestId = request?.requestId || request?.id;

    if (!uidFarmacia || !requestId) {
      Alert.alert("Error", "No se pudo identificar el pedido o la farmacia");
      return;
    }

    try {
      // 1) Borrar puntero de inbox de esta farmacia
      const ptrRef = doc(db, "inbox", uidFarmacia, "requests", requestId);
      await deleteDoc(ptrRef);

      // 2) Notificar al padre para que haga lo que ya hacía (guardar rechazo, etc.)
      onConfirm?.(motivoLimpio);

      // 3) Limpiar UI
      setMotivo("");
      setModalVisible(false);
    } catch (e) {
      console.error("Error al rechazar pedido:", e);
      Alert.alert("Error", "No se pudo rechazar el pedido");
    }
  };

  const handleCancel = () => {
    setMotivo("");
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>      Rechazar       </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Motivo del rechazo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Medicamento fuera de stock"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={4}
              value={motivo}
              onChangeText={setMotivo}
              autoFocus
            />

            <View style={styles.row}>
              <TouchableOpacity style={styles.cancel} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
                <Text style={styles.confirmText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    width:"102%",
    minWidth: 120,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  overlay: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modal: {    
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancel: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#d9d9d9ff",
    borderWidth: 1,
    borderColor: "#d9d9d9ff"
  },
  confirm: {
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: { color: "#4f4f4fff", fontWeight: "600", fontSize: 16 },
  confirmText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});

export default RechazarButton;
