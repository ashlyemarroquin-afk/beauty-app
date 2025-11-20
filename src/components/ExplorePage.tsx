import { useState, useEffect } from "react";
import { BookMarked, Search, X, Loader2, UserPlus, UserCheck, Share2, Star, MapPin, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { type WorkPhoto, categories } from "./mockData";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getExplorePosts } from "../lib/firestoreService";
import { toast } from "sonner@2.0.3";
import { followProvider, unfollowProvider } from "../lib/firebaseAuth";
import { auth } from "../lib/firebase";
import { BusinessProfilePage } from "./BusinessProfilePage";

interface ExplorePageProps {
  savedItems: string[];
  onToggleSave: (photoId: string) => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
  currentUserId?: string;
  followedProviders?: string[];
  onFollowChange?: () => void;
  onNavigateToMessages?: () => void;
}

export function ExplorePage({ savedItems, onToggleSave, isGuest = false, onRequireAuth, currentUserId, followedProviders = [], onFollowChange, onNavigateToMessages }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workPhotos, setWorkPhotos] = useState<WorkPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followed, setFollowed] = useState<string[]>(followedProviders);
  const [selectedPhoto, setSelectedPhoto] = useState<WorkPhoto | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<string | null>(null);

  // Update followed list when prop changes
  useEffect(() => {
    setFollowed(followedProviders);
  }, [followedProviders]);

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

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("ExplorePage: Starting to fetch posts...");
        const posts = await getExplorePosts();
        console.log("ExplorePage: Received posts:", posts);
        console.log("ExplorePage: Number of posts:", posts.length);
        setWorkPhotos(posts);
        
        if (posts.length === 0) {
          console.warn("ExplorePage: No posts returned from Firestore");
          setError("No posts found in the explore collection. Please check your Firestore data.");
        }
      } catch (err: any) {
        console.error("ExplorePage: Error fetching posts:", err);
        console.error("ExplorePage: Error details:", {
          message: err.message,
          code: err.code,
          stack: err.stack
        });
        setError(err.message || "Failed to load posts");
        toast.error(`Failed to load posts: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter photos based on search and category
  const filteredPhotos = workPhotos.filter((photo) => {
    const matchesSearch = 
      searchQuery === "" ||
      photo.professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || 
      photo.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8 min-h-full">
      {/* Header */}
      <div className="space-y-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 border-b border-border">
        <div className="flex items-center justify-between pt-2">
          <h1>Explore</h1>
          <Badge variant="secondary">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'result' : 'results'}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by artist or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      ) : workPhotos.length === 0 ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No posts found in the explore collection.</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error || "Please check your Firestore database and ensure the 'explore' collection has documents."}
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No photos found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search or category.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Showing {workPhotos.length} total posts, but none match your filters.
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 900: 3 }}
        >
          <Masonry gutter="12px">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isSaved={savedItems.includes(photo.id)}
                onToggleSave={onToggleSave}
                onClick={() => setSelectedPhoto(photo)}
                isFollowing={followed.includes(photo.professional.id)}
                onFollowToggle={() => handleFollowToggle(photo.professional.id, photo.professional.name, followed.includes(photo.professional.id))}
                isGuest={isGuest}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          isSaved={savedItems.includes(selectedPhoto.id)}
          onToggleSave={onToggleSave}
          onClose={() => setSelectedPhoto(null)}
          onViewProfile={() => {
            setViewingBusiness(selectedPhoto.professional.id);
            setSelectedPhoto(null);
          }}
          isFollowing={followed.includes(selectedPhoto.professional.id)}
          onFollowToggle={() => handleFollowToggle(selectedPhoto.professional.id, selectedPhoto.professional.name, followed.includes(selectedPhoto.professional.id))}
          isGuest={isGuest}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

interface PhotoCardProps {
  photo: WorkPhoto;
  isSaved: boolean;
  onToggleSave: (photoId: string) => void;
  onClick: () => void;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  isGuest?: boolean;
}

function PhotoCard({ photo, isSaved, onToggleSave, onClick, isFollowing = false, onFollowToggle, isGuest = false }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-xl bg-muted transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image - maintains natural aspect ratio */}
      <ImageWithFallback
        src={photo.image}
        alt={`Work by ${photo.professional.name}`}
        className="w-full h-auto object-cover"
      />

      {/* Gradient Overlay - always visible at bottom */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent h-32 pointer-events-none" />

      {/* Full Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Right: Category Badge - visible on hover */}
      <div 
        className={`absolute top-3 right-3 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm shadow-lg">
          {photo.category}
        </Badge>
      </div>

      {/* Bottom: Artist Info - always visible */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img
              src={photo.professional.avatar}
              alt={photo.professional.name}
              className="w-9 h-9 rounded-full border-2 border-white/90 flex-shrink-0"
            />
            <div className="text-white min-w-0">
              <p className="text-sm font-medium truncate">{photo.professional.name}</p>
              <p className="text-xs opacity-90">{photo.likes.toLocaleString()} likes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save and Follow Buttons */}
      <div className={`absolute top-3 left-3 flex gap-2 transition-all duration-300 ${
        isHovered || isSaved ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-background/95 hover:bg-background shadow-lg backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(photo.id);
          }}
        >
          <BookMarked
            className={`w-5 h-5 transition-all ${
              isSaved ? 'fill-red-500 text-red-500 scale-110' : ''
            }`}
          />
        </Button>
        {/* Follow Button */}
        {!isGuest && onFollowToggle && (
          <Button
            variant={isFollowing ? "default" : "ghost"}
            size="icon"
            className="w-10 h-10 rounded-full bg-background/95 hover:bg-background shadow-lg backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle();
            }}
          >
            {isFollowing ? (
              <UserCheck className="w-5 h-5" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

interface PhotoDetailModalProps {
  photo: WorkPhoto;
  isSaved: boolean;
  onToggleSave: (photoId: string) => void;
  onClose: () => void;
  onViewProfile: () => void;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  isGuest?: boolean;
  currentUserId?: string;
}

function PhotoDetailModal({ photo, isSaved, onToggleSave, onClose, onViewProfile, isFollowing = false, onFollowToggle, isGuest = false, currentUserId }: PhotoDetailModalProps) {
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
            src={photo.image}
            alt={photo.description || `Work by ${photo.professional.name}`}
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
              onClick={() => onToggleSave(photo.id)}
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
              src={photo.professional.avatar}
              alt={photo.professional.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium">{photo.professional.name}</p>
                {photo.professional.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              {photo.professional.profession && (
                <p className="text-sm text-muted-foreground">
                  {photo.professional.profession}
                </p>
              )}
              {photo.professional.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{photo.professional.rating}</span>
                </div>
              )}
              {photo.professional.location && (
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{photo.professional.location}</span>
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
          {photo.description && (
            <div className="mt-6">
              <h3 className="mb-2">Description</h3>
              <p className="text-muted-foreground">{photo.description}</p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookMarked className="w-4 h-4" />
                <span className="text-sm">{photo.likes} likes</span>
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