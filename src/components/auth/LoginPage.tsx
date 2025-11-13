import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Eye, EyeOff, ArrowLeft } from "lucide-react-native";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";
import Toast from "react-native-toast-message";

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
  onSignup: () => void;
}

export function LoginPage({ onLogin, onBack, onSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock users for demo
  const mockUsers = [
    {
      id: "1",
      email: "sarah@example.com",
      name: "Sarah Chen",
      type: "provider" as const,
      isOnboarded: true
    },
    {
      id: "2", 
      email: "john@example.com",
      name: "John Smith",
      type: "consumer" as const,
      isOnboarded: true
    },
    {
      id: "3",
      email: "newuser@example.com", 
      name: "New User",
      type: "consumer" as const,
      isOnboarded: false
    }
  ];

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === formData.email);
      
      if (user && formData.password === "password") {
        Toast.show({ type: "success", text1: "Success", text2: "Welcome back!" });
        onLogin(user);
      } else {
        Toast.show({ type: "error", text1: "Error", text2: "Invalid email or password" });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (userType: "consumer" | "provider") => {
    const user = mockUsers.find(u => u.type === userType && u.isOnboarded);
    if (user) {
      setFormData({ email: user.email, password: "password" });
      Toast.show({ type: "success", text1: "Success", text2: `Demo ${userType} login ready!` });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>
          </View>

          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>S</Text>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.form}>
                <View style={styles.field}>
                  <Label>Email</Label>
                  <Input
                    placeholder="your@email.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.field}>
                  <Label>Password</Label>
                  <View style={styles.passwordContainer}>
                    <Input
                      placeholder="Enter your password"
                      value={formData.password}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                      secureTextEntry={!showPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? <EyeOff size={16} color="#666" /> : <Eye size={16} color="#666" />}
                    </TouchableOpacity>
                  </View>
                </View>

                <Button onPress={handleSubmit} disabled={isLoading} style={styles.submitButton}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </View>

              {/* Demo Logins */}
              <View style={styles.demoSection}>
                <Text style={styles.demoTitle}>Quick demo access:</Text>
                <View style={styles.demoButtons}>
                  <Button 
                    variant="outline" 
                    onPress={() => handleDemoLogin("consumer")}
                    style={styles.demoButton}
                  >
                    Demo Consumer
                  </Button>
                  <Button 
                    variant="outline" 
                    onPress={() => handleDemoLogin("provider")}
                    style={styles.demoButton}
                  >
                    Demo Provider
                  </Button>
                </View>
                <Text style={styles.demoHint}>
                  Email will be pre-filled, password is "password"
                </Text>
              </View>

              {/* Forgot Password */}
              <View style={styles.forgotContainer}>
                <Button variant="link">
                  Forgot your password?
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={onSignup}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  content: {
    width: "100%",
    maxWidth: 448,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  card: {
    marginBottom: 24,
  },
  cardHeader: {
    paddingBottom: 16,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: "#030213",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 10,
    padding: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  demoSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  demoTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: "row",
    gap: 8,
  },
  demoButton: {
    flex: 1,
  },
  demoHint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  forgotContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontSize: 14,
    color: "#030213",
    fontWeight: "600",
  },
});
