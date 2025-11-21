import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { updateUserProfile } from "../lib/firebaseAuth";
import { toast } from "sonner@2.0.3";
import { Loader2, User, X } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentName: string;
  currentProfilePicture?: string;
  onProfileUpdated?: () => void;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  userId,
  currentName,
  currentProfilePicture,
  onProfileUpdated,
}: EditProfileDialogProps) {
  const [name, setName] = useState(currentName);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(currentProfilePicture || "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentProfilePicture || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state when dialog opens or currentName/currentProfilePicture changes
  useEffect(() => {
    if (open) {
      setName(currentName);
      const currentPic = currentProfilePicture || "";
      setProfilePictureUrl(currentPic);
      setPreviewUrl(currentPic || null);
    }
  }, [open, currentName, currentProfilePicture]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setProfilePictureUrl(url);
    
    // Validate and preview URL
    if (url) {
      // Basic URL validation
      try {
        new URL(url);
        // Set preview - if it fails to load, it will show error in Avatar
        setPreviewUrl(url);
      } catch (error) {
        // Invalid URL, but allow user to enter it
        setPreviewUrl(url);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUrlBlur = () => {
    // Optional: Validate image URL when user leaves the input
    if (profilePictureUrl && profilePictureUrl.trim()) {
      // Test if image loads (non-blocking)
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(profilePictureUrl);
      };
      img.onerror = () => {
        // Don't show error immediately, just don't update preview
        console.warn("Image failed to load:", profilePictureUrl);
      };
      img.src = profilePictureUrl;
    }
  };

  const handleRemovePicture = () => {
    setProfilePictureUrl("");
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save the URL string directly
      const imageUrlToSave = profilePictureUrl.trim() || undefined;
      
      await updateUserProfile(userId, name.trim(), imageUrlToSave);

      toast.success("Profile updated successfully! ✨");

      // Close dialog first
      setIsSubmitting(false);
      onOpenChange(false);

      // Notify parent component after dialog closes
      setTimeout(() => {
        if (onProfileUpdated) {
          onProfileUpdated();
        }
      }, 100);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setIsSubmitting(false);
      toast.error(error.message || "Failed to update profile. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      // Reset form state
      setName(currentName);
      const currentPic = currentProfilePicture || "";
      setProfilePictureUrl(currentPic);
      setPreviewUrl(currentPic || null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and profile picture.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture URL */}
          <div className="space-y-2">
            <Label htmlFor="profile-picture-url">Profile Picture URL</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 flex-shrink-0">
                <AvatarImage src={previewUrl || undefined} alt={name} />
                <AvatarFallback>
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="profile-picture-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={profilePictureUrl}
                    onChange={handleUrlChange}
                    onBlur={handleUrlBlur}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleRemovePicture}
                      disabled={isSubmitting}
                      title="Remove picture"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a URL to an image for your profile picture.
                </p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

