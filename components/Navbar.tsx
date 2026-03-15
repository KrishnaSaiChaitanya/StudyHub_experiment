"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/actions";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Study", path: "/study" },
  { label: "Practice", path: "/practice" },
  { label: "Faculty", path: "/faculty" },
  { label: "Community", path: "/community" },
];

const authRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndSub = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("id", user.id)
      .maybeSingle()
          
        setIsPro(data?.status === "active");
      } else {
        setIsPro(false);
      }
    };

    fetchUserAndSub();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("subscriptions")
          .select("status")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data }) => setIsPro(data?.status === "active"));
      } else {
        setIsPro(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, supabase]);

  if (authRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-accent-foreground">CA</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Study Hub
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                <span className={isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {isPro && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-accent-foreground bg-accent rounded-full shadow-sm whitespace-nowrap">
                  <Crown className="h-3.5 w-3.5" />
                  PRO
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground bg-secondary/50 rounded-full border border-border">
                <User className="h-4 w-4 text-accent" />
                <span className="max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email || "User"}
                </span>
              </div>
              <form action={signOutAction}>
                <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-muted-foreground">Log in</Button>
              </Link>
              <Link href="/sign-in">
                <Button size="sm" className="bg-accent text-accent-foreground shadow-accent hover:bg-accent/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-background px-4 pb-4 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium ${
                pathname === item.path ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              {isPro && (
                <div className="mt-4 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-accent-foreground bg-accent rounded-lg shadow-sm justify-center">
                  <Crown className="h-4 w-4" />
                  PRO PLAN ACTIVE
                </div>
              )}
              <div className={`${isPro ? 'mt-2' : 'mt-4'} mb-2 flex flex-col gap-2`}>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-secondary/50 rounded-lg border border-border">
                  <User className="h-4 w-4 text-accent" />
                  <span className="truncate">
                    {user.user_metadata?.full_name || user.email || "User"}
                  </span>
                </div>
                <form action={signOutAction}>
                  <Button variant="ghost" size="sm" type="submit" className="w-full justify-start text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">Log in</Button>
              </Link>
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-accent text-accent-foreground">Get Started</Button>
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
