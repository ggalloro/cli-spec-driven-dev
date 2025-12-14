import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Podcast Generator",
  description: "Generate personalized audio podcasts from your RSS feeds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}
      >
        <header className="w-full bg-white shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-indigo-600">Podcast Generator</h1>
           </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 w-full h-64 relative rounded-xl overflow-hidden shadow-lg">
                <Image
                    src="/hero-image.png"
                    alt="Robot Agent in TV Studio"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                   <h2 className="text-4xl font-bold text-white shadow-black drop-shadow-lg">Your Daily AI News Briefing</h2>
                </div>
            </div>
          {children}
        </main>
      </body>
    </html>
  );
}