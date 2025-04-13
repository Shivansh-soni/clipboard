import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { queryClient } from "@/components/Provider";
import { ClipboardItem, ItemPayload } from "@/components/app-page";
import { updateItem, deleteItem, addItem } from "@/lib/actions/redis.actions";

export function useClipboardMutations() {
  const updateMutation = useMutation({
    mutationFn: async ({ id, content, type }: ClipboardItem) => {
      const item: ClipboardItem | undefined = await updateItem(
        id,
        content,
        type
      );
      return item;
    },
    onSuccess: () => {
      toast.success("Text has been updated successfully.");
      queryClient.invalidateQueries({
        queryKey: ["clipboard"],
      });
    },
    onError: (error) => {
      toast.error("Failed to update text.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteItem(id);
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
      const item: ClipboardItem = await addItem(payload);
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
