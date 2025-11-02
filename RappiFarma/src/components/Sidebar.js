import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../styles/theme"; //falta incluir esto después

export default function Sidebar({ active, setActive }) {
  const menuItems = ["Solicitudes", "Mis pedidos"];

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>RappiFarma</Text>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.menuItem, active === item && styles.activeItem]}
          onPress={() => setActive(item)}
        >
          <Text style={[styles.menuText, active === item && styles.activeText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    paddingTop: 40,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeItem: {
    backgroundColor: "#FFEEE6",
  },
  menuText: {
    fontSize: 16,
    color: "#444",
  },
  activeText: {
    color: "#ff6600",
    fontWeight: "bold",
  },
});
