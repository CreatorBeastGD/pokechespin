
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import Image from "next/image";
import { Suspense } from "react";
import BuyMeACoffeeIcon from "@/components/buy-me-a-coffee";
import CookieBanner from "@/components/cookie-banner";
import Navbar from "@/components/navbar";

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
  icons: {
    icon: "/favicon.ico",
  }
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
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
            <p className="text-white text-lg">Loading Pokémon GO Damage Calculator...</p>
        </div>
        }>
          {children}
        </Suspense>
        <div className="flex flex-col items-center justify-center space-y-3 mt-4 mb-4">
          <p className="textslate text-xs w-1/2 justify-center text-center px-4">
            CreatorBeastGD is not affiliated with Niantic, Inc., The Pokémon Company, or Nintendo. Pokémon and Pokémon character names are trademarks of Nintendo.
          </p>
          <p className="textslate text-xs w-1/2 justify-center text-center px-4">
            If you enjoy this page, consider supporting me by buying me a cooffee, or helping me if you find any discrepancy in the data. I'll try to do my best to fix it as soon as possible.
          </p>
          <p className="textslate text-xs w-1/2 justify-center text-center px-4">
            Pokémon GO API used: <a className="link" href="https://github.com/pokemon-go-api/pokemon-go-api">mario6700-pogo</a> and <a className="link" href="https://www.pokebattler.com">PokéBattler</a>
          </p>
          <p className="textslate text-xs w-1/2 justify-center text-center px-4">
            2025 CreatorBeastGD.
          </p>
          <div className="flex flex-row  space-x-2 bg-black p-2 rounded-lg text-white bg-black text-xs w-1/2 border-2 border-white border-opacity-10">
            <a href="https://buymeacoffee.com/creatorbeastgd" className="flex flex-row items-center justify-center"><BuyMeACoffeeIcon/>
              <p>Buy me a Chespin!</p>
            </a>
          </div>
          
        </div>
        <Analytics />
      </body>
    </html>
  );
}


// <Analytics /> disabled due to limitations