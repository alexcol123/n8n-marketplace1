import db from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sites = await db.availableSite.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        workflow: {
          select: {
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

    return NextResponse.json(sites);
  } catch (error) {
    console.error("Error fetching portfolio sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}