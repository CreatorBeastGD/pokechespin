"use client"

import { PoGoAPI } from "../../lib/PoGoAPI";
import Image from "next/image";
import { PBPokemonData } from "./PokemonData";
import { useEffect, useState } from "react";


export function Announcement()
{
    const [announcement, setAnnouncement] = useState<boolean>(false);
    const promoLink = "https://pokechespin.net/player?attacker1=MEWTWO_MEGA_X&attacker_bonuses1=WINDY%2Cfalse%2Cfalse%2C0&attacker_stats1=52%2C12%2C14%2C13&defender=DARKRAI&defender_bonuses=EXTREME%2Cfalse%2Cfalse%2C0&raid_mode=raid-t5&can_dodge=false&pokemon_team_number=6&relobby_time=8&teams_number=1&party_power=false&energy_resolve_bug=false&num_pokemon=6&attacker_mega_level1=4&defender_stats=50%2C15%2C15%2C15&attacker_cinematic_attack1_2=ICE_BEAM&attacker_stats2=50%2C14%2C12%2C12&attacker_bonuses2=WINDY%2Cfalse%2Cfalse%2C0&attacker_mega_level2=3&attacker2=KYUREM_BLACK_FORM&attacker_stats3=44%2C15%2C15%2C15&attacker_bonuses3=WINDY%2Cfalse%2Cfalse%2C0&attacker_mega_level3=1&attacker3=KYUREM_BLACK_FORM&attacker_stats4=50%2C15%2C15%2C15&attacker_bonuses4=WINDY%2Cfalse%2Cfalse%2C0&attacker_mega_level4=1&attacker4=KYUREM_BLACK_FORM&attacker_stats5=40%2C15%2C15%2C15&attacker_bonuses5=WINDY%2Cfalse%2Cfalse%2C0&attacker_mega_level5=1&attacker5=KELDEO_RESOLUTE_FORM&attacker_mega_level6=1&adv_effect=none&weather=CLOUDY&attacker_fast_attack1=COUNTER_FAST&attacker_cinematic_attack1=DYNAMIC_PUNCH_PLUS_4&attacker_fast_attack2=DRAGON_TAIL_FAST&attacker_cinematic_attack2=FREEZE_SHOCK&attacker_fast_attack3=DRAGON_TAIL_FAST&attacker_cinematic_attack3=FREEZE_SHOCK&attacker_fast_attack4=DRAGON_TAIL_FAST&attacker_cinematic_attack4=FREEZE_SHOCK&attacker_fast_attack5=LOW_KICK_FAST&attacker_cinematic_attack5=SECRET_SWORD&attacker_stats6=38%2C12%2C11%2C15&attacker_bonuses6=WINDY%2Cfalse%2Cfalse%2C0&attacker6=KELDEO_RESOLUTE_FORM&attacker_fast_attack6=LOW_KICK_FAST&attacker_cinematic_attack6=SECRET_SWORD&defender_fast_attack=SNARL_FAST&defender_cinematic_attack=FOCUS_BLAST&ref=darkrai-solo-raid";

    useEffect(() => {
        const currentDate = new Date();

        let isActive = true;
        if (currentDate > new Date("2026-12-03T23:59:59Z")) {
            isActive = false; // Don't render the announcement if the current date is after November 15, 2026
        }
        setAnnouncement(isActive);
    }, []);
    return (
        announcement && (
            <div className="mx-4 bg-dark  p-4 rounded-lg mb-4 border border-red-500 border-4 flex flex-row space-x-2">
                <Image
                    unoptimized
                    className={"  mb-4 mt-4  "}
                    src={"https://static.pokebattler.com/assets/pokemon/256/pokemon_icon_491_00.png"}
                    alt={"Eternatus Eternamax" + " | Pokémon GO Damage Calculator"}
                    width={80}
                    height={80}
                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                />
                <div className="flex flex-col justify-center">
                    <h2 className="font-bold">Will you be able to win the CHALLENGE?</h2>
                    <p className="text-sm">
                        Try to defeat Darkrai in a Solo Raid using the Realtime Raid Player!
                    </p>
                    <p className="text-sm">
                        <a href={promoLink} className="underline font-bold text-red-200">Click here</a> to face it with a pre-made team of 6 Pokémon.
                    </p>
                    <p className="text-lg font-bold">
                        Have fun!
                    </p>
                    
                </div>
            </div>
        )
    );
}