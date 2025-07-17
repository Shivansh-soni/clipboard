"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addClipboardItem,
  uploadFile,
  updateClipboardItem,
  deleteClipboardItem,
} from "@/lib/actions/clipboard.actions";
import type { ClipboardItem, FileMetadata } from "@/types/clipboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Edit, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  getFileDownloadUrl,
  getFilePreviewUrl,
} from "@/lib/utils/appwrite-storage";

interface ClipboardViewProps {
  items: ClipboardItem[];
  isLoading: boolean;
  error: Error | null;
  clipboardId: string;
  name?: string;
  description?: string;
  onItemAdded?: () => void;
  onItemUpdated?: () => void;
  onItemDeleted?: () => void;
}

const schema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z.enum(["text", "link", "image", "file"] as const),
  file: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ClipboardView({
  items = [],
  isLoading,
  error,
  clipboardId,
  onItemAdded,
  onItemUpdated,
  onItemDeleted,
}: ClipboardViewProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<ClipboardItem | null>(null);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FormValues>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
        type: "text" as const,
        content: "",
      },
    });

  const selectedType = watch("type");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItemId(itemId);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedItemId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const readFileAsArrayBuffer = (file: File): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          // Convert ArrayBuffer to number array for JSON serialization
          const uint8Array = new Uint8Array(reader.result);
          resolve(Array.from(uint8Array));
        } else {
          reject(new Error("Failed to read file as ArrayBuffer"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  const addItemMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      setIsSubmitting(true);
      try {
        let fileData = null;
        if ((data.type === "file" || data.type === "image") && data.file) {
          // Convert file to number array for server action
          const buffer = await readFileAsArrayBuffer(data.file);
          fileData = await uploadFile({
            name: data.file.name,
            type: data.file.type,
            buffer: buffer,
          });
        }

        const itemData = {
          type: data.type,
          content: data.content,
          file: fileData?.$id,
          clipboardId,
        };

        return await addClipboardItem(itemData);
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast.success("Item added successfully");
      reset();
      if (onItemAdded) onItemAdded();
      queryClient.invalidateQueries({
        queryKey: ["clipboard-items", clipboardId],
      });
    },
    onError: (error) => {
      console.error("Error adding item:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add item"
      );
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (data: { id: string; content: string; type: string }) => {
      return await updateClipboardItem(data.id, {
        content: data.content,
        type: data.type,
      });
    },
    onSuccess: () => {
      toast.success("Item updated successfully");
      setEditingItem(null);
      queryClient.invalidateQueries({
        queryKey: ["clipboard-items", clipboardId],
      });
    },
    onError: (error) => {
      console.error("Error updating item:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update item"
      );
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteClipboardItem(id);
      return id;
    },
    onSuccess: () => {
      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["clipboard-items", clipboardId],
      });
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (editingItem) {
      updateItemMutation.mutate({
        id: editingItem.id,
        content: data.content,
        type: data.type as any,
      });
    } else {
      // For new items, set content to file name if it's a file or image
      if ((data.type === "file" || data.type === "image") && data.file) {
        data.content = data.file.name;
      }
      addItemMutation.mutate(data);
    }
  };

  const handleEdit = (item: ClipboardItem) => {
    setEditingItem(item);
    setValue("type", item.type as any);
    setValue("content", item.content);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    reset();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file);
      // Only auto-set content if it's empty or we're not editing
      if (!editingItem || !watch("content")) {
        setValue("content", file.name);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='container mx-auto p-4 max-w-3xl'>
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-6'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            {editingItem ? "Edit Item" : "Add New Item"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='type' className='block mb-2'>
                Type
              </Label>
              <select
                {...register("type")}
                className='w-full p-2 rounded bg-gray-700 border border-gray-600 text-white'
              >
                <option value='text'>Text</option>
                <option value='link'>Link</option>
                <option value='image'>Image</option>
                <option value='file'>File</option>
              </select>
            </div>

            {selectedType === "file" || selectedType === "image" ? (
              <div>
                <Label htmlFor='file' className='block mb-2'>
                  {selectedType === "image" ? "Image" : "File"}
                </Label>
                <input
                  type='file'
                  id='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className='hidden'
                  accept={selectedType === "image" ? "image/*" : "*"}
                />
                <Button
                  type='button'
                  onClick={triggerFileInput}
                  variant='outline'
                  className='w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  disabled={!!editingItem}
                >
                  {watch("file")
                    ? watch("file")?.name
                    : `Choose ${
                        selectedType === "image" ? "an image" : "a file"
                      }`}
                </Button>
                {selectedType === "image" && watch("file") && (
                  <div className='mt-2'>
                    <img
                      src={URL.createObjectURL(watch("file") as Blob)}
                      alt='Preview'
                      className='max-h-40 rounded mt-2 object-contain'
                      onLoad={(e) => {
                        // Revoke the object URL to avoid memory leaks
                        URL.revokeObjectURL(e.currentTarget.src);
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor='content' className='block mb-2'>
                  {selectedType === "link" ? "URL" : "Content"}
                </Label>
                <Input
                  id='content'
                  type={selectedType === "link" ? "url" : "text"}
                  placeholder={
                    selectedType === "link"
                      ? "https://example.com"
                      : "Enter your content here..."
                  }
                  {...register("content")}
                  className='bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                />
              </div>
            )}

            <div className='flex space-x-4'>
              <Button
                type='submit'
                className='flex-1 bg-blue-600 hover:bg-blue-700'
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? editingItem
                    ? "Updating..."
                    : "Adding..."
                  : editingItem
                  ? "Update Item"
                  : "Add Item"}
              </Button>
              {editingItem && (
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1 bg-gray-700 hover:bg-gray-600'
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className='mt-8'>
            <h3 className='text-xl font-semibold mb-4'>Items</h3>
            {isLoading ? (
              <div className='text-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
                <p className='mt-2 text-gray-400'>Loading items...</p>
              </div>
            ) : error ? (
              <div className='text-red-500 text-center py-4'>
                Error loading items: {error.message}
              </div>
            ) : items.length === 0 ? (
              <div className='text-center py-8 text-gray-400'>
                No items yet. Add one above!
              </div>
            ) : (
              <div className='space-y-4'>
                {items.map((item) => {
                  const getFileUrl = (file: string | FileMetadata | undefined): string => {
                    if (!file) return '';
                    const fileId = typeof file === 'string' ? file : file.id;
                    return getFileDownloadUrl(fileId);
                  };
                  
                  const renderURL = getFileUrl(item.file);
                  return (
                    <div
                      key={item.id}
                      className='p-4 bg-gray-700 rounded-lg group relative'
                    >
                      <div className='absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        {(item.type === "text" || item.type === "link") && (
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-600'
                            onClick={() => handleCopy(item.content, item.id)}
                            title='Copy to clipboard'
                          >
                            {copiedItemId === item.id ? (
                              <Check className='h-4 w-4 text-green-400' />
                            ) : (
                              <Copy className='h-4 w-4' />
                            )}
                          </Button>
                        )}
                        {item.type !== "file" && item.type !== "image" && (
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-gray-600'
                            onClick={() => handleEdit(item)}
                            title='Edit item'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                        )}
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-600'
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this item?"
                              )
                            ) {
                              deleteItemMutation.mutate(item.id);
                            }
                          }}
                          title='Delete item'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <p className='text-sm text-gray-400 mb-1'>
                        {item.type.toUpperCase()}
                      </p>
                      {item.type === "image" && renderURL ? (
                        <div className='mt-2'>
                          <img
                            src={renderURL}
                            alt={item.content}
                            className='max-w-full max-h-96 rounded object-contain'
                          />
                          <p className='text-xs text-gray-500 mt-1'>
                            {item.content}
                          </p>
                        </div>
                      ) : item.type === "link" ? (
                        <a
                          href={
                            item.content.startsWith("http")
                              ? item.content
                              : `https://${item.content}`
                          }
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-400 hover:underline block break-all'
                        >
                          {item.content}
                        </a>
                      ) : item.type === "file" && renderURL ? (
                        <Link
                          href={renderURL}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-400 hover:underline flex items-center'
                        >
                          <span className='mr-2'>📄</span>
                          <span className='break-all'>
                            {typeof item.file === 'object' && item.file ? (item.file as FileMetadata).name : item.content}
                          </span>
                        </Link>
                      ) : (
                        <p className='text-white break-all'>{item.content}</p>
                      )}
                      {item.createdAt && (
                        <p className='text-xs text-gray-500 mt-2'>
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
