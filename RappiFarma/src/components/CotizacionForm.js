import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

const CotizacionForm = ({ visible, onClose, onSubmit, request }) => {
  const [medicamentos, setMedicamentos] = useState([
    { nombre: "", cantidad: "", precio: "" },
  ]);
  const [errors, setErrors] = useState({});

  // Validar solo números para cantidad y precio
  const validarNumero = (valor) => {
    return /^\d*\.?\d*$/.test(valor); // Permite números y punto decimal
  };

  // Validar texto para nombre (solo letras, espacios y algunos caracteres especiales)
  const validarTexto = (valor) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.\(\)]*$/.test(valor);
  };

  // Agregar medicamento
  const agregarMedicamento = () => {
    setMedicamentos([
      ...medicamentos,
      { nombre: "", cantidad: "", precio: "" },
    ]);
  };

  // Eliminar medicamento
  const eliminarMedicamento = (index) => {
    if (medicamentos.length > 1) {
      const nuevos = medicamentos.filter((_, i) => i !== index);
      setMedicamentos(nuevos);
      // Limpiar errores del medicamento eliminado
      const nuevosErrores = { ...errors };
      Object.keys(nuevosErrores).forEach(key => {
        if (key.includes(`-${index}`)) {
          delete nuevosErrores[key];
        }
      });
      setErrors(nuevosErrores);
    }
  };

  // Actualizar campo de un medicamento con validación
  const actualizarMedicamento = (index, field, value) => {
    // Validación en tiempo real
    let errorKey = `${field}-${index}`;
    let nuevoError = "";

    if (field === "nombre" && value && !validarTexto(value)) {
      nuevoError = "Solo se permiten letras y espacios";
    } else if ((field === "cantidad" || field === "precio") && value && !validarNumero(value)) {
      nuevoError = "Solo se permiten números";
    } else if (field === "cantidad" && value && parseInt(value) <= 0) {
      nuevoError = "La cantidad debe ser mayor a 0";
    } else if (field === "precio" && value && parseFloat(value) <= 0) {
      nuevoError = "El precio debe ser mayor a 0";
    }

    // Actualizar errores
    setErrors(prev => ({
      ...prev,
      [errorKey]: nuevoError
    }));

    // Actualizar medicamento
    const nuevos = [...medicamentos];
    nuevos[index][field] = value;
    setMedicamentos(nuevos);
  };

  // Calcular total
  const calcularTotal = () => {
    return medicamentos.reduce((acc, med) => {
      const precio = parseFloat(med.precio) || 0;
      const cantidad = parseInt(med.cantidad) || 0;
      return acc + precio * cantidad;
    }, 0);
  };

  // Validar formulario completo
  const validarFormulario = () => {
    const nuevosErrores = {};
    let formularioValido = true;

    medicamentos.forEach((med, index) => {
      if (!med.nombre.trim()) {
        nuevosErrores[`nombre-${index}`] = "Este campo es requerido";
        formularioValido = false;
      }
      if (!med.cantidad.trim()) {
        nuevosErrores[`cantidad-${index}`] = "Este campo es requerido";
        formularioValido = false;
      } else if (parseInt(med.cantidad) <= 0) {
        nuevosErrores[`cantidad-${index}`] = "La cantidad debe ser mayor a 0";
        formularioValido = false;
      }
      if (!med.precio.trim()) {
        nuevosErrores[`precio-${index}`] = "Este campo es requerido";
        formularioValido = false;
      } else if (parseFloat(med.precio) <= 0) {
        nuevosErrores[`precio-${index}`] = "El precio debe ser mayor a 0";
        formularioValido = false;
      }
    });

    setErrors(nuevosErrores);
    return formularioValido;
  };

  const handleSubmit = () => {
    if (!validarFormulario()) {
      Alert.alert("Error", "Por favor completa todos los campos correctamente");
      return;
    }

    const montoTotal = calcularTotal();
    const cotizacionData = {
      medicamentos: medicamentos.map(med => ({
        ...med,
        cantidad: parseInt(med.cantidad),
        precio: parseFloat(med.precio),
        subtotal: (parseInt(med.cantidad) * parseFloat(med.precio)).toFixed(2)
      })),
      montoTotal,
      fecha: new Date().toISOString(),
      requestId: request?.id
    };

    onSubmit(cotizacionData);
    
    // Resetear formulario
    setMedicamentos([{ nombre: "", cantidad: "", precio: "" }]);
    setErrors({});
  };

  const handleClose = () => {
    setMedicamentos([{ nombre: "", cantidad: "", precio: "" }]);
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Enviar Cotización</Text>
            {request?.medicationName && (
              <Text style={styles.subHeaderText}>
                Para: {request.medicationName}
              </Text>
            )}
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {medicamentos.map((med, index) => (
              <View key={index} style={styles.medicamentoCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Medicamento {index + 1}</Text>
                  {medicamentos.length > 1 && (
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => eliminarMedicamento(index)}
                    >
                      <Text style={styles.deleteIconText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nombre del medicamento *</Text>
                  <TextInput
                    placeholder="Ej: Paracetamol 500mg"
                    placeholderTextColor="#999"
                    style={[
                      styles.input,
                      errors[`nombre-${index}`] && styles.inputError
                    ]}
                    value={med.nombre}
                    onChangeText={(v) => actualizarMedicamento(index, "nombre", v)}
                  />
                  {errors[`nombre-${index}`] && (
                    <Text style={styles.errorText}>{errors[`nombre-${index}`]}</Text>
                  )}
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <Text style={styles.inputLabel}>Cantidad *</Text>
                    <TextInput
                      placeholder="Ej: 2"
                      placeholderTextColor="#999"
                      style={[
                        styles.input,
                        errors[`cantidad-${index}`] && styles.inputError
                      ]}
                      keyboardType="numeric"
                      value={med.cantidad}
                      onChangeText={(v) => actualizarMedicamento(index, "cantidad", v)}
                    />
                    {errors[`cantidad-${index}`] && (
                      <Text style={styles.errorText}>{errors[`cantidad-${index}`]}</Text>
                    )}
                  </View>

                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <Text style={styles.inputLabel}>Precio unitario (S/.) *</Text>
                    <TextInput
                      placeholder="Ej: 15.50"
                      placeholderTextColor="#999"
                      style={[
                        styles.input,
                        errors[`precio-${index}`] && styles.inputError
                      ]}
                      keyboardType="decimal-pad"
                      value={med.precio}
                      onChangeText={(v) => actualizarMedicamento(index, "precio", v)}
                    />
                    {errors[`precio-${index}`] && (
                      <Text style={styles.errorText}>{errors[`precio-${index}`]}</Text>
                    )}
                  </View>
                </View>

                {med.cantidad && med.precio && (
                  <Text style={styles.subtotalText}>
                    Subtotal: S/. {(parseInt(med.cantidad) * parseFloat(med.precio) || 0).toFixed(2)}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={agregarMedicamento}
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Agregar otro medicamento</Text>
            </TouchableOpacity>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>TOTAL COTIZACIÓN</Text>
              <Text style={styles.totalAmount}>S/. {calcularTotal().toFixed(2)}</Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Enviar Cotización</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContainer: {
    padding: 20,
  },
  medicamentoCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  deleteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
    color: "#1A1A1A",
  },
  inputError: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  subtotalText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#28A745",
    textAlign: "right",
    marginTop: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BBDEFB",
    borderStyle: "dashed",
  },
  addButtonIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976D2",
  },
  totalContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#DEE2E6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6C757D",
  },
  submitButton: {
    flex: 2,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#28A745",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default CotizacionForm;