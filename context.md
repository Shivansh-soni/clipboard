# Clipboard Project Context

## Project Overview

A modern clipboard application built with Next.js 14, TypeScript, and Appwrite. The app allows users to store and manage various types of clipboard items including text, links, images, and files with a clean, responsive interface and admin capabilities.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Appwrite (primary)
- **State Management**: React Query (TanStack Query)
- **Authentication**: Appwrite Auth with JWT
- **Storage**: Appwrite Storage
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
/
├── app/                    # Next.js app directory (App Router)
│   ├── admin/              # Admin dashboard pages
│   │   └── users/          # User management
│   ├── login/              # Authentication pages
│   ├── signup/             # Invitation-based signup
│   ├── fonts/              # Custom fonts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── components/
│   ├── admin/             # Admin components
│   │   ├── UserManagement.tsx # User management interface
│   │   ├── AdminLayout.tsx  # Admin layout wrapper
│   │   ├── ClipboardForm.tsx # Form for clipboard operations
│   │   └── ClipboardList.tsx # List of clipboards
│   ├── auth/               # Authentication components
│   │   ├── LoginForm.tsx   # Login form
│   │   ├── SignupForm.tsx  # Signup form (invitation-based)
│   │   └── ProtectedRoute.tsx # Route protection
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
│   │   ├── userFunctions.ts # User management functions
│   │   └── index.ts        # Database utilities
│   ├── mutations/          # React Query mutations
│   │   └── ClipboardMutation.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── database.ts     # Database schema types
│   │   └── users.ts        # User-related types and interfaces
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

- **User Management**: Admin can create, update, and delete users
- **Role-Based Access Control**: Admin and User roles with appropriate permissions
- **Invitation System**: Secure user onboarding with invitation tokens
- **Clipboard Management**: Store and manage text, links, images, and files
- **Real-time Updates**: Automatic UI updates using React Query
- **File Previews**: Image and file previews with download options
- **Responsive Design**: Works on desktop and mobile devices
- **Admin Interface**: Manage all users and clipboard items
- **Modern UI**: Built with shadcn/ui components for a polished look

## Authentication & Authorization

- **User Roles**:

  - `admin`: Full access to all features including user management
  - `user`: Can manage their own clipboard items

- **Authentication Flows**:
  - Email/Password login
  - Invitation-based signup
  - Password reset
  - Protected routes with role-based access control

## Data Model

### User

```typescript
interface User {
  $id: string;
  email: string;
  name: string;
  status: "active" | "pending" | "suspended";
  prefs: {
    role: "admin" | "user";
  };
  $createdAt: string;
  $updatedAt: string;
}
```

### Invitation

```typescript
interface Invitation {
  $id: string;
  email: string;
  token: string;
  role: UserRole;
  status: "pending" | "accepted" | "revoked";
  invitedBy: string;
  expiresAt: string;
  acceptedAt?: string;
  userId?: string;
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
3. Copy `.env.local.example` to `.env.local` and update with your Appwrite credentials
4. Start the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Recent Changes

- **2024-06-21**:
  - Implemented complete user management interface
  - Added role-based access control
  - Implemented invitation system
  - Fixed authentication flows
  - Added proper error handling and loading states
  - Updated documentation
