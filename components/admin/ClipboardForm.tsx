import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ClipboardFormProps {
  initialData?: {
    name: string;
    description: string;
    isActive: boolean;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    isActive: boolean;
  }) => Promise<void>;
}

export default function ClipboardForm({
  initialData,
  onSubmit,
}: ClipboardFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ name, description, isActive });
      toast({
        title: "Success",
        description: "Clipboard saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={3}
          maxLength={50}
          placeholder='Enter clipboard name'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Optional description...'
          maxLength={200}
        />
      </div>

      <div className='flex items-center space-x-2'>
        <Switch id='active' checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor='active'>Active</Label>
      </div>

      <Button type='submit' className='w-full'>
        {initialData ? "Update Clipboard" : "Create Clipboard"}
      </Button>
    </form>
  );
}
