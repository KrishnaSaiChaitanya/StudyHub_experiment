import Link from "next/link";
import { BookOpen, Users, FileText, LayoutDashboard } from "lucide-react";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/planners", icon: BookOpen, label: "Study Planners" },
  { href: "/dashboard/tests", icon: FileText, label: "Tests & MCQs" },
  { href: "/dashboard/faculty", icon: Users, label: "Faculty" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col hidden md:flex">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Manage StudyHub</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
