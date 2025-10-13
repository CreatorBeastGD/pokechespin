"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import Navbar from "@/components/navbar";
import Image from "next/image";

const novedades = [
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
        title: "v1.25",
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
        date: "2025-08-21"
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
        title: "v1.24",
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
        title: "v1.22",
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
        title:"v1.21",
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
        title: "v1.20",
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
		title: "v1.18",
		desc: "+ Added this page.\n hey folks! make sure you read the notice below this one. :)",
		date: "2025-05-18",
	},
	{
		title: "Max Battles Notice",
		desc: "Hi! I am aware of the new Max Battle mechanics regarding targeted attacks dealing double the damage as well as the dodging reduction. I prefer waiting for a bit longer to check if this change is definitive or not.",
		date: "2025-05-18",
	},{
		title: "v1.17.6",
		desc: "+ Added Zacian and Zamazenta' Max moves for Max Battles.\nThese moves are selectable when selecting 'Giganamax Zacian Crowned Sword' or 'Giganamax Zamazenta Crowned Shield' as the attacker, and will have the same stats as a Steel Type GMax move.",
		date: "2025-05-15",
	},{
		title: "v1.17.5.1",
		desc: "+ Fixed HP r+emaining on Max Battle Simulator. \n+ Tweaked damage reduction on targeted moves.",
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
        title: "v1.17",
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
        title: "v1.16",
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
							<Card key={idx}>
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