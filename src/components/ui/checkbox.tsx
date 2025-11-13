import * as React from "react";
import { TouchableOpacity, View, StyleSheet, ViewProps } from "react-native";
import { Check } from "lucide-react-native";

interface CheckboxProps extends Omit<ViewProps, "onPress"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Checkbox = React.forwardRef<View, CheckboxProps>(
  ({ checked = false, onCheckedChange, disabled = false, style, ...props }, ref) => {
    const handlePress = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.checkbox,
          checked && styles.checked,
          disabled && styles.disabled,
          style,
        ]}
        activeOpacity={0.7}
        {...props}
      >
        {checked && <Check size={14} color="#fff" />}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#030213",
    borderColor: "#030213",
  },
  disabled: {
    opacity: 0.5,
  },
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
