import * as React from "react";
import { TouchableOpacity, StyleSheet, Animated, ViewProps } from "react-native";

interface SwitchProps extends Omit<ViewProps, "onPress"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch = React.forwardRef<TouchableOpacity, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled = false, style, ...props }, ref) => {
    const translateX = React.useRef(new Animated.Value(checked ? 20 : 2)).current;

    React.useEffect(() => {
      Animated.spring(translateX, {
        toValue: checked ? 20 : 2,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }).start();
    }, [checked, translateX]);

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
          styles.switch,
          checked && styles.switchChecked,
          disabled && styles.switchDisabled,
          style,
        ]}
        activeOpacity={0.7}
        {...props}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    padding: 2,
  },
  switchChecked: {
    backgroundColor: "#030213",
  },
  switchDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});

Switch.displayName = "Switch";

export { Switch };
