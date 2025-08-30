import db from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { siteId, status } = await request.json();
    
    if (!siteId || !status) {
      return NextResponse.json(
        { error: "siteId and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['ACTIVE', 'COMING_SOON', 'BETA', 'DISABLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedSite = await db.availableSite.update({
      where: { id: siteId },
      data: { status }
    });

    return NextResponse.json({ 
      success: true, 
      site: updatedSite 
    });
  } catch (error) {
    console.error("Error updating site status:", error);
    return NextResponse.json(
      { error: "Failed to update site status" },
      { status: 500 }
    );
  }
}