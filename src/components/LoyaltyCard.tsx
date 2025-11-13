import { Gift, Star, Trophy, Zap } from "lucide-react-native";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface LoyaltyCardProps {
  professionalName: string;
  totalVisits: number;
  visitsForReward: number;
  rewardDescription: string;
  nextReward?: string;
  level?: "Bronze" | "Silver" | "Gold" | "Platinum";
  points?: number;
}

const levelColors = {
  Bronze: "bg-gradient-to-r from-amber-600 to-amber-800",
  Silver: "bg-gradient-to-r from-gray-400 to-gray-600", 
  Gold: "bg-gradient-to-r from-yellow-400 to-yellow-600",
  Platinum: "bg-gradient-to-r from-purple-500 to-indigo-600"
};

const levelIcons = {
  Bronze: Trophy,
  Silver: Star,
  Gold: Zap,
  Platinum: Gift
};

export function LoyaltyCard({
  professionalName,
  totalVisits,
  visitsForReward,
  rewardDescription,
  nextReward,
  level = "Bronze",
  points = 0
}: LoyaltyCardProps) {
  const progress = Math.min((totalVisits / visitsForReward) * 100, 100);
  const visitsRemaining = Math.max(visitsForReward - totalVisits, 0);
  const LevelIcon = levelIcons[level];

  return (
    <Card className="overflow-hidden relative">
      <div className={`absolute inset-0 opacity-5 ${levelColors[level]}`} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-medium text-lg">{professionalName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className={`${levelColors[level]} text-white border-0`}
              >
                <LevelIcon className="w-3 h-3 mr-1" />
                {level}
              </Badge>
              {points > 0 && (
                <Badge variant="outline">
                  {points} points
                </Badge>
              )}
            </div>
          </div>
          <Gift className="w-8 h-8 text-primary opacity-60" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to reward</span>
            <span className="font-medium">
              {totalVisits}/{visitsForReward} visits
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          {visitsRemaining === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 text-sm">
                    🎉 Reward Earned!
                  </p>
                  <p className="text-green-600 text-xs">{rewardDescription}</p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-2">
                Claim Reward
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">{visitsRemaining} more visits</span> 
                {" "}until your next reward
              </p>
              <div className="bg-accent/30 rounded-lg p-3">
                <p className="text-sm font-medium text-accent-foreground">
                  Next reward: {rewardDescription}
                </p>
                {nextReward && (
                  <p className="text-xs text-muted-foreground mt-1">
                    After that: {nextReward}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}