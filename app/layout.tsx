import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Providers } from "@/components/providers";
import QueryProvider from "@/components/QueryProvider";

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

const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

import { ConditionalLayout } from "@/components/ConditionalLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`} suppressHydrationWarning>
      <body className="font-sans">
          <main className="flex flex-col items-center">
            <QueryProvider>
              <Providers>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </Providers>
            </QueryProvider>
          </main>
      </body>
    </html>
  );
}
