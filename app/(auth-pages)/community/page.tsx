"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, MessageCircle, Compass, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  { icon: Users, title: "Group Study Sessions", description: "Join live study rooms with fellow aspirants. Collaborate on tough topics and stay motivated.", cta: "Find a Group" },
  { icon: MessageCircle, title: "Discussion Forum", description: "Post questions, share insights, and get answers from peers and mentors.", cta: "Join Discussions" },
  { icon: Compass, title: "Career Guidance", description: "Get mentorship from qualified CAs. Explore articleship and career paths.", cta: "Get Guidance" },
  { icon: TrendingUp, title: "Leaderboard", description: "Compete on mock tests, study streaks, and community contributions.", cta: "View Rankings" },
];

const Community = () => (
  <div className="w-full">
    <Navbar />
    <section className="bg-primary py-20">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-bold text-primary-foreground">Join the <span className="text-gradient-blue">Community</span></h1>
          <p className="mt-4 text-sm text-primary-foreground/50">Connect, collaborate, and grow with thousands of CA aspirants.</p>
        </motion.div>
      </div>
    </section>
    <section className="container py-16">
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <s.icon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-card-foreground">{s.title}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">{s.description}</p>
            <Button size="sm" className="mt-5 bg-accent text-accent-foreground hover:bg-accent/90">{s.cta}</Button>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Community;
