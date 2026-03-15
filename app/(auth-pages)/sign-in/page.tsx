"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { signInWithGoogle } from "@/app/actions";

const SignIn = () => {
  return (
    // 1. Added relative, overflow-hidden, and bg-white to the main wrapper
    <div className="relative flex h-[calc(100vh-0rem)] items-center justify-center overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8 w-full">
      
      {/* 2. Background Decorative Triangles */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        {/* Large top-right primary diagonal */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -right-[10%] -top-[10%] h-[60vh] w-[60vw] bg-primary/5 [clip-path:polygon(100%_0,0_0,100%_100%)] md:-right-[5%] md:-top-[5%] md:h-[70vh] md:w-[50vw]"
        />

        {/* Medium bottom-left primary diagonal */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-[10%] -left-[10%] h-[50vh] w-[50vw] bg-primary/10 [clip-path:polygon(0_100%,0_0,100%_100%)] md:-bottom-[5%] md:-left-[5%] md:h-[60vh] md:w-[40vw]"
        />

        {/* Small floating accent triangle */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [15, 20, 15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] top-[25%] h-16 w-16 bg-primary/20 [clip-path:polygon(50%_0%,0%_100%,100%_100%)] md:left-[20%]"
        />
      </div>

      {/* 3. Added relative and z-10 to bring the card above the background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <span className="text-base font-bold text-accent-foreground">CA</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Study Hub
          </span>
        </Link>

        {/* Optional: Added bg-white/90 and backdrop-blur to the Card so the background shapes peek through slightly */}
        <Card className="w-full border-accent/20 bg-white/95 backdrop-blur-sm shadow-card transition-all duration-300 hover:shadow-card-hover">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to access your study dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form action={signInWithGoogle}>
              <Button
                type="submit"
                variant="outline"
                className="w-full gap-3 py-6 text-base font-medium shadow-sm transition-all duration-300 border-accent hover:bg-accent/5 hover:text-accent"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <span className="cursor-pointer underline">Terms of Service</span> and{" "}
              <span className="cursor-pointer underline">Privacy Policy</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignIn;