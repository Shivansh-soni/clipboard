import { ClipboardItem, ItemPayload } from "@/components/app-page";
import { clsx, type ClassValue } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePayload(text: string): ItemPayload {
  return {
    content: text,
    type:
      text.startsWith("http://") || text.startsWith("https://")
        ? "link"
        : "text",
  };
}

export const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
  toast.success("The content has been copied to your clipboard.");
};

export const openImageInNewTab = (item: ClipboardItem) => {
  const newTab: any = window.open();
  newTab.document.write(
    `<html><head><title>Image Preview</title></head><body style="margin:0; background-color:black; display:flex; align-items:center; justify-content:center;"><img src="${item.content}" alt="Uploaded image" style="max-width:100%; height:auto;" /></body></html>`
  );
  newTab.document.close();
};

export async function downloadWithCustomName(
  url: string,
  customFilename: string
) {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = customFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl); // clean up
}
