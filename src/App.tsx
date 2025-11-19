import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { getUserData, logOut as firebaseLogout } from "./lib/firebaseAuth";
import {
  Home,
  Search,
  Calendar,
  MessageCircle,
  User,
  BarChart3,
  LogOut,
  Heart,
  BookMarked,
} from "lucide-react";
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
import { toast } from "sonner@2.0.3";

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
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUserData(firebaseUser.uid);
          if (userData) {
            setCurrentUser(userData as User);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setCurrentUser(null);
      setActiveTab("home");
      setSavedItems([]);
      setShowAuthPrompt(false);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
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
            <div className="max-w-2xl mx-auto text-center py-12">
              <BookMarked className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="mb-2">Create your shelf! ✨</h2>
              <p className="text-muted-foreground mb-6">
                Sign in to save your favorite work and keep track of talented artists.
              </p>
              <Button onClick={() => requireAuth("access saved items")}>
                Get Started
              </Button>
            </div>
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
            <div className="max-w-2xl mx-auto text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="mb-2">Ready to book? 📅</h2>
              <p className="text-muted-foreground mb-6">
                Create an account to book appointments with amazing artists.
              </p>
              <Button onClick={() => requireAuth("access bookings")}>
                Get Started
              </Button>
            </div>
          );
        }
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2">Your Bookings</h2>
            <p className="text-muted-foreground mb-6">
              Book appointments and manage your schedule—all in one place!
            </p>
            <Button>Connect Calendar</Button>
          </div>
        );
      case "messages":
        if (currentUser?.type === "guest") {
          return (
            <div className="max-w-2xl mx-auto text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="mb-2">Let's chat! 💬</h2>
              <p className="text-muted-foreground mb-6">
                Sign in to message artists about services and appointments.
              </p>
              <Button onClick={() => requireAuth("send messages")}>
                Get Started
              </Button>
            </div>
          );
        }
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2">Messages</h2>
            <p className="text-muted-foreground mb-6">
              Chat with artists about services and book your next appointment!
            </p>
            <Button>Start Conversation</Button>
          </div>
        );
      case "profile":
        if (currentUser?.type === "guest") {
          return (
            <div className="max-w-2xl mx-auto text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="mb-2">Browsing as Guest 👋</h2>
              <p className="text-muted-foreground mb-6">
                Create an account to unlock bookings, messaging, and your personal shelf of favorites!
              </p>
              <div className="space-y-2">
                <Button className="w-full max-w-xs" onClick={() => {
                  setCurrentUser(null);
                  setShowAuthPrompt(false);
                }}>
                  Create Account ✨
                </Button>
                <Button variant="outline" className="w-full max-w-xs" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Exit Guest Mode
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2">Your Profile</h2>
            <p className="text-muted-foreground mb-4">
              Welcome back, {currentUser.name}!
            </p>
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="font-medium">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.email}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {currentUser.type === "provider"
                      ? "Professional"
                      : "Client"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={() => setActiveTab("saved")}>
                <BookMarked className="w-4 h-4 mr-2" />
                My Shelf
                {savedItems.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {savedItems.length}
                  </Badge>
                )}
              </Button>
              <Button variant="outline">Edit Profile</Button>
              {currentUser.type === "provider" && (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("business")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Business Dashboard
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
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

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

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
      <div className="min-h-screen bg-background flex flex-col">
        {/* Auth Prompt Modal */}
        {showAuthPrompt && currentUser?.type === "guest" && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl max-w-md w-full p-6 space-y-4">
              <h2>Ready to continue?</h2>
              <p className="text-muted-foreground">
                Sign in or create an account to book appointments, message artists, and save your favorites!
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setCurrentUser(null);
                    setShowAuthPrompt(false);
                  }}
                >
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowAuthPrompt(false)}
                >
                  Continue Browsing
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold">Bookshelf</span>
                  {currentUser && (
                    <div className="text-xs text-muted-foreground">
                      {currentUser.type === "guest" ? "Browsing as Guest" : `Welcome, ${currentUser.name.split(" ")[0]}`}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2">
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
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            <Button
              variant={
                activeTab === "home" ? "default" : "ghost"
              }
              size="sm"
              className="flex-col h-auto py-2 px-3"
              onClick={() => setActiveTab("home")}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Home</span>
            </Button>

            <Button
              variant={
                activeTab === "explore" ? "default" : "ghost"
              }
              size="sm"
              className="flex-col h-auto py-2 px-3"
              onClick={() => setActiveTab("explore")}
            >
              <Search className="w-5 h-5 mb-1" />
              <span className="text-xs">Explore</span>
            </Button>

            <Button
              variant={
                activeTab === "bookings" ? "default" : "ghost"
              }
              size="sm"
              className="flex-col h-auto py-2 px-3"
              onClick={() => setActiveTab("bookings")}
            >
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs">Bookings</span>
            </Button>

            <Button
              variant={
                activeTab === "messages" ? "default" : "ghost"
              }
              size="sm"
              className="flex-col h-auto py-2 px-3 relative"
              onClick={() => setActiveTab("messages")}
            >
              <MessageCircle className="w-5 h-5 mb-1" />
              <span className="text-xs">Messages</span>
              {currentUser?.type !== "guest" && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">2</span>
                </div>
              )}
            </Button>

            <Button
              variant={
                activeTab === "profile" ? "default" : "ghost"
              }
              size="sm"
              className="flex-col h-auto py-2 px-3"
              onClick={() => setActiveTab("profile")}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </nav>

        {/* Toast Container */}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}