import { NextRequest, NextResponse } from "next/server";
import { handleFileRequest } from "@/lib/utils/file-upload";

// This endpoint serves the actual file content
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    return await handleFileRequest(request, { params });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Add HEAD handler for CORS preflight and file existence checks
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
