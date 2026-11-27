
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import Image from "next/image";
import { Suspense } from "react";
import { BuyMeACoffeeIcon, GitHubSponsorIcon } from "@/components/buy-me-a-coffee";
import CookieBanner from "@/components/cookie-banner";
import Navbar from "@/components/navbar";
import ServiceWorkerRegister from "@/components/sw-register";
import ThemeProvider from "@/components/theme-provider";

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
    apple: "/apple-icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2398840545137307" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >

        <ThemeProvider />
        <ServiceWorkerRegister />
        
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
            CreatorBeastGD is not affiliated with Niantic, Inc., The Pokémon Company, Scopely Explore, or Nintendo. Pokémon and Pokémon character names are trademarks of Nintendo.
          </p>
          <p className="textslate text-xs w-1/2 justify-center text-center px-4">
            If you enjoy this page, consider supporting me by buying me a coffee or sponsoring me on GitHub, or helping me if you find any discrepancy in the data. I'll try to do my best to fix it as soon as possible.
          </p>
          <p className="textslate text-xs w-1/2 justify-center text-center px-4">
            Pokémon GO API used: <a className="link" href="https://github.com/pokemon-go-api/pokemon-go-api">mario6700-pogo</a> and <a className="link" href="https://www.pokebattler.com">PokéBattler</a>
          </p>
          <p className="textslate text-xs w-1/2 justify-center text-center px-4">
            2026 CreatorBeastGD.
          </p>
          <a href="https://buymeacoffee.com/creatorbeastgd" className="flex flex-row items-center justify-center bg-black text-white md:w-1/4 w-1/2 p-3 border border-gray-500 rounded-lg">
            <BuyMeACoffeeIcon/>
            <p className="px-2">Buy me a Chespin!</p>
          </a>
          <a href="https://github.com/sponsors/creatorbeastgd" className="flex flex-row items-center justify-center bg-black text-white md:w-1/4 w-1/2 p-3 border border-gray-500 rounded-lg">
            <GitHubSponsorIcon/>
            <p className="px-2">Sponsor me on GitHub!</p>
          </a>
          
        </div>
        <Analytics />
      </body>
    </html>
  );
}


// <p className="text-red-600 text-center text-sm mt-4">Pokebattler is having issues loading data. In consequence, PokéChespin may not work as expected.</p>