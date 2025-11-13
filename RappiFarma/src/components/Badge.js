import React, { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { theme } from "../styles/theme";

/**
 * Badge reutilizable (notificaciones en el sidebar)
 * - Cambia a color naranja cuando el count cambia.
 * - Vuelve a gris cuando se presiona.
 * @param {number} count - número a mostrar de elementos 
 * @param {boolean} hidden - si se debe ocultar completamente
 * @param {boolean} isNew - si debe mostrarse como nuevo (naranja)
 */
export default function Badge({ count = 0, hidden = false, isNew = false }) {
  const [isHighlighted, setIsHighlighted] = useState(isNew);

  useEffect(() => {
    setIsHighlighted(isNew);
  }, [isNew]);

  if (hidden) return null; // ocultar si count es 0 o hidden=true

  return (
    <Pressable
      onPress={() => setIsHighlighted(false)} // al tocarlo vuelve a gris
      style={[
        styles.badge,
        isHighlighted ? styles.badgeNew : styles.badgeDefault,
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
    marginLeft: 6,
    paddingHorizontal: 5,
  },
  badgeDefault: {
    backgroundColor: "#B0B0B0", // gris
  },
  badgeNew: {
    backgroundColor: theme.colors.primary, // naranja
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
