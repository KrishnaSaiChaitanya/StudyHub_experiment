import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
              <span className="text-xs font-bold text-accent-foreground">CA</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Study Hub</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            India's all-in-one platform for Chartered Accountancy students.
          </p>
        </div>
        {[
          { title: "Platform", links: ["Study", "Practice", "Faculty", "Community"] },
          { title: "Resources", links: ["MTP Papers", "RTP Papers", "PYQ Bank", "Mock Tests"] },
          { title: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 CA Study Hub. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
