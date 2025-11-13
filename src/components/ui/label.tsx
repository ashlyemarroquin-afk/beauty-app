import * as React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

interface LabelProps extends TextProps {
  className?: string;
}

const Label = React.forwardRef<Text, LabelProps>(
  ({ className, style, ...props }, ref) => {
    return <Text ref={ref} style={[styles.label, style]} {...props} />;
  }
);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
});

Label.displayName = "Label";

export { Label };
