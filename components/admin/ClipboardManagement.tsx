"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable"; // generic table
import { ClipboardFormDialog } from "./ClipboardFormDialog";
import { useQuery } from "@tanstack/react-query";
import { getClipboards } from "@/lib/actions/clipboard.actions";
import { deleteClipboard } from "@/lib/actions/clipboard.actions";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/components/Provider";
import { restoreClipboard } from "@/lib/actions/clipboard.actions";
// import { QK } from "@/lib/mutations/ClipboardMutation";

export function ClipboardManagement() {
  const deleteCb = useMutation({
    mutationFn: deleteClipboard,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["clipboards"] }),
  });

  const restoreCb = useMutation({
    mutationFn: restoreClipboard,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["clipboards"] }),
  });

  const { data: clipboards } = useQuery({
    queryKey: ["clipboards"],
    queryFn: () => getClipboards(),
  });
  const cols = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "$createdAt", header: "Created" },
    //  { accessorKey: "lastAccessed", header: "Last Access" },
    { accessorKey: "isActive", header: "Status" },
    { accessorKey: "requirePinOnVisit", header: "Require Pin" },
    //  { accessorKey: "pin", header: "Pin" },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Clipboards</h1>
        <ClipboardFormDialog clipboard={null}>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> New Clipboard
          </Button>
        </ClipboardFormDialog>
      </div>

      <DataTable
        data={clipboards?.documents ?? []}
        columns={cols}
        onDelete={(row) => deleteCb.mutate(row.$id)}
        onRestore={(row) => restoreCb.mutate(row.$id)}
      />
    </div>
  );
}
