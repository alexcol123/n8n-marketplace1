// app/sitemap.ts
import { MetadataRoute } from "next";
import prisma from "@/utils/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all workflows
  const workflows = await prisma.workflow.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Get all categories (unique categories from workflows)
  const categories = await prisma.workflow.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
  });

  // Base URL
  const baseUrl = "https://n8n-store.com";

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Add other static routes
  ];

  // Category routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/?category=${cat.category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic workflow routes
  const workflowRoutes = workflows.map((workflow) => ({
    url: `${baseUrl}/workflow/${workflow.slug}`,
    lastModified: workflow.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Combine all routes
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...workflowRoutes,
  ] as MetadataRoute.Sitemap;
}
