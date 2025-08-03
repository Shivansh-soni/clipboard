import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className='container py-8 space-y-6'>
      <div>
        <Skeleton className='h-9 w-48 mb-2' />
        <Skeleton className='h-5 w-64' />
      </div>

      <div className='space-y-4'>
        <div className='flex space-x-2'>
          <Skeleton className='h-9 w-24' />
          <Skeleton className='h-9 w-24' />
          <Skeleton className='h-9 w-36' />
        </div>

        <div className='border rounded-lg p-6 space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-9 w-full max-w-[180px]' />
              <Skeleton className='h-4 w-64' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-9 w-full max-w-[180px]' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-9 w-full max-w-[280px]' />
            </div>

            <div className='space-y-4 pt-4 border-t'>
              <Skeleton className='h-5 w-32' />

              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-36' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <Skeleton className='h-5 w-10' />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-36' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <Skeleton className='h-5 w-10' />
              </div>
            </div>

            <div className='space-y-4 pt-4 border-t'>
              <Skeleton className='h-5 w-32' />

              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-36' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <Skeleton className='h-5 w-10' />
              </div>
            </div>
          </div>

          <div className='flex justify-end pt-4'>
            <Skeleton className='h-9 w-32' />
          </div>
        </div>
      </div>
    </div>
  );
}
