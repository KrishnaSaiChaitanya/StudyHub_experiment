"use client"
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { icon: BookOpen, value: "500+", label: "Resources" },
  { icon: Users, value: "10K+", label: "Students" },
  { icon: Trophy, value: "95%", label: "Pass Rate" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      {/* Blue glow */}
      <div className="absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container relative z-10 py-24 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
              Your CA Journey Starts Here
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl"
          >
            All-in-One Platform for{" "}
            <span className="text-gradient-blue">CA Students</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-primary-foreground/50"
          >
            Study smarter with curated resources, mock tests, expert faculty, and a thriving community — everything you need to crack CA exams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/sign-in">
            <Button size="lg" className="bg-accent text-accent-foreground shadow-accent hover:bg-accent/90">
              Start Studying Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
            <Link href="#feature-section">
            <Button size="lg" variant="outline" className="border-primary-foreground/15 text-black bg-white">
              Explore Features
            </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mt-20 grid max-w-md grid-cols-3 gap-8"
          
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-accent" />
              <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="mt-1 text-xs text-primary-foreground/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        <div id="feature-section"/>
      </div>
    </section>
  );
};

export default HeroSection;
