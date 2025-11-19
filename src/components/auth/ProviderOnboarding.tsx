import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Camera, DollarSign, Clock, Palette, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";

interface ProviderOnboardingProps {
  onComplete: (data: any) => void;
}

export function ProviderOnboarding({ onComplete }: ProviderOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
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

  const addCustomService = (service: string) => {
    if (service.trim() && !onboardingData.customServices.includes(service.trim())) {
      setOnboardingData(prev => ({
        ...prev,
        customServices: [...prev.customServices, service.trim()]
      }));
    }
  };

  const removeCustomService = (service: string) => {
    setOnboardingData(prev => ({
      ...prev,
      customServices: prev.customServices.filter(s => s !== service)
    }));
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 0 && !onboardingData.location.trim()) {
      toast.error("Please enter your business location");
      return;
    }
    if (currentStep === 1 && onboardingData.services.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    if (currentStep === 3 && onboardingData.availability.days.length === 0) {
      toast.error("Please select at least one available day");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    toast.success("Welcome to Bookshelf! Time to shine ✨");
    onComplete(onboardingData);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">City, State</Label>
              <Input
                id="location"
                placeholder="e.g., Los Angeles, CA"
                value={onboardingData.location}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Business Address (Optional)</Label>
              <Input
                id="address"
                placeholder="123 Main St, Suite 100"
                value={onboardingData.address}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, address: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank if you offer mobile services or work from multiple locations
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {serviceOptions.map((service) => (
                <Card
                  key={service}
                  className={`cursor-pointer transition-all ${
                    onboardingData.services.includes(service)
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <CardContent className="p-2">
                    <p className="text-xs text-center">{service}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label>Add Custom Service</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a custom service"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addCustomService((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {onboardingData.customServices.map((service) => (
                  <Badge 
                    key={service} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => removeCustomService(service)}
                  >
                    {service} ×
                  </Badge>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Selected: {onboardingData.services.length + onboardingData.customServices.length} services
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee (Optional)</Label>
              <Input
                id="consultationFee"
                placeholder="e.g., $25"
                value={onboardingData.pricing.consultationFee}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, consultationFee: e.target.value }
                }))}
              />
              <p className="text-xs text-muted-foreground">
                Many professionals offer free consultations
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="basePrice">Starting Price</Label>
              <Input
                id="basePrice"
                placeholder="e.g., $65"
                value={onboardingData.pricing.basePrice}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, basePrice: e.target.value }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range</Label>
              <select
                id="priceRange"
                value={onboardingData.pricing.priceRange}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, priceRange: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md"
              >
                <option value="">Select price range</option>
                <option value="budget">Budget-friendly ($25-75)</option>
                <option value="mid">Mid-range ($75-150)</option>
                <option value="premium">Premium ($150-300)</option>
                <option value="luxury">Luxury ($300+)</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Available Days</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {dayOptions.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={onboardingData.availability.days.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={day} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={onboardingData.availability.hours.start}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      hours: { ...prev.availability.hours, start: e.target.value }
                    }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={onboardingData.availability.hours.end}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      hours: { ...prev.availability.hours, end: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Professional Bio</Label>
              <Textarea
                id="description"
                placeholder="Tell potential clients about your experience, training, and what makes you unique..."
                value={onboardingData.portfolio.description}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  portfolio: { ...prev.portfolio, description: e.target.value }
                }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label>Specialties & Certifications</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {specialties.map((specialty) => (
                  <Card
                    key={specialty}
                    className={`cursor-pointer transition-all ${
                      onboardingData.portfolio.specialties.includes(specialty)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleSpecialtyToggle(specialty)}
                  >
                    <CardContent className="p-2">
                      <p className="text-xs text-center">{specialty}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Business Amenities</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="creditCards"
                  checked={onboardingData.businessInfo.acceptsCreditCards}
                  onCheckedChange={(checked) => 
                    setOnboardingData(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, acceptsCreditCards: checked as boolean }
                    }))
                  }
                />
                <Label htmlFor="creditCards" className="text-sm">
                  Accepts credit cards
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={onboardingData.businessInfo.hasParking}
                  onCheckedChange={(checked) => 
                    setOnboardingData(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, hasParking: checked as boolean }
                    }))
                  }
                />
                <Label htmlFor="parking" className="text-sm">
                  Parking available
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wheelchair"
                  checked={onboardingData.businessInfo.wheelchairAccessible}
                  onCheckedChange={(checked) => 
                    setOnboardingData(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, wheelchairAccessible: checked as boolean }
                    }))
                  }
                />
                <Label htmlFor="wheelchair" className="text-sm">
                  Wheelchair accessible
                </Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cancellation">Cancellation Policy</Label>
              <Textarea
                id="cancellation"
                placeholder="e.g., 24-hour cancellation notice required..."
                value={onboardingData.businessInfo.cancellationPolicy}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  businessInfo: { ...prev.businessInfo, cancellationPolicy: e.target.value }
                }))}
                rows={2}
              />
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