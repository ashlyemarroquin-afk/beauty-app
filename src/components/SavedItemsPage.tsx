import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = SCREEN_WIDTH > 600 ? 3 : 2;
const GUTTER = 8;
const ITEM_WIDTH = (SCREEN_WIDTH - (GUTTER * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

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

  // Organize photos into grid
  const rows: typeof filteredPhotos[] = [];
  for (let i = 0; i < filteredPhotos.length; i += COLUMN_COUNT) {
    rows.push(filteredPhotos.slice(i, i + COLUMN_COUNT));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>My Shelf</Text>
            <Text style={styles.headerSubtitle}>
              All your favorite work in one place ✨
            </Text>
          </View>
          <Badge variant="secondary">
            {savedPhotos.length} {savedPhotos.length === 1 ? 'item' : 'items'}
          </Badge>
        </View>

        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => {
            const count = categoryCounts[category] || 0;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onPress={() => setSelectedCategory(category)}
                style={styles.categoryButton}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    style={styles.categoryBadge}
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </ScrollView>
      </View>

      {/* Saved Items Grid */}
      {savedPhotos.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={64} color="#717182" />
          <Text style={styles.emptyTitle}>Your shelf is empty! 📚</Text>
          <Text style={styles.emptyText}>
            Start exploring and shelf your favorite work to see it here
          </Text>
        </View>
      ) : filteredPhotos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No items in this category yet.
          </Text>
          <Text style={styles.emptySubtext}>
            Try exploring a different category!
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((photo) => (
                  <SavedPhotoCard
                    key={photo.id}
                    photo={photo}
                    onDelete={() => setPhotoToDelete(photo.id)}
                  />
                ))}
                {/* Fill empty spaces in last row */}
                {row.length < COLUMN_COUNT && Array(COLUMN_COUNT - row.length).fill(null).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.emptyCard} />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
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
            <AlertDialogCancel onPress={() => setPhotoToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onPress={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}

interface SavedPhotoCardProps {
  photo: typeof mockWorkPhotos[0];
  onDelete: () => void;
}

function SavedPhotoCard({ photo, onDelete }: SavedPhotoCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.photoCard, pressed && styles.photoCardPressed]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.9}
    >
      <ImageWithFallback
        src={photo.image}
        style={styles.photoImage}
      />

      {/* Hover Overlay */}
      {pressed && (
        <View style={styles.overlay}>
          {/* Category Badge */}
          <View style={styles.categoryBadgeContainer}>
            <Badge variant="secondary">{photo.category}</Badge>
          </View>

          {/* Artist Info */}
          <View style={styles.artistInfo}>
            <Image
              source={{ uri: photo.professional.avatar }}
              style={styles.avatar}
            />
            <View style={styles.artistText}>
              <Text style={styles.artistName} numberOfLines={1}>
                {photo.professional.name}
              </Text>
              <Text style={styles.artistLikes}>{photo.likes} likes</Text>
            </View>
          </View>
        </View>
      )}

      {/* Delete Button */}
      <TouchableOpacity
        style={[styles.deleteButton, pressed && styles.deleteButtonVisible]}
        onPress={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Ionicons name="trash-outline" size={16} color="#ef4444" />
      </TouchableOpacity>

      {/* Saved Indicator */}
      <View style={styles.savedIndicator}>
        <Ionicons name="bookmark" size={20} color="#ef4444" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#030213",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#717182",
  },
  categoryScroll: {
    marginHorizontal: -16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
  },
  categoryButton: {
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryButtonText: {
    fontSize: 14,
  },
  categoryBadge: {
    fontSize: 10,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    padding: GUTTER,
  },
  row: {
    flexDirection: "row",
    gap: GUTTER,
    marginBottom: GUTTER,
  },
  photoCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  photoCardPressed: {
    transform: [{ scale: 1.05 }],
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "space-between",
    padding: 12,
  },
  categoryBadgeContainer: {
    alignSelf: "flex-start",
  },
  artistInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  artistText: {
    flex: 1,
  },
  artistName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  artistLikes: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteButtonVisible: {
    opacity: 1,
  },
  savedIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
  },
  emptyCard: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#030213",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#717182",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 12,
    color: "#717182",
    textAlign: "center",
    marginTop: 8,
  },
});
