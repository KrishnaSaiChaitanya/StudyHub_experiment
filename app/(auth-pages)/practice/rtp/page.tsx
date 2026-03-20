import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaperBrowser, { Paper } from "@/components/PracticePapers";

const papers: Paper[] = [
  { id: "rtp-1", title: "RTP Foundation - Paper 1: Principles of Accounting", subject: "Accounting", year: "May 2025", level: "Foundation", pages: 32 },
  { id: "rtp-2", title: "RTP Foundation - Paper 2: Business Laws", subject: "Law", year: "May 2025", level: "Foundation", pages: 28 },
  { id: "rtp-3", title: "RTP Foundation - Paper 3: Quantitative Aptitude", subject: "Quantitative Aptitude", year: "May 2025", level: "Foundation", pages: 26 },
  { id: "rtp-4", title: "RTP Foundation - Paper 4: Business Economics", subject: "Economics", year: "Nov 2024", level: "Foundation", pages: 24 },
  { id: "rtp-5", title: "RTP Inter Group I - Paper 1: Advanced Accounting", subject: "Accounting", year: "May 2025", level: "Intermediate", pages: 36 },
  { id: "rtp-6", title: "RTP Inter Group I - Paper 2: Corporate Laws", subject: "Law", year: "May 2025", level: "Intermediate", pages: 30 },
  { id: "rtp-7", title: "RTP Inter Group II - Paper 5: Auditing & Assurance", subject: "Auditing", year: "Nov 2024", level: "Intermediate", pages: 34 },
  { id: "rtp-8", title: "RTP Inter Group II - Paper 6: Financial Management", subject: "Financial Management", year: "Nov 2024", level: "Intermediate", pages: 28 },
  { id: "rtp-9", title: "RTP Final Group I - Paper 1: Financial Reporting", subject: "Financial Reporting", year: "May 2025", level: "Final", pages: 42 },
  { id: "rtp-10", title: "RTP Final Group I - Paper 3: Advanced Auditing", subject: "Auditing", year: "May 2025", level: "Final", pages: 38 },
];

const RTP = () => (
  <div className="min-h-screen">
    {/* <Navbar /> */}
    <section className="bg-primary py-12">
      <div className="container">
        <h1 className="text-center text-3xl font-bold text-primary-foreground">Revision Test Papers <span className="text-accent">(RTP)</span></h1>
        <p className="mt-2 text-center text-sm text-primary-foreground/50">Official revision test papers with detailed solutions</p>
      </div>
    </section>
    <PaperBrowser title="Revision Test Papers" subtitle="Browse, bookmark, and download official RTPs with solutions." papers={papers} accentLabel="80+ Papers" />
    <Footer />
  </div>
);

export default RTP;
