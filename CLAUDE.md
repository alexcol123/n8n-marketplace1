# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Database operations**:
  - Push schema changes: `npx prisma db push && npx prisma generate`
  - Open Prisma Studio: `npx prisma studio`
- **Clear Next.js cache**: `rm -rf .next`

## Tech Stack & Architecture

This is an n8n workflow marketplace built with:

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **UI**: Tailwind CSS + shadcn/ui components
- **File Storage**: Supabase for images and media
- **AI Integration**: OpenAI for workflow analysis and content generation

### Database Architecture

The application centers around workflow automation with these core models:

- **Profile**: User management linked to Clerk authentication via `clerkId`
- **Workflow**: n8n workflows with JSON storage, categories, and metadata
- **WorkflowStep**: Individual workflow steps with rich n8n node data and teaching content
- **WorkflowTeachingGuide**: Project-level documentation and learning materials
- **NodeUsageStats & NodeDocumentation**: Service tracking and setup guides
- **UserSiteCredentials & AvailableSite**: Portfolio sites with credential management

### Key Patterns

1. **Authentication**: Uses Clerk with middleware protection. Admin access controlled via `ADMIN_USER_ID` environment variable
2. **Database Access**: Single Prisma client instance with singleton pattern in `utils/db.ts`
3. **Server Actions**: All database operations in `utils/actions.ts` using "use server"
4. **File Uploads**: Images handled via Supabase integration with remote patterns in next.config.ts
5. **AI Integration**: OpenAI used for workflow analysis and content generation in API routes

### Directory Structure

- `app/` - Next.js App Router with nested layouts
  - `admin/` - Admin-only pages (protected by middleware)
  - `dashboard/` - User dashboard and profile management
  - `workflow/[slug]/` - Individual workflow pages
  - `api/` - API routes for workflow analysis and portfolio generation
- `components/` - Organized by feature with shadcn/ui base components
- `utils/` - Server actions, database client, schemas, and helper functions
- `prisma/` - Database schema and migrations

### Custom Component Organization

Components are organized by feature in subdirectories:
- `(custom)/(dashboard)/` - Dashboard-specific components
- `(custom)/(landing)/` - Landing page components
- `(custom)/(coding-steps)/` - Workflow step visualization
- `ui/` - Base shadcn/ui components

### Environment Requirements

- `DATABASE_URL` & `DIRECT_URL` - PostgreSQL connection
- `NEXT_PUBLIC_CLERK_*` - Clerk authentication
- `ADMIN_USER_ID` - Admin user identification
- `NEXT_PUBLIC_SUPABASE_*` - Supabase configuration
- `OPENAI_API_KEY` - AI integration

### Image Configuration

Remote image patterns configured for:
- `img.clerk.com` (user avatars)
- `ojjueyxpbmimmdstdrai.supabase.co` (uploaded images)
- `via.placeholder.com` & `images.pexels.com` (placeholder images)

## Testing & Type Checking

This project uses TypeScript with strict configuration. Always run type checking after making changes:
- TypeScript compilation happens automatically during build
- Use `npm run lint` for ESLint checks
- Database schema changes require `npx prisma generate` after modifications