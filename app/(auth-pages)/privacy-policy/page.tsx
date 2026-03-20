"use client"
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, including your name, email address, phone number, and study progress data. We also collect usage data to improve our services."
    },
    {
      icon: Lock,
      title: "How We Protect Your Data",
      content: "We implement industry-standard security measures including encryption, secure servers, and regular security audits. Your data is stored securely and access is restricted to authorized personnel only."
    },
    {
      icon: Database,
      title: "Data Usage",
      content: "Your data is used to provide personalized study recommendations, track your progress, and improve our platform. We do not sell your personal information to third parties."
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have the right to access, modify, or delete your personal data. You can request a copy of your data or ask us to remove your account at any time by contacting our support team."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* <Navbar /> */}
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent/10 mb-4">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-sm max-w-none text-muted-foreground mb-8"
          >
            <p>
              At CA Study Hub, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {sections.map((section, index) => (
              <Card key={index} className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <section.icon className="h-5 w-5 text-accent" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 rounded-xl bg-muted/50 border border-border/60"
          >
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Questions?</strong> If you have any questions about 
              this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@castudyhub.in" className="text-accent hover:underline">
                privacy@castudyhub.in
              </a>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
