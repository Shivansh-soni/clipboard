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
  type: "link" | "image" | "text";
  content: string;
}
export type ItemPayload = {
  content: string;
  type: "link" | "image" | "text";
};

export default function Home() {
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const { addMutation, updateMutation, deleteMutation } =
    useClipboardMutations();

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() && newItem !== "") {
      addMutation.mutate(generatePayload(newItem));
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
  const handleDeleteItem = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const item = await addItem({
          type: "image",
          content: base64String,
        });
        // setItems([...items, item]);
        toast.success("Image has been added successfully.");
      };
      reader.readAsDataURL(file);
    }
    setIsImagePickerOpen(false);
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='container mx-auto p-4 max-w-3xl'>
        <Card className='bg-gray-800 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-3xl font-bold text-center text-white'>
              Clipboard App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InputForm
              newItem={newItem}
              setNewItem={setNewItem}
              fileInputRef={fileInputRef}
              handleAddItem={handleAddItem}
              handleImageUpload={handleImageUpload}
            />
            <RenderItems
              editingId={editingId}
              setEditingId={setEditingId}
              editContent={editContent}
              setEditContent={setEditContent}
              items={items}
              isLoading={isLoading}
              error={error}
              handleUpdateItem={handleUpdateItem}
              handleDeleteItem={handleDeleteItem}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
