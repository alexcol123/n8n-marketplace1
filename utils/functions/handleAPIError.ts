import { NextResponse } from "next/server";

export const handleApiError = (
  error: unknown, 
  defaultMessage: string = "Failed to process request",
  status: number = 500
) => {
  console.error("API Error:", error);
  
  if (error instanceof Error) {
    return NextResponse.json(
      { 
        success: false,
        error: defaultMessage, 
        details: error.message 
      },
      { status }
    );
  } else {
    return NextResponse.json(
      { 
        success: false,
        error: defaultMessage, 
        details: "Unknown error occurred" 
      },
      { status }
    );
  }
};