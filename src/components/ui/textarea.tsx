import * as React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";

interface TextareaProps extends TextInputProps {
  className?: string;
}

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={4}
        style={[styles.textarea, style]}
        placeholderTextColor="#999"
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
});

Textarea.displayName = "Textarea";

export { Textarea };
