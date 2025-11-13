import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BusinessProfilePage } from "./BusinessProfilePage";
import { mockWorkPhotos, type WorkPhoto } from "./mockData";
import { toast } from "./ui/sonner";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = SCREEN_WIDTH > 768 ? 3 : 2;
const GUTTER = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - (GUTTER * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

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

  // Organize photos into columns for masonry-like layout
  const columns: WorkPhoto[][] = Array(COLUMN_COUNT).fill(null).map(() => []);
  mockWorkPhotos.forEach((pin, index) => {
    columns[index % COLUMN_COUNT].push(pin);
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="sparkles" size={20} color="#030213" />
          <Text style={styles.headerTitle}>For You</Text>
        </View>
        <Badge variant="secondary">
          {mockWorkPhotos.length} pins
        </Badge>
      </View>

      {/* Photo Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {columns.map((column, colIndex) => (
            <View key={colIndex} style={styles.column}>
              {column.map((pin) => (
                <PinCard
                  key={pin.id}
                  pin={pin}
                  isSaved={allSavedItems.includes(pin.id)}
                  onToggleSave={handleToggleSave}
                  onPress={() => setSelectedPin(pin)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

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
    </View>
  );
}

interface PinCardProps {
  pin: WorkPhoto;
  isSaved: boolean;
  onToggleSave: (pinId: string) => void;
  onPress: () => void;
}

function PinCard({ pin, isSaved, onToggleSave, onPress }: PinCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.pinCard, pressed && styles.pinCardPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.9}
    >
      <ImageWithFallback
        src={pin.image}
        style={styles.pinImage}
      />

      {/* Overlay */}
      {(pressed || isSaved) && (
        <View style={styles.overlay}>
          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleSave(pin.id);
            }}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isSaved ? "#ef4444" : "#030213"} 
            />
          </TouchableOpacity>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Badge variant="secondary">{pin.category}</Badge>
          </View>

          {/* Artist Info */}
          <View style={styles.artistInfo}>
            <Image 
              source={{ uri: pin.professional.avatar }} 
              style={styles.avatar}
            />
            <View style={styles.artistText}>
              <Text style={styles.artistName} numberOfLines={1}>
                {pin.professional.name}
              </Text>
              {pin.professional.profession && (
                <Text style={styles.artistProfession} numberOfLines={1}>
                  {pin.professional.profession}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Saved Indicator */}
      {isSaved && !pressed && (
        <View style={styles.savedIndicator}>
          <Ionicons name="bookmark" size={16} color="#ef4444" />
        </View>
      )}
    </TouchableOpacity>
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
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <ScrollView
          contentContainerStyle={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            {/* Image */}
            <View style={styles.modalImageContainer}>
              <ImageWithFallback
                src={pin.image}
                style={styles.modalImage}
              />
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#030213" />
              </TouchableOpacity>
            </View>

            {/* Details */}
            <View style={styles.modalDetails}>
              {/* Actions */}
              <View style={styles.modalActions}>
                <Button
                  variant={isSaved ? "default" : "outline"}
                  style={styles.actionButton}
                  onPress={() => onToggleSave(pin.id)}
                >
                  <Ionicons 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={16} 
                    color={isSaved ? "#ffffff" : "#030213"}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.actionButtonText, isSaved && styles.actionButtonTextActive]}>
                    {isSaved ? "Shelved" : "Shelf it"}
                  </Text>
                </Button>
                <Button variant="outline" style={styles.shareButton}>
                  <Ionicons name="share-outline" size={16} color="#030213" />
                </Button>
              </View>

              {/* Professional Info */}
              <TouchableOpacity
                style={styles.professionalCard}
                onPress={onViewProfile}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: pin.professional.avatar }}
                  style={styles.professionalAvatar}
                />
                <View style={styles.professionalInfo}>
                  <View style={styles.professionalHeader}>
                    <Text style={styles.professionalName}>{pin.professional.name}</Text>
                    {pin.professional.verified && (
                      <Badge variant="secondary" style={styles.verifiedBadge}>
                        ✓ Verified
                      </Badge>
                    )}
                  </View>
                  {pin.professional.profession && (
                    <Text style={styles.professionalProfession}>
                      {pin.professional.profession}
                    </Text>
                  )}
                  {pin.professional.rating && (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#fbbf24" />
                      <Text style={styles.ratingText}>{pin.professional.rating}</Text>
                    </View>
                  )}
                  {pin.professional.location && (
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={12} color="#717182" />
                      <Text style={styles.locationText}>{pin.professional.location}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Description */}
              {pin.description && (
                <View style={styles.descriptionSection}>
                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{pin.description}</Text>
                </View>
              )}

              {/* Stats */}
              <View style={styles.statsSection}>
                <View style={styles.statItem}>
                  <Ionicons name="bookmark-outline" size={16} color="#717182" />
                  <Text style={styles.statText}>{pin.likes} likes</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="chatbubble-outline" size={16} color="#717182" />
                  <Text style={styles.statText}>View comments</Text>
                </View>
              </View>

              {/* CTA */}
              <Button style={styles.ctaButton} onPress={onViewProfile}>
                <Text style={styles.ctaButtonText}>View Profile & Book it! ✨</Text>
              </Button>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#030213",
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
  pinCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    marginBottom: GUTTER,
  },
  pinCardPressed: {
    opacity: 0.9,
  },
  pinImage: {
    width: "100%",
    aspectRatio: 0.75,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
    padding: 12,
  },
  saveButton: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryBadge: {
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
  artistProfession: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  savedIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    maxWidth: 600,
    width: "100%",
  },
  modalImageContainer: {
    position: "relative",
    backgroundColor: "#f3f4f6",
    minHeight: 300,
  },
  modalImage: {
    width: "100%",
    height: 400,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalDetails: {
    padding: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonText: {
    color: "#030213",
  },
  actionButtonTextActive: {
    color: "#ffffff",
  },
  shareButton: {
    width: 48,
  },
  professionalCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 24,
  },
  professionalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  professionalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  professionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#030213",
  },
  verifiedBadge: {
    fontSize: 10,
  },
  professionalProfession: {
    fontSize: 14,
    color: "#717182",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#030213",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#717182",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#030213",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#717182",
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginBottom: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: "#717182",
  },
  ctaButton: {
    width: "100%",
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
