import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react";
import BuyMeACoffeeIcon from "@/components/buy-me-a-coffee";

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
  title: "Pokémon GO Damage Calculator | PokéChespin",
  description: "Calculate the damage output of your Pokémon in Pokémon GO! Simulate battles and raids, and find out the best moveset for your Pokémon.",
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
            <p className="text-white text-lg">Loading Pokémon GO Damage Calculator...</p>
        </div>
        }>
          {children}
        </Suspense>
        <div className="flex flex-col items-center justify-center space-x-3 mt-4 mb-4">
          <p className="textslate text-xs text-center w-1/2 text-left">
            CreatorBeastGD is not affiliated with Niantic, Inc., The Pokémon Company, or Nintendo. Pokémon and Pokémon character names are trademarks of Nintendo.
          </p>
          <p className="textslate text-lg text-center w-1/2 text-left mt-2">
            If you enjoy this page, consider supporting me by buying me a cooffee, or helping me if you find any discrepancy in the data. I'll try to do my best to fix it as soon as possible.
          </p>
          <p className="textslate text-xs text-center w-1/2 text-right mb-2 mt-2">
            2025 CreatorBeastGD.
          </p>
          <div className="flex flex-row  space-x-2 bg-black p-2 rounded-lg text-white bg-black text-xs w-1/2 border-2 border-white border-opacity-10">
            <a href="https://buymeacoffee.com/creatorbeastgd" className="flex flex-row items-center justify-center"><BuyMeACoffeeIcon/>
              <p>Buy me a Chespin!</p>
            </a>
          </div>
          <p className="textslate text-xs text-center w-1/2 text-right mb-2 mt-2">
            Thanks for 1000 views! 🎉
          </p>
        </div>
        <Analytics />
        
      </body>
    </html>
  );
}


// <Analytics /> disabled due to limitations