import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaperBrowser, { Paper } from "@/components/PracticePapers";

const papers: Paper[] = [
  { id: "pyq-1", title: "Foundation May 2025 - Paper 1: Principles of Accounting", subject: "Accounting", year: "May 2025", level: "Foundation", pages: 16 },
  { id: "pyq-2", title: "Foundation May 2025 - Paper 2: Business Laws", subject: "Law", year: "May 2025", level: "Foundation", pages: 14 },
  { id: "pyq-3", title: "Foundation Nov 2024 - Paper 1: Principles of Accounting", subject: "Accounting", year: "Nov 2024", level: "Foundation", pages: 16 },
  { id: "pyq-4", title: "Foundation Nov 2024 - Paper 3: Quantitative Aptitude", subject: "Quantitative Aptitude", year: "Nov 2024", level: "Foundation", pages: 18 },
  { id: "pyq-5", title: "Inter May 2025 - Paper 1: Advanced Accounting", subject: "Accounting", year: "May 2025", level: "Intermediate", pages: 20 },
  { id: "pyq-6", title: "Inter May 2025 - Paper 2: Corporate Laws", subject: "Law", year: "May 2025", level: "Intermediate", pages: 18 },
  { id: "pyq-7", title: "Inter Nov 2024 - Paper 3: Cost & Management Accounting", subject: "Cost Accounting", year: "Nov 2024", level: "Intermediate", pages: 22 },
  { id: "pyq-8", title: "Inter Nov 2024 - Paper 5: Auditing & Assurance", subject: "Auditing", year: "Nov 2024", level: "Intermediate", pages: 20 },
  { id: "pyq-9", title: "Final May 2025 - Paper 1: Financial Reporting", subject: "Financial Reporting", year: "May 2025", level: "Final", pages: 24 },
  { id: "pyq-10", title: "Final May 2025 - Paper 2: Strategic Financial Management", subject: "SFM", year: "May 2025", level: "Final", pages: 22 },
  { id: "pyq-11", title: "Final Nov 2024 - Paper 3: Advanced Auditing", subject: "Auditing", year: "Nov 2024", level: "Final", pages: 26 },
  { id: "pyq-12", title: "Final Nov 2024 - Paper 6: Risk Management", subject: "Risk Management", year: "Nov 2024", level: "Final", pages: 20 },
  { id: "pyq-13", title: "Foundation May 2024 - Paper 4: Business Economics", subject: "Economics", year: "May 2024", level: "Foundation", pages: 14 },
  { id: "pyq-14", title: "Inter May 2024 - Paper 6: Financial Management", subject: "Financial Management", year: "May 2024", level: "Intermediate", pages: 22 },
];

const PYQ = () => (
  <div className="min-h-screen">
    {/* <Navbar /> */}
    <section className="bg-primary py-12">
      <div className="container">
        <h1 className="text-center text-3xl font-bold text-primary-foreground">Previous Year Questions <span className="text-accent">(PYQ)</span></h1>
        <p className="mt-2 text-center text-sm text-primary-foreground/50">Comprehensive PYQ bank organized by subject and difficulty</p>
      </div>
    </section>
    <PaperBrowser title="Previous Year Questions" subtitle="Browse, bookmark, and download PYQs sorted by chapter and difficulty." papers={papers} accentLabel="200+ Papers" />
    <Footer />
  </div>
);

export default PYQ;
