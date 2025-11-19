import { Star, MapPin, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Professional {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  avatar: string;
  coverImage: string;
  specialties: string[];
  distance: string;
}

interface ProfessionalCardProps {
  professional: Professional;
  onViewProfile: () => void;
}

export function ProfessionalCard({ professional, onViewProfile }: ProfessionalCardProps) {
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onViewProfile}>
      <div className="relative h-32">
        <img
          src={professional.coverImage}
          alt={`${professional.name}'s work`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/90 shadow-md">
            {professional.distance}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={professional.avatar} />
            <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="truncate">{professional.name}</h3>
            <p className="text-muted-foreground text-sm">{professional.profession}</p>
            
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{professional.location}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{professional.rating}</span>
                <span className="text-xs text-muted-foreground">({professional.reviewCount})</span>
              </div>
              <span className="text-sm">• {professional.price}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {professional.specialties.slice(0, 2).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {professional.specialties.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{professional.specialties.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}