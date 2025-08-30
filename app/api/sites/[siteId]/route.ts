import db from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;

    // Look up the site in the database
    const site = await db.availableSite.findUnique({
      where: {
        siteName: siteId,
      },
      include: {
        workflow: {
          select: {
            id: true,
            title: true,
            WorkflowTeachingGuide: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // Return site data with teaching guide title if available
    const response = {
      ...site,
      displayTitle: site.workflow?.WorkflowTeachingGuide?.title || site.name,
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Error fetching site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}