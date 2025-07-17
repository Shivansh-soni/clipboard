"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getClipboardByName,
  getClipboardItems,
} from "@/lib/actions/clipboard.actions";
import ClipboardView from "@/components/ClipboardView/ClipboardView";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ClipboardItem } from "@/types/clipboard";

export default function ClipboardPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  //   Fetch clipboard metadata
  const {
    data: clipboard,
    isLoading: isClipboardLoading,
    error: clipboardError,
  } = useQuery({
    queryKey: ["clipboard", params.id],
    queryFn: () => getClipboardByName(params.id),
    enabled: !!params.id,
  });

  console.log("clipboard", clipboard);
  // Fetch clipboard items
  const {
    data: items = [],
    isLoading: isItemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useQuery({
    queryKey: ["clipboard-items", params.id],
    queryFn: () => getClipboardItems(params.id),
    //  enabled: !!params.id && !!clipboard, // Only fetch items if clipboard exists
  });

  const isLoading = isClipboardLoading || isItemsLoading;
  const error = clipboardError || itemsError;

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

  if (!clipboard.isActive) {
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
