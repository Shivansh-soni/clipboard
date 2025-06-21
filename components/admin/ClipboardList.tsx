import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit2, Eye } from "lucide-react";
import { useState } from "react";

interface ClipboardItem {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt?: number;
  createdBy: string;
}

interface ClipboardListProps {
  clipboards: ClipboardItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export default function ClipboardList({
  clipboards,
  onDelete,
  onEdit,
  onView,
}: ClipboardListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className='space-y-4'>
      {clipboards.map((clipboard) => (
        <Card key={clipboard.id} className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <h3 className='font-semibold'>{clipboard.name}</h3>
              {clipboard.description && (
                <p className='text-sm text-muted-foreground'>
                  {clipboard.description}
                </p>
              )}
              <div className='flex items-center gap-2 mt-2'>
                <Badge variant={clipboard.isActive ? "default" : "secondary"}>
                  {clipboard.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className='text-sm text-muted-foreground'>
                  Created {new Date(clipboard.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onView(clipboard.id)}
              >
                <Eye className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onEdit(clipboard.id)}
              >
                <Edit2 className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setDeleteId(clipboard.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Clipboard</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-sm text-muted-foreground'>
              Are you sure you want to delete this clipboard? This action cannot
              be undone.
            </p>
            <div className='flex justify-end gap-4 mt-4'>
              <Button variant='outline' onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
