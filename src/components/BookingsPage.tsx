import { useState, useEffect } from "react";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { getBookingsByUserId, BookingDocument } from "../lib/firestoreService";
import { getUserData } from "../lib/firebaseAuth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner@2.0.3";

interface EnrichedBooking extends BookingDocument {
  id: string;
  serviceName?: string;
  providerName?: string;
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userBookings = await getBookingsByUserId(currentUser.uid);
      
      // Enrich bookings with service and provider names
      const enrichedBookings = await Promise.all(
        userBookings.map(async (booking) => {
          let serviceName = "Unknown Service";
          let providerName = "Unknown Provider";
          
          // Fetch service info
          try {
            const serviceRef = doc(db, "services", booking.service_id);
            const serviceSnap = await getDoc(serviceRef);
            if (serviceSnap.exists()) {
              const serviceData = serviceSnap.data();
              serviceName = serviceData.title || "Unknown Service";
            }
          } catch (error) {
            console.error("Error fetching service:", error);
          }
          
          // Fetch provider info
          try {
            const providerData = await getUserData(booking.provider_id);
            if (providerData) {
              providerName = providerData.name || "Unknown Provider";
            }
          } catch (error) {
            console.error("Error fetching provider:", error);
          }
          
          return {
            ...booking,
            serviceName,
            providerName,
          };
        })
      );
      
      setBookings(enrichedBookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            My Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-medium mb-2">No bookings yet</h3>
              <p className="text-sm text-muted-foreground">
                Book appointments with beauty professionals to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{booking.serviceName}</h4>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {booking.providerName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.time.toMillis()).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(booking.time.toMillis()).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge variant={
                      new Date(booking.time.toMillis()) > new Date() 
                        ? "default" 
                        : "secondary"
                    }>
                      {new Date(booking.time.toMillis()) > new Date() 
                        ? "Upcoming" 
                        : "Past"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

