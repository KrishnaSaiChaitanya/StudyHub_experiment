"use client"
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I access study materials?",
      answer: "Once you sign in, navigate to the Study section where you'll find organized resources by subject and topic. All materials are available for download or online viewing."
    },
    {
      question: "Can I track my progress?",
      answer: "Yes! Your personalized dashboard shows study hours, completed tasks, subject progress, and upcoming events. The Progress tab provides detailed analytics."
    },
    {
      question: "How do mock exams work?",
      answer: "Mock exams simulate real exam conditions with timed questions. You can access them through the Practice section. Results are saved to track your improvement over time."
    },
    {
      question: "Is the faculty available for doubt clearing?",
      answer: "Absolutely! Our faculty members are available through scheduled webinars and the Community section where you can ask questions and get expert guidance."
    },
    {
      question: "Can I use the platform on mobile?",
      answer: "Yes, CA Study Hub is fully responsive and works seamlessly on all devices including smartphones and tablets."
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
              <HelpCircle className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Help Center</h1>
            <p className="text-muted-foreground">Find answers to frequently asked questions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
