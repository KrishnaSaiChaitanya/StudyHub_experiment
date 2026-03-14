"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FacultyProfile from "@/components/FacultyProfile";
import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const facultyList = [
  { name: "CA Parveen Sharma", subject: "Accounting", rating: 4.9, students: "15K+", level: "Intermediate" },
  { name: "CA Sanjay Khemka", subject: "Taxation", rating: 4.8, students: "12K+", level: "Final" },
  { name: "CA Aarti Lahoti", subject: "Audit & Assurance", rating: 4.9, students: "10K+", level: "Final" },
  { name: "CA Bhanwar Borana", subject: "Cost & Management", rating: 4.7, students: "8K+", level: "Intermediate" },
  { name: "CA Abhishek Bansal", subject: "Law", rating: 4.8, students: "9K+", level: "Intermediate" },
  { name: "CA Vinod Gupta", subject: "Financial Mgmt", rating: 4.9, students: "11K+", level: "Final" },
];

const Faculty = () => {
  const [selectedFaculty, setSelectedFaculty] = useState<typeof facultyList[0] | null>(null);

  return (
    <div className="w-full">
      <Navbar />
      {selectedFaculty ? (
        <FacultyProfile faculty={selectedFaculty} onBack={() => setSelectedFaculty(null)} />
      ) : (
        <>
          <section className="bg-primary py-20">
            <div className="container">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
                <h1 className="text-4xl font-bold text-primary-foreground">Expert <span className="text-gradient-blue">Faculty</span></h1>
                <p className="mt-4 text-sm text-primary-foreground/50">Connect with India's top CA educators.</p>
              </motion.div>
            </div>
          </section>
          <section className="container py-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {facultyList.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-accent/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {f.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-card-foreground">{f.name}</h3>
                  <p className="text-xs text-accent">{f.subject} · {f.level}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" />{f.rating}</span>
                    <span>{f.students} students</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-4 w-full text-[11px]" onClick={() => setSelectedFaculty(f)}>
                    <User className="mr-1 h-3 w-3" />Profile
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Faculty;
