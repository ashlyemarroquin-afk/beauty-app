import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [showMenu, setShowMenu] = React.useState(false);

  const iconName = actualTheme === "dark" ? "moon" : "sunny";

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowMenu(true)}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Ionicons name={iconName} size={20} color="#030213" />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={[styles.menuItem, theme === "light" && styles.menuItemActive]}
              onPress={() => {
                setTheme("light");
                setShowMenu(false);
              }}
            >
              <Ionicons name="sunny" size={16} color="#030213" style={styles.menuIcon} />
              <Text style={styles.menuText}>Light</Text>
              {theme === "light" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, theme === "dark" && styles.menuItemActive]}
              onPress={() => {
                setTheme("dark");
                setShowMenu(false);
              }}
            >
              <Ionicons name="moon" size={16} color="#030213" style={styles.menuIcon} />
              <Text style={styles.menuText}>Dark</Text>
              {theme === "dark" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, theme === "system" && styles.menuItemActive]}
              onPress={() => {
                setTheme("system");
                setShowMenu(false);
              }}
            >
              <Ionicons name="phone-portrait" size={16} color="#030213" style={styles.menuIcon} />
              <Text style={styles.menuText}>System</Text>
              {theme === "system" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 4,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  menuItemActive: {
    backgroundColor: "#f3f4f6",
  },
  menuIcon: {
    marginRight: 8,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: "#030213",
  },
  checkmark: {
    fontSize: 14,
    color: "#030213",
    fontWeight: "bold",
  },
});
