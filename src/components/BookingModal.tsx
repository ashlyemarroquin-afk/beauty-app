import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign } from "lucide-react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface Professional {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  avatar: string;
  coverImage: string;
  specialties: string[];
  distance: string;
}

interface BookingModalProps {
  professional: Professional | null;
  open: boolean;
  onClose: () => void;
  onBook: (booking: any) => void;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
];

const services = [
  { name: "Basic Cut & Style", price: 45, duration: "1 hour" },
  { name: "Color & Highlights", price: 85, duration: "2 hours" },
  { name: "Full Makeover", price: 120, duration: "2.5 hours" },
  { name: "Consultation", price: 25, duration: "30 min" }
];

export function BookingModal({ professional, open, onClose, onBook }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [notes, setNotes] = useState("");

  const handleBook = () => {
    if (!selectedDate || !selectedTime || !selectedService || !professional) return;

    const service = services.find(s => s.name === selectedService);
    const booking = {
      professional,
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
      price: service?.price,
      duration: service?.duration,
      notes
    };

    onBook(booking);
    onClose();
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedService(undefined);
    setNotes("");
  };

  if (!professional) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book with {professional.name}</DialogTitle>
        </DialogHeader>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Professional Info */}
            <View style={styles.professionalInfo}>
              <Avatar style={styles.avatar}>
                <AvatarImage source={{ uri: professional.avatar }} />
                <AvatarFallback>
                  <Text>{professional.name.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
              <View style={styles.professionalDetails}>
                <Text style={styles.professionalName}>{professional.name}</Text>
                <Text style={styles.professionalProfession}>{professional.profession}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color="#666" />
                  <Text style={styles.locationText}>{professional.location}</Text>
                </View>
              </View>
            </View>

            {/* Service Selection */}
            <View style={styles.section}>
              <Label>Select Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.name} value={service.name}>
                      {service.name} - ${service.price} ({service.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>

            {/* Date Selection */}
            <View style={styles.section}>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
              />
            </View>

            {/* Time Selection */}
            <View style={styles.section}>
              <Label>Select Time</Label>
              <View style={styles.timeSlotsGrid}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    style={styles.timeSlotButton}
                  >
                    <Button
                      variant={selectedTime === time ? "default" : "outline"}
                      style={styles.timeSlot}
                    >
                      {time}
                    </Button>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <Label>Special Requests (Optional)</Label>
              <Textarea
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special requests or preferences..."
                style={styles.textarea}
              />
            </View>

            {/* Summary */}
            {selectedService && (
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Booking Summary</Text>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Service:</Text>
                    <Text style={styles.summaryValue}>{selectedService}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Price:</Text>
                    <Text style={styles.summaryValue}>
                      ${services.find(s => s.name === selectedService)?.price}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Duration:</Text>
                    <Text style={styles.summaryValue}>
                      {services.find(s => s.name === selectedService)?.duration}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button variant="outline" onPress={onClose} style={styles.actionButton}>
                Cancel
              </Button>
              <Button 
                onPress={handleBook} 
                disabled={!selectedDate || !selectedTime || !selectedService}
                style={styles.actionButton}
              >
                Book Appointment
              </Button>
            </View>
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: "90%",
  },
  content: {
    gap: 24,
  },
  professionalInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  professionalDetails: {
    flex: 1,
    gap: 4,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  professionalProfession: {
    fontSize: 14,
    color: "#666",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    gap: 8,
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlotButton: {
    width: "30%",
  },
  timeSlot: {
    paddingVertical: 8,
  },
  textarea: {
    minHeight: 80,
  },
  summary: {
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  summaryContent: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
