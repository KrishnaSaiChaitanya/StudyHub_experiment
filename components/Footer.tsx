import { LogoElement } from "@/assets/logo";
import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5 h-16 w-16">
          <LogoElement />
        </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            India's all-in-one platform for Chartered Accountancy students.
          </p>
        </div>
        {[
          { 
            title: "Platform", 
            links: [
              { name: "Study", href: "/study" },
              { name: "Practice", href: "/practice" },
              { name: "Faculty", href: "/faculty" },
              { name: "Community", href: "/community" }
            ] 
          },
          { 
            title: "Resources", 
            links: [
              { name: "MTP Papers", href: "/study" },
              { name: "RTP Papers", href: "/study" },
              { name: "PYQ Bank", href: "/study" },
              { name: "Mock Tests", href: "/practice/mock-exams" }
            ] 
          },
          { 
            title: "Support", 
            links: [
              { name: "Help Center", href: "/help-center" },
              { name: "Contact Us", href: "/contact-us" },
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms", href: "/terms" }
            ] 
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 CA Study Hub. All rights reserved.
      </div> */}
    </div>
  </footer>
);

export default Footer;
