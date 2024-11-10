"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Check,
    Clipboard,
    Image as ImageIcon,
    Pencil,
    Plus,
    Trash,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    addItem,
    deleteItem,
    getItems,
    updateItem,
} from "@/lib/actions/redis.actions";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface ClipboardItem {
    id: string;
    type: "link" | "image" | "text";
    content: string;
}

export default function Home() {
    const [items, setItems] = useState<ClipboardItem[]>([]);
    const [newItem, setNewItem] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchItems = async () => {
            const fetchedItems = await getItems();
            setItems(fetchedItems);
        };

        fetchItems();
    }, []);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            if (
                newItem.startsWith("http://") ||
                newItem.startsWith("https://")
            ) {
                const item: ClipboardItem = await addItem({
                    type: "link",
                    text: newItem,
                });
                setItems([...items, item]);
                setNewItem("");
                toast.success("Link has been added successfully.");
            } else {
                const item: ClipboardItem = await addItem({
                    type: "text",
                    text: newItem,
                });
                setItems([...items, item]);
                setNewItem("");
                toast.success("Text has been added successfully.");
            }
        }
    };

    const handleUpdateItem = async (id: string) => {
        if (editContent.trim()) {
            const updatedItem = await updateItem(id, editContent);
            setItems(
                items.map((item) =>
                    item.id === id ? updatedItem ?? item : item
                )
            );
            setEditingId(null);
            toast.success("Your item has been updated successfully.");
        }
    };

    const handleDeleteItem = async (id: string) => {
        await deleteItem(id);
        setItems(items.filter((item) => item.id !== id));
        toast.success("Your item has been deleted successfully.");
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success("The content has been copied to your clipboard.");
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                const item = await addItem({
                    type: "image",
                    text: base64String,
                });
                setItems([...items, item]);
                toast.success("Image has been added successfully.");
            };
            reader.readAsDataURL(file);
        }
        setIsImagePickerOpen(false);
    };
    const openImageInNewTab = (item: ClipboardItem) => {
        const newTab: any = window.open();
        newTab.document.write(
            `<html><head><title>Image Preview</title></head><body style="margin:0; background-color:black; display:flex; align-items:center; justify-content:center;"><img src="${item.content}" alt="Uploaded image" style="max-width:100%; height:auto;" /></body></html>`
        );
        newTab.document.close(); // Close the document to render
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
                        <form
                            onSubmit={handleAddItem}
                            className='flex flex-col space-y-2 mb-4'
                        >
                            <div className='flex space-x-2'>
                                <Input
                                    // type='url'
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    placeholder='Add a new item'
                                    className='flex-grow bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                                />
                                <Button
                                    type='submit'
                                    className='bg-blue-600 text-white hover:bg-blue-700'
                                >
                                    <Plus className='h-4 w-4 mr-2 text-white' />
                                    Add Item
                                </Button>
                                <div className='flex items-center justify-center'>
                                    <Input
                                        ref={fileInputRef}
                                        type='file'
                                        accept='image/*'
                                        onChange={handleImageUpload}
                                        className='hidden'
                                    />
                                    <Button
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className='bg-black text-white hover:bg-black hover:drop-shadow-lg hover:bg-gray-950'
                                    >
                                        <ImageIcon className='h-4 w-4 mr-2' />{" "}
                                        Add Image
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <ul className='space-y-4'>
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className='flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700 rounded-lg shadow'
                                >
                                    <div className='flex-grow mb-2 sm:mb-0 sm:mr-4 break-all'>
                                        {editingId === item.id ? (
                                            <Input
                                                type={
                                                    item.type === "link"
                                                        ? "url"
                                                        : "text"
                                                }
                                                value={editContent}
                                                onChange={(e) =>
                                                    setEditContent(
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full bg-gray-600 text-white border-gray-500 focus:border-blue-500'
                                            />
                                        ) : item.type === "text" ? (
                                            <p className=''>{item.content}</p>
                                        ) : item.type === "link" ? (
                                            <Link
                                                href={item.content}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-500 hover:underline'
                                            >
                                                {item.content}
                                            </Link>
                                        ) : (
                                            <Image
                                                onClick={() =>
                                                    openImageInNewTab(item)
                                                }
                                                src={item.content}
                                                width={200}
                                                height={200}
                                                alt='Uploaded image'
                                                className='max-w-full h-auto rounded'
                                            />
                                        )}
                                    </div>
                                    <div className='flex space-x-2 justify-end'>
                                        {editingId === item.id ? (
                                            <>
                                                <Button
                                                    size='icon'
                                                    onClick={() =>
                                                        handleUpdateItem(
                                                            item.id
                                                        )
                                                    }
                                                    className='bg-green-600 hover:bg-green-700'
                                                >
                                                    <Check className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    size='icon'
                                                    variant='outline'
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }
                                                    className='border-gray-500 text-gray-300 hover:bg-gray-600'
                                                >
                                                    <X className='h-4 w-4' />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {item.type !== "image" && (
                                                    <>
                                                        <Button
                                                            size='icon'
                                                            variant='outline'
                                                            onClick={() =>
                                                                handleCopy(
                                                                    item.content
                                                                )
                                                            }
                                                            className='border-gray-500 text-gray-300 hover:bg-gray-600'
                                                        >
                                                            <Clipboard className='h-4 w-4' />
                                                        </Button>
                                                        <Button
                                                            size='icon'
                                                            variant='outline'
                                                            onClick={() => {
                                                                setEditingId(
                                                                    item.id
                                                                );
                                                                setEditContent(
                                                                    item.content
                                                                );
                                                            }}
                                                            className='border-gray-500 text-gray-300 hover:bg-gray-600'
                                                        >
                                                            <Pencil className='h-4 w-4' />
                                                        </Button>
                                                    </>
                                                )}

                                                <Button
                                                    size='icon'
                                                    variant='outline'
                                                    onClick={() =>
                                                        handleDeleteItem(
                                                            item.id
                                                        )
                                                    }
                                                    className='border-gray-500 text-gray-300 hover:bg-gray-600'
                                                >
                                                    <Trash className='h-4 w-4' />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
