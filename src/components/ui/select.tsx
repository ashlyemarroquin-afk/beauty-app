import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => {},
});

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

const SelectTrigger = ({ className, children }: SelectTriggerProps) => {
  const { setOpen } = React.useContext(SelectContext);

  return (
    <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
      {children}
      <ChevronDown size={16} color="#666" />
    </TouchableOpacity>
  );
};

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext);

  return (
    <Text style={[styles.value, !value && styles.placeholder]}>
      {value || placeholder || "Select..."}
    </Text>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

const SelectContent = ({ children }: SelectContentProps) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setOpen(false)}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectItem = ({ value: itemValue, children }: SelectItemProps) => {
  const { value, onValueChange, setOpen } = React.useContext(SelectContext);
  const isSelected = value === itemValue;

  const handleSelect = () => {
    onValueChange?.(itemValue);
    setOpen(false);
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handleSelect}>
      <Text style={styles.itemText}>{children}</Text>
      {isSelected && <Check size={16} color="#000" />}
    </TouchableOpacity>
  );
};

interface SelectGroupProps {
  children: React.ReactNode;
}

const SelectGroup = ({ children }: SelectGroupProps) => {
  return <View style={styles.group}>{children}</View>;
};

interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

const SelectLabel = ({ children }: SelectLabelProps) => {
  return <Text style={styles.label}>{children}</Text>;
};

const SelectSeparator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  value: {
    fontSize: 14,
    color: "#000",
  },
  placeholder: {
    color: "#999",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 200,
    maxHeight: 300,
    padding: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#000",
  },
  group: {
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
});

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
