import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight, MapPin, Heart, Calendar, Sparkles } from "lucide-react-native";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import Toast from "react-native-toast-message";

interface ConsumerOnboardingProps {
  onComplete: (data: any) => void;
}

export function ConsumerOnboarding({ onComplete }: ConsumerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    location: "",
    servicePreferences: [] as string[],
    priceRange: "",
    availability: [] as string[],
    notifications: {
      bookingReminders: true,
      promotions: true,
      newServices: false
    }
  });

  const services = [
    "Hair Styling", "Hair Coloring", "Hair Cutting", "Barber Services",
    "Makeup Application", "Bridal Makeup", "Special Event Makeup",
    "Manicure", "Pedicure", "Nail Art", "Gel Nails",
    "Facials", "Skin Treatments", "Eyebrow Services", "Eyelash Services",
    "Massage Therapy", "Photography"
  ];

  const priceRanges = [
    { label: "Budget-friendly ($)", value: "budget", description: "Under $50 per service" },
    { label: "Mid-range ($$)", value: "mid", description: "$50-150 per service" },
    { label: "Premium ($$$)", value: "premium", description: "$150+ per service" },
    { label: "Flexible", value: "flexible", description: "Open to all price ranges" }
  ];

  const availabilityOptions = [
    "Weekday mornings", "Weekday afternoons", "Weekday evenings",
    "Weekend mornings", "Weekend afternoons", "Weekend evenings"
  ];

  const steps = [
    {
      title: "Where are you located?",
      description: "Help us find professionals near you",
      icon: MapPin
    },
    {
      title: "What services interest you?",
      description: "Select the services you'd like to book",
      icon: Heart
    },
    {
      title: "What's your budget?",
      description: "Choose your preferred price range",
      icon: Sparkles
    },
    {
      title: "When are you available?",
      description: "Select your preferred booking times",
      icon: Calendar
    }
  ];

  const handleServiceToggle = (service: string) => {
    setOnboardingData(prev => ({
      ...prev,
      servicePreferences: prev.servicePreferences.includes(service)
        ? prev.servicePreferences.filter(s => s !== service)
        : [...prev.servicePreferences, service]
    }));
  };

  const handleAvailabilityToggle = (time: string) => {
    setOnboardingData(prev => ({
      ...prev,
      availability: prev.availability.includes(time)
        ? prev.availability.filter(t => t !== time)
        : [...prev.availability, time]
    }));
  };

  const handleNext = () => {
    if (currentStep === 0 && !onboardingData.location.trim()) {
      Toast.show({ type: "error", text1: "Error", text2: "Please enter your location" });
      return;
    }
    if (currentStep === 1 && onboardingData.servicePreferences.length === 0) {
      Toast.show({ type: "error", text1: "Error", text2: "Please select at least one service" });
      return;
    }
    if (currentStep === 2 && !onboardingData.priceRange) {
      Toast.show({ type: "error", text1: "Error", text2: "Please select a price range" });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    Toast.show({ type: "success", text1: "Success", text2: "Welcome to Bookshelf! Let's explore ✨" });
    onComplete(onboardingData);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Label>City or ZIP code</Label>
            <Input
              placeholder="e.g., New York, NY or 10001"
              value={onboardingData.location}
              onChangeText={(text) => setOnboardingData(prev => ({ ...prev, location: text }))}
            />
            <Text style={styles.hint}>
              We'll use this to show you nearby professionals and estimated travel times.
            </Text>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service}
                  onPress={() => handleServiceToggle(service)}
                >
                  <Card
                    style={[
                      styles.serviceCard,
                      onboardingData.servicePreferences.includes(service) && styles.serviceCardSelected
                    ]}
                  >
                    <CardContent style={styles.serviceCardContent}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.hint}>
              Selected: {onboardingData.servicePreferences.length} services
            </Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            {priceRanges.map((range) => (
              <TouchableOpacity
                key={range.value}
                onPress={() => setOnboardingData(prev => ({ ...prev, priceRange: range.value }))}
              >
                <Card
                  style={[
                    styles.priceCard,
                    onboardingData.priceRange === range.value && styles.priceCardSelected
                  ]}
                >
                  <CardContent style={styles.priceCardContent}>
                    <View style={styles.priceCardText}>
                      <Text style={styles.priceLabel}>{range.label}</Text>
                      <Text style={styles.priceDescription}>{range.description}</Text>
                    </View>
                    {onboardingData.priceRange === range.value && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.availabilityList}>
              {availabilityOptions.map((time) => (
                <View key={time} style={styles.checkboxRow}>
                  <Checkbox
                    checked={onboardingData.availability.includes(time)}
                    onCheckedChange={() => handleAvailabilityToggle(time)}
                  />
                  <Text style={styles.checkboxLabel}>{time}</Text>
                </View>
              ))}
            </View>

            <View style={styles.notificationsSection}>
              <Text style={styles.notificationsTitle}>Notification Preferences</Text>
              <View style={styles.notificationsList}>
                <View style={styles.checkboxRow}>
                  <Checkbox
                    checked={onboardingData.notifications.bookingReminders}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, bookingReminders: checked }
                      }))
                    }
                  />
                  <Text style={styles.checkboxLabel}>
                    Booking reminders and updates
                  </Text>
                </View>
                
                <View style={styles.checkboxRow}>
                  <Checkbox
                    checked={onboardingData.notifications.promotions}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, promotions: checked }
                      }))
                    }
                  />
                  <Text style={styles.checkboxLabel}>
                    Special offers and promotions
                  </Text>
                </View>
                
                <View style={styles.checkboxRow}>
                  <Checkbox
                    checked={onboardingData.notifications.newServices}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, newServices: checked }
                      }))
                    }
                  />
                  <Text style={styles.checkboxLabel}>
                    New services from your favorite professionals
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Step {currentStep + 1} of {steps.length}
            </Text>
            <Text style={styles.progressText}>
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / steps.length) * 100}%` }
              ]}
            />
          </View>
        </View>

        {/* Step Content */}
        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <View style={styles.stepHeader}>
              <View style={styles.iconContainer}>
                <Icon size={24} color="#030213" />
              </View>
              <Text style={styles.stepTitle}>{currentStepData.title}</Text>
              <Text style={styles.stepDescription}>{currentStepData.description}</Text>
            </View>

            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            variant="outline"
            onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={styles.navButton}
          >
            <View style={styles.buttonContent}>
              <ChevronLeft size={16} color="#000" />
              <Text>Back</Text>
            </View>
          </Button>
          
          <Button onPress={handleNext} style={styles.navButton}>
            <View style={styles.buttonContent}>
              <Text>{currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}</Text>
              {currentStep < steps.length - 1 && <ChevronRight size={16} color="#fff" />}
            </View>
          </Button>
        </View>

        {/* Skip Option */}
        <View style={styles.skipContainer}>
          <Button variant="link" onPress={handleComplete}>
            Skip for now
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 16,
  },
  content: {
    width: "100%",
    maxWidth: 448,
    alignSelf: "center",
    gap: 24,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#030213",
    borderRadius: 4,
  },
  card: {
    // Card styles from component
  },
  cardContent: {
    padding: 24,
  },
  stepHeader: {
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  stepContent: {
    gap: 16,
  },
  hint: {
    fontSize: 14,
    color: "#666",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceCard: {
    width: "48%",
    marginBottom: 8,
  },
  serviceCardSelected: {
    borderColor: "#030213",
    backgroundColor: "#f9fafb",
  },
  serviceCardContent: {
    padding: 12,
  },
  serviceText: {
    fontSize: 14,
    textAlign: "center",
    color: "#000",
  },
  priceCard: {
    marginBottom: 12,
  },
  priceCardSelected: {
    borderColor: "#030213",
    backgroundColor: "#f9fafb",
  },
  priceCardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceCardText: {
    flex: 1,
    gap: 4,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  priceDescription: {
    fontSize: 14,
    color: "#666",
  },
  checkmark: {
    width: 20,
    height: 20,
    backgroundColor: "#030213",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 12,
  },
  availabilityList: {
    gap: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  notificationsSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  notificationsList: {
    gap: 12,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  navButton: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  skipContainer: {
    alignItems: "center",
  },
});
