import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Eye, EyeOff, ArrowLeft, Calendar, Scissors } from "lucide-react-native";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Toast from "react-native-toast-message";

interface SignupPageProps {
  userType: "consumer" | "provider";
  onSignupComplete: (userData: any) => void;
  onBack: () => void;
  onLogin: () => void;
}

export function SignupPage({ userType, onSignupComplete, onBack, onLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false,
    // Provider specific fields
    businessName: "",
    profession: "",
    yearsExperience: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const professions = [
    "Hair Stylist",
    "Barber", 
    "Makeup Artist",
    "Nail Artist",
    "Esthetician",
    "Massage Therapist",
    "Eyebrow Specialist",
    "Photographer",
    "Other"
  ];

  const handleSubmit = async () => {
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      Toast.show({ type: "error", text1: "Error", text2: "Passwords don't match" });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      Toast.show({ type: "error", text1: "Error", text2: "Password must be at least 6 characters" });
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      Toast.show({ type: "error", text1: "Error", text2: "Please agree to the terms and conditions" });
      setIsLoading(false);
      return;
    }

    // Provider specific validation
    if (userType === "provider" && (!formData.businessName || !formData.profession)) {
      Toast.show({ type: "error", text1: "Error", text2: "Please fill in all business information" });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        type: userType,
        isOnboarded: false,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        ...(userType === "provider" && {
          businessName: formData.businessName,
          profession: formData.profession,
          yearsExperience: formData.yearsExperience
        })
      };

      Toast.show({ type: "success", text1: "Success", text2: "Account created successfully!" });
      onSignupComplete(userData);
      setIsLoading(false);
    }, 1500);
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
              <Text style={styles.title}>Create Account</Text>
              <View style={styles.accountType}>
                {userType === "consumer" ? (
                  <Calendar size={16} color="#030213" />
                ) : (
                  <Scissors size={16} color="#030213" />
                )}
                <Text style={styles.subtitle}>
                  {userType === "consumer" ? "Client Account" : "Professional Account"}
                </Text>
              </View>
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
                {/* Basic Information */}
                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                    />
                  </View>
                  <View style={styles.halfField}>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                    />
                  </View>
                </View>

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
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Provider Specific Fields */}
                {userType === "provider" && (
                  <>
                    <View style={styles.field}>
                      <Label>Business Name</Label>
                      <Input
                        placeholder="Your salon or business name"
                        value={formData.businessName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
                      />
                    </View>

                    <View style={styles.field}>
                      <Label>Profession</Label>
                      <Select
                        value={formData.profession}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professions.map(prof => (
                            <SelectItem key={prof} value={prof}>
                              {prof}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </View>

                    <View style={styles.field}>
                      <Label>Years of Experience</Label>
                      <Select
                        value={formData.yearsExperience}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, yearsExperience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </View>
                  </>
                )}

                {/* Password Fields */}
                <View style={styles.field}>
                  <Label>Password</Label>
                  <View style={styles.passwordContainer}>
                    <Input
                      placeholder="Create a password"
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

                <View style={styles.field}>
                  <Label>Confirm Password</Label>
                  <View style={styles.passwordContainer}>
                    <Input
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                      secureTextEntry={!showConfirmPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      {showConfirmPassword ? <EyeOff size={16} color="#666" /> : <Eye size={16} color="#666" />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Agreements */}
                <View style={styles.agreements}>
                  <View style={styles.checkboxRow}>
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
                    />
                    <Text style={styles.checkboxLabel}>
                      I agree to the <Text style={styles.link}>Terms of Service</Text> and{" "}
                      <Text style={styles.link}>Privacy Policy</Text>
                    </Text>
                  </View>

                  <View style={styles.checkboxRow}>
                    <Checkbox
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToMarketing: checked }))}
                    />
                    <Text style={styles.checkboxLabel}>
                      Send me updates and marketing communications (optional)
                    </Text>
                  </View>
                </View>

                <Button onPress={handleSubmit} disabled={isLoading} style={styles.submitButton}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.loginLink}>Sign in</Text>
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
  accountType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  row: {
    flexDirection: "row",
    gap: 8,
  },
  halfField: {
    flex: 1,
    gap: 8,
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
  agreements: {
    gap: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  link: {
    color: "#030213",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: "#030213",
    fontWeight: "600",
  },
});
