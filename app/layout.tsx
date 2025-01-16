import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react";
import Image from "next/image";

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
  title: "Pokémon GO Damage Calculator",
  description: "Calculate the damage output of your Pokémon in Pokémon GO!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={
          
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
            <p className="text-white text-lg">Loading...</p>
        </div>
        }>
          {children}
        </Suspense>
        
        <Analytics />
      </body>
    </html>
  );
}
