import { useState, useEffect } from "react";
import Masonry from "react-responsive-masonry";
import { BookMarked, MessageCircle, Share2, X, MapPin, Star, Sparkles, Loader2, UserPlus, UserCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BusinessProfilePage } from "./BusinessProfilePage";
import { type WorkPhoto } from "./mockData";
import { toast } from "sonner@2.0.3";
import { getForYouPosts } from "../lib/firestoreService";
import { followProvider, unfollowProvider, getUserData } from "../lib/firebaseAuth";
import { auth } from "../lib/firebase";

interface ForYouPageProps {
  savedItems?: string[];
  onToggleSave?: (pinId: string) => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
  currentUserId?: string;
  followedProviders?: string[];
  onFollowChange?: () => void;
  onNavigateToMessages?: () => void;
}

export function ForYouPage({ 
  savedItems = [], 
  onToggleSave, 
  isGuest = false, 
  onRequireAuth,
  currentUserId,
  followedProviders = [],
  onFollowChange,
  onNavigateToMessages
}: ForYouPageProps) {
  const [localSavedItems, setLocalSavedItems] = useState<string[]>(savedItems);
  const [selectedPin, setSelectedPin] = useState<WorkPhoto | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<string | null>(null);
  const [workPhotos, setWorkPhotos] = useState<WorkPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followed, setFollowed] = useState<string[]>(followedProviders);

  // Update followed list when prop changes
  useEffect(() => {
    setFollowed(followedProviders);
  }, [followedProviders]);

  // Fetch posts from Firestore (only from followed providers)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (isGuest || followed.length === 0) {
          // If guest or no followed providers, show empty state
          setWorkPhotos([]);
        } else {
          const posts = await getForYouPosts(followed);
          setWorkPhotos(posts);
        }
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to load posts");
        toast.error("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [followed, isGuest]);

  // Handle follow/unfollow
  const handleFollowToggle = async (providerId: string, providerName: string, isFollowing: boolean) => {
    if (isGuest || !currentUserId) {
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }

    try {
      if (isFollowing) {
        await unfollowProvider(currentUserId, providerId);
        setFollowed(prev => prev.filter(id => id !== providerId));
        toast.success(`Unfollowed ${providerName}`);
      } else {
        await followProvider(currentUserId, providerId);
        setFollowed(prev => [...prev, providerId]);
        toast.success(`Following ${providerName}`);
      }
      
      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  const handleToggleSave = (pinId: string) => {
    if (onToggleSave) {
      onToggleSave(pinId);
    } else {
      setLocalSavedItems(prev => {
        if (prev.includes(pinId)) {
          toast.success("Removed from your shelf");
          return prev.filter(id => id !== pinId);
        } else {
          toast.success("Shelved! ✨");
          return [...prev, pinId];
        }
      });
    }
  };

  const allSavedItems = [...savedItems, ...localSavedItems];

  // If viewing a business profile, show that instead
  if (viewingBusiness) {
    return (
      <BusinessProfilePage 
        professionalId={viewingBusiness} 
        onBack={() => setViewingBusiness(null)}
        isGuest={isGuest}
        onRequireAuth={onRequireAuth}
        onNavigateToMessages={onNavigateToMessages}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (workPhotos.length === 0 && !isLoading) {
    if (isGuest || followed.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-full">
          <div className="text-center space-y-4 max-w-md">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold">Start Following Providers</h2>
            <p className="text-muted-foreground">
              {isGuest 
                ? "Sign in to follow providers and see their posts in your feed!"
                : "Follow providers in the Explore page to see their posts here."}
            </p>
            {isGuest && onRequireAuth && (
              <Button onClick={onRequireAuth}>Sign In</Button>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">No posts yet</h2>
          <p className="text-muted-foreground">The providers you follow haven't posted anything yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 min-h-full">
        {/* Minimal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h1>For You</h1>
          </div>
          <Badge variant="secondary">
            {workPhotos.length} pins
          </Badge>
        </div>

        {/* Masonry Grid - Single responsive grid */}
        <div className="block md:hidden">
          <Masonry columnsCount={2} gutter="12px">
            {workPhotos.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                isSaved={allSavedItems.includes(pin.id)}
                onToggleSave={handleToggleSave}
                onClick={() => setSelectedPin(pin)}
                isFollowing={followed.includes(pin.professional.id)}
                onFollowToggle={(e) => {
                  e.stopPropagation();
                  handleFollowToggle(pin.professional.id, pin.professional.name, followed.includes(pin.professional.id));
                }}
                isGuest={isGuest}
              />
            ))}
          </Masonry>
        </div>

        <div className="hidden md:block lg:hidden">
          <Masonry columnsCount={3} gutter="16px">
            {workPhotos.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                isSaved={allSavedItems.includes(pin.id)}
                onToggleSave={handleToggleSave}
                onClick={() => setSelectedPin(pin)}
                isFollowing={followed.includes(pin.professional.id)}
                onFollowToggle={(e) => {
                  e.stopPropagation();
                  handleFollowToggle(pin.professional.id, pin.professional.name, followed.includes(pin.professional.id));
                }}
                isGuest={isGuest}
              />
            ))}
          </Masonry>
        </div>

        <div className="hidden lg:block">
          <Masonry columnsCount={4} gutter="16px">
            {workPhotos.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                isSaved={allSavedItems.includes(pin.id)}
                onToggleSave={handleToggleSave}
                onClick={() => setSelectedPin(pin)}
                isFollowing={followed.includes(pin.professional.id)}
                onFollowToggle={(e) => {
                  e.stopPropagation();
                  handleFollowToggle(pin.professional.id, pin.professional.name, followed.includes(pin.professional.id));
                }}
                isGuest={isGuest}
              />
            ))}
          </Masonry>
        </div>
      </div>

      {/* Pin Detail Modal */}
      {selectedPin && (
        <PinDetailModal
          pin={selectedPin}
          isSaved={allSavedItems.includes(selectedPin.id)}
          onToggleSave={handleToggleSave}
          onClose={() => setSelectedPin(null)}
          onViewProfile={() => {
            setViewingBusiness(selectedPin.professional.id);
            setSelectedPin(null);
          }}
          isFollowing={followed.includes(selectedPin.professional.id)}
          onFollowToggle={() => handleFollowToggle(selectedPin.professional.id, selectedPin.professional.name, followed.includes(selectedPin.professional.id))}
          isGuest={isGuest}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
}

interface PinCardProps {
  pin: WorkPhoto;
  isSaved: boolean;
  onToggleSave: (pinId: string) => void;
  onClick: () => void;
  isFollowing?: boolean;
  onFollowToggle?: (e: React.MouseEvent) => void;
  isGuest?: boolean;
}

function PinCard({ pin, isSaved, onToggleSave, onClick, isFollowing = false, onFollowToggle, isGuest = false }: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-muted mb-3"
      style={{
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <ImageWithFallback
        src={pin.image}
        alt={pin.description || `Work by ${pin.professional.name}`}
        className="w-full h-auto object-cover"
      />

      {/* Hover Overlay */}
      {isHovered && (
        <div 
          className="absolute inset-0 bg-black/30 dark:bg-black/40"
          style={{
            transition: "opacity 0.2s ease",
          }}
        >
          {/* Save Button - Top Right */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-background hover:bg-background/90 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(pin.id);
              }}
            >
              <BookMarked
                className={`w-5 h-5 ${
                  isSaved ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            {/* Follow Button */}
            {!isGuest && onFollowToggle && (
              <Button
                variant={isFollowing ? "default" : "ghost"}
                size="icon"
                className="w-10 h-10 rounded-full bg-background hover:bg-background/90 shadow-lg"
                onClick={onFollowToggle}
              >
                {isFollowing ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>

          {/* Category Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 shadow-lg">
              {pin.category}
            </Badge>
          </div>

          {/* Artist Info - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <img
                src={pin.professional.avatar}
                alt={pin.professional.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {pin.professional.name}
                </p>
                {pin.professional.profession && (
                  <p className="text-white/80 text-xs truncate">
                    {pin.professional.profession}
                  </p>
                )}
              </div>
              {isFollowing && (
                <Badge variant="secondary" className="text-xs">
                  Following
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PinDetailModalProps {
  pin: WorkPhoto;
  isSaved: boolean;
  onToggleSave: (pinId: string) => void;
  onClose: () => void;
  onViewProfile: () => void;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  isGuest?: boolean;
  currentUserId?: string;
}

function PinDetailModal({ pin, isSaved, onToggleSave, onClose, onViewProfile, isFollowing = false, onFollowToggle, isGuest = false, currentUserId }: PinDetailModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 dark:bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Side */}
        <div className="relative bg-muted flex items-center justify-center">
          <ImageWithFallback
            src={pin.image}
            alt={pin.description || `Work by ${pin.professional.name}`}
            className="w-full h-full object-contain max-h-[90vh]"
          />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background hover:bg-background/90 shadow-lg"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Details Side */}
        <div className="p-6 flex flex-col max-h-[90vh] overflow-y-auto">
          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={isSaved ? "default" : "outline"}
              className="flex-1"
              onClick={() => onToggleSave(pin.id)}
            >
              <BookMarked className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Shelved" : "Shelf it"}
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Professional Info */}
          <div 
            className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
            style={{
              transition: "background-color 0.2s ease",
            }}
            onClick={onViewProfile}
          >
            <img
              src={pin.professional.avatar}
              alt={pin.professional.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium">{pin.professional.name}</p>
                {pin.professional.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              {pin.professional.profession && (
                <p className="text-sm text-muted-foreground">
                  {pin.professional.profession}
                </p>
              )}
              {pin.professional.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{pin.professional.rating}</span>
                </div>
              )}
              {pin.professional.location && (
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{pin.professional.location}</span>
                </div>
              )}
            </div>
            {/* Follow Button in Modal */}
            {!isGuest && currentUserId && onFollowToggle && (
              <Button
                variant={isFollowing ? "default" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle();
                }}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Description */}
          {pin.description && (
            <div className="mt-6">
              <h3 className="mb-2">Description</h3>
              <p className="text-muted-foreground">{pin.description}</p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookMarked className="w-4 h-4" />
                <span className="text-sm">{pin.likes} likes</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">View comments</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-6">
            <Button className="w-full" onClick={onViewProfile}>
              View Profile & Book it! ✨
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}