import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ForYouPage } from "./components/ForYouPage";
import { ExplorePage } from "./components/ExplorePage";
import { SavedItemsPage } from "./components/SavedItemsPage";
import { BusinessDashboard } from "./components/BusinessDashboard";
import { AuthWrapper } from "./components/auth/AuthWrapper";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Toaster } from "./components/ui/sonner";
import { toast } from "./components/ui/sonner";

type TabType =
  | "home"
  | "explore"
  | "bookings"
  | "messages"
  | "profile"
  | "saved"
  | "business";

interface User {
  id: string;
  email: string;
  name: string;
  type: "consumer" | "provider" | "guest";
  isOnboarded: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleAuthComplete = (user: User) => {
    setCurrentUser(user);
    if (user.type !== "guest") {
      toast.success(
        `Welcome${user.type === "provider" ? " to your business dashboard" : ""}!`,
      );
    }
  };

  const handleGuestMode = () => {
    setCurrentUser({
      id: "guest",
      email: "",
      name: "Guest",
      type: "guest",
      isOnboarded: true,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("home");
    setSavedItems([]);
    setShowAuthPrompt(false);
    toast.success("Logged out successfully");
  };

  const requireAuth = (action: string): boolean => {
    if (currentUser?.type === "guest") {
      setShowAuthPrompt(true);
      toast.error(`Please sign in to ${action}`);
      return false;
    }
    return true;
  };

  const handleToggleSave = (photoId: string) => {
    setSavedItems((prev) => {
      if (prev.includes(photoId)) {
        toast.success("Removed from your shelf");
        return prev.filter((id) => id !== photoId);
      } else {
        toast.success("Shelved! ✨");
        return [...prev, photoId];
      }
    });
  };

  const handleRemoveSaved = (photoId: string) => {
    setSavedItems((prev) => prev.filter((id) => id !== photoId));
    toast.success("Removed from your shelf");
  };

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return (
          <ForYouPage 
            savedItems={savedItems} 
            onToggleSave={handleToggleSave}
            isGuest={currentUser?.type === "guest"}
            onRequireAuth={() => requireAuth("save items")}
          />
        );
      case "explore":
        return (
          <ExplorePage 
            savedItems={savedItems} 
            onToggleSave={handleToggleSave}
            isGuest={currentUser?.type === "guest"}
            onRequireAuth={() => requireAuth("save items")}
          />
        );
      case "saved":
        if (currentUser?.type === "guest") {
          return (
            <View style={styles.centerContainer}>
              <Ionicons name="bookmark-outline" size={64} color="#717182" style={styles.centerIcon} />
              <Text style={styles.centerTitle}>Create your shelf! ✨</Text>
              <Text style={styles.centerText}>
                Sign in to save your favorite work and keep track of talented artists.
              </Text>
              <Button onPress={() => requireAuth("access saved items")}>
                Get Started
              </Button>
            </View>
          );
        }
        return (
          <SavedItemsPage 
            savedItems={savedItems} 
            onRemove={handleRemoveSaved} 
          />
        );
      case "bookings":
        if (currentUser?.type === "guest") {
          return (
            <View style={styles.centerContainer}>
              <Ionicons name="calendar-outline" size={64} color="#717182" style={styles.centerIcon} />
              <Text style={styles.centerTitle}>Ready to book? 📅</Text>
              <Text style={styles.centerText}>
                Create an account to book appointments with amazing artists.
              </Text>
              <Button onPress={() => requireAuth("access bookings")}>
                Get Started
              </Button>
            </View>
          );
        }
        return (
          <View style={styles.centerContainer}>
            <Ionicons name="calendar-outline" size={64} color="#717182" style={styles.centerIcon} />
            <Text style={styles.centerTitle}>Your Bookings</Text>
            <Text style={styles.centerText}>
              Book appointments and manage your schedule—all in one place!
            </Text>
            <Button>Connect Calendar</Button>
          </View>
        );
      case "messages":
        if (currentUser?.type === "guest") {
          return (
            <View style={styles.centerContainer}>
              <Ionicons name="chatbubble-outline" size={64} color="#717182" style={styles.centerIcon} />
              <Text style={styles.centerTitle}>Let's chat! 💬</Text>
              <Text style={styles.centerText}>
                Sign in to message artists about services and appointments.
              </Text>
              <Button onPress={() => requireAuth("send messages")}>
                Get Started
              </Button>
            </View>
          );
        }
        return (
          <View style={styles.centerContainer}>
            <Ionicons name="chatbubble-outline" size={64} color="#717182" style={styles.centerIcon} />
            <Text style={styles.centerTitle}>Messages</Text>
            <Text style={styles.centerText}>
              Chat with artists about services and book your next appointment!
            </Text>
            <Button>Start Conversation</Button>
          </View>
        );
      case "profile":
        if (currentUser?.type === "guest") {
          return (
            <View style={styles.centerContainer}>
              <Ionicons name="person-outline" size={64} color="#717182" style={styles.centerIcon} />
              <Text style={styles.centerTitle}>Browsing as Guest 👋</Text>
              <Text style={styles.centerText}>
                Create an account to unlock bookings, messaging, and your personal shelf of favorites!
              </Text>
              <View style={styles.buttonGroup}>
                <Button 
                  style={styles.fullWidthButton}
                  onPress={() => {
                    setCurrentUser(null);
                    setShowAuthPrompt(false);
                  }}
                >
                  Create Account ✨
                </Button>
                <Button 
                  variant="outline" 
                  style={styles.fullWidthButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={16} color="#030213" style={{ marginRight: 8 }} />
                  Exit Guest Mode
                </Button>
              </View>
            </View>
          );
        }
        return (
          <ScrollView style={styles.profileContainer}>
            <View style={styles.centerContainer}>
              <Ionicons name="person-outline" size={64} color="#717182" style={styles.centerIcon} />
              <Text style={styles.centerTitle}>Your Profile</Text>
              <Text style={styles.centerText}>
                Welcome back, {currentUser.name}!
              </Text>
              <View style={styles.profileCard}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {currentUser.name}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {currentUser.email}
                  </Text>
                  <Badge variant="outline" style={styles.profileBadge}>
                    {currentUser.type === "provider"
                      ? "Professional"
                      : "Client"}
                  </Badge>
                </View>
              </View>
              <View style={styles.profileActions}>
                <Button onPress={() => setActiveTab("saved")} style={styles.profileButton}>
                  <Ionicons name="bookmark-outline" size={16} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={{ color: "#ffffff" }}>My Shelf</Text>
                  {savedItems.length > 0 && (
                    <Badge variant="secondary" style={{ marginLeft: 8 }}>
                      {savedItems.length}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" style={styles.profileButton}>Edit Profile</Button>
                {currentUser.type === "provider" && (
                  <Button
                    variant="outline"
                    style={styles.profileButton}
                    onPress={() => setActiveTab("business")}
                  >
                    <Ionicons name="bar-chart-outline" size={16} color="#030213" style={{ marginRight: 8 }} />
                    Business Dashboard
                  </Button>
                )}
                <Button variant="outline" style={styles.profileButton} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={16} color="#030213" style={{ marginRight: 8 }} />
                  Sign Out
                </Button>
              </View>
            </View>
          </ScrollView>
        );
      case "business":
        return <BusinessDashboard />;
      default:
        return (
          <ForYouPage 
            savedItems={savedItems} 
            onToggleSave={handleToggleSave}
            isGuest={currentUser?.type === "guest"}
            onRequireAuth={() => requireAuth("save items")}
          />
        );
    }
  };

  // Show auth flow if no user is logged in
  if (!currentUser) {
    return (
      <ThemeProvider>
        <AuthWrapper 
          onAuthComplete={handleAuthComplete}
          onGuestMode={handleGuestMode}
        />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        {/* Auth Prompt Modal */}
        <Modal
          visible={showAuthPrompt && currentUser?.type === "guest"}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAuthPrompt(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowAuthPrompt(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ready to continue?</Text>
              <Text style={styles.modalText}>
                Sign in or create an account to book appointments, message artists, and save your favorites!
              </Text>
              <View style={styles.modalButtons}>
                <Button 
                  style={styles.modalButton}
                  onPress={() => {
                    setCurrentUser(null);
                    setShowAuthPrompt(false);
                  }}
                >
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  style={styles.modalButton}
                  onPress={() => setShowAuthPrompt(false)}
                >
                  Continue Browsing
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <Ionicons name="bookmark" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.logoText}>Bookshelf</Text>
                {currentUser && (
                  <Text style={styles.welcomeText}>
                    {currentUser.type === "guest" ? "Browsing as Guest" : `Welcome, ${currentUser.name.split(" ")[0]}`}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.badgeContainer}>
                {activeTab === "saved" && currentUser.type !== "guest" && (
                  <Badge variant="secondary">
                    {savedItems.length} shelved
                  </Badge>
                )}
                {activeTab !== "saved" && (
                  <Badge variant="secondary">
                    Discover • Shelf • Book
                  </Badge>
                )}
                {currentUser.type === "provider" && (
                  <Badge variant="outline">Professional</Badge>
                )}
                {currentUser.type === "guest" && (
                  <Badge variant="outline">Guest</Badge>
                )}
              </View>
              <ThemeToggle />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent}>
          {renderPage()}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navButton, activeTab === "home" && styles.navButtonActive]}
            onPress={() => setActiveTab("home")}
          >
            <Ionicons 
              name={activeTab === "home" ? "home" : "home-outline"} 
              size={20} 
              color={activeTab === "home" ? "#030213" : "#717182"} 
            />
            <Text style={[styles.navLabel, activeTab === "home" && styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === "explore" && styles.navButtonActive]}
            onPress={() => setActiveTab("explore")}
          >
            <Ionicons 
              name={activeTab === "explore" ? "search" : "search-outline"} 
              size={20} 
              color={activeTab === "explore" ? "#030213" : "#717182"} 
            />
            <Text style={[styles.navLabel, activeTab === "explore" && styles.navLabelActive]}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === "bookings" && styles.navButtonActive]}
            onPress={() => setActiveTab("bookings")}
          >
            <Ionicons 
              name={activeTab === "bookings" ? "calendar" : "calendar-outline"} 
              size={20} 
              color={activeTab === "bookings" ? "#030213" : "#717182"} 
            />
            <Text style={[styles.navLabel, activeTab === "bookings" && styles.navLabelActive]}>Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === "messages" && styles.navButtonActive]}
            onPress={() => setActiveTab("messages")}
          >
            <View>
              <Ionicons 
                name={activeTab === "messages" ? "chatbubble" : "chatbubble-outline"} 
                size={20} 
                color={activeTab === "messages" ? "#030213" : "#717182"} 
              />
              {currentUser?.type !== "guest" && (
                <View style={styles.badgeDot}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navLabel, activeTab === "messages" && styles.navLabelActive]}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === "profile" && styles.navButtonActive]}
            onPress={() => setActiveTab("profile")}
          >
            <Ionicons 
              name={activeTab === "profile" ? "person" : "person-outline"} 
              size={20} 
              color={activeTab === "profile" ? "#030213" : "#717182"} 
            />
            <Text style={[styles.navLabel, activeTab === "profile" && styles.navLabelActive]}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Toast Container */}
        <Toaster />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  centerIcon: {
    marginBottom: 16,
  },
  centerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#030213",
    textAlign: "center",
  },
  centerText: {
    fontSize: 14,
    color: "#717182",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    maxWidth: 300,
    gap: 8,
  },
  fullWidthButton: {
    width: "100%",
  },
  profileContainer: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: "100%",
    maxWidth: 400,
  },
  profileInfo: {
    alignItems: "flex-start",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#030213",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#717182",
    marginBottom: 8,
  },
  profileBadge: {
    marginTop: 4,
  },
  profileActions: {
    width: "100%",
    maxWidth: 400,
    gap: 8,
  },
  profileButton: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#030213",
  },
  modalText: {
    fontSize: 14,
    color: "#717182",
  },
  modalButtons: {
    gap: 8,
  },
  modalButton: {
    width: "100%",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#030213",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#030213",
  },
  welcomeText: {
    fontSize: 12,
    color: "#717182",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  navButtonActive: {
    // Active state styling handled by icon/text colors
  },
  navLabel: {
    fontSize: 12,
    color: "#717182",
    marginTop: 4,
  },
  navLabelActive: {
    color: "#030213",
    fontWeight: "600",
  },
  badgeDot: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
