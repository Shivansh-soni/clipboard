"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  createClipboard,
  updateClipboard,
} from "@/lib/actions/clipboard.actions";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/components/Provider";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[^\s]*$/, "Name cannot contain spaces")
    .regex(
      /^[a-zA-Z0-9_-]*$/,
      "Name can only contain letters, numbers, underscores (_), and hyphens (-)"
    ),
  pin: z.string().min(4, "PIN must be at least 4 characters"),
  expiresAt: z.string().optional(),
  requirePinOnVisit: z.boolean().default(false).optional(),
});

type Form = z.infer<typeof schema>;

export function ClipboardFormDialog({
  children,
  clipboard,
}: {
  children: React.ReactNode;
  clipboard?: any;
}) {
  const [open, setOpen] = useState(false);
  const createMutation = useMutation({
    mutationFn: (data: any) => createClipboard(data),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["clipboards"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: any }) =>
      updateClipboard(params.id, params.data),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["clipboards"] });
    },
  });

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: clipboard?.name || "",
      pin: clipboard?.pin || "",
      expiresAt: clipboard?.expiresAt || undefined,
      requirePinOnVisit: clipboard?.requirePinOnVisit ?? false,
    },
  });

  const onSubmit = async (values: Form) => {
    try {
      const payload = {
        ...values,
        expiresAt: values.expiresAt ? new Date(values.expiresAt) : undefined,
      };

      if (clipboard) {
        await updateMutation.mutateAsync({ id: clipboard.$id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{clipboard ? "Edit" : "Create"} Clipboard</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Input placeholder='Name' {...form.register("name")} />
          <Input placeholder='PIN' type='password' {...form.register("pin")} />
          <Input
            placeholder='Expires At'
            type='datetime-local'
            {...form.register("expiresAt")}
          />
          <Label>Require PIN on every visit</Label>
          <Switch
            checked={form.watch("requirePinOnVisit")}
            onCheckedChange={(v) => form.setValue("requirePinOnVisit", v)}
          />
          <Button type='submit' disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
