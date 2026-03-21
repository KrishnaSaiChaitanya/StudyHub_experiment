import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaperBrowser from "@/components/PracticePapers";



const RTP = () => (
  <div className="min-h-screen">
    {/* <Navbar /> */}
    <section className="bg-primary py-12">
      <div className="container">
        <h1 className="text-center text-3xl font-bold text-primary-foreground">Revision Test Papers <span className="text-accent">(RTP)</span></h1>
        <p className="mt-2 text-center text-sm text-primary-foreground/50">Official revision test papers with detailed solutions</p>
      </div>
    </section>
     <PaperBrowser 
          title="Mock Test Papers" 
          subtitle="Browse, bookmark, and download ICAI mock test papers." 
          paperType="rtp" 
        />
    <Footer />
  </div>
);

export default RTP;
