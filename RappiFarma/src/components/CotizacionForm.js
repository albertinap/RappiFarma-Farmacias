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
import { createOffer } from "../features/offers/actions"; //santi, te quiero


const CotizacionForm = ({ visible, onClose, request }) => {
  const [medicamentos, setMedicamentos] = useState([
    { nombreydosis: "", cantidad: "", precio: "" },
  ]);
  const [tiempoEspera, setTiempoEspera] = useState("");
  const [errors, setErrors] = useState({});

  // Validar solo números para cantidad y precio
  const validarNumero = (valor) => {
    return /^\d*\.?\d*$/.test(valor); // Permite números y punto decimal
  };

  // Validar texto para nombre (solo letras, espacios y algunos caracteres especiales)
  const validarTexto = (valor) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.\(\)]*$/.test(valor);
  };

  // Agregar medicamento
  const agregarMedicamento = () => {
    setMedicamentos([
      ...medicamentos,
      { nombreydosis: "", cantidad: "", precio: "" },
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

    if (field === "nombreydosis" && value && !validarTexto(value)) {
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

  // Actualizar tiempo de espera con validación
  const actualizarTiempoEspera = (value) => {
    // Validación en tiempo real
    let nuevoError = "";

    if (value && !validarNumero(value)) {
      nuevoError = "Solo se permiten números";
    } else if (value && parseInt(value) <= 0) {
      nuevoError = "El tiempo debe ser mayor a 0";
    }

    // Actualizar errores
    setErrors(prev => ({
      ...prev,
      tiempoEspera: nuevoError
    }));

    setTiempoEspera(value);
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
      if (!med.nombreydosis.trim()) {
        nuevosErrores[`nombreydosis-${index}`] = "Este campo es requerido";
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

    // Validar tiempo de espera
    if (!tiempoEspera.trim()) {
      nuevosErrores.tiempoEspera = "Este campo es requerido";
      formularioValido = false;
    } else if (parseInt(tiempoEspera) <= 0) {
      nuevosErrores.tiempoEspera = "El tiempo debe ser mayor a 0";
      formularioValido = false;
    }

    setErrors(nuevosErrores);
    return formularioValido;
  };

  const handleSubmit = async () => {
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
    tiempoEspera: parseInt(tiempoEspera),
    tiempoEsperaTexto: `${tiempoEspera} minutos`,
    requestId: request?.id
  };

  try {
    await createOffer(cotizacionData);
    Alert.alert("Éxito", "Cotización enviada");

    setMedicamentos([{ nombreydosis: "", cantidad: "", precio: "" }]);
    setTiempoEspera("");
    setErrors({});
    onClose();
  } catch (e) {
    console.error(e);
    Alert.alert("Error", e?.message ?? "No se pudo enviar la cotización");
  }
};

  const handleClose = () => {
    setMedicamentos([{ nombreydosis: "", cantidad: "", precio: "" }]);
    setTiempoEspera("");
    setErrors({});
    onClose();
  };

  // Formatear tiempo para mostrar sugerencias
  const getTiempoSugerencias = () => {
    const tiempos = [15, 30, 45, 60, 90, 120];
    return tiempos.map(tiempo => (
      <TouchableOpacity
        key={tiempo}
        style={styles.tiempoSugerencia}
        onPress={() => actualizarTiempoEspera(tiempo.toString())}
      >
      <Text style={styles.tiempoSugerenciaText}>{tiempo} min</Text>
      </TouchableOpacity>
    ));
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
                <Text style={styles.inputLabel}>Nombre y dosis del medicamento</Text>
                <TextInput
                  placeholder="Ej: Paracetamol 500mg"
                  placeholderTextColor="#999"
                  style={[
                    styles.input,
                    errors[`nombreydosis-${index}`] && styles.inputError
                  ]}
                  value={med.nombreydosis}
                  onChangeText={(v) => actualizarMedicamento(index, "nombreydosis", v)}
                />
                {errors[`nombreydosis-${index}`] ? (
                  <Text style={styles.errorText}>{errors[`nombreydosis-${index}`]}</Text>
                ) : null}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Cantidad</Text>
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
                  {errors[`cantidad-${index}`] ? (
                    <Text style={styles.errorText}>{errors[`cantidad-${index}`]}</Text>
                  ) : null}
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Precio unitario ($)</Text>
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
                  {errors[`precio-${index}`] ? (
                    <Text style={styles.errorText}>{errors[`precio-${index}`]}</Text>
                  ) : null}
                </View>
              </View>

              {med.cantidad && med.precio ? (
                <Text style={styles.subtotalText}>
                  Subtotal: $ {(parseInt(med.cantidad) * parseFloat(med.precio) || 0).toFixed(2)}
                </Text>
              ) : null}
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={agregarMedicamento}
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Agregar otro medicamento</Text>
          </TouchableOpacity>

          {/* Sección de Tiempo de Espera */}
          <View style={styles.tiempoEsperaSection}>
            <Text style={styles.sectionTitle}>Tiempo de Preparación</Text>
            <Text style={styles.inputLabel}>Tiempo estimado (minutos) *</Text>
            <TextInput
                placeholder="Ej: 30"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  styles.tiempoInput,
                  errors.tiempoEspera && styles.inputError
                ]}
                keyboardType="numeric"
                value={tiempoEspera}
                onChangeText={actualizarTiempoEspera}
            />
            {errors.tiempoEspera ? (
  <Text style={styles.errorText}>{errors.tiempoEspera}</Text>
) : null}
              
            <Text style={styles.sugerenciasLabel}>Sugerencias rápidas:</Text>
            <View style={styles.sugerenciasContainer}>
              {getTiempoSugerencias()}
            </View>
          </View>


          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>TOTAL COTIZACIÓN</Text>
            <Text style={styles.totalAmount}>$ {calcularTotal().toFixed(2)}</Text>
            {tiempoEspera ? (
              <Text style={styles.tiempoTotalText}>
                Tiempo de entrega: {tiempoEspera} minutos
              </Text>
            ) : null}
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
    alignContent: "center",
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
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    width: "50%",
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
  tiempoEsperaSection: {
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 12,
  },
  tiempoInput: {
    marginBottom: 8,
  },
  sugerenciasLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    marginBottom: 8,
  },
  sugerenciasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tiempoSugerencia: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1976D2",
  },
  tiempoSugerenciaText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "500",
  },
  totalContainer: {
    backgroundColor: "#003a77ff",
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
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  tiempoTotalText: {
    fontSize: 12,
    color: "#FFF",
    marginTop: 4,
    opacity: 0.8,
  },
});

export default CotizacionForm;