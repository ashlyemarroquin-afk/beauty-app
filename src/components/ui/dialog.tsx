import * as React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { X } from "lucide-react-native";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open: controlledOpen, onOpenChange, children }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
}

const DialogTrigger = ({ asChild, children }: DialogTriggerProps) => {
  const { onOpenChange } = React.useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onPress: () => {
        onOpenChange(true);
        children.props.onPress?.();
      },
    } as any);
  }

  return (
    <TouchableOpacity onPress={() => onOpenChange(true)}>
      {children}
    </TouchableOpacity>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContent = ({ children, className }: DialogContentProps) => {
  const { open, onOpenChange } = React.useContext(DialogContext);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <ScrollView>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const DialogHeader = ({ children, className }: DialogHeaderProps) => {
  const { onOpenChange } = React.useContext(DialogContext);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>{children}</View>
      <TouchableOpacity onPress={() => onOpenChange(false)} style={styles.closeButton}>
        <X size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const DialogTitle = ({ children, className }: DialogTitleProps) => {
  return <Text style={styles.title}>{children}</Text>;
};

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const DialogDescription = ({ children, className }: DialogDescriptionProps) => {
  return <Text style={styles.description}>{children}</Text>;
};

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const DialogFooter = ({ children, className }: DialogFooterProps) => {
  return <View style={styles.footer}>{children}</View>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 24,
  },
});

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
