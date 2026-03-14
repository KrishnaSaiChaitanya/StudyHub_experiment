"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Study", path: "/study" },
  { label: "Practice", path: "/practice" },
  { label: "Faculty", path: "/faculty" },
  { label: "Community", path: "/community" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Log in</Button>
          </Link>
          <Link href="/sign-in">
            <Button size="sm" className="bg-accent text-accent-foreground shadow-accent hover:bg-accent/90">
              Get Started
            </Button>
          </Link>
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
          <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="mt-2 w-full bg-accent text-accent-foreground">Get Started</Button>
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
