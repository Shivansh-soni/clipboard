import Link from "next/link";
import { ClipboardItem } from "./app-page";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { handleCopy, openImageInNewTab } from "@/lib/utils";
import { Button } from "./ui/button";
import { Check, Clipboard, Pencil, Trash, X } from "lucide-react";

type RenderItemsProps = {
  items: ClipboardItem[] | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editContent: string;
  setEditContent: (content: string) => void;
  handleUpdateItem: (id: string) => void;
  handleDeleteItem: (id: string) => void;
};
export default function RenderItems(props: RenderItemsProps) {
  return (
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
                  type={item.type === "link" ? "url" : "text"}
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
                  className='text-blue-500 hover:underline'
                >
                  {item.content}
                </Link>
              ) : (
                <Image
                  onClick={() => openImageInNewTab(item)}
                  src={item.content}
                  width={200}
                  height={200}
                  alt='Uploaded image'
                  className='max-w-full h-auto rounded'
                />
              )}
            </div>
            <div className='flex space-x-2 justify-end'>
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
                  {item.type !== "image" && (
                    <>
                      <Button
                        size='icon'
                        variant='outline'
                        onClick={() => handleCopy(item.content)}
                        className='border-gray-500 text-gray-300 hover:bg-gray-600'
                      >
                        <Clipboard className='h-4 w-4' />
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
                    onClick={() => props.handleDeleteItem(item.id)}
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
  );
}
