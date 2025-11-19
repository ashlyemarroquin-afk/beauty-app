import { Scissors, Users, Sparkles, Calendar, BookMarked } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface WelcomePageProps {
  onChooseUserType: (type: "consumer" | "provider") => void;
  onLogin: () => void;
  onGuestMode?: () => void;
}

export function WelcomePage({ onChooseUserType, onLogin, onGuestMode }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center">
            <BookMarked className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="mb-2">Welcome to Bookshelf</h1>
          <p className="text-muted-foreground">
            Your personal collection of amazing talent ✨
          </p>
        </div>

        {/* User Type Selection */}
        <div className="space-y-4">
          <h2 className="text-center">What brings you here today?</h2>
          
          {/* Consumer Option */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20" 
                onClick={() => onChooseUserType("consumer")}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">Looking for a pro ✨</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Find and book talented artists in your area
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Hair Styling</Badge>
                    <Badge variant="outline" className="text-xs">Makeup</Badge>
                    <Badge variant="outline" className="text-xs">Nails</Badge>
                    <Badge variant="outline" className="text-xs">+More</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Option */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20" 
                onClick={() => onChooseUserType("provider")}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">I'm a creative pro 🎨</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share your work, grow your clientele, shine bright
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Portfolio</Badge>
                    <Badge variant="outline" className="text-xs">Bookings</Badge>
                    <Badge variant="outline" className="text-xs">Analytics</Badge>
                    <Badge variant="outline" className="text-xs">+More</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Option */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={onLogin}>
            Sign In
          </Button>

          {onGuestMode && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button variant="ghost" onClick={onGuestMode} className="w-full">
                Just browsing for now 👀
              </Button>
              <p className="text-xs text-muted-foreground">
                Explore portfolios with no strings attached
              </p>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Talented Artists</p>
          </div>
          <div className="text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Amazing Work</p>
          </div>
          <div className="text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Easy Peasy</p>
          </div>
        </div>
      </div>
    </div>
  );
}