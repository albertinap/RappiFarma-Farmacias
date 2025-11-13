import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import Badge from "../components/Badge";

export default function Sidebar({ active, counts, newFlags, onOpenScreen }) {
  const menuItems = [
    { key: "Solicitudes", label: "Solicitudes" },
    { key: "Pendientes", label: "Pendientes" },
    { key: "MisPedidos", label: "Mis pedidos" },
    { key: "Historial", label: "Historial" }
  ];

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>RappiFarma</Text>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.menuItem, active === item.key && styles.activeItem]}
          onPress={() => onOpenScreen(item.key)}
        >
          <View style={styles.menuRow}>
            <Text
              style={[styles.menuText, active === item.key && styles.activeText]}
            >
              {item.label}
            </Text>
          
            <Badge
              count={counts?.[item.key] ?? 0}
              isNew={!!newFlags?.[item.key]}
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
