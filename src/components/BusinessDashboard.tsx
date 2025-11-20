import { useState, useEffect } from "react";
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, Star, Gift, Megaphone, Eye, Briefcase, Plus, Clock } from "lucide-react";
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
import { CreateServiceDialog } from "./CreateServiceDialog";
import { getServicesByIds, ServiceDocument } from "../lib/firestoreService";
import { auth } from "../lib/firebase";
import { getUserData } from "../lib/firebaseAuth";

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

  const [showCreateServiceDialog, setShowCreateServiceDialog] = useState(false);
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

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

  const toggleProgram = (id: string) => {
    setLoyaltyPrograms(programs => 
      programs.map(program => 
        program.id === id ? { ...program, active: !program.active } : program
      )
    );
  };

  // Fetch user's services
  useEffect(() => {
    const fetchServices = async () => {
      if (!auth.currentUser) return;
      
      try {
        setLoadingServices(true);
        const userData = await getUserData(auth.currentUser.uid);
        
        if (userData && userData.services && Array.isArray(userData.services)) {
          const fetchedServices = await getServicesByIds(userData.services);
          setServices(fetchedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceCreated = async () => {
    // Refresh services list
    if (!auth.currentUser) return;
    
    try {
      const userData = await getUserData(auth.currentUser.uid);
      if (userData && userData.services && Array.isArray(userData.services)) {
        const fetchedServices = await getServicesByIds(userData.services);
        setServices(fetchedServices);
      }
    } catch (error) {
      console.error("Error refreshing services:", error);
    }
  };

  return (
    <div className="space-y-6 min-h-full">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Business Dashboard
        </h1>
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white dark:from-green-600 dark:to-emerald-600">
          Pro Account
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">{stats.newClients}</p>
            <p className="text-xs text-muted-foreground">New Clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold">{stats.rating}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
            <p className="text-2xl font-bold">{stats.profileViews}</p>
            <p className="text-xs text-muted-foreground">Profile Views</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="w-6 h-6 mx-auto mb-2 text-pink-600" />
            <p className="text-2xl font-bold">{stats.loyaltyMembers}</p>
            <p className="text-xs text-muted-foreground">Loyalty Members</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Programs</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Your Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingServices ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    You haven't created any services yet. Start by adding your first service!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{service.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${service.price.toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.time} min
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={() => setShowCreateServiceDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Service
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Loyalty Programs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loyaltyPrograms.map(program => (
                <div key={program.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{program.name}</h4>
                        <Badge variant={program.active ? "default" : "secondary"}>
                          {program.active ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {program.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Reward: <strong>{program.reward}</strong></span>
                        <span>After: <strong>{program.visitsRequired} visits</strong></span>
                        <span>Enrolled: <strong>{program.enrolledClients} clients</strong></span>
                      </div>
                    </div>
                    <Switch
                      checked={program.active}
                      onCheckedChange={() => toggleProgram(program.id)}
                    />
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline">
                <Gift className="w-4 h-4 mr-2" />
                Create New Loyalty Program
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Promote Your Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-id">Select Post to Promote</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-type">Promotion Type</Label>
                  <Select value={promotionData.type} onValueChange={(value) => setPromotionData({...promotionData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boost">Boost Post ($5/day)</SelectItem>
                      <SelectItem value="featured">Featured ($15/day)</SelectItem>
                      <SelectItem value="sponsored">Sponsored ($25/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Daily Budget ($)</Label>
                  <Input
                    type="number"
                    value={promotionData.budget}
                    onChange={(e) => setPromotionData({...promotionData, budget: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Select value={promotionData.duration} onValueChange={(value) => setPromotionData({...promotionData, duration: value})}>
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer">Special Offer (Optional)</Label>
                <Input
                  placeholder="e.g., 20% off first appointment"
                  value={promotionData.offer}
                  onChange={(e) => setPromotionData({...promotionData, offer: e.target.value})}
                />
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <h5 className="font-medium text-sm mb-1">Promotion Preview</h5>
                <p className="text-sm text-muted-foreground">
                  Your post will reach an estimated <strong>2,500-4,000</strong> potential clients 
                  in your area over {promotionData.duration} days.
                </p>
                <p className="text-sm mt-1">
                  Total cost: <strong>${promotionData.budget * Number(promotionData.duration)}</strong>
                </p>
              </div>

              <Button className="w-full">
                <Megaphone className="w-4 h-4 mr-2" />
                Start Promotion
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Views Growth</span>
                      <span className="text-green-600">+23%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Booking Conversion</span>
                      <span className="text-blue-600">12.5%</span>
                    </div>
                    <Progress value={63} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Client Retention</span>
                      <span className="text-purple-600">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💇‍♀️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hair Transformation</p>
                      <p className="text-xs text-muted-foreground">234 likes • 18 comments</p>
                    </div>
                    <Badge variant="outline">+156%</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">✨</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Color Correction</p>
                      <p className="text-xs text-muted-foreground">189 likes • 12 comments</p>
                    </div>
                    <Badge variant="outline">+92%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Service Dialog */}
      {auth.currentUser && (
        <CreateServiceDialog
          open={showCreateServiceDialog}
          onOpenChange={setShowCreateServiceDialog}
          userId={auth.currentUser.uid}
          onServiceCreated={handleServiceCreated}
        />
      )}
    </div>
  );
}