"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Users, FileText, LayoutDashboard, Mail, CalendarDays, Video } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", exact: true, icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/contact-us", exact: false, icon: Mail, label: "Contact Us" },
  { href: "/admin/planners", exact: false, icon: BookOpen, label: "Study Planners" },
  { href: "/admin/tests", exact: false, icon: FileText, label: "Tests & MCQs" },
  { href: "/admin/practice-papers", exact: false, icon: BookOpen, label: "Practice Papers" },
  { href: "/admin/events", exact: false, icon: FileText, label: "Calendar Events" },
  { href: "/admin/exam-dates", exact: false, icon: CalendarDays, label: "Exam Dates" },
  { href: "/admin/community-submissions", exact: false, icon: Users, label: "Community Submittions" },
  { href: "/admin/faculty", exact: false, icon: Users, label: "Faculty" },
  { href: "/admin/rooms", exact: false, icon: Video, label: "Study Rooms" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-primary">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage StudyHub</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
              
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "")} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto bg-muted/20">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
