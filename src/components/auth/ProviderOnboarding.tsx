import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight, MapPin, Camera, DollarSign, Clock, Palette, Users, X } from "lucide-react-native";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Toast from "react-native-toast-message";

interface ProviderOnboardingProps {
  onComplete: (data: any) => void;
}

export function ProviderOnboarding({ onComplete }: ProviderOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [customServiceInput, setCustomServiceInput] = useState("");
  const [onboardingData, setOnboardingData] = useState({
    location: "",
    address: "",
    services: [] as string[],
    customServices: [] as string[],
    pricing: {
      consultationFee: "",
      basePrice: "",
      priceRange: ""
    },
    availability: {
      days: [] as string[],
      hours: {
        start: "",
        end: ""
      }
    },
    portfolio: {
      description: "",
      specialties: [] as string[],
      experience: ""
    },
    businessInfo: {
      acceptsCreditCards: true,
      hasParking: false,
      wheelchairAccessible: false,
      cancellationPolicy: ""
    }
  });

  const serviceOptions = [
    "Hair Cutting", "Hair Styling", "Hair Coloring", "Balayage", "Highlights",
    "Barber Services", "Beard Trimming", "Hot Towel Shave",
    "Makeup Application", "Bridal Makeup", "Special Event Makeup", "Makeup Lessons",
    "Manicure", "Pedicure", "Gel Nails", "Nail Art", "Acrylic Nails",
    "Facials", "Chemical Peels", "Microdermabrasion", "Eyebrow Shaping",
    "Eyelash Extensions", "Lash Lift", "Brow Tinting",
    "Massage Therapy", "Deep Tissue Massage", "Swedish Massage",
    "Photography", "Portrait Photography", "Event Photography"
  ];

  const specialties = [
    "Bridal Services", "Special Events", "Color Correction", "Extensions",
    "Curly Hair", "Natural Hair", "Men's Grooming", "Kids & Teens",
    "Mature Clients", "Plus Size Friendly", "LGBTQ+ Friendly"
  ];

  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const steps = [
    {
      title: "Business Location",
      description: "Where do you provide your services?",
      icon: MapPin
    },
    {
      title: "Services Offered",
      description: "What services do you provide?",
      icon: Palette
    },
    {
      title: "Pricing Information",
      description: "Set your consultation and service pricing",
      icon: DollarSign
    },
    {
      title: "Availability",
      description: "When are you available for bookings?",
      icon: Clock
    },
    {
      title: "Portfolio & Specialties",
      description: "Tell us about your expertise",
      icon: Camera
    },
    {
      title: "Business Details",
      description: "Final details about your business",
      icon: Users
    }
  ];

  const handleServiceToggle = (service: string) => {
    setOnboardingData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setOnboardingData(prev => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        specialties: prev.portfolio.specialties.includes(specialty)
          ? prev.portfolio.specialties.filter(s => s !== specialty)
          : [...prev.portfolio.specialties, specialty]
      }
    }));
  };

  const handleDayToggle = (day: string) => {
    setOnboardingData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const addCustomService = () => {
    const service = customServiceInput.trim();
    if (service && !onboardingData.customServices.includes(service)) {
      setOnboardingData(prev => ({
        ...prev,
        customServices: [...prev.customServices, service]
      }));
      setCustomServiceInput("");
    }
  };

  const removeCustomService = (service: string) => {
    setOnboardingData(prev => ({
      ...prev,
      customServices: prev.customServices.filter(s => s !== service)
    }));
  };

  const handleNext = () => {
    if (currentStep === 0 && !onboardingData.location.trim()) {
      Toast.show({ type: "error", text1: "Error", text2: "Please enter your business location" });
      return;
    }
    if (currentStep === 1 && onboardingData.services.length === 0) {
      Toast.show({ type: "error", text1: "Error", text2: "Please select at least one service" });
      return;
    }
    if (currentStep === 3 && onboardingData.availability.days.length === 0) {
      Toast.show({ type: "error", text1: "Error", text2: "Please select at least one available day" });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    Toast.show({ type: "success", text1: "Success", text2: "Welcome to Bookshelf! Time to shine ✨" });
    onComplete(onboardingData);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.field}>
              <Label>City, State</Label>
              <Input
                placeholder="e.g., Los Angeles, CA"
                value={onboardingData.location}
                onChangeText={(text) => setOnboardingData(prev => ({ ...prev, location: text }))}
              />
            </View>
            <View style={styles.field}>
              <Label>Business Address (Optional)</Label>
              <Input
                placeholder="123 Main St, Suite 100"
                value={onboardingData.address}
                onChangeText={(text) => setOnboardingData(prev => ({ ...prev, address: text }))}
              />
              <Text style={styles.hint}>
                Leave blank if you offer mobile services or work from multiple locations
              </Text>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <ScrollView style={styles.servicesScroll} contentContainerStyle={styles.servicesGrid}>
              {serviceOptions.map((service) => (
                <TouchableOpacity
                  key={service}
                  onPress={() => handleServiceToggle(service)}
                  style={styles.serviceOption}
                >
                  <Card
                    style={[
                      styles.serviceCard,
                      onboardingData.services.includes(service) && styles.serviceCardSelected
                    ]}
                  >
                    <CardContent style={styles.serviceCardContent}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.field}>
              <Label>Add Custom Service</Label>
              <View style={styles.customServiceRow}>
                <Input
                  placeholder="Enter a custom service"
                  value={customServiceInput}
                  onChangeText={setCustomServiceInput}
                  onSubmitEditing={addCustomService}
                  style={styles.customServiceInput}
                />
                <Button onPress={addCustomService} variant="outline" style={styles.addButton}>
                  Add
                </Button>
              </View>
              <View style={styles.customServiceBadges}>
                {onboardingData.customServices.map((service) => (
                  <TouchableOpacity key={service} onPress={() => removeCustomService(service)}>
                    <Badge style={styles.customBadge}>
                      <Text style={styles.customBadgeText}>{service} ×</Text>
                    </Badge>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <Text style={styles.hint}>
              Selected: {onboardingData.services.length + onboardingData.customServices.length} services
            </Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.field}>
              <Label>Consultation Fee (Optional)</Label>
              <Input
                placeholder="e.g., $25"
                value={onboardingData.pricing.consultationFee}
                onChangeText={(text) => setOnboardingData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, consultationFee: text }
                }))}
                keyboardType="numeric"
              />
              <Text style={styles.hint}>
                Many professionals offer free consultations
              </Text>
            </View>
            
            <View style={styles.field}>
              <Label>Starting Price</Label>
              <Input
                placeholder="e.g., $65"
                value={onboardingData.pricing.basePrice}
                onChangeText={(text) => setOnboardingData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, basePrice: text }
                }))}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.field}>
              <Label>Price Range</Label>
              <Select
                value={onboardingData.pricing.priceRange}
                onValueChange={(value) => setOnboardingData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, priceRange: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget-friendly ($25-75)</SelectItem>
                  <SelectItem value="mid">Mid-range ($75-150)</SelectItem>
                  <SelectItem value="premium">Premium ($150-300)</SelectItem>
                  <SelectItem value="luxury">Luxury ($300+)</SelectItem>
                </SelectContent>
              </Select>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.field}>
              <Label>Available Days</Label>
              <View style={styles.daysGrid}>
                {dayOptions.map((day) => (
                  <View key={day} style={styles.checkboxRow}>
                    <Checkbox
                      checked={onboardingData.availability.days.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Text style={styles.checkboxLabel}>{day}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Label>Start Time</Label>
                <Input
                  placeholder="09:00"
                  value={onboardingData.availability.hours.start}
                  onChangeText={(text) => setOnboardingData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      hours: { ...prev.availability.hours, start: text }
                    }
                  }))}
                />
              </View>
              
              <View style={styles.timeField}>
                <Label>End Time</Label>
                <Input
                  placeholder="18:00"
                  value={onboardingData.availability.hours.end}
                  onChangeText={(text) => setOnboardingData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      hours: { ...prev.availability.hours, end: text }
                    }
                  }))}
                />
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.field}>
              <Label>Professional Bio</Label>
              <Textarea
                placeholder="Tell potential clients about your experience, training, and what makes you unique..."
                value={onboardingData.portfolio.description}
                onChangeText={(text) => setOnboardingData(prev => ({
                  ...prev,
                  portfolio: { ...prev.portfolio, description: text }
                }))}
                style={styles.textarea}
              />
            </View>
            
            <View style={styles.field}>
              <Label>Specialties & Certifications</Label>
              <View style={styles.specialtiesGrid}>
                {specialties.map((specialty) => (
                  <TouchableOpacity
                    key={specialty}
                    onPress={() => handleSpecialtyToggle(specialty)}
                    style={styles.specialtyOption}
                  >
                    <Card
                      style={[
                        styles.specialtyCard,
                        onboardingData.portfolio.specialties.includes(specialty) && styles.specialtyCardSelected
                      ]}
                    >
                      <CardContent style={styles.specialtyCardContent}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <View style={styles.field}>
              <Label>Business Amenities</Label>
              
              <View style={styles.amenitiesList}>
                <View style={styles.checkboxRow}>
                  <Checkbox
                    checked={onboardingData.businessInfo.acceptsCreditCards}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        businessInfo: { ...prev.businessInfo, acceptsCreditCards: checked }
                      }))
                    }
                  />
                  <Text style={styles.checkboxLabel}>
                    Accepts credit cards
                  </Text>
                </View>
                
                <View style={styles.checkboxRow}>
                  <Checkbox
                    checked={onboardingData.businessInfo.hasParking}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        businessInfo: { ...prev.businessInfo, hasParking: checked }
                      }))
                    }
                  />
                  <Text style={styles.checkboxLabel}>
                    Parking available
                  </Text>
                </View>
                
                <View style={styles.checkboxRow}>
                  <Checkbox
                    checked={onboardingData.businessInfo.wheelchairAccessible}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        businessInfo: { ...prev.businessInfo, wheelchairAccessible: checked }
                      }))
                    }
                  />
                  <Text style={styles.checkboxLabel}>
                    Wheelchair accessible
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.field}>
              <Label>Cancellation Policy</Label>
              <Textarea
                placeholder="e.g., 24-hour cancellation notice required..."
                value={onboardingData.businessInfo.cancellationPolicy}
                onChangeText={(text) => setOnboardingData(prev => ({
                  ...prev,
                  businessInfo: { ...prev.businessInfo, cancellationPolicy: text }
                }))}
                style={styles.textarea}
              />
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
  card: {},
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
  field: {
    gap: 8,
  },
  hint: {
    fontSize: 12,
    color: "#666",
  },
  servicesScroll: {
    maxHeight: 300,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceOption: {
    width: "48%",
  },
  serviceCard: {
    marginBottom: 8,
  },
  serviceCardSelected: {
    borderColor: "#030213",
    backgroundColor: "#f9fafb",
  },
  serviceCardContent: {
    padding: 8,
  },
  serviceText: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
  },
  customServiceRow: {
    flexDirection: "row",
    gap: 8,
  },
  customServiceInput: {
    flex: 1,
  },
  addButton: {
    paddingHorizontal: 16,
  },
  customServiceBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  customBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  customBadgeText: {
    fontSize: 12,
  },
  textarea: {
    minHeight: 80,
  },
  daysGrid: {
    gap: 12,
    marginTop: 8,
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
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeField: {
    flex: 1,
    gap: 8,
  },
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  specialtyOption: {
    width: "48%",
  },
  specialtyCard: {
    marginBottom: 8,
  },
  specialtyCardSelected: {
    borderColor: "#030213",
    backgroundColor: "#f9fafb",
  },
  specialtyCardContent: {
    padding: 8,
  },
  specialtyText: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
  },
  amenitiesList: {
    gap: 12,
    marginTop: 8,
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
