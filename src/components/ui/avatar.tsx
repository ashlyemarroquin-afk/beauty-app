import * as React from "react";
import { View, Image, Text, StyleSheet, ViewProps, ImageProps, TextProps } from "react-native";

interface AvatarProps extends ViewProps {
  className?: string;
}

const Avatar = React.forwardRef<View, AvatarProps>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.avatar, style]} {...props}>
        {children}
      </View>
    );
  }
);

interface AvatarImageProps extends ImageProps {
  className?: string;
}

const AvatarImage = React.forwardRef<Image, AvatarImageProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        style={[styles.avatarImage, style]}
        {...props}
      />
    );
  }
);

interface AvatarFallbackProps extends ViewProps {
  className?: string;
}

const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.avatarFallback, style]} {...props}>
        {typeof children === "string" ? (
          <Text style={styles.fallbackText}>{children}</Text>
        ) : (
          children
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
});

Avatar.displayName = "Avatar";
AvatarImage.displayName = "AvatarImage";
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
