import * as React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
        outline: "border bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "bg-transparent",
        link: "text-primary underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ variant = "default", size = "default", children, onPress, disabled, loading, style, textStyle, ...props }, ref) => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      opacity: disabled ? 0.5 : 1,
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: { backgroundColor: "#030213" },
      destructive: { backgroundColor: "#ef4444" },
      outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#e5e7eb" },
      secondary: { backgroundColor: "#f3f4f6" },
      ghost: { backgroundColor: "transparent" },
      link: { backgroundColor: "transparent" },
    };

    const sizeStyles: Record<string, ViewStyle> = {
      default: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      sm: { paddingHorizontal: 12, paddingVertical: 6, minHeight: 32 },
      lg: { paddingHorizontal: 24, paddingVertical: 8, minHeight: 40 },
      icon: { width: 36, height: 36, padding: 0 },
    };

    const textVariantStyles: Record<string, TextStyle> = {
      default: { color: "#ffffff" },
      destructive: { color: "#ffffff" },
      outline: { color: "#030213" },
      secondary: { color: "#030213" },
      ghost: { color: "#030213" },
      link: { color: "#030213", textDecorationLine: "underline" },
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={[baseStyle, variantStyles[variant || "default"], sizeStyles[size || "default"], style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textVariantStyles[variant || "default"].color} />
        ) : (
          <Text style={[textVariantStyles[variant || "default"], { fontSize: 14, fontWeight: "500" }, textStyle]}>
            {children}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
