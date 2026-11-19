"use client"

import { PoGoAPI } from "../../lib/PoGoAPI";
import Image from "next/image";
import { PBPokemonData } from "./PokemonData";


export function Announcement()
{
    const currentDate = new Date();
    let isActive = true;
    if (currentDate > new Date("2026-22-15T23:59:59Z")) {
        isActive = false; // Don't render the announcement if the current date is after November 15, 2026
    }
    return (
        isActive && (
            <div className="mx-4 bg-dragon text-black p-4 rounded-lg mb-4 border border-poison border-4 flex flex-row space-x-2">
                <Image
                    unoptimized
                    className={"  mb-4 mt-4  "}
                    src={"https://static.pokebattler.com/assets/pokemon/256/pm/pm890.fETERNAMAX.icon.png"}
                    alt={"Eternatus Eternamax" + " | Pokémon GO Damage Calculator"}
                    width={80}
                    height={80}
                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                />
                <div className="flex flex-col justify-center">
                    <h2 className="font-bold">Eternatus Returns... (Saturday 21st 11AM-2PM local time)</h2>
                    <p className="text-sm">
                        Eternamax Eternatus is back to Max Battles in Pokémon GO! 
                    </p>
                    <p className="text-sm">
                        Check out the <a href="http://pokechespin.net/dynamax/rankings/ETERNATUS_ETERNAMAX_FORM" className="underline font-bold text-red-200">rankings</a> to find out the best attackers and tanks to use against it!
                    </p>
                    <p className="text-lg font-bold">
                        Good luck with your battles!
                    </p>
                    
                </div>
            </div>
        )
    );
}