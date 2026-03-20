"use client"
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Scale, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: "By accessing or using CA Study Hub, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service."
    },
    {
      icon: Scale,
      title: "User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
    },
    {
      icon: FileText,
      title: "Content and Materials",
      content: "All study materials, mock tests, and content provided on the platform are for educational purposes only. You may not reproduce, distribute, or commercially exploit any content without permission."
    },
    {
      icon: AlertCircle,
      title: "Limitation of Liability",
      content: "CA Study Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent/10 mb-4">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: March 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-sm max-w-none text-muted-foreground mb-8"
          >
            <p>
              Welcome to CA Study Hub. These Terms of Service govern your use of our platform and 
              provide important information about your rights and obligations as a user.
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
            className="mt-8 space-y-4"
          >
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to modify these terms at any time. We will notify users of 
                  any material changes via email or through the platform. Continued use of the 
                  service after changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For questions about these Terms, please contact us at{" "}
                  <a href="mailto:legal@castudyhub.in" className="text-accent hover:underline">
                    legal@castudyhub.in
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
