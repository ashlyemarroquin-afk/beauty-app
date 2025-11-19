import { Search, MapPin, Filter, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  filters: {
    priceRange: [number, number];
    rating: number;
    distance: number;
    availability: string[];
    specialties: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const categories = [
  "All",
  "Hair Stylist",
  "Makeup Artist",
  "Barber",
  "Photographer",
  "Nail Artist",
  "Esthetician",
  "Lash Technician"
];

const locations = [
  "Nearby",
  "Downtown",
  "Midtown",
  "Uptown",
  "Suburbs",
  "East Side",
  "West Side"
];

const specialties = [
  "Bridal",
  "Color Correction",
  "Extensions",
  "Highlights",
  "Balayage",
  "Keratin",
  "Wedding",
  "Editorial",
  "Fashion",
  "Portrait"
];

const availability = [
  "Today",
  "This Week",
  "Weekends",
  "Evenings",
  "Same Day"
];

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  filters,
  onFiltersChange
}: SearchFiltersProps) {
  const activeFiltersCount = 
    (filters.rating > 0 ? 1 : 0) +
    (filters.distance < 25 ? 1 : 0) +
    filters.availability.length +
    filters.specialties.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 200],
      rating: 0,
      distance: 25,
      availability: [],
      specialties: []
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search professionals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-input-background"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[140px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="shrink-0">
          <MapPin className="w-4 h-4 mr-1" />
          {selectedLocation}
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              <Filter className="w-4 h-4 mr-1" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Filters
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={selectedLocation} onValueChange={onLocationChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range</Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFiltersChange({...filters, priceRange: value})}
                  max={200}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}+</span>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select 
                  value={filters.rating.toString()} 
                  onValueChange={(value) => onFiltersChange({...filters, rating: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Distance */}
              <div className="space-y-3">
                <Label>Distance (miles)</Label>
                <Slider
                  value={[filters.distance]}
                  onValueChange={(value) => onFiltersChange({...filters, distance: value[0]})}
                  max={25}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-center">
                  Within {filters.distance} miles
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label>Availability</Label>
                <div className="space-y-2">
                  {availability.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`availability-${item}`}
                        checked={filters.availability.includes(item)}
                        onCheckedChange={(checked) => {
                          const newAvailability = checked
                            ? [...filters.availability, item]
                            : filters.availability.filter(a => a !== item);
                          onFiltersChange({...filters, availability: newAvailability});
                        }}
                      />
                      <Label htmlFor={`availability-${item}`} className="text-sm">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-2">
                <Label>Specialties</Label>
                <div className="space-y-2">
                  {specialties.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${specialty}`}
                        checked={filters.specialties.includes(specialty)}
                        onCheckedChange={(checked) => {
                          const newSpecialties = checked
                            ? [...filters.specialties, specialty]
                            : filters.specialties.filter(s => s !== specialty);
                          onFiltersChange({...filters, specialties: newSpecialties});
                        }}
                      />
                      <Label htmlFor={`specialty-${specialty}`} className="text-sm">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.rating > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.rating}+ stars
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({...filters, rating: 0})}
              />
            </Badge>
          )}
          {filters.availability.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({
                  ...filters, 
                  availability: filters.availability.filter(a => a !== item)
                })}
              />
            </Badge>
          ))}
          {filters.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
              {specialty}
              <X 
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({
                  ...filters,
                  specialties: filters.specialties.filter(s => s !== specialty)
                })}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}