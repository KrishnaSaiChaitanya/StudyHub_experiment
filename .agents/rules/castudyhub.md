---
trigger: always_on
---

### 1. AI Assistant Context File (`.cursorrules` or `.agents/rules/castudyhub.md`)

Save this file at the root of your project or in your `.agents/rules/` directory. This tells the AI exactly how to behave within your specific stack and database schema.

```markdown
# CA StudyHub - AI Assistant Rules & Context

## Project Overview
CA StudyHub is a comprehensive learning and resource-sharing platform for Chartered Accountancy (CA) aspirants. It features study planners, practice papers, flashcards, a community forum, mock exams, and SPOM (Self-Paced Online Modules) tracking.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Database/Auth:** Supabase (PostgreSQL)
- **State/Fetching:** React Query (where applicable), Server Actions
- **Editor:** Tiptap (for forums)

## Database Schema Highlights
The primary database is PostgreSQL via Supabase. Key tables include:
- `profiles`: Extends Supabase auth. Stores `student_type`, `current_streak`, and subscription status.
- `study_planners` & `community_submissions`: Pdfs/resources uploaded by admins or users.
- `practice_papers`: MTPs, RTPs, PYQs.
- `forum_posts`, `forum_replies`, `forum_groups`: Community discussion architecture.
- `flashcards`, `flashcard_sets`, `flashcard_folders`: Spaced repetition features.
- `tests`, `questions`, `test_attempts`: Mock exam infrastructure.
- `spom_content`: Tracks Self-Paced Online Modules.

## Coding Conventions & Best Practices

### 1. Next.js App Router
- Use React Server Components (RSC) by default.
- Only add `'use client'` when hooks (`useState`, `useEffect`), browser APIs, or interactivity are strictly required.
- Use **Server Actions** for all database mutations (e.g., creating a post, uploading a planner). Keep them in `app/actions.ts` or feature-specific action files (e.g., `app/admin/flash-cards/actions.ts`).

### 2. Supabase Integration
- ALWAYS use the `@supabase/ssr` package for server-side auth and data fetching.
- Utilize the utility functions in `utils/supabase/` (`server.ts`, `client.ts`, `middleware.ts`).
- Never perform direct database updates from Client Components without going through an API route or Server Action.

### 3. Styling & UI
- Use Tailwind CSS for all styling.
- Use Shadcn UI components from `components/ui/`.
- Maintain the Bento grid aesthetics and modern dark/light themes where implemented.

### 4. TypeScript
- Strictly type all Supabase responses using the generated types in `utils/supabase/types.ts`.
- Avoid `any`. Use generic types for API responses.

### 5. File Structure
- `app/(auth-pages)`: Contains routes requiring authentication.
- `components/`: Reusable UI elements.
- `utils/`: Helpers and Supabase clients.

```