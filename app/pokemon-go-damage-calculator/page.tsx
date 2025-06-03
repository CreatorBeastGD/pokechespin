"use client"

import CookieBanner from "@/components/cookie-banner";
import { PoGoAPI } from "../../lib/PoGoAPI";


export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
            <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
            <h1 className="title">Pokémon GO Damage Calculator | PokéChespin <span className="text-lg">v{PoGoAPI.getVersion()}</span></h1>
            <p className="text-white text-lg">Calculate the damage output of your Pokémon in Pokémon GO! Simulate battles and raids, and find out the best moveset for your Pokémon.</p>
            <a href={"https://pokemongo-damage-calculator.vercel.app/"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Go to PokéChespin for Raids
                </button>
            </a>
            <a href={"https://pokemongo-damage-calculator.vercel.app/dynamax"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Go to PokéChespin for Max Battles
                </button>
            </a>
            <a href={"https://pokemongo-damage-calculator.vercel.app/whatsnew"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  See what's new!
                </button>
            </a>
            <div>
                <p className="italic p-4">Thanks <a className="link" href="https://www.reddit.com/user/soraliink/">u/soraliink</a>, Gerkenator and Someone for you donations! ♥️</p>
            </div>
            <CookieBanner />
        </div>
        
    );
}
