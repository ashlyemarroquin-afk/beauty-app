// React Native toast implementation using react-native-toast-message
import React from "react";
import Toast from "react-native-toast-message";

// Toaster component that should be added to your App root
export const Toaster = () => {
  return <Toast />;
};

// Toast helper functions that match the sonner API
export const toast = {
  success: (message: string) => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
    });
  },
  error: (message: string) => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
    });
  },
  info: (message: string) => {
    Toast.show({
      type: "info",
      text1: "Info",
      text2: message,
    });
  },
};
