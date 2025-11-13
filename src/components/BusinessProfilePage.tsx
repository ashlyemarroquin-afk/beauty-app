import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "./ui/button";

interface BusinessProfilePageProps {
  professionalId: string;
  onBack: () => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
}

export function BusinessProfilePage({ professionalId, onBack, isGuest, onRequireAuth }: BusinessProfilePageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Business Profile</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Business Profile for ID: {professionalId}
          </Text>
          <Text style={styles.placeholderSubtext}>
            Profile details will be displayed here
          </Text>
          <Button onPress={onBack} style={styles.button}>
            Go Back
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  button: {
    marginTop: 16,
  },
});
