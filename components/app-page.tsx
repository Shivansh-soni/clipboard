"use client";

import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/lib/db/clipboardItems";
import ClipboardView from "@/components/ClipboardView/ClipboardView";
import type { ClipboardItem } from "@/types/clipboard";

export default function Home() {
  const {
    data: items = [],
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
        file: doc.file?.$id, // Only store the file ID
        clipboardId: doc.clipboardId,
      }));
    },
  });

  return (
    <ClipboardView
      items={items}
      isLoading={isLoading}
      error={error}
      clipboardId='default'
    />
  );
}

export type { ClipboardItem };
