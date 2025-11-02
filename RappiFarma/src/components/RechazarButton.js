import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { theme } from "../styles/theme";

const RechazarButton = ({
  request,
  onReject,
  buttonText = "Rechazar",
  buttonStyle,
  textStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handlePress = () => {
    setModalVisible(true);
    setMensaje("");
  };

  const handleSubmit = () => {
    if (!mensaje.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor ingresa un mensaje de rechazo",
        position: "top",
      });
      return;
    }

    const rejectData = {
      requestId: request?.id,
      mensaje,
      client: request?.clientName,
      ...request,
    };

    if (onReject) {
      onReject(rejectData);
      Toast.show({
        type: "success",
        text1: "Pedido rechazado",
        text2: mensaje,
        position: "top",
        visibilityTime: 3000,
      });
    }

    setModalVisible(false);
    setMensaje("");
  };

  const handleCancel = () => {
    setModalVisible(false);
    setMensaje("");
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.rejectButton, buttonStyle]}
        onPress={handlePress}
      >
        <Text style={[styles.rejectButtonText, textStyle]}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rechazar Pedido</Text>

            <Text style={styles.modalLabel}>Motivo del rechazo</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe un breve mensaje"
              placeholderTextColor={theme.colors.textMuted}
              value={mensaje}
              onChangeText={setMensaje}
              multiline={true}
              numberOfLines={3}
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  rejectButton: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
  },
  rejectButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContainer: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
  modalButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#F8F9FA", borderWidth: 1, borderColor: "#DDDDDD" },
  cancelButtonText: { color: "#666666", fontWeight: "600", fontSize: 16 },
  submitButton: { backgroundColor: "#FF5252" },
  submitButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});

export default RechazarButton;
