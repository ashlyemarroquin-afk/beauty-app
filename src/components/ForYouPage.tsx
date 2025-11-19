import { useState } from "react";
import Masonry from "react-responsive-masonry";
import { BookMarked, MessageCircle, Share2, X, MapPin, Star, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BusinessProfilePage } from "./BusinessProfilePage";
import { mockWorkPhotos, type WorkPhoto } from "./mockData";
import { toast } from "sonner@2.0.3";

interface ForYouPageProps {
  savedItems?: string[];
  onToggleSave?: (pinId: string) => void;
  isGuest?: boolean;
  onRequireAuth?: () => void;
}

export function ForYouPage({ savedItems = [], onToggleSave, isGuest = false, onRequireAuth }: ForYouPageProps) {
  const [localSavedItems, setLocalSavedItems] = useState<string[]>(savedItems);
  const [selectedPin, setSelectedPin] = useState<WorkPhoto | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<string | null>(null);

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
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Minimal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h1>For You</h1>
          </div>
          <Badge variant="secondary">
            {mockWorkPhotos.length} pins
          </Badge>
        </div>

        {/* Masonry Grid */}
        <Masonry columnsCount={2} gutter="12px" className="md:hidden">
          {mockWorkPhotos.map((pin) => (
            <PinCard
              key={pin.id}
              pin={pin}
              isSaved={allSavedItems.includes(pin.id)}
              onToggleSave={handleToggleSave}
              onClick={() => setSelectedPin(pin)}
            />
          ))}
        </Masonry>

        <Masonry columnsCount={3} gutter="16px" className="hidden md:block lg:hidden">
          {mockWorkPhotos.map((pin) => (
            <PinCard
              key={pin.id}
              pin={pin}
              isSaved={allSavedItems.includes(pin.id)}
              onToggleSave={handleToggleSave}
              onClick={() => setSelectedPin(pin)}
            />
          ))}
        </Masonry>

        <Masonry columnsCount={4} gutter="16px" className="hidden lg:block">
          {mockWorkPhotos.map((pin) => (
            <PinCard
              key={pin.id}
              pin={pin}
              isSaved={allSavedItems.includes(pin.id)}
              onToggleSave={handleToggleSave}
              onClick={() => setSelectedPin(pin)}
            />
          ))}
        </Masonry>
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
}

function PinCard({ pin, isSaved, onToggleSave, onClick }: PinCardProps) {
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
          <div className="absolute top-3 right-3">
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
}

function PinDetailModal({ pin, isSaved, onToggleSave, onClose, onViewProfile }: PinDetailModalProps) {
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