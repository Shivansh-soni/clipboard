"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getItems } from "@/lib/db/clipboardItems";
import { useClipboardMutations } from "@/lib/mutations/ClipboardMutation";
import { generatePayload } from "@/lib/utils";
import { uploadFile } from "@/lib/utils/appwrite-storage";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import InputForm from "./InputForm";
import { queryClient } from "./Provider";
import RenderItems from "./RenderItems";

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface ClipboardItem {
  id: string;
  type: "link" | "image" | "text" | "file";
  content: string;
  file?: FileMetadata;
  clipboardId?: string;
}

export type ItemPayload = Omit<ClipboardItem, "id">;

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
      const items = await getItems();
      return items.map((doc: any) => ({
        id: doc.$id,
        type: doc.type,
        content: doc.content,
        file: doc.file
          ? {
              id: doc.file.id,
              name: doc.file.name,
              size: doc.file.size,
              type: doc.file.type,
              previewUrl: doc.file.previewUrl,
            }
          : undefined,
        clipboardId: doc.clipboardId,
      }));
    },
  });

  const { addMutation, updateMutation, deleteMutation } =
    useClipboardMutations();

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
        // Create a file-like object
        const fileObj = {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          arrayBuffer: () => selectedFile.arrayBuffer(),
        };

        // Upload file to Appwrite Storage
        const result = await uploadFile(fileObj);

        // Add file reference to the database
        addMutation.mutate({
          type: selectedFile.type.startsWith("image/") ? "image" : "file",
          content: result.url, // Store the public URL
          file: {
            id: result.id,
            name: result.name,
            size: result.size,
            type: result.type,
            previewUrl: result.previewUrl,
          },
          clipboardId: "clipboardId",
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
      toast.error(
        error instanceof Error ? error.message : "Failed to add item"
      );
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
    queryClient.invalidateQueries({ queryKey: ["clipboard"] });
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    deleteMutation.mutate(id);
    queryClient.invalidateQueries({ queryKey: ["clipboard"] });
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='container mx-auto p-4 max-w-3xl'>
        <Card className='bg-gray-800 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>
              Clipboard
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
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
              <div className='text-center text-sm text-gray-400 mt-2'>
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
