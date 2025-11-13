import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import Badge from "../components/Badge";

/*Active, cuál de las pantallas está abierta en un instante
counts: cuántos elementos tiene cada pantalla
newFlags: booleanos para las notificaciones (if true entonces naranja)
onOpenScreen: para cambiar la pantalla activa*/
 
export default function Sidebar({ active, counts, newFlags, onOpenScreen }) {
  const menuItems = ["Solicitudes", "Pendientes", "Mis pedidos", "Historial"];

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>RappiFarma</Text>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.menuItem, active === item && styles.activeItem]}
          onPress={() => onOpenScreen(item)}
        >
          <View style={styles.menuRow}>
            <Text
              style={[styles.menuText, active === item && styles.activeText]}
            >
              {item}
            </Text>
          
            <Badge
              count={counts?.[item] ?? 0}
              isNew={!!newFlags?.[item]}
            />
            
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: theme.colors.background || "#f8f9fa",
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: 220,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary || "#FF7A00",
    marginBottom: 30,
    textAlign: "center",
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  activeItem: {
    backgroundColor: "#eee",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  activeText: {
    fontWeight: "bold",
    color: theme.colors.primary || "#FF7A00",
  },
});
