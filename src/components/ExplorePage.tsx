import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { mockWorkPhotos, categories } from "./mockData";
import { toast } from "./ui/sonner";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = SCREEN_WIDTH > 600 ? 2 : 2;
const GUTTER = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - (GUTTER * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

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

  // Organize photos into columns
  const columns: typeof mockWorkPhotos[] = Array(COLUMN_COUNT).fill(null).map(() => []);
  filteredPhotos.forEach((photo, index) => {
    columns[index % COLUMN_COUNT].push(photo);
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Badge variant="secondary">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'result' : 'results'}
          </Badge>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#717182" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by artist or category..."
            placeholderTextColor="#717182"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons name="close" size={16} color="#717182" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryButton}
            >
              {category}
            </Button>
          ))}
        </ScrollView>
      </View>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No photos found matching your criteria.</Text>
          <Text style={styles.emptySubtext}>Try a different search or category.</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {columns.map((column, colIndex) => (
              <View key={colIndex} style={styles.column}>
                {column.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    isSaved={savedItems.includes(photo.id)}
                    onToggleSave={onToggleSave}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

interface PhotoCardProps {
  photo: typeof mockWorkPhotos[0];
  isSaved: boolean;
  onToggleSave: (photoId: string) => void;
}

function PhotoCard({ photo, isSaved, onToggleSave }: PhotoCardProps) {
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

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Hover Overlay */}
      {pressed && (
        <View style={styles.hoverOverlay} />
      )}

      {/* Category Badge - visible on press */}
      {pressed && (
        <View style={styles.categoryBadge}>
          <Badge variant="secondary">{photo.category}</Badge>
        </View>
      )}

      {/* Artist Info - always visible */}
      <View style={styles.artistInfo}>
        <Image
          source={{ uri: photo.professional.avatar }}
          style={styles.avatar}
        />
        <View style={styles.artistText}>
          <Text style={styles.artistName} numberOfLines={1}>
            {photo.professional.name}
          </Text>
          <Text style={styles.artistLikes}>{photo.likes.toLocaleString()} likes</Text>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, (pressed || isSaved) && styles.saveButtonVisible]}
        onPress={(e) => {
          e.stopPropagation();
          onToggleSave(photo.id);
        }}
      >
        <Ionicons 
          name={isSaved ? "bookmark" : "bookmark-outline"} 
          size={20} 
          color={isSaved ? "#ef4444" : "#030213"} 
        />
      </TouchableOpacity>

      {/* Saved Indicator */}
      {isSaved && !pressed && (
        <View style={styles.savedIndicator}>
          <Ionicons name="bookmark" size={16} color="#ef4444" />
        </View>
      )}
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
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#030213",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#030213",
  },
  clearButton: {
    padding: 4,
  },
  categoryScroll: {
    marginHorizontal: -16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    paddingHorizontal: GUTTER,
    gap: GUTTER,
  },
  column: {
    flex: 1,
    gap: GUTTER,
  },
  photoCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    marginBottom: GUTTER,
  },
  photoCardPressed: {
    opacity: 0.95,
  },
  photoImage: {
    width: "100%",
    aspectRatio: 0.75,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
  },
  hoverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  artistInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.9)",
    marginRight: 8,
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
  saveButton: {
    position: "absolute",
    top: 12,
    left: 12,
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
  saveButtonVisible: {
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#717182",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#717182",
    textAlign: "center",
  },
});
