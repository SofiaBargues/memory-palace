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
  description:
    "Unlock your mind's potential: Use AI-guided Memory Palaces to turn information into lasting stories.",
  openGraph: {
    title: "Memory Palace",
    description:
      "Unlock your mind's potential: Use AI-guided Memory Palaces to turn information into lasting stories.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Memory Palace app preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Palace",
    description:
      "Unlock your mind's potential: Use AI-guided Memory Palaces to turn information into lasting stories.",
    images: ["/opengraph-image.png"],
  },
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
        className={`flex min-h-screen flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
