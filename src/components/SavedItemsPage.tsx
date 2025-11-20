import { useState } from "react";
import { BookMarked, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { mockWorkPhotos, categories } from "./mockData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface SavedItemsPageProps {
  savedItems: string[];
  onRemove: (photoId: string) => void;
}

export function SavedItemsPage({ savedItems, onRemove }: SavedItemsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  // Get saved photos
  const savedPhotos = mockWorkPhotos.filter((photo) => savedItems.includes(photo.id));

  // Filter by category
  const filteredPhotos = savedPhotos.filter((photo) => {
    if (selectedCategory === "All") return true;
    return photo.category === selectedCategory;
  });

  // Count by category
  const categoryCounts = categories.reduce((acc, category) => {
    if (category === "All") {
      acc[category] = savedPhotos.length;
    } else {
      acc[category] = savedPhotos.filter((p) => p.category === category).length;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleDelete = () => {
    if (photoToDelete) {
      onRemove(photoToDelete);
      setPhotoToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-h-full">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>My Shelf</h1>
            <p className="text-sm text-muted-foreground">
              All your favorite work in one place ✨
            </p>
          </div>
          <Badge variant="secondary">
            {savedPhotos.length} {savedPhotos.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b">
          {categories.map((category) => {
            const count = categoryCounts[category] || 0;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1.5 py-0.5 text-xs"
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Saved Items Grid */}
      {savedPhotos.length === 0 ? (
        <div className="text-center py-12">
          <BookMarked className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="mb-2">Your shelf is empty! 📚</h2>
          <p className="text-muted-foreground">
            Start exploring and shelf your favorite work to see it here
          </p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No items in this category yet.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try exploring a different category!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {filteredPhotos.map((photo) => (
            <SavedPhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() => setPhotoToDelete(photo.id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from your shelf?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from your collection. You can always shelf it again later!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SavedPhotoCardProps {
  photo: typeof mockWorkPhotos[0];
  onDelete: () => void;
}

function SavedPhotoCard({ photo, onDelete }: SavedPhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-muted transition-transform duration-200 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <ImageWithFallback
        src={photo.image}
        alt={`Work by ${photo.professional.name}`}
        className="w-full h-full object-cover aspect-square"
      />

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 dark:bg-black/50 flex flex-col justify-between p-3 transition-opacity duration-200">
          {/* Top: Category Badge */}
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="bg-background/90 shadow-lg">
              {photo.category}
            </Badge>
          </div>

          {/* Bottom: Artist Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={photo.professional.avatar}
                alt={photo.professional.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="text-white">
                <p className="text-sm font-medium">{photo.professional.name}</p>
                <p className="text-xs">{photo.likes} likes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-2 w-10 h-10 rounded-full ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } transition-opacity bg-background hover:bg-background/90 hover:text-destructive shadow-lg`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Saved Indicator */}
      <div className="absolute top-2 left-2">
        <BookMarked className="w-5 h-5 fill-red-500 text-red-500" />
      </div>
    </div>
  );
}