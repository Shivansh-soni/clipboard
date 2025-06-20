"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { Download, X } from "lucide-react";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  alt,
}: ImagePreviewModalProps) {
  if (!isOpen) return null;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = alt || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
        <div className="relative w-full h-[80vh] bg-black/90 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Download image"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center p-4">
            <Image
              src={imageUrl}
              alt={alt || "Preview"}
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 80vw"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
