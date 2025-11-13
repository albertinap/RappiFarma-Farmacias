import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../styles/theme";

/**
 * Badge reutilizable (notificaciones en el sidebar)
 * - Cambia a color naranja cuando el count cambia.
 * - Vuelve a gris cuando se presiona.
 * @param {number} count - número a mostrar de elementos 
 * @param {boolean} hidden - si se debe ocultar completamente
 */
export default function Badge({ count = 0, hidden = false }) {
  const [isNew, setIsNew] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  // Detecta cambios en el número de pedidos
  useEffect(() => {
    if (count !== prevCount) {
      setIsNew(true); // activa color naranja
      setPrevCount(count);
    }
  }, [count]);

  if (hidden || count <= 0) return null;

  return (
    <Pressable
      onPress={() => setIsNew(false)} // al tocarlo vuelve a gris
      style={[
        styles.badge,
        isNew ? styles.badgeNew : styles.badgeDefault,
      ]}
    >
      <Text style={styles.text}>{count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    paddingHorizontal: 5,
  },
  badgeDefault: {
    backgroundColor: "#ccc",
  },
  badgeNew: {
    backgroundColor: theme.colors.primary || "#FF7A00", // tu naranja
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
