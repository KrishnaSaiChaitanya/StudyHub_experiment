import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaperBrowser, { Paper } from "@/components/PracticePapers";

const papers: Paper[] = [
  { id: "mtp-1", title: "MTP Foundation - Paper 1: Principles of Accounting", subject: "Accounting", year: "May 2025", level: "Foundation", pages: 18 },
  { id: "mtp-2", title: "MTP Foundation - Paper 2: Business Laws", subject: "Law", year: "May 2025", level: "Foundation", pages: 14 },
  { id: "mtp-3", title: "MTP Foundation - Paper 3: Quantitative Aptitude", subject: "Quantitative Aptitude", year: "May 2025", level: "Foundation", pages: 16 },
  { id: "mtp-4", title: "MTP Foundation - Paper 4: Business Economics", subject: "Economics", year: "May 2025", level: "Foundation", pages: 12 },
  { id: "mtp-5", title: "MTP Inter Group I - Paper 1: Advanced Accounting", subject: "Accounting", year: "May 2025", level: "Intermediate", pages: 22 },
  { id: "mtp-6", title: "MTP Inter Group I - Paper 2: Corporate Laws", subject: "Law", year: "May 2025", level: "Intermediate", pages: 20 },
  { id: "mtp-7", title: "MTP Inter Group I - Paper 3: Cost & Management Accounting", subject: "Cost Accounting", year: "Nov 2024", level: "Intermediate", pages: 24 },
  { id: "mtp-8", title: "MTP Inter Group II - Paper 5: Auditing & Assurance", subject: "Auditing", year: "Nov 2024", level: "Intermediate", pages: 18 },
  { id: "mtp-9", title: "MTP Final Group I - Paper 1: Financial Reporting", subject: "Financial Reporting", year: "May 2025", level: "Final", pages: 28 },
  { id: "mtp-10", title: "MTP Final Group I - Paper 2: Strategic Financial Management", subject: "SFM", year: "Nov 2024", level: "Final", pages: 26 },
  { id: "mtp-11", title: "MTP Final Group II - Paper 6: Risk Management", subject: "Risk Management", year: "May 2025", level: "Final", pages: 20 },
  { id: "mtp-12", title: "MTP Foundation - Paper 1: Principles of Accounting", subject: "Accounting", year: "Nov 2024", level: "Foundation", pages: 17 },
];

const MTP = () => (
  <div className="min-h-screen">
    {/* <Navbar /> */}
    <section className="bg-primary py-12">
      <div className="container">
        <h1 className="text-center text-3xl font-bold text-primary-foreground">Mock Test Papers <span className="text-accent">(MTP)</span></h1>
        <p className="mt-2 text-center text-sm text-primary-foreground/50">ICAI-aligned mock test papers for all levels</p>
      </div>
    </section>
    <PaperBrowser title="Mock Test Papers" subtitle="Browse, bookmark, and download ICAI mock test papers." papers={papers} accentLabel="120+ Papers" />
    <Footer />
  </div>
);

export default MTP;
