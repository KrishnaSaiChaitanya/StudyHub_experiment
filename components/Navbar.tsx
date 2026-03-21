"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/actions";
import { LogoElement } from "@/assets/logo";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Study", path: "/study" },
  { label: "Practice", path: "/practice" },
  { label: "Faculty", path: "/faculty" },
  { label: "Community", path: "/community" },
  {label:"Pricing", path:"/pricing"}
];

const authRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  
  const [profile, setProfile] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editStudentType, setEditStudentType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndSub = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        setEditName(user.user_metadata?.full_name || "");
        const [subRes, profRes] = await Promise.all([
          supabase.from("subscriptions").select("status").eq("id", user.id).maybeSingle(),
          supabase.from("profiles").select("student_type").eq("id", user.id).maybeSingle()
        ]);
        
        setIsPro(subRes.data?.status === "active");
        setProfile(profRes.data);
        if (profRes.data?.student_type) {
          setEditStudentType(profRes.data.student_type);
        }
      } else {
        setIsPro(false);
        setProfile(null);
      }
    };

    fetchUserAndSub();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setEditName(session.user.user_metadata?.full_name || "");
        const [subRes, profRes] = await Promise.all([
          supabase.from("subscriptions").select("status").eq("id", session.user.id).maybeSingle(),
          supabase.from("profiles").select("student_type").eq("id", session.user.id).maybeSingle()
        ]);
        setIsPro(subRes.data?.status === "active");
        setProfile(profRes.data);
        if (profRes.data?.student_type) {
          setEditStudentType(profRes.data.student_type);
        }
      } else {
        setIsPro(false);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, supabase]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      if (editName !== user.user_metadata?.full_name) {
        const { data } = await supabase.auth.updateUser({
          data: { full_name: editName }
        });
        if (data?.user) {
          setUser(data.user);
        }
      }

      if (editStudentType && editStudentType !== profile?.student_type) {
        await supabase
          .from("profiles")
          .update({ student_type: editStudentType })
          .eq("id", user.id);
        
        setProfile((prev: any) => ({ ...prev, student_type: editStudentType }));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const renderUserPopover = (mobile = false) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-2 text-sm font-medium text-foreground bg-secondary/50 hover:bg-secondary/70 transition-colors border border-border ${
          mobile ? "px-3 py-2 rounded-lg w-full text-left" : "px-3 py-1.5 rounded-full"
        }`}>
          <User className="h-4 w-4 text-accent shrink-0" />
          <span className="truncate flex-1 text-left">
            {user?.user_metadata?.full_name || user?.email || "User"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" sideOffset={8}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Profile Settings</h4>
            <p className="text-sm text-muted-foreground">
              Update your details and view your plan.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-3 items-center gap-4 text-sm mt-2">
              <Label htmlFor={`name-${mobile ? 'mobile' : 'desktop'}`}>Name</Label>
              <Input
                id={`name-${mobile ? 'mobile' : 'desktop'}`}
                value={editName}
                className="col-span-2 h-8"
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4 text-sm">
              <Label htmlFor={`level-${mobile ? 'mobile' : 'desktop'}`}>Level</Label>
              <div className="col-span-2">
                <Select value={editStudentType} onValueChange={setEditStudentType}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button size="sm" onClick={handleSaveProfile} disabled={isSaving} className="mt-2 w-full">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          
          <div className="border-t border-border pt-4">
            <h4 className="font-medium leading-none text-sm mb-3">Current Plan</h4>
            {isPro ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Pro Plan Active</span>
                <Crown className="h-4 w-4 text-accent" />
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Free Plan</span>
                </div>
                <Link href="/pricing" className="w-full text-foreground hover:text-foreground">
                  <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-transparent transition-all">
                    Upgrade to Pro <Crown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  if (authRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 h-16 w-16">
          <LogoElement />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.filter((i) => i.path === "/pricing" ? !isPro : true).map((item) => {
            const isActive = item.path === "/" ? pathname === "/" || pathname === "/dashboard" :pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative px-4 py-2 text-sm font-semibold transition-colors"
                prefetch={false}
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

        <div className="hidden items-center gap-3 md:flex !font-semibold">
          {user ? (
            <>
              {isPro && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-accent-foreground bg-accent rounded-full shadow-sm whitespace-nowrap">
                  <Crown className="h-3.5 w-3.5" />
                  PRO
                </div>
              )}
              {renderUserPopover(false)}
              <form action={signOutAction}>
                <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-muted-foreground !font-semibold">Log in</Button>
              </Link>
              <Link href="/sign-in" prefetch={false}>
                <Button size="sm" className="bg-accent text-accent-foreground shadow-accent hover:bg-accent/90 !font-semibold">
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
              prefetch={false}
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
                {renderUserPopover(true)}
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
              <Link href="/sign-in" prefetch={false} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">Log in</Button>
              </Link>
              <Link href="/sign-in" prefetch={false} onClick={() => setMobileOpen(false)}>
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
