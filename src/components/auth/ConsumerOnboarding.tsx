import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Heart, Calendar, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner@2.0.3";

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
      toast.error("Please enter your location");
      return;
    }
    if (currentStep === 1 && onboardingData.servicePreferences.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    if (currentStep === 2 && !onboardingData.priceRange) {
      toast.error("Please select a price range");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    toast.success("Welcome to Bookshelf! Let's explore ✨");
    onComplete(onboardingData);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Label htmlFor="location">City or ZIP code</Label>
            <Input
              id="location"
              placeholder="e.g., New York, NY or 10001"
              value={onboardingData.location}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, location: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              We'll use this to show you nearby professionals and estimated travel times.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <Card
                  key={service}
                  className={`cursor-pointer transition-all ${
                    onboardingData.servicePreferences.includes(service)
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <CardContent className="p-3">
                    <p className="text-sm text-center">{service}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: {onboardingData.servicePreferences.length} services
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <Card
                key={range.value}
                className={`cursor-pointer transition-all ${
                  onboardingData.priceRange === range.value
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setOnboardingData(prev => ({ ...prev, priceRange: range.value }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{range.label}</p>
                      <p className="text-sm text-muted-foreground">{range.description}</p>
                    </div>
                    {onboardingData.priceRange === range.value && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {availabilityOptions.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={time}
                    checked={onboardingData.availability.includes(time)}
                    onCheckedChange={() => handleAvailabilityToggle(time)}
                  />
                  <Label htmlFor={time} className="text-sm">{time}</Label>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="mb-3">Notification Preferences</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bookingReminders"
                    checked={onboardingData.notifications.bookingReminders}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, bookingReminders: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="bookingReminders" className="text-sm">
                    Booking reminders and updates
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="promotions"
                    checked={onboardingData.notifications.promotions}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, promotions: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="promotions" className="text-sm">
                    Special offers and promotions
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newServices"
                    checked={onboardingData.notifications.newServices}
                    onCheckedChange={(checked) => 
                      setOnboardingData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, newServices: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="newServices" className="text-sm">
                    New services from your favorite professionals
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="mb-2">{currentStepData.title}</h2>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>

            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <Button variant="link" onClick={handleComplete}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}