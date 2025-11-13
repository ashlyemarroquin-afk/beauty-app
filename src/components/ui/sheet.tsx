import * as React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from "react-native";
import { X } from "lucide-react-native";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue>({
  open: false,
  onOpenChange: () => {},
});

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet = ({ open: controlledOpen, onOpenChange, children }: SheetProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
}

const SheetTrigger = ({ asChild, children }: SheetTriggerProps) => {
  const { onOpenChange } = React.useContext(SheetContext);

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

interface SheetContentProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const SheetContent = ({ children, side = "right", className }: SheetContentProps) => {
  const { open, onOpenChange } = React.useContext(SheetContext);
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, slideAnim]);

  const getTransform = () => {
    switch (side) {
      case "left":
        return [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.8, 0] }) }];
      case "right":
        return [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [width * 0.8, 0] }) }];
      case "top":
        return [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [-height * 0.8, 0] }) }];
      case "bottom":
        return [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [height * 0.8, 0] }) }];
    }
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={() => onOpenChange(false)}
        />
        <Animated.View
          style={[
            styles.content,
            side === "left" && styles.contentLeft,
            side === "right" && styles.contentRight,
            side === "top" && styles.contentTop,
            side === "bottom" && styles.contentBottom,
            { transform: getTransform() },
          ]}
        >
          <ScrollView style={styles.scrollView}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SheetHeader = ({ children, className }: SheetHeaderProps) => {
  const { onOpenChange } = React.useContext(SheetContext);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>{children}</View>
      <TouchableOpacity onPress={() => onOpenChange(false)} style={styles.closeButton}>
        <X size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SheetTitle = ({ children, className }: SheetTitleProps) => {
  return <Text style={styles.title}>{children}</Text>;
};

interface SheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const SheetDescription = ({ children, className }: SheetDescriptionProps) => {
  return <Text style={styles.description}>{children}</Text>;
};

interface SheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

const SheetFooter = ({ children, className }: SheetFooterProps) => {
  return <View style={styles.footer}>{children}</View>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  content: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 24,
  },
  contentLeft: {
    left: 0,
    top: 0,
    bottom: 0,
    width: "80%",
  },
  contentRight: {
    right: 0,
    top: 0,
    bottom: 0,
    width: "80%",
  },
  contentTop: {
    top: 0,
    left: 0,
    right: 0,
    height: "80%",
  },
  contentBottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
  },
  scrollView: {
    flex: 1,
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
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
};
