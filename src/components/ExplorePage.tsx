import { useState } from "react";
import { BookMarked, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { mockWorkPhotos, categories } from "./mockData";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface ExplorePageProps {
  savedItems: string[];
  onToggleSave: (photoId: string) => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
}

export function ExplorePage({ savedItems, onToggleSave, isGuest = false, onRequireAuth }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter photos based on search and category
  const filteredPhotos = mockWorkPhotos.filter((photo) => {
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

      {/* Photo Masonry Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No photos found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search or category.</p>
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
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
}

interface PhotoCardProps {
  photo: typeof mockWorkPhotos[0];
  isSaved: boolean;
  onToggleSave: (photoId: string) => void;
}

function PhotoCard({ photo, isSaved, onToggleSave }: PhotoCardProps) {
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

      {/* Save Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-3 left-3 w-10 h-10 rounded-full transition-all duration-300 ${
          isHovered || isSaved ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        } bg-background/95 hover:bg-background shadow-lg backdrop-blur-sm`}
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
    </div>
  );
}