import * as React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "./button";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => onOpenChange(false)}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function AlertDialogTrigger({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}

function AlertDialogContent({ children }: { children: React.ReactNode }) {
  return <View style={styles.dialogContent}>{children}</View>;
}

function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

function AlertDialogCancel({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <Button variant="outline" onPress={onPress} style={styles.footerButton}>
      {children}
    </Button>
  );
}

function AlertDialogAction({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <Button onPress={onPress} style={styles.footerButton}>
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    width: "100%",
    maxWidth: 400,
  },
  dialogContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#030213",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#717182",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 24,
  },
  footerButton: {
    minWidth: 80,
  },
});

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
};
