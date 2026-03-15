"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import MockExam from "@/components/MockExam";
import PerformanceHistory from "@/components/PerformanceHistory";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ClipboardCheck, Clock, Award, Lock, Crown, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";


const resources = [
  { icon: FileText, title: "Mock Test Papers (MTP)", count: "120+ Papers", description: "ICAI-aligned mock test papers for Foundation, Intermediate, and Final levels." },
  { icon: FileText, title: "Revision Test Papers (RTP)", count: "80+ Papers", description: "Official revision test papers with detailed solutions and explanations." },
  { icon: FileText, title: "Previous Year Questions", count: "200+ Papers", description: "Comprehensive PYQ bank organized by subject, chapter, and difficulty." },
  { icon: ClipboardCheck, title: "Online Mock Exams", count: "50+ Tests", description: "Full-length timed mock exams with auto-grading and performance analysis." },
];

const Practice = () => {
  const [examActive, setExamActive] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("id", session.user.id)
        .single();
        
      if (data && data.status === "active") {
        setIsSubscribed(true);
      }
    };
    
    checkSubscription();
  }, [supabase]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const res = await loadRazorpay();
      
      if (!res) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const response = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (!data.subscriptionId) {
        toast.error(data.error || "Could not initialize payment");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: "Study Hub Pro",
        description: "Monthly Premium Subscription",
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Subscription activated successfully!");
            setIsSubscribed(true);
            setShowPaywall(false);
          } else {
            toast.error(verifyData.error || "Payment verification failed");
          }
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (showPerformance) {
    return (
      <div className="w-full">
        <PerformanceHistory onBack={() => setShowPerformance(false)} />
        <Footer />
      </div>
    );
  }

  if (examActive) {
    return (
      <div className="w-full">
        <MockExam onExit={() => setExamActive(false)} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background w-full">
      <main className="py-12">
      <section className="bg-primary py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
            <h1 className="text-4xl font-bold text-primary-foreground">Practice & <span className="text-gradient-blue">Excel</span></h1>
            <p className="mt-4 text-sm text-primary-foreground/50">Access MTPs, RTPs, PYQs, and take mock exams to sharpen your skills.</p>
          </motion.div>
        </div>
      </section>
      <section className="container py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((res, i) => (
            <motion.div
              key={res.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <res.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{res.title}</h3>
                  <span className="text-xs font-medium text-accent">{res.count}</span>
                </div>
              </div>
              <p className="mt-3 flex-1 text-xs text-muted-foreground">{res.description}</p>
              <Button variant="outline" size="sm" className="mt-4 w-full text-xs">Browse Papers</Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-12 overflow-hidden rounded-xl bg-primary p-8 text-center"
        >
          {/* Lock overlay when not subscribed */}
          {!isSubscribed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-primary/80 backdrop-blur-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/30 bg-accent/10">
                <Lock className="h-7 w-7 text-accent" />
              </div>
              <Badge className="mt-4 bg-accent/20 text-accent border-accent/30">
                <Crown className="mr-1 h-3 w-3" /> Premium Feature
              </Badge>
              <p className="mt-3 max-w-xs text-sm font-medium text-primary-foreground">
                Unlock full mock exams with a Pro subscription
              </p>
              <Button
                size="lg"
                onClick={() => setShowPaywall(true)}
                className="mt-4 bg-accent text-accent-foreground shadow-accent hover:bg-accent/90"
              >
                <Sparkles className="mr-2 h-4 w-4" /> Upgrade to Pro
              </Button>
            </div>
          )}

          <Award className="mx-auto h-8 w-8 text-accent" />
          <h3 className="mt-4 text-xl font-bold text-primary-foreground">Take a Full Mock Exam</h3>
          <p className="mt-2 text-xs text-primary-foreground/50">Simulate real CA exam conditions with timed, full-length tests.</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-primary-foreground/40">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 30 Minutes</span>
            <span>10 Questions</span>
            <span>Instant Results</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => isSubscribed ? setExamActive(true) : setShowPaywall(true)} className="bg-accent text-accent-foreground shadow-accent hover:bg-accent/90">Start Mock Exam</Button>
            <Button size="lg" variant="outline" onClick={() => setShowPerformance(true)} className="border-accent/30 text-accent hover:bg-accent/10">View My Performance</Button>
          </div>
        </motion.div>

        {/* Paywall Modal */}
        <AnimatePresence>
          {showPaywall && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              onClick={() => setShowPaywall(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl"
              >
                <button onClick={() => setShowPaywall(false)} className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary">
                  <X className="h-4 w-4" />
                </button>

                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/30">
                    <Crown className="h-8 w-8 text-accent" />
                  </div>
                </div>

                <h2 className="mt-5 text-center text-2xl font-bold text-card-foreground">Upgrade to Pro</h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">Unlock the full potential of CA StudyHub</p>

                {/* Pricing */}
                <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-5 text-center">
                  <span className="text-4xl font-bold text-card-foreground">₹499</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                  <p className="mt-1 text-xs text-muted-foreground">or ₹3,999/year (save 33%)</p>
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {[
                    "Unlimited full-length mock exams",
                    "Detailed performance analytics & insights",
                    "Priority access to new question banks",
                    "Ad-free study experience",
                    "Downloadable study planners & notes",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-card-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  className="mt-6 w-full bg-accent text-accent-foreground shadow-accent hover:bg-accent/90"
                  onClick={handleSubscribe}
                  disabled={true}
                >
                  <Sparkles className="mr-2 h-4 w-4" /> 
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </Button>
              
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Practice;
