import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/Provider";
import {
  createClipboard,
  updateClipboard,
  deleteClipboard,
} from "@/lib/actions/clipboard.actions";
import { listClipboards } from "../db";

const QK = {
  clipboards: () => ["clipboards"] as const,
};

// export function useClipboards() {
//   return useQuery({ queryKey: QK.clipboards(), queryFn: listClipboards });
// }

export function useCreateClipboard() {
  return useMutation({
    mutationFn: createClipboard,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QK.clipboards() }),
  });
}

export function useUpdateClipboard() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateClipboard(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QK.clipboards() }),
  });
}

export function useDeleteClipboard() {
  return useMutation({
    mutationFn: deleteClipboard,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QK.clipboards() }),
  });
}
