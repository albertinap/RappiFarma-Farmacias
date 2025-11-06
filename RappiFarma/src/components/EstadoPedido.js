import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const EstadoPedido = () => {
  const [estado, setEstado] = useState("Pendiente"); //por default va a pendiente

  return (
    <View style={styles.estadoContainer}>
      <Text style={styles.label}>Actualizar estado</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={estado}
          style={styles.picker}
          dropdownIconColor="#666"
          onValueChange={(value) => setEstado(value)}
        >
          <Picker.Item label="Pendiente" value="Pendiente" />
          <Picker.Item label="En preparación" value="En preparación" />
          <Picker.Item label="Listo para envío" value="Listo para envío" />
          <Picker.Item label="Enviando" value="Enviando" />
          <Picker.Item label="Entregado" value="Entregado" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  estadoContainer: {
    marginTop: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  pickerBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  picker: {
    height: 42,
    color: "#111827",
  },
});

export default EstadoPedido;
