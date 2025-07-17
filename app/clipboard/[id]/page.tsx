"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getClipboardByName,
  getClipboardItems,
  verifyClipboardPin,
} from "@/lib/actions/clipboard.actions";
import ClipboardView from "@/components/ClipboardView/ClipboardView";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import type { BaseClipboard, ClipboardItem } from "@/types/clipboard";

export default function ClipboardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pin, setPin] = useState("");
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinError, setPinError] = useState("");

  // Fetch clipboard metadata
  const {
    data: clipboard,
    isLoading: isClipboardLoading,
    error: clipboardError,
  } = useQuery<BaseClipboard>({
    queryKey: ["clipboard", params.id],
    queryFn: () => getClipboardByName(params.id),
    enabled: !!params.id,
  });

  // Handle successful clipboard fetch
  useEffect(() => {
    if (clipboard) {
      if (clipboard.requirePinOnVisit) {
        setIsPinVerified(false);
      } else {
        // Check if PIN is already verified in session storage
        const verifiedClipboards = JSON.parse(
          sessionStorage.getItem("verifiedClipboards") || "[]"
        );
        if (verifiedClipboards.includes(clipboard.$id)) {
          setIsPinVerified(true);
        }
      }
    }
  }, [clipboard]);

  // Fetch clipboard items only if PIN is verified or not required
  const {
    data: items = [],
    isLoading: isItemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useQuery<ClipboardItem[]>({
    queryKey: ["clipboard-items", params.id],
    queryFn: () => getClipboardItems(params.id),
    enabled: !!clipboard && (!clipboard.requirePinOnVisit || isPinVerified),
  });

  const isLoading = isClipboardLoading || isItemsLoading;
  const error = clipboardError || itemsError;

  const handlePinSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setPinError("Please enter a PIN");
      return;
    }

    if (!clipboard) {
      toast.error("Clipboard not found");
      return;
    }

    setIsVerifying(true);
    setPinError("");

    try {
      const isValid = await verifyClipboardPin(clipboard.$id, pin);
      if (isValid) {
        setIsPinVerified(true);
        // Store verification in session storage
        const verifiedClipboards = JSON.parse(
          sessionStorage.getItem("verifiedClipboards") || "[]"
        );
        if (!verifiedClipboards.includes(clipboard.$id)) {
          verifiedClipboards.push(clipboard.$id);
          sessionStorage.setItem(
            "verifiedClipboards",
            JSON.stringify(verifiedClipboards)
          );
        }
        toast.success("PIN verified successfully!");
      } else {
        setPinError("Invalid PIN. Please try again.");
        toast.error("Invalid PIN. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying PIN:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while verifying the PIN.";
      setPinError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p>Loading clipboard...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='text-center p-6 bg-gray-800 rounded-lg max-w-md'>
          <h2 className='text-2xl font-bold text-red-500 mb-4'>Error</h2>
          <p className='mb-6'>
            {error instanceof Error
              ? error.message
              : "Failed to load clipboard"}
          </p>
          <Button
            onClick={() => router.push("/")}
            className='bg-blue-600 hover:bg-blue-700'
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Handle case when clipboard is not found
  if (!clipboard) {
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='text-center p-6 bg-gray-800 rounded-lg max-w-md'>
          <h2 className='text-2xl font-bold mb-4'>Clipboard Not Found</h2>
          <p className='mb-6'>The requested clipboard could not be found.</p>
          <Button
            onClick={() => router.push("/")}
            className='bg-blue-600 hover:bg-blue-700'
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show PIN verification form if required and not verified
  if (clipboard?.requirePinOnVisit && !isPinVerified) {
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold mb-2'>Enter PIN</h1>
            <p className='text-gray-400'>
              This clipboard is protected by a PIN
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='pin' className='text-sm font-medium'>
                PIN
              </Label>
              <Input
                id='pin'
                type='password'
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder='Enter PIN'
                className='bg-gray-700 border-gray-600 text-white'
                autoComplete='off'
                autoFocus
              />
              {pinError && (
                <p className='text-sm text-red-500 mt-1'>{pinError}</p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700'
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Access Clipboard"}
            </Button>

            <Button
              type='button'
              variant='outline'
              className='w-full text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white'
              onClick={() => router.push("/")}
            >
              Go Back
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (clipboard && !clipboard.isActive) {
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='text-center p-6 bg-gray-800 w-full rounded-lg max-w-lg'>
          <h2 className='text-2xl font-bold mb-4'>Clipboard Not Active</h2>
          <p className='mb-2'>The requested clipboard is not active.</p>
          <p className='mb-6'>
            Please contact the <b>admin</b> to activate it.
          </p>
          {/* <Button
            onClick={() => router.push("/")}
            className='bg-blue-600 hover:bg-blue-700'
          >
            Go to Home
          </Button> */}
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='container mx-auto p-4 max-w-4xl'>
        {/* <Button
          onClick={() => router.back()}
          variant='ghost'
          className='mb-4 text-gray-300 hover:text-white hover:bg-gray-800'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button> */}

        {/* <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-1'>{clipboard.name}</h1>
          {clipboard.description && (
            <p className='text-gray-400'>{clipboard.description}</p>
          )}
          <div className='mt-2 text-sm text-gray-500'>
            {clipboard.isPublic ? (
              <span className='text-green-400'>Public</span>
            ) : (
              <span className='text-yellow-400'>Private</span>
            )}
            {clipboard.requirePinOnVisit && (
              <span className='ml-4'>🔒 PIN required</span>
            )}
          </div>
        </div> */}

        <ClipboardView
          items={items}
          name={clipboard.name}
          description={clipboard.description}
          isLoading={isItemsLoading}
          error={itemsError}
          clipboardId={params.id}
          onItemAdded={refetchItems}
          onItemUpdated={refetchItems}
          onItemDeleted={refetchItems}
        />
      </div>
    </div>
  );
}
