import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "svgmap/dist/svgMap.min.css";
import SessionProvider from "@/utils/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Singitronic — Electronics eCommerce",
  description: "Modern electronics store powered by Next.js + Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <Providers>{children}</Providers>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
