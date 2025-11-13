import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-white",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function Badge({ variant = "default", children, style, textStyle, ...props }: BadgeProps) {
  const baseStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  };

  const variantStyles: Record<string, ViewStyle> = {
    default: { backgroundColor: "#030213", borderWidth: 0 },
    secondary: { backgroundColor: "#f3f4f6", borderWidth: 0 },
    destructive: { backgroundColor: "#ef4444", borderWidth: 0 },
    outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#e5e7eb" },
  };

  const textVariantStyles: Record<string, TextStyle> = {
    default: { color: "#ffffff" },
    secondary: { color: "#030213" },
    destructive: { color: "#ffffff" },
    outline: { color: "#030213" },
  };

  return (
    <View style={[baseStyle, variantStyles[variant], style]} {...props}>
      <Text style={[{ fontSize: 12, fontWeight: "500" }, textVariantStyles[variant], textStyle]}>
        {children}
      </Text>
    </View>
  );
}

export { Badge, badgeVariants };
