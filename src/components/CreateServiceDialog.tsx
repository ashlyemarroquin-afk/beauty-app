import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { createService, addServiceToUser } from "../lib/firestoreService";
import { Loader2, DollarSign, Clock, FileText } from "lucide-react";

interface CreateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onServiceCreated?: () => void;
}

export function CreateServiceDialog({
  open,
  onOpenChange,
  userId,
  onServiceCreated,
}: CreateServiceDialogProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Please enter a service title");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const timeNum = parseInt(time);
    if (isNaN(timeNum) || timeNum <= 0) {
      toast.error("Please enter a valid time in minutes");
      return;
    }

    setIsLoading(true);

    try {
      // Create the service document
      const serviceId = await createService(title.trim(), priceNum, timeNum, userId);

      // Add service ID to user's services array
      await addServiceToUser(userId, serviceId);

      toast.success("Service created successfully! 🎉");

      // Reset form
      setTitle("");
      setPrice("");
      setTime("");

      // Close dialog
      onOpenChange(false);

      // Notify parent component
      if (onServiceCreated) {
        onServiceCreated();
      }
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast.error(error.message || "Failed to create service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>
            Add a service that clients can book from your profile
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-title">
              <FileText className="w-4 h-4 inline mr-1" />
              Service Title
            </Label>
            <Input
              id="service-title"
              placeholder="e.g., Haircut & Style"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-price">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price ($)
            </Label>
            <Input
              id="service-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 85"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-time">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration (minutes)
            </Label>
            <Input
              id="service-time"
              type="number"
              min="1"
              placeholder="e.g., 60"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

