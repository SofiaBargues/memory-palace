import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "@/components/navBar";
import { Footer } from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Memory Palace",
  description: "Use the Loci method to memorize anything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`grid min-h-screen grid-rows-[auto_1fr_auto] ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        <div className="w-full bg-[#f9fafe]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
