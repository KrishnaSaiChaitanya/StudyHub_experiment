# CA StudyHub 📚

CA StudyHub is a modern, high-performance platform designed for Chartered Accountancy (CA) students in India. It centralizes study materials, practice tests, flashcards, and community discussions into a single intuitive interface.

## 🚀 Features

- **Resource Library:** Access and upload Study Planners, MTPs, RTPs, and PYQs.
- **Mock Exams & Performance Tracking:** Interactive tests with real-time scoring and historical performance tracking.
- **Community Forums:** Subject-specific groups, Q&A, and study rooms with Google Meet integration.
- **Flashcards:** Create, organize, and study custom flashcard decks.
- **SPOM Tracker:** Track Self-Paced Online Modules progress.
- **Admin Dashboard:** Comprehensive content management, user moderation, and faculty management.

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS
- **UI Components:** Shadcn UI, Radix UI
- **Database & Auth:** Supabase (PostgreSQL), Supabase SSR
- **Payments:** Razorpay Integration
- **Deployment:** Vercel / Hetzner (Coolify)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- Supabase project

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/krishnasaichaitanya/ca_studyhub.git](https://github.com/krishnasaichaitanya/ca_studyhub.git)
   cd ca_studyhub

```

2. **Install dependencies:**
```bash
npm install

```


3. **Environment Variables:**
Create a `.env.local` file in the root directory and add your Supabase and Razorpay credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

```


4. **Run the development server:**
```bash
npm run dev

```


Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

## 🏗 Project Architecture

* `/app` - Next.js App Router pages and API routes.
* `/components` - Reusable React components (divided by feature).
* `/utils` - Utility functions, Supabase clients, and type definitions.
* `/assets` & `/public` - Static assets and images.

```