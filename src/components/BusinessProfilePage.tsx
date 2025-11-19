import { useState } from "react";
import { ArrowLeft, Star, MapPin, Clock, Heart, Bookmark, MessageCircle, Calendar, Gift, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { BookingModal } from "./BookingModal";
import { LoyaltyCard } from "./LoyaltyCard";

interface BusinessProfilePageProps {
  professionalId: string;
  onBack: () => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
}

export function BusinessProfilePage({ professionalId, onBack, isGuest = false, onRequireAuth }: BusinessProfilePageProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [following, setFollowing] = useState(false);

  // Mock business data - in real app this would come from API
  const business = {
    id: professionalId,
    name: "Sarah Chen",
    profession: "Hair Stylist & Colorist",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1af?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviewCount: 127,
    location: "Downtown District",
    distance: "0.8 miles",
    verified: true,
    bio: "Specializing in balayage, color corrections, and transformative cuts. 8+ years of experience helping clients find their perfect look.",
    specialties: ["Balayage", "Color Correction", "Haircuts", "Styling"],
    priceRange: "$80-$200",
    availability: "Mon-Sat 9AM-7PM",
    posts: [
      {
        id: "1",
        image: "https://images.unsplash.com/photo-1562322140-8198e7e1cade?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwdHJhbnNmb3JtYXRpb258ZW58MXx8fHwxNzU4MTIxOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        likes: 89,
        comments: 12,
        caption: "Color transformation ✨"
      },
      {
        id: "2", 
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZ3xlbnwxfHx8fDE3NTgxMjE5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        likes: 156,
        comments: 23,
        caption: "Beachy waves for summer"
      },
      {
        id: "3",
        image: "https://images.unsplash.com/photo-1522337094846-8a818192de1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY29sb3J8ZW58MXx8fHwxNzU4MTIxOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        likes: 203,
        comments: 34,
        caption: "Dramatic balayage transformation"
      }
    ]
  };

  const loyaltyProgram = {
    professionalName: business.name,
    totalVisits: 3,
    visitsForReward: 5,
    rewardDescription: "Free deep conditioning treatment ($85 value)",
    nextReward: "20% off color service",
    level: "Bronze" as const,
    points: 150
  };

  const services = [
    { name: "Haircut & Style", price: "$85", duration: "1hr" },
    { name: "Full Color", price: "$150", duration: "2.5hrs" },
    { name: "Balayage", price: "$200", duration: "3hrs" },
    { name: "Color Touch-up", price: "$80", duration: "1.5hrs" },
    { name: "Deep Conditioning", price: "$45", duration: "30min" }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1>Business Profile</h1>
      </div>

      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={business.avatar} />
              <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2>{business.name}</h2>
                {business.verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{business.profession}</p>
              
              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{business.rating}</span>
                  <span className="text-muted-foreground">({business.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{business.distance}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (isGuest && onRequireAuth) {
                      onRequireAuth();
                    } else {
                      setBookingModalOpen(true);
                    }
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (isGuest && onRequireAuth) {
                      onRequireAuth();
                    } else {
                      setFollowing(!following);
                    }
                  }}
                >
                  {following ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm mb-3">{business.bio}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {business.specialties.map(specialty => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Price Range:</span>
                <span className="ml-2 font-medium">{business.priceRange}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hours:</span>
                <span className="ml-2 font-medium">{business.availability}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="loyalty">Rewards</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-3 gap-1">
            {business.posts.map(post => (
              <div key={post.id} className="aspect-square relative group cursor-pointer">
                <img 
                  src={post.image}
                  alt="Portfolio"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="space-y-3">
            {services.map((service, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{service.price}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setBookingModalOpen(true)}
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <LoyaltyCard {...loyaltyProgram} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">1</div>
                <div>
                  <p className="font-medium text-sm">Book & Visit</p>
                  <p className="text-xs text-muted-foreground">Each appointment earns you progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">2</div>
                <div>
                  <p className="font-medium text-sm">Earn Rewards</p>
                  <p className="text-xs text-muted-foreground">Get free services and exclusive discounts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">3</div>
                <div>
                  <p className="font-medium text-sm">Level Up</p>
                  <p className="text-xs text-muted-foreground">Unlock better rewards as you visit more</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://images.unsplash.com/photo-1494790108755-2616b612b1af?w=150&h=150&fit=crop&crop=face&${i}`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Client {i}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Amazing work! Sarah really understood what I wanted and delivered perfectly. The color is exactly what I envisioned.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        professional={{
          id: business.id,
          name: business.name,
          avatar: business.avatar,
          profession: business.profession,
          rating: business.rating,
          location: business.location,
          distance: business.distance,
          priceRange: business.priceRange,
          specialties: business.specialties,
          verified: business.verified
        }}
      />
    </div>
  );
}