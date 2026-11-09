import { PoGoAPI } from "../../lib/PoGoAPI";
import Image from "next/image";
import { PBPokemonData } from "./PokemonData";


export function Announcement()
{
    const currentDate = new Date();
    let isActive = true;
    if (currentDate > new Date("2026-11-15T23:59:59Z")) {
        isActive = false; // Don't render the announcement if the current date is after November 15, 2026
    }
    return (
        isActive && (
            <div className="mx-4 bg-steel text-black p-4 rounded-lg mb-4 border border-dragon border-4 flex flex-col space-y-2">
                <p className="font-bold">GO: Wild Area Global announcement.</p>
                <p className="text-xs">The GO: Wild Area' Global Challenge has been completed! With this, the following changes are live now in Pokémon GO.</p>
                <ul className="list-disc list-inside text-xs">
                    <li>The Crowned Dogs' Adventure Effects have been buffed to x1.4 (Raids) and x1.2 (Max Battles).</li>
                    <li>Max Orbs will now provide 20 Max Energy when claimed in Max Battles. (x2 the original amount)</li>
                </ul>
                <p className="text-xs font-semibold">If you want these changes applied in PokéChespin, change this options in your Configurations!</p>
                <p className="text-xs">You can find these configurations under the "Multipliers" section. <span className="font-bold text-sm">Have fun on GO: Wild Area Global!</span></p>
            </div>
        )
    );
}