# Clipboard Project Context

## Project Overview

A modern clipboard application built with Next.js 14, TypeScript, and Appwrite. The app allows users to store and manage various types of clipboard items including text, links, images, and files with a clean, responsive interface and admin capabilities.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Appwrite (primary)
- **State Management**: React Query (TanStack Query)
- **Authentication**: Appwrite Auth
- **Storage**: Appwrite Storage
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
/
├── app/                    # Next.js app directory (App Router)
│   ├── login/              # Authentication pages
│   ├── fonts/              # Custom fonts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── components/
│   ├── admin/             # Admin components
│   │   ├── AdminLayout.tsx  # Admin layout wrapper
│   │   ├── ClipboardForm.tsx # Form for clipboard operations
│   │   └── ClipboardList.tsx # List of clipboards
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── skeleton.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── ImagePreviewModal.tsx # Image preview component
│   ├── InputForm.tsx       # Input form component
│   ├── RenderItems.tsx     # Component for rendering clipboard items
│   ├── Provider.tsx        # Global providers wrapper (React Query)
│   └── icons.tsx           # Custom icon components
│
├── lib/
│   ├── actions/           # Server actions
│   │   └── clipboard.actions.ts # Clipboard operations
│   ├── appwrite.ts         # Appwrite client configuration
│   ├── constants.ts        # Application constants
│   ├── context/            # React context providers
│   │   └── auth.tsx        # Authentication context
│   ├── db/                 # Database operations
│   │   ├── clipboardItems.ts # Clipboard item operations
│   │   └── index.ts        # Database utilities
│   ├── mutations/          # React Query mutations
│   │   └── ClipboardMutation.ts
│   ├── types/              # TypeScript type definitions
│   │   └── database.ts     # Database schema types
│   └── utils/              # Utility functions
│       ├── appwrite-storage.ts # File upload/download helpers
│       ├── file-upload.ts  # File upload utilities
│       └── index.ts        # Common utilities
│
├── public/               # Static files
├── .env.local.example      # Example environment variables
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Key Features

- **Clipboard Management**: Store and manage text, links, images, and files
- **Real-time Updates**: Automatic UI updates using React Query
- **File Previews**: Image and file previews with download options
- **Responsive Design**: Works on desktop and mobile devices
- **Admin Interface**: Manage all clipboard items
- **Modern UI**: Built with shadcn/ui components for a polished look

## Data Model

### Clipboard Item

```typescript
interface ClipboardItem {
  id: string;
  type: "text" | "link" | "image" | "file";
  content: string;
  file?: {
    id: string;
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
  };
  clipboardId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-endpoint/v1
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
```

## Deployment

The application is designed to be deployed on Vercel with the following requirements:

- Node.js 18+
- Appwrite backend

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Recent Changes

- Removed Redis and its dependencies
- Updated to use Appwrite as the primary database and storage solution
- Simplified the architecture by removing unnecessary caching layer
- Updated documentation to reflect current state
