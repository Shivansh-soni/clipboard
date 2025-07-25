import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { queryClient } from "@/components/Provider";
import { ItemPayload } from "@/types/clipboard";
import { updateItem, deleteItem, addItem } from "@/lib/db/clipboardItems";

export function useClipboardMutations() {
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      content,
      type,
    }: {
      id: string;
      content: string;
      type: "link" | "image" | "text" | "file";
    }) => {
      const item = await updateItem(id, {
        content,
        type,
      });
      return item;
    },
    onSuccess: () => {
      toast.success("Text has been updated successfully.");
      queryClient.invalidateQueries({
        queryKey: ["clipboard"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, file_id }: { id: string; file_id: string }) => {
      await deleteItem(id, file_id);
      return true;
    },
    onSuccess: () => {
      toast.success("Text has been deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["clipboard"],
      });
    },
    onError: (error) => {
      toast.error("Failed to delete text.");
      console.error(error);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: ItemPayload) => {
      const item = await addItem(payload);
      return item;
    },
    onSuccess: () => {
      toast.success("Text has been added successfully.");
      queryClient.invalidateQueries({
        queryKey: ["clipboard"],
      });
    },
    onError: (error) => {
      toast.error("Failed to add text.");
      console.error(error);
    },
  });

  return {
    updateMutation,
    deleteMutation,
    addMutation,
  };
}
