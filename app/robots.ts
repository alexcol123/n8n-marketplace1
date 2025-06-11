// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',  // Prevent indexing of user dashboard
        '/api/',        // Block API routes
        '/admin/',      // Block admin areas
      ],
    },
    sitemap: 'https://n8n-store.com/sitemap.xml',
  };
}