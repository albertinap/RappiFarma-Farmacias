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

const CotizacionButton = ({
  request,
  onQuoteSubmit,
  buttonText = "Enviar Cotización",
  buttonStyle,
  textStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [monto, setMonto] = useState("");

  const handlePress = () => {
    setModalVisible(true);
    setMonto("");
  };

  const handleSubmit = () => {
    if (!monto || isNaN(parseFloat(monto))) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor ingresa un monto válido",
        position: "top",
      });
      return;
    }

    const quoteData = {
      requestId: request?.id,
      monto: parseFloat(monto),
      medication: request?.medicationName,
      client: request?.clientName,
      ...request,
    };

    if (onQuoteSubmit) {
      onQuoteSubmit(quoteData);
      Toast.show({
        type: "success",
        text1: "Cotización enviada",
        text2: `Has enviado $${monto} para esta solicitud`,
        position: "top",
      });
    }

    setModalVisible(false);
    setMonto("");
  };

  const handleCancel = () => {
    setModalVisible(false);
    setMonto("");
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.quoteButton, buttonStyle]}
        onPress={handlePress}
      >
        <Text style={[styles.quoteButtonText, textStyle]}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enviar Cotización</Text>
            <Text style={styles.modalSubtitle}>
              {request?.medicationName || "Medicamento"}
            </Text>

            <Text style={styles.modalLabel}>Monto ($)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ejemplo: 25.50"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="decimal-pad"
              value={monto}
              onChangeText={setMonto}
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
                <Text style={styles.submitButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
    </>
  );
};

const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: { fontSize: 16, fontWeight: "600", color: "#333333", marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  modalButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#F8F9FA", borderWidth: 1, borderColor: "#DDDDDD" },
  cancelButtonText: { color: "#666666", fontWeight: "600", fontSize: 16 },
  submitButton: { backgroundColor: "#007AFF" },
  submitButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});

export default CotizacionButton;
