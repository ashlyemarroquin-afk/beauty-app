import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, Star, Gift, Megaphone, Eye } from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface BusinessStats {
  totalBookings: number;
  revenue: number;
  newClients: number;
  rating: number;
  profileViews: number;
  loyaltyMembers: number;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  visitsRequired: number;
  reward: string;
  active: boolean;
  enrolledClients: number;
}

export function BusinessDashboard() {
  const [stats] = useState<BusinessStats>({
    totalBookings: 156,
    revenue: 8420,
    newClients: 23,
    rating: 4.8,
    profileViews: 1240,
    loyaltyMembers: 89
  });

  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[]>([
    {
      id: "1",
      name: "VIP Hair Treatment",
      description: "Get a free deep conditioning treatment",
      visitsRequired: 5,
      reward: "Free deep conditioning ($85 value)",
      active: true,
      enrolledClients: 45
    },
    {
      id: "2", 
      name: "Loyalty Cuts",
      description: "Every 8th haircut is free",
      visitsRequired: 8,
      reward: "Free haircut ($65 value)",
      active: true,
      enrolledClients: 67
    }
  ]);

  const [promotionData, setPromotionData] = useState({
    postId: "",
    type: "boost",
    budget: 50,
    duration: "7",
    offer: "",
    discount: 0
  });

  const [activeTab, setActiveTab] = useState("loyalty");

  const toggleProgram = (id: string) => {
    setLoyaltyPrograms(programs => 
      programs.map(program => 
        program.id === id ? { ...program, active: !program.active } : program
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <BarChart3 size={24} color="#000" />
            <Text style={styles.title}>Business Dashboard</Text>
          </View>
          <Badge style={styles.proBadge}>
            <Text style={styles.proBadgeText}>Pro Account</Text>
          </Badge>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Calendar size={24} color="#2563eb" />
              <Text style={styles.statValue}>{stats.totalBookings}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <DollarSign size={24} color="#16a34a" />
              <Text style={styles.statValue}>${stats.revenue.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Users size={24} color="#9333ea" />
              <Text style={styles.statValue}>{stats.newClients}</Text>
              <Text style={styles.statLabel}>New Clients</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Star size={24} color="#ca8a04" />
              <Text style={styles.statValue}>{stats.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Eye size={24} color="#4f46e5" />
              <Text style={styles.statValue}>{stats.profileViews}</Text>
              <Text style={styles.statLabel}>Profile Views</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Gift size={24} color="#db2777" />
              <Text style={styles.statValue}>{stats.loyaltyMembers}</Text>
              <Text style={styles.statLabel}>Loyalty Members</Text>
            </CardContent>
          </Card>
        </View>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={styles.tabsList}>
            <TabsTrigger value="loyalty" style={styles.tab}>
              Loyalty Programs
            </TabsTrigger>
            <TabsTrigger value="promotions" style={styles.tab}>
              Promotions
            </TabsTrigger>
            <TabsTrigger value="analytics" style={styles.tab}>
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <View style={styles.cardTitleRow}>
                  <Gift size={20} color="#000" />
                  <CardTitle>Loyalty Programs</CardTitle>
                </View>
              </CardHeader>
              <CardContent style={styles.loyaltyContent}>
                {loyaltyPrograms.map(program => (
                  <View key={program.id} style={styles.programCard}>
                    <View style={styles.programHeader}>
                      <View style={styles.programInfo}>
                        <View style={styles.programTitleRow}>
                          <Text style={styles.programName}>{program.name}</Text>
                          <Badge variant={program.active ? "default" : "secondary"}>
                            <Text>{program.active ? "Active" : "Paused"}</Text>
                          </Badge>
                        </View>
                        <Text style={styles.programDescription}>{program.description}</Text>
                        <View style={styles.programDetails}>
                          <Text style={styles.programDetail}>
                            Reward: <Text style={styles.bold}>{program.reward}</Text>
                          </Text>
                          <Text style={styles.programDetail}>
                            After: <Text style={styles.bold}>{program.visitsRequired} visits</Text>
                          </Text>
                          <Text style={styles.programDetail}>
                            Enrolled: <Text style={styles.bold}>{program.enrolledClients} clients</Text>
                          </Text>
                        </View>
                      </View>
                      <Switch
                        checked={program.active}
                        onCheckedChange={() => toggleProgram(program.id)}
                      />
                    </View>
                  </View>
                ))}
                
                <Button variant="outline" style={styles.fullWidth}>
                  <View style={styles.buttonContent}>
                    <Gift size={16} color="#000" />
                    <Text>Create New Loyalty Program</Text>
                  </View>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <View style={styles.cardTitleRow}>
                  <Megaphone size={20} color="#000" />
                  <CardTitle>Promote Your Content</CardTitle>
                </View>
              </CardHeader>
              <CardContent style={styles.promotionContent}>
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Label>Select Post to Promote</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a post" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post1">Latest Hair Transformation</SelectItem>
                        <SelectItem value="post2">Before & After Color</SelectItem>
                        <SelectItem value="post3">Wedding Hair Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </View>

                  <View style={styles.formField}>
                    <Label>Promotion Type</Label>
                    <Select 
                      value={promotionData.type} 
                      onValueChange={(value) => setPromotionData({...promotionData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boost">Boost Post ($5/day)</SelectItem>
                        <SelectItem value="featured">Featured ($15/day)</SelectItem>
                        <SelectItem value="sponsored">Sponsored ($25/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Label>Daily Budget ($)</Label>
                    <Input
                      keyboardType="numeric"
                      value={promotionData.budget.toString()}
                      onChangeText={(text) => setPromotionData({...promotionData, budget: Number(text)})}
                    />
                  </View>

                  <View style={styles.formField}>
                    <Label>Duration (days)</Label>
                    <Select 
                      value={promotionData.duration} 
                      onValueChange={(value) => setPromotionData({...promotionData, duration: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </View>
                </View>

                <View style={styles.fullField}>
                  <Label>Special Offer (Optional)</Label>
                  <Input
                    placeholder="e.g., 20% off first appointment"
                    value={promotionData.offer}
                    onChangeText={(text) => setPromotionData({...promotionData, offer: text})}
                  />
                </View>

                <View style={styles.promotionPreview}>
                  <Text style={styles.previewTitle}>Promotion Preview</Text>
                  <Text style={styles.previewText}>
                    Your post will reach an estimated <Text style={styles.bold}>2,500-4,000</Text> potential clients 
                    in your area over {promotionData.duration} days.
                  </Text>
                  <Text style={styles.previewTotal}>
                    Total cost: <Text style={styles.bold}>${promotionData.budget * Number(promotionData.duration)}</Text>
                  </Text>
                </View>

                <Button style={styles.fullWidth}>
                  <View style={styles.buttonContent}>
                    <Megaphone size={16} color="#fff" />
                    <Text style={styles.buttonText}>Start Promotion</Text>
                  </View>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <View style={styles.analyticsGrid}>
              <Card style={styles.analyticsCard}>
                <CardHeader>
                  <View style={styles.cardTitleRow}>
                    <TrendingUp size={20} color="#000" />
                    <CardTitle>Growth Metrics</CardTitle>
                  </View>
                </CardHeader>
                <CardContent>
                  <View style={styles.metricsContent}>
                    <View style={styles.metric}>
                      <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>Profile Views Growth</Text>
                        <Text style={styles.metricGreen}>+23%</Text>
                      </View>
                      <Progress value={76} style={styles.progress} />
                    </View>
                    
                    <View style={styles.metric}>
                      <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>Booking Conversion</Text>
                        <Text style={styles.metricBlue}>12.5%</Text>
                      </View>
                      <Progress value={63} style={styles.progress} />
                    </View>
                    
                    <View style={styles.metric}>
                      <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>Client Retention</Text>
                        <Text style={styles.metricPurple}>87%</Text>
                      </View>
                      <Progress value={87} style={styles.progress} />
                    </View>
                  </View>
                </CardContent>
              </Card>

              <Card style={styles.analyticsCard}>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <View style={styles.topContent}>
                    <View style={styles.contentItem}>
                      <View style={[styles.contentIcon, styles.pinkGradient]}>
                        <Text style={styles.emoji}>💇‍♀️</Text>
                      </View>
                      <View style={styles.contentInfo}>
                        <Text style={styles.contentTitle}>Hair Transformation</Text>
                        <Text style={styles.contentStats}>234 likes • 18 comments</Text>
                      </View>
                      <Badge variant="outline">
                        <Text>+156%</Text>
                      </Badge>
                    </View>
                    
                    <View style={styles.contentItem}>
                      <View style={[styles.contentIcon, styles.blueGradient]}>
                        <Text style={styles.emoji}>✨</Text>
                      </View>
                      <View style={styles.contentInfo}>
                        <Text style={styles.contentTitle}>Color Correction</Text>
                        <Text style={styles.contentStats}>189 likes • 12 comments</Text>
                      </View>
                      <Badge variant="outline">
                        <Text>+92%</Text>
                      </Badge>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  proBadge: {
    backgroundColor: "#10b981",
  },
  proBadgeText: {
    color: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
  },
  statContent: {
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  tabsList: {
    marginBottom: 16,
  },
  tab: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loyaltyContent: {
    gap: 16,
  },
  programCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
  },
  programHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  programInfo: {
    flex: 1,
    gap: 8,
  },
  programTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  programName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  programDescription: {
    fontSize: 14,
    color: "#666",
  },
  programDetails: {
    gap: 4,
  },
  programDetail: {
    fontSize: 14,
    color: "#000",
  },
  bold: {
    fontWeight: "600",
  },
  fullWidth: {
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
  },
  promotionContent: {
    gap: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 16,
  },
  formField: {
    flex: 1,
    gap: 8,
  },
  fullField: {
    gap: 8,
  },
  promotionPreview: {
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    color: "#666",
  },
  previewTotal: {
    fontSize: 14,
    color: "#000",
    marginTop: 4,
  },
  analyticsGrid: {
    gap: 16,
  },
  analyticsCard: {
    marginBottom: 16,
  },
  metricsContent: {
    gap: 16,
  },
  metric: {
    gap: 4,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#000",
  },
  metricGreen: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "600",
  },
  metricBlue: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  metricPurple: {
    fontSize: 14,
    color: "#9333ea",
    fontWeight: "600",
  },
  progress: {
    height: 8,
  },
  topContent: {
    gap: 12,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pinkGradient: {
    backgroundColor: "#fce7f3",
  },
  blueGradient: {
    backgroundColor: "#dbeafe",
  },
  emoji: {
    fontSize: 20,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  contentStats: {
    fontSize: 12,
    color: "#666",
  },
});
