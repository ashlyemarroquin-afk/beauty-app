// Shared mock data for pins/photos across the app

export interface WorkPhoto {
  id: string;
  image: string;
  category: string;
  professional: {
    id: string;
    name: string;
    avatar: string;
    profession?: string;
    verified?: boolean;
    rating?: number;
    location?: string;
  };
  likes: number;
  description?: string;
}

export const mockWorkPhotos: WorkPhoto[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1599316329891-19df7fa9580d?w=600&h=800&fit=crop",
    category: "Nails",
    professional: {
      id: "5",
      name: "Aaliyah Davis",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      profession: "Nail Artist",
      verified: true,
      rating: 4.9,
      location: "Beverly Hills"
    },
    description: "French ombré with gold accents ✨",
    likes: 234
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1712641966879-63f3bc1a47e4?w=600&h=900&fit=crop",
    category: "Hair",
    professional: {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      profession: "Hair Stylist",
      verified: true,
      rating: 4.8,
      location: "Downtown"
    },
    description: "Blonde balayage transformation",
    likes: 567
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1627921522614-86d4b431bd21?w=600&h=750&fit=crop",
    category: "Makeup",
    professional: {
      id: "3",
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      profession: "Makeup Artist",
      verified: true,
      rating: 5.0,
      location: "Hollywood"
    },
    description: "Soft glam bridal look",
    likes: 892
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1733995471067-1dec05442204?w=600&h=800&fit=crop",
    category: "Barber",
    professional: {
      id: "2",
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      profession: "Barber",
      verified: true,
      rating: 4.9,
      location: "Midtown"
    },
    description: "Clean taper fade",
    likes: 445
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1544124094-8aea0374da93?w=600&h=900&fit=crop",
    category: "Photography",
    professional: {
      id: "4",
      name: "Jordan Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      profession: "Photographer",
      verified: true,
      rating: 4.7,
      location: "Arts District"
    },
    description: "Natural light portrait session",
    likes: 1203
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=700&fit=crop",
    category: "Nails",
    professional: {
      id: "5",
      name: "Aaliyah Davis",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      profession: "Nail Artist",
      verified: true,
      rating: 4.9,
      location: "Beverly Hills"
    },
    description: "Matte black with chrome details",
    likes: 678
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=800&fit=crop",
    category: "Hair",
    professional: {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      profession: "Hair Stylist",
      verified: true,
      rating: 4.8,
      location: "Downtown"
    },
    description: "Beach waves styling",
    likes: 423
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=850&fit=crop",
    category: "Makeup",
    professional: {
      id: "3",
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      profession: "Makeup Artist",
      verified: true,
      rating: 5.0,
      location: "Hollywood"
    },
    description: "Dramatic smoky eye",
    likes: 789
  },
  {
    id: "9",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=900&fit=crop",
    category: "Barber",
    professional: {
      id: "2",
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      profession: "Barber",
      verified: true,
      rating: 4.9,
      location: "Midtown"
    },
    description: "Classic scissor cut",
    likes: 356
  },
  {
    id: "10",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop",
    category: "Photography",
    professional: {
      id: "4",
      name: "Jordan Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      profession: "Photographer",
      verified: true,
      rating: 4.7,
      location: "Arts District"
    },
    description: "Editorial fashion shoot",
    likes: 934
  },
  {
    id: "11",
    image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=600&h=750&fit=crop",
    category: "Nails",
    professional: {
      id: "5",
      name: "Aaliyah Davis",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      profession: "Nail Artist",
      verified: true,
      rating: 4.9,
      location: "Beverly Hills"
    },
    description: "Minimalist nude nails",
    likes: 512
  },
  {
    id: "12",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=900&fit=crop",
    category: "Hair",
    professional: {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      profession: "Hair Stylist",
      verified: true,
      rating: 4.8,
      location: "Downtown"
    },
    description: "Curly hair transformation",
    likes: 645
  }
];

export const categories = ["All", "Nails", "Hair", "Makeup", "Barber", "Photography"];
