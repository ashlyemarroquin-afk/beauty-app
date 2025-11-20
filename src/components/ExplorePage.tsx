import { useState, useEffect } from "react";
import { BookMarked, Search, X, Loader2, UserPlus, UserCheck } from "lucide-react";
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

interface ExplorePageProps {
  savedItems: string[];
  onToggleSave: (photoId: string) => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
  currentUserId?: string;
  followedProviders?: string[];
  onFollowChange?: () => void;
}

export function ExplorePage({ savedItems, onToggleSave, isGuest = false, onRequireAuth, currentUserId, followedProviders = [], onFollowChange }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workPhotos, setWorkPhotos] = useState<WorkPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followed, setFollowed] = useState<string[]>(followedProviders);

  // Update followed list when prop changes
  useEffect(() => {
    setFollowed(followedProviders);
  }, [followedProviders]);

  // Handle follow/unfollow
  const handleFollowToggle = async (providerName: string, isFollowing: boolean) => {
    if (isGuest || !currentUserId) {
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }

    try {
      if (isFollowing) {
        await unfollowProvider(currentUserId, providerName);
        setFollowed(prev => prev.filter(name => name !== providerName));
        toast.success(`Unfollowed ${providerName}`);
      } else {
        await followProvider(currentUserId, providerName);
        setFollowed(prev => [...prev, providerName]);
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      ) : workPhotos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No posts found in the explore collection.</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error || "Please check your Firestore database and ensure the 'explore' collection has documents."}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">Refresh</Button>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No photos found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search or category.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Showing {workPhotos.length} total posts, but none match your filters.
          </p>
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
                isFollowing={followed.includes(photo.professional.name)}
                onFollowToggle={() => handleFollowToggle(photo.professional.name, followed.includes(photo.professional.name))}
                isGuest={isGuest}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
}

interface PhotoCardProps {
  photo: WorkPhoto;
  isSaved: boolean;
  onToggleSave: (photoId: string) => void;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  isGuest?: boolean;
}

function PhotoCard({ photo, isSaved, onToggleSave, isFollowing = false, onFollowToggle, isGuest = false }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-xl bg-muted transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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