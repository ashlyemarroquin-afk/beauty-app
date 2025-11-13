import { Heart, MessageCircle, Bookmark, MoreHorizontal, Megaphone, Sparkles } from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface PromotedPost {
  id: string;
  professional: {
    name: string;
    avatar: string;
    profession: string;
    verified: boolean;
  };
  image: string;
  likes: number;
  comments: number;
  description: string;
  tags: string[];
  timeAgo: string;
  liked: boolean;
  bookmarked: boolean;
  promotion: {
    type: "sponsored" | "featured" | "boost";
    offer?: string;
    discount?: number;
    validUntil?: string;
  };
}

interface PromotedPostCardProps {
  post: PromotedPost;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment: (postId: string) => void;
  onBook: (professionalId: string) => void;
}

export function PromotedPostCard({ post, onLike, onBookmark, onComment, onBook }: PromotedPostCardProps) {
  const getPromotionBadge = () => {
    switch (post.promotion.type) {
      case "sponsored":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Megaphone className="w-3 h-3 mr-1" />
            Sponsored
          </Badge>
        );
      case "featured":
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        );
      case "boost":
        return (
          <Badge variant="outline">
            Trending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-border">
      {/* Promotion Banner */}
      <div className="bg-muted px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          {getPromotionBadge()}
          {post.promotion.offer && (
            <Badge variant="outline" className="bg-background">
              {post.promotion.offer}
            </Badge>
          )}
        </div>
      </div>

      {/* Header */}
      <CardContent className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.professional.avatar} />
              <AvatarFallback>{post.professional.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <button 
                  className="font-medium text-sm hover:underline text-left"
                  onClick={() => onBook(post.id)}
                >
                  {post.professional.name}
                </button>
                {post.professional.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{post.professional.profession} • {post.timeAgo}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      {/* Image */}
      <div className="relative">
        <img
          src={post.image}
          alt="Post content"
          className="w-full aspect-square object-cover"
        />
      </div>

      {/* Actions */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0"
              onClick={() => onLike(post.id)}
            >
              <Heart 
                className={`w-6 h-6 ${post.liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0"
              onClick={() => onComment(post.id)}
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0"
            onClick={() => onBookmark(post.id)}
          >
            <Bookmark 
              className={`w-6 h-6 ${post.bookmarked ? 'fill-current' : ''}`}
            />
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-sm">
            <span className="">{post.likes.toLocaleString()} likes</span>
          </p>
          
          <p className="text-sm">
            <button 
              className="font-medium hover:underline"
              onClick={() => onBook(post.id)}
            >
              {post.professional.name}
            </button>
            <span className="text-muted-foreground ml-2">{post.description}</span>
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}



          {post.comments > 0 && (
            <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground">
              View all {post.comments} comments
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}