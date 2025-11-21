import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RotateCw, RotateCcw, Check, X, ZoomIn, ZoomOut } from "lucide-react";

interface ProfilePictureEditorProps {
  imageUrl: string;
  onSave: (editedImageBlob: Blob) => void;
  onCancel: () => void;
}

export function ProfilePictureEditor({
  imageUrl,
  onSave,
  onCancel,
}: ProfilePictureEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate dimensions
    const img = imageRef.current;
    const imgWidth = img.width;
    const imgHeight = img.height;
    
    // Calculate scale to fit image in canvas
    const fitScale = Math.min(
      (size * scale) / Math.max(imgWidth, imgHeight),
      2 // Max 2x zoom
    );

    const scaledWidth = imgWidth * fitScale;
    const scaledHeight = imgHeight * fitScale;

    // Calculate center position
    const centerX = size / 2 + position.x;
    const centerY = size / 2 + position.y;

    // Save context
    ctx.save();

    // Move to center and rotate
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw image centered
    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    // Restore context
    ctx.restore();

    // Draw dark overlay outside circle
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, size, size);
    
    // Clear the circle area to show the image
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Draw circular crop indicator border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.stroke();
  }, [rotation, scale, position, imageLoaded]);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      drawImage();
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
    img.src = imageUrl;
  }, [imageUrl, drawImage]);

  // Redraw when adjustments change
  useEffect(() => {
    if (imageLoaded) {
      drawImage();
    }
  }, [rotation, scale, position, imageLoaded, drawImage]);

  const handleRotate = (clockwise: boolean) => {
    setRotation((prev) => prev + (clockwise ? 90 : -90));
    setPosition({ x: 0, y: 0 }); // Reset position after rotation
  };

  const handleZoom = (increment: boolean) => {
    setScale((prev) => Math.max(0.5, Math.min(2, prev + (increment ? 0.1 : -0.1))));
  };

  const getClientPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getClientPosition(e);
    setIsDragging(true);
    setDragStart({ x: pos.x - position.x, y: pos.y - position.y });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      const pos = getClientPosition(e);
      const maxMove = 150; // Limit movement
      const newX = Math.max(-maxMove, Math.min(maxMove, pos.x - dragStart.x));
      const newY = Math.max(-maxMove, Math.min(maxMove, pos.y - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas for circular crop
    const cropCanvas = document.createElement("canvas");
    const size = 400;
    cropCanvas.width = size;
    cropCanvas.height = size;
    const ctx = cropCanvas.getContext("2d");
    if (!ctx) return;

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw the image from main canvas
    ctx.drawImage(canvas, 0, 0);

    // Convert to blob
    cropCanvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, "image/png", 0.95);
  };

  return (
    <div className="space-y-4">
      <Label>Adjust Your Profile Picture</Label>
      
      {/* Image Editor */}
      <div
        ref={containerRef}
        className="relative bg-muted rounded-lg overflow-hidden border-2 border-border select-none"
        style={{ width: "100%", maxWidth: "400px", aspectRatio: "1" }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-move"
          style={{ display: "block" }}
        />
        
        {/* Instructions overlay */}
        <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
          Drag to position
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Rotation Controls */}
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm">Rotate</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRotate(false)}
              disabled={!imageLoaded}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRotate(true)}
              disabled={!imageLoaded}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm">Zoom</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleZoom(false)}
              disabled={!imageLoaded || scale <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleZoom(true)}
              disabled={!imageLoaded || scale >= 2}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!imageLoaded}
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-2" />
          Apply
        </Button>
      </div>
    </div>
  );
}

