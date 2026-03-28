"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, Users, FileText, LayoutDashboard, Mail, 
  CalendarDays, Video, Menu, X 
} from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoElement } from "@/assets/logo";

const navItems = [
  { href: "/admin", exact: true, icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/contact-us", exact: false, icon: Mail, label: "Contact Us" },
  { href: "/admin/planners", exact: false, icon: BookOpen, label: "Study Planners" },
  { href: "/admin/tests", exact: false, icon: FileText, label: "Tests & MCQs" },
  { href: "/admin/practice-papers", exact: false, icon: BookOpen, label: "Practice Papers" },
  { href: "/admin/events", exact: false, icon: FileText, label: "Calendar Events" },
  { href: "/admin/exam-dates", exact: false, icon: CalendarDays, label: "Exam Dates" },
  { href: "/admin/community-submissions", exact: false, icon: Users, label: "Community Submissions" },
  { href: "/admin/faculty", exact: false, icon: Users, label: "Faculty" },
  { href: "/admin/rooms", exact: false, icon: Video, label: "Study Rooms" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper component to render links, keeping code DRY for both mobile and desktop navs
  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="flex flex-col gap-2 mt-4">
      {navItems.map((item) => {
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href);
          
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
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
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* === Desktop Sidebar === */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="pb-4 border-b border-border flex items-center justify-center gap-4">
            <LogoElement height={40} width={40} />
          <h2 className="text-xl font-bold text-center tracking-tight text-primary">Admin Panel</h2>
        </div>
        <NavLinks />
      </aside>

      {/* === Mobile Overlay & Sidebar === */}
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Drawer */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-6 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <LogoElement height={40} width={40} />
            <h2 className="text-xl font-bold tracking-tight text-primary">Admin Panel</h2>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks isMobile />
      </aside>

      {/* === Main Content Area === */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <LogoElement height={40} width={40} />
            <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted/20">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}