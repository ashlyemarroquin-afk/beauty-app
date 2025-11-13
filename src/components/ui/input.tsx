import * as React from "react";
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from "react-native";

interface InputProps extends TextInputProps {
  style?: ViewStyle;
}

function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#717182"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 36,
    width: "100%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#ffffff",
    color: "#030213",
  },
});

export { Input };
