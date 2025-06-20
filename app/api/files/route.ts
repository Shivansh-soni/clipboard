import { NextResponse } from "next/server";
import {
  saveFile,
  isFileTypeAllowed,
  getAllowedFileTypes,
} from "@/lib/utils/file-upload";

export async function POST(request: Request) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to a format we can work with
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a file-like object
    const fileObj = {
      name: file.name,
      type: file.type,
      size: file.size,
      arrayBuffer: () => Promise.resolve(buffer.buffer),
    };

    // Validate file type
    if (!isFileTypeAllowed(fileObj.name)) {
      return NextResponse.json(
        {
          error: "File type not allowed",
          allowedTypes: getAllowedFileTypes(),
        },
        { status: 400 }
      );
    }

    // Save the file and get the URL
    const fileUrl = await saveFile(fileObj);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: fileObj.name,
      size: fileObj.size,
      type: fileObj.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
