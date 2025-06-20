"use client";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addItem,
  deleteItem,
  getItems,
  updateItem,
} from "@/lib/actions/redis.actions";
import { generatePayload } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import InputForm from "./InputForm";
import { queryClient } from "./Provider";
import RenderItems from "./RenderItems";
import { useClipboardMutations } from "@/lib/mutations/ClipboardMutation";

export interface ClipboardItem {
  id: string;
  type: "link" | "image" | "text" | "file";
  content: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  filePath?: string;
  uploadedAt?: string;
}

export type ItemPayload = {
  content: string;
  type: "link" | "image" | "text" | "file";
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  filePath?: string;
};

export default function Home() {
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clipboard"],
    queryFn: async () => {
      const fetchedItems = await getItems();
      return fetchedItems;
    },
  });

  const { addMutation, updateMutation } = useClipboardMutations();

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clipboard"] });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.trim() && !selectedFile) return;

    setIsUploading(true);

    try {
      if (selectedFile) {
        // Handle file upload
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Upload file to the server
        const uploadResponse = await fetch("/api/files", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }

        const {
          url,
          name: fileName,
          size: fileSize,
          type: fileType,
        } = await uploadResponse.json();

        // Extract the filename from the URL (last part after the last slash)
        const filePath = url.split("/").pop();

        // Add file reference to the database
        await addItem({
          type: "file",
          content: filePath, // Store just the filename
          fileName,
          fileSize: Number(fileSize),
          fileType,
          filePath: url, // Store the full URL for reference
        });

        toast.success("File uploaded successfully!");
        clearFile();
      } else if (newItem.trim()) {
        // Handle regular text/link
        addMutation.mutate(generatePayload(newItem));
      }

      setNewItem("");
      queryClient.invalidateQueries({ queryKey: ["clipboard"] });
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateItem = async (id: string) => {
    const payload = generatePayload(editContent);
    if (editContent.trim() && items) {
      updateMutation.mutate({
        id,
        ...payload,
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 max-w-3xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Clipboard
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InputForm
              handleAddItem={handleAddItem}
              newItem={newItem}
              setNewItem={setNewItem}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              selectedFile={selectedFile}
              clearFile={clearFile}
            />
            {isUploading && (
              <div className="text-center text-sm text-gray-400 mt-2">
                Uploading...
              </div>
            )}
            <RenderItems
              items={items || []}
              isLoading={isLoading}
              error={error}
              editingId={editingId}
              editContent={editContent}
              setEditContent={setEditContent}
              setEditingId={setEditingId}
              handleUpdateItem={handleUpdateItem}
              handleDeleteItem={handleDeleteItem}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
