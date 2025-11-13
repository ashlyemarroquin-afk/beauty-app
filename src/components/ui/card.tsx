import * as React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

interface CardProps extends ViewProps {
  className?: string;
}

function Card({ className, style, ...props }: CardProps) {
  return <View style={[styles.card, style]} {...props} />;
}

interface CardHeaderProps extends ViewProps {
  className?: string;
}

function CardHeader({ className, style, ...props }: CardHeaderProps) {
  return <View style={[styles.header, style]} {...props} />;
}

interface CardTitleProps extends TextProps {
  className?: string;
}

function CardTitle({ className, style, ...props }: CardTitleProps) {
  return <Text style={[styles.title, style]} {...props} />;
}

interface CardDescriptionProps extends TextProps {
  className?: string;
}

function CardDescription({ className, style, ...props }: CardDescriptionProps) {
  return <Text style={[styles.description, style]} {...props} />;
}

interface CardContentProps extends ViewProps {
  className?: string;
}

function CardContent({ className, style, ...props }: CardContentProps) {
  return <View style={[styles.content, style]} {...props} />;
}

interface CardFooterProps extends ViewProps {
  className?: string;
}

function CardFooter({ className, style, ...props }: CardFooterProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
