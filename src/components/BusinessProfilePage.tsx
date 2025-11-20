import { useState, useEffect } from "react";
import { ArrowLeft, Star, MapPin, Clock, Heart, MessageCircle, Calendar, DollarSign, Briefcase, ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookingModal } from "./BookingModal";
import { getUserData } from "../lib/firebaseAuth";
import { getServicesByIds, ServiceDocument, createMessageConversation } from "../lib/firestoreService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "sonner@2.0.3";

interface BusinessProfilePageProps {
  professionalId: string;
  onBack: () => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
  onNavigateToMessages?: () => void;
}

interface Post {
  id: string;
  url: string;
  description?: string;
  likes?: number;
  category?: string;
}

export function BusinessProfilePage({ professionalId, onBack, isGuest = false, onRequireAuth, onNavigateToMessages }: BusinessProfilePageProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("services");
  const [startingChat, setStartingChat] = useState(false);

  // Fetch user data, services, and posts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const user = await getUserData(professionalId);
        if (!user) {
          toast.error("Provider not found");
          onBack();
          return;
        }
        setUserData(user);

        // Fetch services
        if (user.services && Array.isArray(user.services) && user.services.length > 0) {
          const fetchedServices = await getServicesByIds(user.services);
          setServices(fetchedServices);
        }

        // Fetch posts from explore collection where provider_id matches
        const exploreRef = collection(db, "explore");
        const postsQuery = query(exploreRef, where("provider_id", "==", professionalId));
        const postsSnapshot = await getDocs(postsQuery);
        
        const fetchedPosts: Post[] = [];
        postsSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPosts.push({
            id: doc.id,
            url: data.url,
            description: data.description,
            likes: data.likes || 0,
            category: data.category,
          });
        });
        setPosts(fetchedPosts);

      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [professionalId, onBack]);

  const handleStartChat = async () => {
    if (isGuest && onRequireAuth) {
      onRequireAuth();
      return;
    }

    try {
      setStartingChat(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("You must be logged in to start a chat");
        return;
      }

      // Get current user data to verify they're a consumer
      const currentUserData = await getUserData(currentUser.uid);
      if (!currentUserData) {
        toast.error("User data not found");
        return;
      }

      // Create or find existing conversation
      const conversationId = await createMessageConversation(
        currentUser.uid, // consumer_id
        professionalId    // provider_id
      );

      toast.success("Chat started! Opening messages...");
      
      // Navigate to messages page if callback provided
      if (onNavigateToMessages) {
        onNavigateToMessages();
      }
      
    } catch (error: any) {
      console.error("Error starting chat:", error);
      toast.error(error.message || "Failed to start chat");
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Business Profile</h1>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Business Profile</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Provider not found</p>
        </div>
      </div>
    );
  }

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
              <AvatarImage src={userData.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`} />
              <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2>{userData.name}</h2>
                {userData.verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{userData.profession || "Beauty Professional"}</p>
              
              <div className="flex items-center gap-4 text-sm mb-3">
                {userData.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{userData.rating}</span>
                    {userData.reviewCount && (
                      <span className="text-muted-foreground">({userData.reviewCount})</span>
                    )}
                  </div>
                )}
                {userData.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.location}</span>
                  </div>
                )}
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
                  onClick={handleStartChat}
                  disabled={startingChat}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {startingChat ? "..." : "Message"}
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

          {userData.bio && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm mb-3">{userData.bio}</p>
            </div>
          )}

          {userData.specialties && userData.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {userData.specialties.map((specialty: string) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Services and Portfolio */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No services available yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{service.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${service.price.toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.time} min
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            if (isGuest && onRequireAuth) {
                              onRequireAuth();
                            } else {
                              setBookingModalOpen(true);
                            }
                          }}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Portfolio ({posts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No posts yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {posts.map((post) => (
                    <div key={post.id} className="aspect-square relative group cursor-pointer">
                      <img 
                        src={post.url}
                        alt={post.description || "Portfolio item"}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="flex items-center gap-2 text-sm">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes || 0}</span>
                          </div>
                          {post.category && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        professional={{
          id: userData.id,
          name: userData.name,
          avatar: userData.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`,
          profession: userData.profession || "Beauty Professional",
          rating: userData.rating,
          location: userData.location,
          distance: userData.distance,
          priceRange: userData.priceRange,
          specialties: userData.specialties || [],
          verified: userData.verified || false
        }}
        services={services}
      />
    </div>
  );
}