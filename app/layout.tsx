import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/footer";
import { Providers } from "@/components/providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Lovable App",
//   description: "Lovable Generated Project",
//   openGraph: {
//     title: "Lovable App",
//     description: "Lovable Generated Project",
//     type: "website",
//     images: ["https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8dbe06b8-1cff-4cd6-814f-a328cf366376/id-preview-b181a41b--b598085a-6916-4624-83d9-26387e76e236.lovable.app-1771310227309.png"],
//   },
//   twitter: {
//     card: "summary_large_image",
//     site: "@Lovable",
//     title: "Lovable App",
//     description: "Lovable Generated Project",
//     images: ["https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8dbe06b8-1cff-4cd6-814f-a328cf366376/id-preview-b181a41b--b598085a-6916-4624-83d9-26387e76e236.lovable.app-1771310227309.png"],
//   },
// };

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>
       
          <main className="flex flex-col items-center">
              <Providers>
                <div className="w-full flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-1 w-full flex flex-col">
                    {children}
                  </div>
                </div>
                 
                
              </Providers>
          </main>
        
      </body>
    </html>
  );
}
