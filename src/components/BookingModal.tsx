import { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { createBooking, addBookingToUser, ServiceDocument } from "../lib/firestoreService";
import { auth } from "../lib/firebase";
import { toast } from "sonner@2.0.3";

interface Professional {
  id: string;
  name: string;
  profession: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  priceRange?: string;
  avatar: string;
  coverImage?: string;
  specialties: string[];
  distance?: string;
  verified?: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional;
  services?: ServiceDocument[];
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
];

export function BookingModal({ isOpen, onClose, professional, services = [] }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !selectedServiceId || !professional) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("You must be logged in to book an appointment");
      return;
    }

    try {
      setIsLoading(true);

      // Combine date and time to create a proper timestamp
      const [hours, minutes, period] = selectedTime.match(/(\d+):(\d+) (AM|PM)/)?.slice(1) || [];
      const hour24 = period === "PM" && hours !== "12" 
        ? parseInt(hours) + 12 
        : period === "AM" && hours === "12" 
        ? 0 
        : parseInt(hours);
      
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(hour24, parseInt(minutes), 0, 0);

      // Create booking document
      const bookingId = await createBooking(
        selectedServiceId,
        currentUser.uid,
        professional.id,
        bookingDateTime
      );

      // Add booking to user's bookings array
      await addBookingToUser(currentUser.uid, bookingId);

      toast.success("Booking created successfully! View it in the Bookings tab.");
      
      onClose();
      
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setSelectedServiceId("");
      setNotes("");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === selectedServiceId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book with {professional.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Professional Info */}
          <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={professional.avatar} />
              <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="">{professional.name}</h3>
              <p className="text-sm text-muted-foreground">{professional.profession}</p>
              {professional.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{professional.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label>Select Service</Label>
            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center border rounded-lg">
                No services available
              </p>
            ) : (
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id || service.title} value={service.id || service.title}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.title}</span>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="outline">${service.price}</Badge>
                          <Badge variant="secondary">{service.time} min</Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border w-full"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Select Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or preferences..."
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedService && (
            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{selectedService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${selectedService.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{selectedService.time} min</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleBook} 
              disabled={!selectedDate || !selectedTime || !selectedServiceId || isLoading}
              className="flex-1"
            >
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}