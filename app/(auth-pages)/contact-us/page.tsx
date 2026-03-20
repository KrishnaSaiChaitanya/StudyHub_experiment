"use client"
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 py-16">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent/10 mb-4">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Contact Us</h1>
            <p className="text-muted-foreground">We'd love to hear from you. Reach out anytime.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" rows={5} placeholder="Tell us more about your query..." />
                    </div>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Card className="border-border/60">
                <CardContent className="p-4 flex items-start gap-3">
                  <Mail className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-sm text-muted-foreground">support@castudyhub.in</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 flex items-start gap-3">
                  <Phone className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-sm text-muted-foreground">
                      123 Study Hub Tower<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
