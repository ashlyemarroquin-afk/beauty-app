import { Brain, TrendingUp, Heart, User, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface PersonalizationBannerProps {
  userPreferences: {
    favoriteCategories: string[];
    priceRange: string;
    location: string;
    recentSearches: string[];
  };
  onUpdatePreferences: (prefs: any) => void;
}

export function PersonalizationBanner({ userPreferences, onUpdatePreferences }: PersonalizationBannerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getPersonalityInsight = () => {
    const { favoriteCategories, priceRange } = userPreferences;
    
    if (favoriteCategories.includes("Hair Stylist") && favoriteCategories.includes("Makeup Artist")) {
      return {
        type: "Full Glam Lover",
        description: "You love the complete beauty experience!",
        icon: Heart,
        suggestion: "Try our combo packages for hair + makeup"
      };
    } else if (favoriteCategories.includes("Barber")) {
      return {
        type: "Classic Style",
        description: "You appreciate timeless, clean looks",
        icon: TrendingUp,
        suggestion: "Check out traditional barbershops in your area"
      };
    } else if (priceRange === "premium") {
      return {
        type: "Luxury Seeker",
        description: "You value premium services and experiences",
        icon: Brain,
        suggestion: "Discover our highest-rated premium professionals"
      };
    }
    
    return {
      type: "Style Explorer",
      description: "You're discovering your unique style!",
      icon: User,
      suggestion: "We'll learn your preferences as you browse"
    };
  };

  const insight = getPersonalityInsight();
  const InsightIcon = insight.icon;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <InsightIcon className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{insight.type}</h4>
                <Badge variant="secondary" className="text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Insight
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {insight.description}
              </p>
              
              <p className="text-sm text-primary font-medium mb-3">
                💡 {insight.suggestion}
              </p>

              {!showDetails ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-primary"
                  onClick={() => setShowDetails(true)}
                >
                  View your personalization →
                </Button>
              ) : (
                <div className="space-y-3 mt-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h5 className="text-sm font-medium mb-1">Your preferences:</h5>
                    <div className="flex flex-wrap gap-1">
                      {userPreferences.favoriteCategories.map(cat => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {userPreferences.recentSearches.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-1">Recent searches:</h5>
                      <div className="flex flex-wrap gap-1">
                        {userPreferences.recentSearches.slice(0, 3).map(search => (
                          <Badge key={search} variant="secondary" className="text-xs">
                            {search}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onUpdatePreferences({})}
                  >
                    Customize Algorithm
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 shrink-0 ml-2"
            onClick={() => setDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}