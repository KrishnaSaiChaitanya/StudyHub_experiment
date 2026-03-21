import Footer from "@/components/Footer";
import PaperBrowser from "@/components/PracticePapers"; // Adjust path if needed

const MTP = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-primary py-12">
        <div className="container">
          <h1 className="text-center text-3xl font-bold text-primary-foreground">
            Mock Test Papers <span className="text-accent">(MTP)</span>
          </h1>
          <p className="mt-2 text-center text-sm text-primary-foreground/50">
            ICAI-aligned mock test papers for all levels
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <PaperBrowser 
          title="Mock Test Papers" 
          subtitle="Browse, bookmark, and download ICAI mock test papers." 
          paperType="mtp" 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default MTP;