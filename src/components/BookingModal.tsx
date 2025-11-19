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
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{professional.location}</span>
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label>Select Service</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.name} value={service.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{service.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline">${service.price}</Badge>
                        <Badge variant="secondary">{service.duration}</Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <span>{selectedService}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${services.find(s => s.name === selectedService)?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{services.find(s => s.name === selectedService)?.duration}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleBook} 
              disabled={!selectedDate || !selectedTime || !selectedService}
              className="flex-1"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}