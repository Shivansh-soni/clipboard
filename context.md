# Clipboard Project Context

## Project Overview

A modern clipboard application built with Next.js 14, TypeScript, and Redis. The app allows users to store and manage various types of clipboard items including text, links, images, and files with a clean, responsive interface.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Redis (for storing clipboard items)
- **Storage**: Local filesystem (for file uploads)
- **Icons**: Lucide React (for file type icons)

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── files/          # File upload/download endpoints
│   │   └── ...             # Other API endpoints
│   └── ...                 # App routes
├── components/             # Reusable UI components
│   ├── app-page.tsx        # Main application page
│   ├── InputForm.tsx       # Input form component
│   ├── RenderItems.tsx     # Component for rendering clipboard items
│   └── ImagePreviewModal.tsx # Image preview modal component
├── lib/
│   ├── actions/           # Server actions
│   │   └── redis.actions.ts # Redis operations
│   └── utils/              # Utility functions
│       └── file-upload.ts  # File handling utilities
├── public/                 # Static files
└── uploads/                # Uploaded files storage
```

## Database Schema

### Clipboard Model

```typescript
interface Clipboard {
  id: string; // Format: 'clipboard:uuid'
  name: string; // User-friendly name
  description?: string; // Optional description
  isActive: boolean; // Whether the clipboard is active
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  createdBy: string; // User ID of the creator
}
```

### Item Model (Updated for Multi-clipboard)

```typescript
interface ClipboardItem {
  id: string;
  type: "link" | "image" | "text" | "file";
  content: string;
  clipboardId: string; // Reference to parent clipboard
  // File-specific fields
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  filePath?: string;
  uploadedAt?: string;
}
```

### Redis Keys

- `clipboard:<uuid>` - Hash containing clipboard data
- `clipboards:index` - Set containing all clipboard IDs
- `clipboard:items:<clipboardId>` - Sorted Set containing item IDs for a clipboard
- `item:<id>` - Hash containing item data

### Indexes

- All clipboards: `SMEMBERS clipboards:index`
- Items in a clipboard: `ZRANGE clipboard:items:<clipboardId> 0 -1`

## Current Implementation Status

### Completed

1. **File Management System**

   - File upload API endpoint (`/api/files`)
   - File serving endpoint (`/api/files/[filename]`)
   - File type validation and MIME type detection
   - Secure file storage with unique filenames (UUID)
   - 10MB file size limit
   - File type whitelist (images, documents, archives, etc.)

2. **User Interface**

   - File upload input with preview
   - File type icons for different file formats
   - Image preview modal with zoom and download
   - Responsive design for all screen sizes
   - Loading states and error handling

3. **Core Features**
   - Text, link, image, and file support
   - File metadata display (size, type)
   - Download functionality for all file types
   - Image preview with full-screen modal
   - Copy to clipboard for text and links

## Design Decisions

1. **File Storage**

   - Local filesystem with UUID filenames to prevent conflicts
   - Files stored in `./uploads` directory (gitignored)
   - File metadata stored in Redis

2. **Security**

   - Strict file type whitelist
   - Filename sanitization
   - MIME type validation
   - 10MB file size limit

3. **Performance**
   - Client-side image optimization
   - Efficient file serving with proper caching headers
   - Lazy loading for images
   - Optimistic UI updates

## How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (create `.env` file):

   ```
   REDIS_URL=your_redis_connection_string
   UPLOAD_DIR=./uploads
   ```

3. Create the uploads directory:

   ```bash
   mkdir -p uploads
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Important Notes

- File uploads are stored in the `uploads/` directory (not version controlled)
- Redis is used for storing metadata and references to uploaded files
- The application supports the following file types:
  - Images: JPG, PNG, GIF, WEBP, SVG
  - Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
  - Archives: ZIP, RAR, 7Z, TAR, GZ
  - Code: JS, TS, JSX, TSX, HTML, CSS, JSON, MD

## Recent Changes (2025-06-20)

### UI Improvements

- Redesigned file upload interface with modern aesthetics
- Added file type-specific icons for better visual recognition
- Implemented a clean file preview card showing metadata
- Enhanced visual feedback during file operations
- Improved responsive design for all screen sizes

### Functional Improvements

- Added automatic file cleanup on item deletion
- Fixed Redis client compatibility issues with ioredis
- Enhanced error handling and user feedback
- Improved file type detection and validation

### Documentation

- Updated component documentation
- Added usage examples for file uploads
- Improved inline code comments

## Future Enhancements

- Drag-and-drop file upload
- File search functionality
- Bulk file upload
- File organization (folders/tags)
- File sharing options
- Image editing capabilities
- Cloud storage integration (S3, Google Drive, etc.)
- User authentication
- **Admin Panel**
  - Multiple clipboard management
  - User access control
  - Clipboard analytics
  - Bulk operations
  - Clipboard templates

## Upcoming Features (In Development)

### Admin Panel

#### Overview

A comprehensive admin interface to manage multiple clipboards, users, and system settings.

#### Key Features

- **Clipboard Management**

  - Create, read, update, and delete multiple clipboards
  - Organize clipboards with names and descriptions
  - Toggle clipboard active/inactive status

- **Item Management**

  - View and manage items across all clipboards
  - Bulk actions (delete, move, copy)
  - Advanced search and filtering

- **User Management**

  - Role-based access control
  - User permissions for clipboards
  - Activity logging

- **Analytics**
  - Clipboard usage statistics
  - Storage usage monitoring
  - User activity reports

#### Technical Implementation

- New API routes under `/api/admin`
- Protected admin routes with authentication
- Redis schema updates for multi-clipboard support
- Responsive admin dashboard

---

_This file is automatically updated to reflect the current state of the project. Always check here first when resuming work on the project._
