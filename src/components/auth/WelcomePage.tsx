import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Scissors, Users, Sparkles, Calendar, BookMarked } from "lucide-react-native";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface WelcomePageProps {
  onChooseUserType: (type: "consumer" | "provider") => void;
  onLogin: () => void;
  onGuestMode?: () => void;
}

export function WelcomePage({ onChooseUserType, onLogin, onGuestMode }: WelcomePageProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor: "#fff" }]}
      contentContainerStyle={[
        styles.container,
        { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 16) }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Logo and Header */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <BookMarked size={36} color="#fff" />
          </View>
          <Text style={styles.mainTitle}>Welcome to Bookshelf</Text>
          <Text style={styles.mainSubtitle}>
            Your personal collection of amazing talent ✨
          </Text>
        </View>

        {/* User Type Selection */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>What brings you here today?</Text>
          
          {/* Consumer Option */}
          <TouchableOpacity onPress={() => onChooseUserType("consumer")}>
            <Card style={styles.optionCard}>
              <CardContent style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={styles.iconContainer}>
                    <Calendar size={24} color="#030213" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Looking for a pro ✨</Text>
                    <Text style={styles.optionDescription}>
                      Find and book talented artists in your area
                    </Text>
                    <View style={styles.badgeContainer}>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>Hair Styling</Text>
                      </Badge>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>Makeup</Text>
                      </Badge>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>Nails</Text>
                      </Badge>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>+More</Text>
                      </Badge>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>

          {/* Provider Option */}
          <TouchableOpacity onPress={() => onChooseUserType("provider")}>
            <Card style={styles.optionCard}>
              <CardContent style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={styles.iconContainer}>
                    <Scissors size={24} color="#030213" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>I'm a creative pro 🎨</Text>
                    <Text style={styles.optionDescription}>
                      Share your work, grow your clientele, shine bright
                    </Text>
                    <View style={styles.badgeContainer}>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>Portfolio</Text>
                      </Badge>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>Bookings</Text>
                      </Badge>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>Analytics</Text>
                      </Badge>
                      <Badge style={styles.badge}>
                        <Text style={styles.badgeText}>+More</Text>
                      </Badge>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Login Option */}
        <View style={styles.loginSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Already have an account?</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <Button variant="outline" onPress={onLogin} style={styles.button}>
            Sign In
          </Button>

          {onGuestMode && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <Button variant="ghost" onPress={onGuestMode} style={styles.button}>
                Just browsing for now 👀
              </Button>
              <Text style={styles.guestHint}>
                Explore portfolios with no strings attached
              </Text>
            </>
          )}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <View style={styles.feature}>
            <Users size={24} color="#666" />
            <Text style={styles.featureText}>Talented Artists</Text>
          </View>
          <View style={styles.feature}>
            <Sparkles size={24} color="#666" />
            <Text style={styles.featureText}>Amazing Work</Text>
          </View>
          <View style={styles.feature}>
            <Calendar size={24} color="#666" />
            <Text style={styles.featureText}>Easy Peasy</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
    maxWidth: 448,
    alignSelf: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#030213",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  mainSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  optionsSection: {
    gap: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginBottom: 8,
  },
  optionCard: {
    marginBottom: 16,
  },
  optionContent: {
    padding: 24,
  },
  optionHeader: {
    flexDirection: "row",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    gap: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
  },
  loginSection: {
    gap: 16,
    marginBottom: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
  },
  guestHint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  featuresSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
  },
  feature: {
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
