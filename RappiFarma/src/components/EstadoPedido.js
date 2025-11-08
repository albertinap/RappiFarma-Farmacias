import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { cambiarEnvioState } from "../features/offers/actions";

const EstadoPedido = ({ offerId, initialEstado = "Pendiente" }) => {
  const [estado, setEstado] = useState(initialEstado);
  const [saving, setSaving] = useState(false);

  const onChange = async (value) => {
    const prev = estado;
    setEstado(value); // UI optimista
    try {
      setSaving(true);
      await cambiarEnvioState(offerId, value);
    } catch (e) {
      setEstado(prev);
      Alert.alert("Error", e?.message ?? "No se pudo actualizar el estado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.estadoContainer}>
      <Text style={styles.label}>Actualizar estado</Text>
      <View style={styles.pickerBox}>
        <Picker
          enabled={!saving}
          selectedValue={estado}
          style={styles.picker}
          dropdownIconColor="#666"
          onValueChange={onChange}
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
  estadoContainer:{ marginTop:12, backgroundColor:"#F9FAFB", borderRadius:10, padding:10, borderWidth:1, borderColor:"#E5E7EB", shadowColor:"#000", shadowOpacity:0.05, shadowRadius:4, elevation:2 },
  label:{ fontSize:14, fontWeight:"600", color:"#374151", marginBottom:6 },
  pickerBox:{ backgroundColor:"#F3F4F6", borderRadius:8, borderWidth:1, borderColor:"#D1D5DB" },
  picker:{ height:42, color:"#111827" },
});

export default EstadoPedido;
