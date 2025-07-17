import { useState } from "react";
import Link from "next/link";
import { ClipboardItem } from "./app-page";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { downloadWithCustomName, handleCopy } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Check,
  Clipboard,
  Download,
  File,
  FileText,
  FileImage,
  FileArchive,
  FileVideo,
  FileAudio,
  FileCode,
  Pencil,
  Trash,
  X,
  Copy,
} from "lucide-react";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { storage } from "@/lib/appwrite";

type RenderItemsProps = {
  items: ClipboardItem[] | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editContent: string;
  setEditContent: (content: string) => void;
  handleUpdateItem: (id: string) => void;
  handleDeleteItem: (id: string, file_id: string) => void;
};

// Helper function to get file icon based on file type
const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const archiveTypes = ["zip", "rar", "7z", "tar", "gz"];
  const videoTypes = ["mp4", "webm", "mov", "avi"];
  const audioTypes = ["mp3", "wav", "ogg", "m4a"];
  const codeTypes = ["js", "ts", "jsx", "tsx", "html", "css", "json", "md"];

  if (imageTypes.includes(ext || "")) return <FileImage className='h-5 w-5' />;
  if (archiveTypes.includes(ext || ""))
    return <FileArchive className='h-5 w-5' />;
  if (videoTypes.includes(ext || "")) return <FileVideo className='h-5 w-5' />;
  if (audioTypes.includes(ext || "")) return <FileAudio className='h-5 w-5' />;
  if (codeTypes.includes(ext || "")) return <FileCode className='h-5 w-5' />;
  if (ext === "pdf") return <FileText className='h-5 w-5' />;

  return <File className='h-5 w-5' />;
};

export default function RenderItems(props: RenderItemsProps) {
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderImageUrl = (fileId: string) => {
    const id = storage.getFileView("clipboard_files", fileId);
    console.log("id", id);
    return id;
  };

  const handleImageClick = (item: ClipboardItem) => {
    if (item.type === "image" || (item.type === "file" && item.file)) {
      setPreviewImage({
        url: renderImageUrl(item.file || ""),
        alt: item.file || "Preview",
      });
    }
  };

  const handleDownload = async (item: ClipboardItem) => {
    if (!item.file) return;
    const file = storage.getFileDownload("clipboard_files", item.file);
    if (!file) return;
    await downloadWithCustomName(file, item.file);
  };

  return (
    <>
      <ul className='space-y-4'>
        {props.isLoading &&
          [1, 2, 3].map((index) => (
            <Skeleton key={index} className='cardClass' />
          ))}
        {props.error && (
          <div className='cardClass'>Error: {props.error.message}</div>
        )}
        {props.items &&
          props.items.length > 0 &&
          props.items.map((item) => (
            <li key={item.id} className='cardClass'>
              <div className='flex-grow mb-2 sm:mb-0 sm:mr-4 break-all'>
                {props.editingId === item.id ? (
                  <Input
                    type='text'
                    value={props.editContent}
                    onChange={(e) => props.setEditContent(e.target.value)}
                    className='w-full bg-gray-600 text-white border-gray-500 focus:border-blue-500'
                  />
                ) : item.type === "text" ? (
                  <p className=''>{item.content}</p>
                ) : item.type === "link" ? (
                  <Link
                    href={item.content}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 hover:underline flex items-center gap-2'
                  >
                    {item.content}
                  </Link>
                ) : item.type === "image" ? (
                  <div
                    className='relative flex items-center justify-between w-full cursor-pointer'
                    onClick={() => handleImageClick(item)}
                  >
                    <div className='flex items-center gap-2'>
                      <Image
                        src={renderImageUrl(item.file || "")}
                        width={100}
                        height={100}
                        alt='Uploaded content'
                        className='max-w-full h-auto rounded hover:opacity-90 transition-opacity'
                      />
                      <div className='flex flex-col'>
                        <p className='font-medium text-sm truncate'>
                          {item.file}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {formatFileSize(item.file as any)} • {item.file}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='border mt-[8px] text-gray-400 hover:text-white hover:bg-gray-700'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      title='Download'
                    >
                      <Download className='w-20 h-20' />
                    </Button>
                  </div>
                ) : item.type === "file" && item.file ? (
                  <div className='flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer'>
                    <div className='p-2 bg-gray-700 rounded'>
                      {getFileIcon(item.file)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm truncate'>
                        {item.file}
                      </p>
                      <p className='text-xs text-gray-400'>
                        {formatFileSize(item.file as any)} • {item.file}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-gray-400 hover:text-white hover:bg-gray-700'
                      onClick={() => handleDownload(item)}
                      title='Download'
                    >
                      <Download size={20} className='h-4 w-4' />
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className='flex space-x-2 justify-end mt-2'>
                {props.editingId === item.id ? (
                  <>
                    <Button
                      size='icon'
                      onClick={() => props.handleUpdateItem(item.id)}
                      className='bg-green-600 hover:bg-green-700'
                    >
                      <Check className='h-4 w-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={() => props.setEditingId(null)}
                      className='border-gray-500 text-gray-300 hover:bg-gray-600'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </>
                ) : (
                  <>
                    {item.type !== "image" && item.type !== "file" && (
                      <>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => handleCopy(item.content)}
                          className='border-gray-500 text-gray-300 hover:bg-gray-600'
                        >
                          <Copy className='h-4 w-4' />
                        </Button>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => {
                            props.setEditingId(item.id);
                            props.setEditContent(item.content);
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
                        props.handleDeleteItem(item.id, item.file!)
                      }
                      className='border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
      </ul>

      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || ""}
        alt={previewImage?.alt || "Image preview"}
      />
    </>
  );
}
