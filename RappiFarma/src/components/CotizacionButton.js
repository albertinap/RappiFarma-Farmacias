import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CotizacionButton = ({ onQuoteSubmit, buttonText, buttonStyle }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, buttonStyle]} 
      onPress={onQuoteSubmit}
    >
      <Text style={styles.text}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});

export default CotizacionButton;
