"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import Navbar from "@/components/navbar";
import Image from "next/image";

const novedades = [
    {
        title: "🎂 One Year of PokéChespin 🎂",
        desc: "PokéChespin is one year old today! 🎉\n"+
                "One year ago, I had the idea of starting a dumb project since I've learnt a bit of web development on my career, and I was curious of how damage calculations worked, so I started this.\n"+
                "Nowhere in my dreams I though this project would grow that much, thank you all for your support, I really hope you like this and find it useful!\n"+
                "I wish to keep improving it and adding more features in the future to keep helping y'all!\n"+
                "Thank you so much, and happy one year anniversary to PokéChespin (and new year 2026)! 🎉🎂",

        date: "🎂 2025-12-31",
    },
    {
        title: "v1.36.5.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Regirock.\n"+
                ">>>>>> T5 Max Battles have had their attack rate increased:\n"+
                ">>>>>>>>> Large moves: from 8.5s to 6.5s of preparation\n"+
                ">>>>>>>>> Target moves: from 9.5s to 7.5s of preparation\n"+
                ">>>>>> T5 Max Battles have had their Energy Gain Multiplier increased from x2 to x4!",
        date: "2026-04-14",
    },
    
    {
        title: "v1.36.4",
        desc: "+ Added a confirmation button on 'Relobby' button on the Solo Raider Simulator to avoid accidental relobbies.\n"+
                "+ Added a new 'Include unreleased Gigantamax Pokémon on General Ranking Calculations' config to PokéChespin!\n"+
                ">>>>>> Now you can choose to include unreleased Gigantamax Pokémon on General Ranking calculations, making all Attacker and Tank rankings vary greatly! (This calculates against all 33 Gigantamax Pokémon.)\n",
        date: "2026-04-12",
    },
    {
        title: "v1.36.3 (ALL Pokémon on Max Rankings!)",
        desc: "+ Added a new config, called 'Import ALL Pokémon'\n"+
                ">>>>>> This new config allows you to import all Pokémon available on the PokeBattler API to the Max Rankings, allowing you to check how good they are as attackers and defenders in Max Battles!\n"+
                ">>>>>> This option overwrites your Custom Pokémon list with +1000 Pokémon. This option WILL make every ranking page load much slower, so use this option at your own risk.",
        date: "2026-04-08",
    },
    {
        title: "v1.36.2.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Trapinch, Vibrava, Flygon.\n",
        date: "2026-04-06",
    },
    {
        title: "v1.36.2",
        desc: "~ Improvements on the Solo Raider in Raids.\n"+
                ">>>>>> Added the 'Energy Resolve Bug' to the simulator, you can decide if using it or not!\n"+
                ">>>>>> Added the slider of 'Relobby Time' to that section to avoid confusions.\n"+
                "+ Deleted (yes, i did delete those...) some texts related to the random simulator.",
        date: "2026-04-04",
    },
    {
        title: "v1.36.1",
        desc: "~ Small improvements and bugfixes to the Solo Raider in Raids.\n"+
                ">>>>>> Now, the correct message will show when you defeat a boss at timeout.\n"+
                ">>>>>> You now can relobby mid-move.\n",
        date: "2026-04-02",
    },
    {
        title: "v1.36 (PokéChespin Editor!)",
        desc: "+ Added a new 'PokéChespin Editor' page to the app!\n"+
                ">>>>>> Have you ever imagined how, for example, a Mega Rayquaza would perform with Dragon Energy and Dragon Breath? or what about making Ember be a water-type move?\n"+
                ">>>>>> Now you can do all of that and more with the new PokéChespin Editor! This new page allows you to edit existing moves, create new moves and edit Pokémon movesets, giving you the freedom to experiment with any kind of move you want and see how it performs on the damage calculator!\n"+
                ">>>>>> You can also create custom moves that will be available on the damage calculator, allowing you to test them with any Pokémon and see how they perform against different defenders!\n"+
                ">>>>>> To access the editor, just click on the 'Go to Editor' button on the Configuration section, and you will be redirected to the editor page. You can also access it directly by going to pokechespin.net/editor.\n"+
                ">>>>>> I hope you like this new feature, and I can't wait to see all the crazy moves you come up with! If you have any suggestions or find any bugs, please let me know!\n"+
                "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Gigantamax Pikachu.\n"+
                "+ Changed some stats on Tier 6 Max Battles \n"+
                ">>>>>> Gigantamax Pikachu\n >>>>>> ~ CPM: 3 -> 1.7 \n",
        date: "2026-04-01",
    },
    {
        title: "v1.35.3",
        desc: "+ Changed some features on PokéChespin for Max Battles.\n"+
                ">>>>>> The energy generation will now work as floats instead of integers. You can check how much energy you are generating in the calculator, including those decimals!\n"+
                ">>>>>> Energy Gain will have a multiplier of x2 in Tier 5 Max Battles and x15 in Gigantamax Battles.\n"+
                ">>>>>> T5 Max Battles have had their attack rate increased:\n"+
                ">>>>>>>>> Large moves: from 9.5s to 8.5s of preparation\n"+
                ">>>>>>>>> Target moves: from 10s to 9.5s of preparation\n"+
                "+ Changed some behaviour on the Solo Max Battle Simulator!\n"+
                ">>>>>> Now, landing your last Max Move of a round will consume 4.5s of the timer. In addition to that, starting the Max Phase with the same Pokémon that you had on field will add 4s to the timer.\n"+
                ">>>>>> If your active Pokémon has Max Guard active and the boss is selecting a move, it will now have a 66% of selecting its Target move.\n",
        date: "2026-03-25",
    },
    {
        title: "v1.35.2.2",
        desc: "+ Changed energy gain on Tier 5 and Tier 6 Max Battles.\n"+
                ">>>>>> Now, energy gain on Max Battles is calculated with the formula: max(1, floor((damage * multiplier) / (bossHP / 200))), where multiplier is 1 for any Max Battle, 2 for Tier 5 Max Battles and 15 for Tier 6 Gigantamax Battles.",
        date: "2026-03-25",
    },
    {
        title: "v1.35.2.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
            ">>>>>> Regice.\n"+
            "+ Changed stats on Tier 5 Max Battles \n"+
            ">>>>>> Regice\n >>>>>> ~ HP: 22500 -> 20000 \n",
            date: "2026-03-23",
    },
    {
        title: "v1.35.2",
        desc: "+ Added a new 'Rejoin freeze bug' config to PokéChespin!\n"+
                ">>>>>> 'Rejoin freeze bug': Enables the 'Rejoin freeze' bug, which makes your Pokémon freeze when rejoining if the boss is casting a move, making you take that damage from the boss. This config is ON by default.\n"+
                "+ Several bug-fixes and improvements to the Solo Raid simulator.\n"+
                "Special thanks to SpiritedBloom, Jay258 and DarKnight for your help testing the Solo Raid Simulator and giving me feedback to improve it!\n",
        date: "2026-03-19",

    },
    {
        title: "v1.35.1 ",
        desc: "+ Added new configs related to Raids to the 'Configuration' sheet to PokéChespin!\n"+
                ">>>>>> 'Show HP values on Solo Raid Simulations' config: Shows the current HP values of the active Pokémon on Solo Raid Simulations.\n"+
                ">>>>>> 'Show DPS on Solo Raid Simulations' config: Shows how many damage per second you are dealing to the boss on Solo Raid Simulations.\n"+
                ">>>>>> 'Self Mega Boost' config: Shows the boost received by the attacker when using a Mega Evolution on Solo Raid Simulations.\n",
        date: "2026-03-17",
    },
    {
        title: "v1.35 (Solo Raid player!)",
        desc: "+ Added 'Solo Raid Player' mode to PokéChespin for Raids!\n"+
                ">>>>>> Now you can simulate a raid with any attacker you want, controlling its actions turn by turn, just like on the Solo Max Battle Simulator!\n"+
                "If you find any issues with this, let me know!\n",
        date: "2026-03-16",

    },
    {
        title: "v1.34 (PokéChespin for Raids overhaul!)",
        desc: "+ Changed 'PokéChespin for Raids' to look similar to the Max Battles page. This includes the following changes:\n"+
                ">>>>>> + Added the possibility to select up to 6 attackers per team, simulating a real Raid team.\n"+
                ">>>>>>>>> This enables the posibility to simulate raids with multiple different attackers!\n"+
                ">>>>>> + Added a new 'Mega Boost' selector, showing the impact of Mega Evolutions on all calculations (even non-same type attacks!).\n"+
                ">>>>>> ~ The mega boost received on a simulation will be dependant of the Mega Evolution selected on the attackers, and will only apply if more than 1 player is simulated.\n"+
                ">>>>>> ~ Moved the 'Friendship' bonus to the 'Results' section.\n"+
                "Even with this change, most of the previous links are compatible with this update."+
                "...Well, one step closer to a Solo Raid Player with this change...",
        date: "2026-03-14",
    },
    {
        title: "v1.33.0.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Pikachu. (Oh whoops forgot about Raichu)\n",
        date: "2026-03-09",
    },
    {
        title: "v1.33 (Your Custom Pokémon List on Max Rankings!)",
        desc: "+ Added a new 'Custom Pokémon in Max Rankings' config to PokéChespin!\n"+
                ">>>>>> Now you can choose to show custom Pokémon that are not currently available in Max Battles on the Max Rankings, allowing you to check how good they are as attackers and defenders in Max Battles!\n"+
                ">>>>>> You can choose to show all custom Pokémon, or only the ones you have added yourself on the 'Custom Pokémon' textarea.\n"+
                "+ Added 'Show all Pokémon as shiny' config to PokéChespin!\n"+
                ">>>>>> Now you can choose to show all Pokémon as shiny on PokéChespin, allowing you to see how they look as shiny while checking their rankings!\n",
        date: "2026-03-05",
    },
    {
        title: "v1.32 (Configurable Bonuses!)",
        desc: "+ Added a new 'Configurations' button and sheet to PokéChespin!\n"+
                  ">>>>>> Now you can adjust the values of some bonuses, such as double friendship or Behemoth Blade/Bash boost, reflecting their changes on some events (like Max Finale or certain seasons).\n"+
              "- Option 'Standard Gigantamax Battle' has been removed from Max Battle Mode selector on Max Rankings.\n"+
              "~ Maybe some other configurations comming soon... Who knows?",
        date: "2026-03-05",
    },
    {
        title: "v1.31.2",
        desc: "+ Added new options to Max Rankings page!\n"+
                ">>>>>> You can now toggle between using Dynamax Cannon adventure effect or not, showing differences on attacker and HP% tank rankings.\n"+
                ">>>>>> You can select how many shields a tank has on the rankings.",
        date: "2026-03-03",

    },
    {
        title: "v1.31.1",
        desc: "+ Fixed some wrong types on new Mega Pokémon from ZA.\n"+
                " + Fixed a bug with Eternatus Eternamax showing multiple times on dropdowns.\n",
        date: "2026-03-01",
    },
    {
        title: "v1.31.0.1",
        desc: "- Removed 'Shadow' forms from all Pokémon dropdowns on Max Battles.\n"+
              "~ If a shadow is selected as an attacker in Raids, it will adjust the shadow bonus automatically.",
        date: "2026-02-23",
    },
    {
        title: "v1.31 (Super Mega Raids, beta until more is known about them...)",
        desc: "+ Improved Super Mega Raids behaviour on Raids.\n"+
                ">>>>>> A Super Mega Raid boss will enrage once it reaches 80% of its max HP, and will be subdued once it receives a certain amount of charged moves from mega attackers. One player can only contribute once.\n"+
                ">>>>>> When a Super Mega Raid boss enrages, it gets a defense multiplier of x4 (subject to change in the future)\n"+
                ">>>>>> When a Super Mega Raid boss subdues, it loses 20% of its max HP (subject to change in the future)\n"+
                "~ Fixed a bug where changing a bonus of a pokemon in Raids would abnormally change the weather.",
        date: "2026-02-22",
    },
    {
        title: "v1.30.3",
        desc: "+ Added Super Mega Raids (25000HP) \n"+
            "Shield and enrage behaviour are not yet implemented for these raids. Stay tuned!",
        date: "2026-02-21",
    },
    {
        title: "v1.30.2.5",
        desc: "+ Changed stats on Tier 6 Max Battles \n"+
                ">>>>>> Gigantamax Meowth\n >>>>>> ~ HP: 100000 -> 80000 \n"+
                ">>>>>> ~ CPM: 0.85 -> 3 (what the hell) \n",
        date: "2026-02-16",
    },
    {
        title: "v1.30.2.4",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Growlithe, Arcanine.\n",
        date: "2026-02-08",
    },
    {
        title: "v1.30.2.3",
        desc: "+ Changed stats on Tier 5 Max Battles \n"+
                ">>>>>> Ho-Oh\n >>>>>> ~ HP: 36000 -> 25000 \n"+
                ">>>>>> ~ CPM: 0.75 -> 0.7 \n",
        date: "2026-02-02",
    },
    {
        title: "v1.30.2.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Ho-Oh.\n"+
                "I wont be able to add it on Saturday so... there you go!\n",
        date: "2026-01-29",
    },
    {
        title: "v1.30.2.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Roggenrola, Boldore, Gigalith.\n",
        date: "2026-01-26",

    },
    {
        title: "v1.30.2",
        desc: "~ Minor bug fixes and improvements to the Solo Max Battle Simulator.\n",
        date: "2026-01-19",
    },
    {
        title: "v1.30.1",
        desc: "~ Some changes in the Solo Max Battle Simulator UI were made.\n",
        date: "2026-01-17",
    },
    {
        title: "v1.30 (Play a Solo Max Battle!)",
        desc: "+ Added 'Play Max Battle Simulation (One Member Only)' mode to PokéChespin for Max Battles!\n"+
                ">>>>>> Now you can simulate a Max Battle with only one team member, controlling the actions of that member!\n"+
                ">>>>>> You can choose between Fast Move, Charged Move, Dodging and Switching Pokémons!\n"+
                ">>>>>> This mode is perfect to practice any future (or past) challenge with ANY pokémon you want!\n",
        date: "2026-01-16",
    },
    {
        title: "v1.29.2",
        desc: "+ Updated behaviour on custom dynamax battles\n"+
                ">>>>>> Now, if the defender Pokémon is a Gigantamax (or Eternamax Eternatus), it will have the same timers as GMax battles.\n"+
                "+ Changed some stats of Tier 6 Max Battles \n"+
                " >>>>> Cinderace Gigantamax\n"+
                " >>>>>> ~ HP: 90000 -> 80000\n"+
                " >>>>> Snorlax Gigantamax\n"+
                " >>>>>> ~ HP: 100000 -> 135000\n"+
                " >>>>> Venusaur Gigantamax\n"+
                " >>>>>> ~ HP: 80000 -> 90000\n"+
                " >>>>> Charizard Gigantamax\n"+
                " >>>>>> ~ HP: 80000 -> 70000\n"+
                " >>>>> Blastoise Gigantamax\n"+
                " >>>>>> ~ HP: 80000 -> 75000\n"+
                " >>>>> Gengar Gigantamax\n"+
                " >>>>>> ~ HP: 80000 -> 70000\n"+
                " >>>>> Toxtricity Gigantamax\n"+
                " >>>>>> ~ HP: 160000 -> 100000\n"+
                " >>>>>> ~ CPM: 0.85 -> 0.9\n",
        date: "2026-01-13",
    },
    {
        title: "v1.29.1.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Drampa.\n",
        date: "2026-01-05",
    },
    {
        title: "v1.29.1",
        desc: "+ Added 'Mind Blown' elite charged move to Blacephalon.\n"+
              "+ Added 5tl level of friendship bonus to calculations. (Since it's doubled this season, it will be x1.24 regardless of the value shown on the datamine for now.)\n",
        date: "2026-01-02",
    },
    {
        title: "v1.29.0.1",
        desc: "+ Some minor text changes.\n"+
                "+ Added a link to bosses' names on General Max Rankings page, so you can go directly to the boss rankings by clicking on its name.\n",
        date: "2025-12-31",
    },
    {
        title: "v1.29 (Most viewed Rankings!)",
        desc: "+ Added a new 'Most Viewed Rankings' section to PokéChespin!\n"+
                ">>>>>> Now you can check which Pokémon are the most viewed ones in the Max Rankings!\n"+
                ">>>>>> This feature helps you speed up your decision-making process when choosing what ranking to see, making it easier to find the most popular rankings.\n"+
                ">>>>>> Rankings are updated in real-time, so you can always see the most up-to-date information.\n"+
                ">>>>>> Check it out on the main page!",
        date: "2025-12-29",
    },
    {
        title: "v1.28.2.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Spheal, Sealeo, Walrein.\n",
        date: "2025-12-22",
    },
    {
        title: "v1.28.2.1",
        desc: "+ Changed stats of Tier 6 Max Battles \n"+
                " >>>>> Gigantamax Snorlax\n"+
                " >>>>>> ~ HP: 100000 -> 135000\n",
        date: "2025-12-17",
    },
    {
        title: "v1.28.2",
        desc: "+ Made some updates to the Max Battle Simulator!"+
                "\n>>>>>> Now, when a move from the boss comes, the attacker will swap to the best tank according to the move type.\n"+
                "\n>>>>>> I'm thinking of some more updates coming to this too, stay tuned!\n",
        date: "2025-12-13",
    },
    {
        title: "v1.28.1.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Hitmonlee, Hitmonchan.\n",
        date: "2025-12-12",
    },
    {
        title: "v1.28.1.1",
        desc: "+ Updated Max Battle simulation timers.\n"+
                ">>>>>> Desperate Timer (Gigantamax): 150s -> 190s\n"+
                ">>>>>> Enrage Timer (Gigantamax): 180s -> 220s\n"+
                ">>>>>> Timeout Timer (Gigantamax): 360s -> 600s\n"+
                ">>>>>> Timeout Timer (Dynamax): 360s -> 480s\n"+
                ">>>>>> Timeout Timer (Raid T5 Dynamax): 360s -> 400s\n",
        date: "2025-12-10",
    },
    {
        title: "v1.28.1",
        desc:   "+ Added new Pokémon to Max Rankings\n"+
                " >>>>> Lugia.\n"+
                "+ Changed stats of Tier 5 Max Battles \n"+
                " >>>>> Lugia\n"+
                " >>>>>> ~ HP: 18000\n"+
                " >>>>>> ~ CPM: 0.75\n",
        date: "2025-11-29",
    },
    {
        title: "v1.28 (Custom Dynamax Battles!)",
        desc: "+ Added 'Custom Dynamax Battles' mode to PokéChespin for Max Battles!\n"+
                ">>>>>> Now you can set custom HP, CPM and Attack Multiplier for the Dynamax Bosses if you select this new kind of Max Battle!\n",
        date: "2025-11-21",
    },
    {
        title: "v1.27.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
              ">>>>> Eevee, Jolteon, Flareon, Vaporeon, Espeon, Umbreon, Glaceon, Leafeon, Sylveon.\n"+
              "+ Made some color adjustements to the type backgrounds. Now they look like the ones on Pokémon GO!\n",
        date: "2025-11-20",
    },
    {
        title: "v1.27.1",
        desc: "+ Preview bonuses are now compatible with Max Battle Breakpoints.\n",
        date: "2025-11-18",
    },
    {
        title: "v1.27 (Some small but useful features!)",
        desc: "+ Added a popover to 'Effective Attack' and 'Effective Defense' values on all search boxes, explaining how these values are calculated.\n"+
                " + Added a new '?' button nxt to the types on all search boxes, showing a table with weaknesses and resistances of the selected Pokémon.\n",
        date: "2025-11-11",
    },
    {
        title: "v1.26.1.6",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>> Gigantamax Grimmsnarl, Ralts, Kirlia, Gardevoir, Gallade.\n"+
                "+ Changed stats of Tier 6 Max Battles \n"+
                " >>>>> Gigantamax Grimmsnarl\n"+
                " >>>>>> ~ HP: 100000 -> 70000\n"+
                " >>>>>> ~ CPM: 0.85 -> 1.2\n",
        date: "2025-11-06",
    },
    {
        title: "v1.26.1.5",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>> Inkay, Malamar.\n",
        date: "2025-11-03",
    },
    {
        title: "v1.26.1.4",
        desc:   "+ Changed stats of Tier 6 Max Battles \n"+
                " >>>>> Gigantamax Garbodor\n"+
                " >>>>>> ~ HP: 160000 -> 100000\n"+
                " >>>>>> ~ atkMult: 1.4 -> 0.9\n"+
                " >>>>>> ~ CPM: 0.9 -> 1.4\n"+
                "+ Added a popover to 'Effective Attack' and 'Effective Defense' values on Defender stats of Max Battles, explaining how these values are calculated.",
        date: "2025-11-02"
    },
    {
        title: "v1.26.1.3",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>> Gigantamax Garbodor.\n"+
                "+ Changed stats of Tier 6 Max Battles \n"+
                " >>>>> Gigantamax Garbodor\n"+
                " >>>>>> ~ HP: 160000, CPM: 0.9, AtkMult: x1.4 \n"+
                " >>>>> Gigantamax Butterfree\n"+
                " >>>>>> ~ HP: 160000 -> 100000 (That was an error.) \n",
        date: "2025-11-01"
    },
    {
        title: "v1.26.1.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
              ">>>>>> Woobat, Swoobat.\n",
        date: "2025-10-27"
    },
    {
        title: "v1.26.1.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Bounsweet, Steenee and Tsareena.\n"+
               "- Aeroblast++ and Sacred Fire++ are no longer taken into account for Max Rankings for tanks in general.\n",
        date: "2025-10-13"
    },
    {
        title: "v1.26.1",
        desc: "+ Added a new switch 'Show All Gigantamax Pokemon in Attacker Rankings' on Max Rankings page. \n"+
                ">>>>>> This switch will allow you to show all Gigantamax Pokémon, including those that are not currently available in Max Battles, on the attackers overall ranking.\n"+
                ">>>>>> This will allow you to check how good are these Pokémon as attackers in Max Battles, even if they are not available yet.\n"+
                ">>>>>> Note that this will not affect the defenders overall ranking, but I may include them in the future. What do you think of that?\n",
        date: "2025-10-09"
    },
    {
        title: "v1.26.0.2",
        desc: "+ Changed stats of Tier 6 Max Battles \n"+
                ">>>>>> Gigantamax Cinderace\n >>>>>> ~ HP: 80000 -> 90000 \n"+
                "~ Fixed an issue where Eternatus could learn Hyper Beam.",
        date: "2025-10-06"
    },
    {
        title: "v1.26.0.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Duraludon.\n",
        date: "2025-09-30"
    },
    {
        title: "v1.26 (Adventure Effects!)",
        desc: "+ Added Adventure Effects to PokéChespin!\n"+
              ">>>>>> Behemoth Blade and Behemoth Bash will be available in PokéChespin for Raids with a bonus of x1.1 in Attack or Defense depending on what adventure effect you have.\n"+
              ">>>>>> Behemoth Blade, Behemoth Bash and Dynamax Cannon will be available in PokéChespin for Max Battles aswell, with a x1.05 bonus in Attack or Defense on these first two bonuses\n"+
              ">>>>>> Dynamax Cannon gives a +1 level to all max moves in Max Battles. This bonus is applied on preview values and simulations, but are not displayed on the Pokémon's info as of now.\n",
        date: "2025-09-18"
    },
    {
        title: "v1.25.0.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Abra, Kadabra, Alakazam.\n",
        date: "2025-09-14"
    },
    {
        title: "v1.25 (Shroom and Helpers Bonuses Revamp)",
        desc: "+ Changed how 'Shroom Bonus' works on Max Battles.\n"+
                ">>>>>> In the past, the shroom bonus was applied like a damage multiplier, such as weather boost or STAB.\n"+
                ">>>>>> Now, the shroom bonus is applied AFTER all damage calculation, resulting in a correct application of x2 damage.\n"+
                "+ Changed how 'Helpers Bonus' works on Max Battles.\n"+
                ">>>>>> In the past, the helper bonus oscilated between 0 and 4, representing the amount of gloves a power spot had.\n"+
                ">>>>>> Now, the helper bonus oscilates between 0 and 15, representing the amount of pokémon placed on a power spot.\n"+
                ">>>>>> It has been demonstrated that the actual amount of Pokémon placed on a power spot matters on the calculation.\n"+
                "~ Changed some visuals.\n"+
                "Thanks Moc and everyone involved in the research for your hard work to discover the real values of Helper Bonuses!\n",
        date: "2025-09-13"

    },
    {
        title: "v1.24.4.1",
        desc: "~ Changed the HP of Gigantamax Lapras from 100000 to 80000."+
              "\n~ Changed the CPM of Gigantamax Lapras from 0.34 to 0.85"+
              "\n~ Changed the Attack Multiplier of Gigantamax Lapras from 0.75 to 0.9",
        date: "2025-08-26"
    },
    {
        title: "v1.24.4",
        desc: "~ Changed the HP of Eternamax Eternatus (Eternamax Form) from 100000 to 60000."+
              "\n~ Changed the CPM of Eternamax Eternatus from 0.7 to 0.75"+
              "\n~ Changed the Attack Multiplier of Eternamax Eternatus from 1 to 0.9",
        date: "2025-08-25"
    },
    {
        title: "v1.24.3.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
              ">>>>>> Eternatus.\n"+
              "+ Added 'Max Dynamax Cannon' max move for Eternatus",
        date: "2025-08-19",
    },
    {
        title: "v1.24.3",
        desc: "+ Added a new setting on Max Rankings\n"+
                ">>>>>> Players in the Team\n"+
                ">>>>>> Now, if 'Prioritise Fastest Attacks for Tanks' option is checked, you may adjust how many players are considered in the calculation! This assumes every other team member is attacking with a 0.5s fast move.\n"+
                ">>>>>> The original tank score of affected pokémon are multiplied by the following formula: \n"+
                ">>>>>> New Tank Score = Original Tank Score * ((PIT * 2) / ((PIT-1) * 2 + (1 / fastMoveMS)))\n"+
                "Thanks u/Clovis_the13th for the suggestion!",
        date: "2025-08-12",

    },
    {
        title: "v1.24.2.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
            ">>>>>> Trubbish, Garbodor.\n",
        date: "2025-08-10",
    }, 
    {
        title: "v1.24.2.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
            ">>>>>> Omanyte, Omastar.\n",
        date: "2025-08-04",
    },
    {
        title: "v1.24.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
            ">>>>>> Gigantamax Butterfree, Kabuto, Kabutops.\n"+
            "+ Changed stats on Tier 6 Max Battles. \n"+
            ">>>>> An Attack Multiplier of 0.9 has been added to most Gigantamax Bosses. \n"+
            ">>>>> An Attack Multiplier of 0.75 has been added to Gigantamax Lapras.\n"+
            ">>>>> An Attack Multiplier of 1.2 has been added to Gigantamax Toxtricity. (and all its GMax variants.)\n"+
            ">>>>> The CPM of most Gigantamax Pokémon has been changed to 0.85.\n"+
            ">>>>> The CPM of Gigantamax Machamp has been changed to 0.8.\n"+
            ">>>>> The CPM of Gigantamax Butterfree has been changed to 0.85.\n"+
            ">>>>> The CPM of Gigantamax Inteleon has been changed to 0.9.\n"+
            ">>>>> The CPM of Gigantamax Cinderace has been changed to 0.8.\n"+
            ">>>>> The CPM of Gigantamax Rillaboom has been changed to 1.0.\n"+
            ">>>>> The CPM of Gigantamax Lapras has been changed to 0.45.\n"+
            ">>>>> The HP of most Gigantamax Pokémon has been changed to 100000HP.\n"+
            ">>>>> The HP of Gigantamax Venusaur, Charizard, Blastoise and Gengar has been changed to 80000HP.\n"+
            ">>>>> The HP of Gigantamax Butterfree has been set to 90000HP.\n"+
            ">>>>> The HP of Gigantamax Toxtricity has been set to 160000HP.\n",
        date: "2025-08-03",
    },
    {
        title: "v1.24.1.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
              ">>>>>> Latios, Latias"+
            "\n+ Changed stats on Tier 5 Max Battles. \n"+
            ">>>>>> Latios\n >>>>>> ~ CPM: 0.8 -> 0.75 \n>>>>>> ~ HP: 22500 -> 23000 \n"+
            ">>>>>> Latias\n >>>>>> ~ CPM: 0.8 -> 0.7 \n>>>>>> ~ HP: 22500 -> 25000 \n",
        date: "2025-07-25",
    },
    {
        title: "v1.24.1",
        desc: "+ Added a new Max Battle Mode: 'Raid T6 GMax Standard'. \n"+
            ">>>>>> All Max Battles under this Max Battle Mode will have the same stats, which are as follows:\n"+
            ">>>>>> - HP: 115000\n"+
            ">>>>>> - CPM: 0.765\n"+
            "+ Changed some styling on Max Rankings. Now if a Tank has its Tank Score duplicated because of configurations, it will be shown in red.\n"+
            "+ In addition to that, Large Tankiness and Target tankiness will also be duplicated if the Tank Score is duplicated.\n"+
            "I'll be tweaking some things up in the next few days, so stay tuned for that!",
        date: "2025-07-24",
    },
    {
        title: "v1.24 (General Rankings!)",
        desc: "+ Added a new 'Max General Rankings' section to PokéChespin\n"+
            ">>>>>> Used to check what Pokémon are the best average attackers and defenders in Max Battles!\n"+
            "It's still in development, so it has some aspects that can be improved yet!",
        date: "2025-07-23",
    },
    {
        title: "v1.23.1",
        desc: "+ Added a new 'Include Zamazenta - Crowned Shield's Extra Shield' option in Max Rankings.\n"+
            "+ ...If you are lucky, you might find a shiny!",
        date: "2025-07-19",
    },
    {
        title: "v1.23.0.1",
        desc: "~ Changed stats on Tier 6 Max Battles. \n"+
            ">>>>>> Gigantamax Lapras\n >>>>>> ~ HP: 90000 → 135000 \n >>>>>> ~ CPM: 0.765 → 0.34 (what is this)\n",
        date: "2025-07-19",
    },
    {
        title: "v1.23 (Some Styling!)",
        desc: "+ Added styling to types. Now they are shown with a background color and rounded corners.\n"+
              "+ Added bars to charged moves representing their energy cost.\n"+
              "+ Attacks of the boss on Max Rankings now have a box like the one showing the move selector.\n"+
              "+ Added a small dot indicator on Max Rankings indicating the type of the max move (attackers) or fast move (defenders).\n"+
              "Do you like this new style? Let me know on Discord or Reddit!",
        date: "2025-07-16",
    },
    {
        title: "v1.22.1.1",
        desc: "+ Added new Pokémon to Max Rankings\n"+
                ">>>>>> Wailmer, Wailord",
        date: "2025-07-15",
    },
    {
        title: "v1.22.1",
        desc: "+ Changed behaviour of Zamazenta Crowned Shield on Max Battle Simulator.\n"+
            ">>>>>> Zamazenta will start with one shield applied if it has Max Guard unlocked.\n"+
            ">>>>>> Zamazenta will be able to have a max of (80 * level) barrier HP.\n"+
            "+ Added extra information on how much shield HP has a Pokémon when they receive damage.",
        date: "2025-07-12",
    },
    {
        title: "v1.22.0.4 (Eternatus)",
        desc: "~ Changed Eternatus moves:\n"+
            ">>>>>> Charged moves: - Cross Poison, + Sludge Bomb, + Hyper Beam, + Dynamax Cannon\n"+
            "+ Added Dynamax Cannon stats.\n"+
            ">>>>>> * 215 power\n"+
            ">>>>>> * Dragon Type\n"+
            ">>>>>> * 100 energy cost\n"+
            ">>>>>> * 1.5s duration\n",
        date: "2025-07-09",
    },
    {
        title: "v1.22.0.3",
        desc: "+ Added new Pokémon to Max Rankings\n"+
            ">>>>>> Shuckle",
        date: "2025-07-07",
    },
    {
        title: "v1.22.0.2",
        desc: "+ Added new Pokémon to Max Rankings\n"+
            ">>>>>> Hatenna, Hattrem and Hatterene",
        date: "2025-06-16",
    },
    {
        title: "v1.22.0.1",
        desc: "~ Changed stats on Tier 6 Max Battles. \n"+
            ">>>>>> Gigantamax Inteleon\n >>>>>> ~ HP: 135000 → 100000 \n"+
            "~ Changed attack frequency on Tier 6 Max Battles. \n"+
            ">>>>>> Spread Frequency: 5s → 3s \n"+
            ">>>>>> Targeted Frequency: 7s → 5s \n"+
            "~ Changed enrage timer on Max Battles. \n"+
            ">>>>>> Enrage Timer (Dynamax): 360s → 300s \n"+
            ">>>>>> Enrage Timer (Gigantamax): 360s → 180s \n",


        date: "2025-06-14",        
    },
    {
        title: "v1.22 (Preview Bonuses!)",
        desc: "+ Added 'Preview Bonuses' to Max Battle Calculations. \n"+
        "~ Minor text adjustements.\n"+
        "- Fixed a bug on Max Battle Simulator where an attacker could receive double the energy on its first Fast Move.",
        date: "2025-06-12",
    },
    {
        title: "v1.21.0.2",
        desc: "+ Added Gigantamax Inteleon to Max Rankings \n ~ Changed stats on Tier 6 Max Battles. \n"+
            ">>>>>> Gigantamax Inteleon\n >>>>>> ~ HP: 120000 → 135000 \n"+
            ">>>>>> ~ CPM: 0.9 → 0.81\n",
        date: "2025-06-12",
    },
    {
        title: "v1.21.0.1",
        desc: "+ Added Gigantamax Cinderace to Max Rankings \n",
        date: "2025-06-07",
    },
    {
        title:"v1.21 (Max Battle Simulator Updates!)",
        desc: "+ Added new functionality to the Max Battle Simulator! \n"+
            ">>> Now, there will be Max Orbs spawning! \n"+
            ">>>>>> One Max Orb will spawn each 15s on a random member and will be claimed by that member, adding +10 energy to the Max Meter\n"+
            ">>> Dead members now will be able to cheer! This will add +25 energy each time one Max Phase is over.\n" +
            "(These new featrues cannot be disabled at the moment, might change that in a few days if you want it ^^)\n" + 
            "+ Added '+' and '-' buttons next to IVs, level and 'number of players (on raid simulator)' options"
            + "\nIf there is any issue with this new functionality, please let me know!",
        date: "2025-06-06",
    },
    {
        title: "1.20.2.1",
        desc: "~ Changed stats on Tier 6 Max Battles. \n"+
            ">>>>>> Gigantamax Cinderace\n >>>>>> ~ HP: 120000 → 80000 \n"+
            ">>>>>> ~ CPM: 0.9 → 0.72\n",
        date: "2025-06-05",
    },
    {
        title: "1.20.2",
        desc: "+ Added some new UI elements to PokéChespin." + 
        "\n>>> Now, every page shows a new navigation bar below the title, which will allow you to navigate to the main page, raids, max battles and this page." + 
        "\n>>> Clicking the title on each page will take you to the main page.",
        date: "2025-06-05",
    },
    {
        title: "v1.20.1",
        desc:"+ Added better visuals for Max Rankings! \n"+
            "- Removed double friendship bonus since Might and Mastery ended.",
        date: "2025-06-03",
    },
    {
        title: "v1.20.0.1",
        desc: "~ Changed some stats on Tier 6 Max Battles. \n>>>>>> Gigantamax Rillaboom, Gigantamax Cinderace and Gigantamax Inteleon\n >>>>>> ~ HP: 135000 → 120000 \n + Updated this project's README file, it was about time to do that...",
        date: "2025-06-02",
    },
    {
        title: "v1.20 (Import and Export for Raids and Max Battles!)",
        desc: "+ Added 'Import' and 'Export' buttons to Raids and Max Battles pages. \n>>> Exporting will copy the ID, level, IVs, attacks, bonuses and max move levels in a JSON file, which can be imported.\n>>> At the moment, these buttons are only available for attackers. \n>>> Using this functionality on PC is recommended. \n>>> This is something really new for me, so if you detect any issues with it, please let me know!",
        date: "2025-05-31",
    },
    {
        title: "v1.19.1",
        desc: "+ New default HP values and CPM for Tier 5 and Tier 6 Max Battles have been added.",
        date: "2025-05-30",
    },
    {
        title: "v1.19 (Zacian and Zamazenta)",
        desc: "+ Changed Zacian and Zamazenta' behaviour on Max Battles and Raids. \n >>> Both Pokémon have their signature charged moves available (Behemoth Blade / Behemoth Bash) \n >>> Their Max Moves are now considered as Dynamax moves (Therefore, 250/300/350 power) \n >>> Both Pokémon are now shown on Max Rankings.",
        date: "2025-05-30",
    },
    {
        title: "v1.18.1",
        desc: "+ Changed 'Avaliable Dynamax Pokémon' list for Max Rankings. From now on, i'll be maintaining this list! \n~ Fixed an issue with GMAX Inteleon not being able to select its GMax move.",
        date: "2025-05-26",
    },
    {
		title: "v1.18 (This page!)",
		desc: "+ Added this page.\n hey folks! make sure you read the notice below this one. :)",
		date: "2025-05-18",
	}
    ,{
		title: "v1.17.6",
		desc: "+ Added Zacian and Zamazenta' Max moves for Max Battles.\nThese moves are selectable when selecting 'Giganamax Zacian Crowned Sword' or 'Giganamax Zamazenta Crowned Shield' as the attacker, and will have the same stats as a Steel Type GMax move.",
		date: "2025-05-15",
	},{
		title: "v1.17.5.1",
		desc: "+ Fixed HP remaining on Max Battle Simulator. \n+ Tweaked damage reduction on targeted moves.",
		date: "2025-05-10",
	},{
        title: "v1.17.5",
        desc: "+ Added Suicune stats on Tier 5 Max Battles.\n Adjusted some values on effectivenes and Tier 5 multipler. \n+ Some texts were changed.",
        date: "2025-05-10",
    },{
        title: "v1.17.4.2",
        desc: "+ Changed Dynamax Entei stats for Tier 5 Max Battles. \n CPM: 0.7 -> 0.75 \n HP: 20000 -> 26500",
        date: "2025-04-29",
    },{
        title: "v1.17.4.1",
        desc: "+ A small tweak on Max Battle Simulation. Now after each max phase is completed, the boss' delay is restarted, and will select a different move.",
        date: "2025-04-24",
    },{
        title: "v1.17.4",
        desc: "+ changed default option of tanks on Max Rankings.",
        date: "2025-04-22"
    },{
        title: "v1.17.3",
        desc: "+New options for Max Rankings are now live. You can select if tanks are ordered by HP taken from an attack, HP% taken from an attack, or an average between these two.",
        date: "2025-04-18",
    },{
        title: "v1.17.2.1",
        desc: "+ Links support for 'prioritise fast attacks' for max rankings were added",
        date: "2025-04-09",
    },{
        title: "v1.17.2",
        desc: "+ Added the possibility to priroritise the use of fastest attacks (fast attacks with 0.5s duration) on Max Ranking page.",
        date: "2025-04-09",
    },{
        title: "v1.17.1",
        desc: "+ Changed how 'Best Tanks' are calculated, now displays damage taken from attacks rather than percent of HP left. This will indicate which mons are more valuable to power their shields up.",
        date: "2025-03-24",
    },{
        title: "v1.17 (General Best Defenders!)",
        desc: "+ Added a 'Show General Best Defenders' button to show an average tankiness score between all possible moves of a Max Boss. \n+ Changed the constraint of 'Rankings' button on dynamax page. Now it's not required to have a moveset selected for the defender. If not all moves were selected, now the best tanks in general will be shown. \n+ Minor text changes.",
        date: "2025-04-19",
    },{
        title: "v1.16.5",
        desc: "+ Max spirit healing was wrongly shown. This has been fixed.",
        date: "2025-03-17",
    },{
        title: "v1.16.4",
        desc: "+ Added weather boost compatibility on max rankings page. All older links will still have 'extreme' weather as its weather.\n+ Now only the top 5 tanks and attackers will be shown by default. User will have to press a button if it wants to check all tanks or all attackers.",
        date: "2025-03-17",
    },{
        title: "v1.16.3",
        desc: "+ Updated Raikou's CPM and HP for 5 star Max Battle",
        date: "2025-03-15",
    },{
        title: "v1.16.2",
        desc: "+ 'Large Tankiness' on rankings improved, now showing remaining HP after the best and worst case, and showing the average between them (negative values not shown, but used on the average)",
        date: "2025-03-14",
    },{
        title: "v1.16.1",
        desc: "+ Fixed the fact that ranking bosses dealt x4 damage, now they deal what they should do. \n+ Added some special effecto to 'View Ranking' button to make it check out more.",
        date: "2025-03-13",
    },{
        title: "v1.16 (Rankings Page!)",
        desc: "+ Added a 'Rankings' page to Max Battles! In this new page, you can check the best attackers and defenders for any boss you want! \n+ + Fixed an issue with breakpoints on max battles.",
        date: "2025-03-13",
    },{
        title: "v1.15",
        desc: "+ Added 'Prioritise Energy Regeneration' option on Max Battle Simulator.",
        date: "2025-03-11",
    },{
        title: "v1.14",
        desc: "+ Added Damage dealt by defender by large and targeted move information on Max Battles",
        date: "2025-03-11",
    },{
        title: "v1.13",
        desc: "+ Added shadow raids. \n+ Tweaked most of raid boss CPM due to lack of accuracy.\n+ Deleted 'Enrage' option on raid advanced simulator. \n+ Defender stats on raids should display correctly according to its raid boss CPM.\n+ Defender' stat and bonus menu disabled when user has any raid option in use.\n+ Added how much HP a pokemon will heal on max battles. This will be displayed next to Max Spirit level on a Pokémon.\n+ Fixed an issue where links wouldn't save half levels correctly.",
        date: "2025-03-10",
    },{
        title: "v1.12.3",
        desc: "+Added Friendship Bonus to Max Battles.",
        date: "2025-03-09",
    },{
        title: "v1.12.2",
        desc: "+ Changed Gigantamax Battle's CPM and HP.\n+ Doubled friendship bonuses.\n+ Full effective attack and defense are now visible on screen.",
        date: "2025-03-09",
    },{
        title: "v1.12.1",
        desc: "~ Fixed a bug where Gigantamax Urshifu couldn't have any GMax move.",
        date: "2025-03-04",
    },{
        title: "v1.12",
        desc: "+ Added Party Power to raid simulations! This option is only available if there is more than one player in the simulation.",
        date: "2025-02-22",
    },{
        title: "v1.11.2",
        desc: "~ Small tweak on tier-5 dynamax damage multiplier",
        date: "2025-02-11",
    },{
        title: "v1.11",
        desc: "+ Added the possibility to change the team size on Dynamax Simulator (from 1 to 4) \n~ Fixing some errors.\nThanks @flavioebn for your contribution!",
        date: "2025-01-30",
    },{
        title: "v1.10.2",
        desc: "+ Added Helper Bonus, Weather Boost and Shrooms Bonus to max battle simulator\n+ Added varying HP on tier-5 dmax battles (Default value is 17500 still, but Zapdos will have 13000)\n+ Added damage and defense multiplicator of 0.9 against Gmax bosses.",
        date: "2025-01-30",
    },{
        title: "v1.10.1",
        desc: "+ Improved tank score on max battle simulator.",
        date: "2025-01-30",
    },{
        title: "v1.10",
        desc: "+ Added Max Battle simulator! This option is available on /dynamax page, and you will be able to use it once you have selected all Pokémon on all members. You can select a certain strategy for each member of the group.\n+ Fixed a bug where attacks wouldn't load properly on links on /dynamax\n+ Changed gigantamax battle stats",
        date: "2025-01-27",
    },{
        title: "v1.9.3.1",
        desc: "+ Added energy gain information on attacks\n+ Fixed an error where you could use any max move on dynamax damage calculator if you selected some max move and then changed it to other pokemon.\n+ Defender Pokemon's charged moves are now saved on link.\n+ Changed tier 5 dyamax' CPM and HP (now 0.7 and 17500, was 1.4 and 20000)\n+ Added black background on 'buy me a chespin' button",
        date: "2025-01-26",
    },{
        title: "v1.9.3",
        desc: "+ Added BuyMeACoffee button to support the development of this page.",
        date: "2025-01-18",
    },{
        title: "v1.9.2",
        desc: "~ Small bug fix",
        date: "2025-01-16",
    },{
        title: "v1.9.1",
        desc: "+ Solved problem with 'clear' button and links on Dynamax page.",
        date: "2025-01-16",
    },{
        title: "v1.9",
        desc: "+ Added a new page to calculate dynamax damage. This page is work in progress, since a simulator is also planned. Max Moves can be configured, and a total of 12 Pokémon can be configured on 4 different teams. Breakpoints of attackers can be checked, and Max Moves will be displayed.\n+ Changed this project's name to PokéChespin.",
        date: "2025-01-14",
    },{
        title: "v1.8.1",
        desc: "+ Added advanced simulation config on link.",
        date: "2025-01-11",
    },{
        title: "v1.8",
        desc: "+ Added the possibility for a Defender Pokémon to enrage.\n+ Added the possibility of configuring how many members are simulating the raid.\n+ Added the possibility of setting the amount of pokémon in a team.\n+ Added the possibility of setting a custom relobby time.",
        date: "2025-01-09",
    },{
        title: "v1.7.1.1",
        desc: "+ Added shadow effect",
        date: "2025-01-07",
    },{
        title: "v1.7.1",
        desc: "+ Fixed defenderBonus not correctly being read on breakpoints.",
        date: "2025-01-06",
    },{
        title: "v1.7",
        desc: "+ Added breakpoint page, where you can check all breakpoints of any pokémon against another one.\n+ Fixed simulation bugs.",
        date: "2025-01-06",
    },{
        title: "v1.6",
        desc: "+ Added links! Now you can share your configurations with anyone!",
        date: "2025-01-05",
    },{
        title: "v1.5.3",
        desc: "~ Small tweaks",
        date: "2025-01-05",
    },{
        title: "v1.5.2",
        desc: "+ Added Ignore Relobby Time and Dodge Charged Attack flags for advanced simulation.\n+ Fixed a bug where an attacker could deal more damage if it had exactly 0HP left.\n+ Added dodge information on battle sequence.",
        date: "2025-01-05",
    },{
        title: "v1.5.1.2",
        desc: "+ Added more info on advanced simulation sequence",
        date: "2025-01-05",
    },{
        title: "v1.5.1.1",
        desc: "+ Reduced relobby time window (10s -> 8s)",
        date: "2025-01-04",
    },{
        title: "v1.5.1",
        desc: "+ Altered some delays on advanced simulation (Cooldown when faint -> 3000 > 1000)\n+ Defender health on advanced simulation fixed\n+ Added more information on result of advanced simulation",
        date: "2025-01-04",
    },{
        title: "v1.5",
        desc: "+ Added advanced simulation!\n +Weather now displaying in results.\n+ 'Normal' raid difficulty changed to 'Gym Battle'.",
        date: "2025-01-04",
    },{
        title: "v1.4.2.1",
        desc: "+ Added jumping Chespins",
        date: "2025-01-04",
    },{
        title: "v1.4.2",
        desc: "~ Fix on Megaevolutions",
        date: "2025-01-04",
    },{
        title: "v1.4.1.1",
        desc: "~ Corrected boss CP",
        date: "2025-01-04",
    },{
        title: "v1.4.1",
        desc: "- Fixed an issue with undefined names of Pikachu's",
        date: "2025-01-04",
    },{
        title: "v1.4",
        desc: "+ PokeBattler API integration\n+ Better searching",
        date: "2025-01-04",
    },{
        title: "v1.3.2",
        desc: "+ Fixed search bar, changed ho-oh and lugia's sacred fire ++ and aeroblast++ availability.",
        date: "2025-01-02",
    },{        
        title: "v1.3.1",
        desc: "~ Minor text changes",
        date: "2025-01-02",
    },{
        title: "v1.3",
        desc: "+ Added Raid Boss PC, now displayed on Defender Pokémon PC\n+ Added Stat Bonuses, such as Weather Boost (x1.2), Shadow Pokémon Boost (x1.2), Mega Boost (x1.3) and Friendship Level (x1.03, x1.05, x1.07, x1.1)\n+ Added additional text info on time to defeat using fast and charged attacks simulation\n- Fixed an issue where Mega Raids would have 300 seconds instead of 180 seconds.\n- Fixed an issue where Shedinja could have 0 effective stamina.\n- Fixed an issue where IVs would interferee on raid boss stats.\n? Weather Boost can be set different on Attacker Pokémon and Defender Pokémon",
        date: "2025-01-02",
    },{
        title: "v1.2",
        desc: "+ Added raid bosses functionality (It may not display completely accurate stats, needs further investigation)",
        date: "2025-01-02",
    },{
        title: "v1.1",
        desc: "+ Alternate forms of Pokémon now showing on the app\n+ Added special moves: Dragon Ascent, Roar of Time, Spacial Rend, Aeroblast+, Aeroblast++, Sacred Fire+, Sacred Fire++, Moongeist Beam, Sunseel Strike\n+ Fixed issue where Dialga and Palkia don't show their basic forme asset\n+ Added some simple styling",
        date: "2025-01-01",
    },{
        title: "v1.0",
        desc: "+ Initial release of the app\n+ Welcome to Pokémon GO Damage Calculator!",
        date: "2024-12-31",
    },
];

export default function WhatsNewPage() {
	return (
		<div className="flex flex-col flex-row items-center justify-center space-y-4">
			<div className="flex flex-row items-center justify-center space-x-4">
				<Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
				<a href="/pokemon-go-damage-calculator">
                    <h1 className="mb-10 title">PokéChespin News <span className="text-lg">v{PoGoAPI.getVersion()}</span></h1>
                </a>
				<Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
			</div>
            <p className="linktext">
				Made by{" "}
				<a
					className="link"
					href="https://github.com/CreatorBeastGD"
				>
					CreatorBeastGD
				</a>
			</p>
            <Navbar/>
			<div className="flex justify-center min-h-screen py-8 px-8">
				<div className="w-full">
					<div className="space-y-4">
						{novedades.map((item, idx) => (
							<Card key={idx} className={idx === 0 ? "type-fairy" : ""}>
								<CardHeader>
									<div className="flex justify-between items-center">
										<h2 className="text-xl font-semibold">{item.title}</h2>
										<span className="text-sm text-muted-foreground">
											{item.date}
										</span>
									</div>
								</CardHeader>
								<CardContent>
                                {item.desc.replace(/> ?/g, "\u00A0").split("\n").map((line, i) => (
                                    <p key={i} className="text-sm text-muted-foreground mb-2">
                                    {line}
                                    </p>
                                ))}
                                </CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}