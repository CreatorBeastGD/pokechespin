
import React  from "react";
import { NavigationMenu, NavigationMenuList
, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink
} from "./ui/navigation-menu";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useState, useEffect } from "react";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

const Navbar = () => {

    let [doubleFriendshipBonus, setDoubleFriendshipBonus] = useState(false);
    let [customBladeBoostAmount, setCustomBladeBoostAmount] = useState(0.1);
    let [showAllPokemonAsShiny, setShowAllPokemonAsShiny] = useState(false);
    let [showAllGmax, setShowAllGmax] = useState(false);
    let [customPokemonToRankings, setCustomPokemonToRankings] = useState("");
    let [showCustomPokemonOnRankings, setShowCustomPokemonOnRankings] = useState(false);
    let [showOnlyCustomPokemonOnRankings, setShowOnlyCustomPokemonOnRankings] = useState(false);
    let [selfMegaBoost, setSelfMegaBoost] = useState(false);
    let [showDPSOnSoloRaid, setShowDPSOnSoloRaid] = useState(false);
    let [showHPOnSoloRaid, setShowHPOnSoloRaid] = useState(false);
    let [freezeRejoin, setFreezeRejoin] = useState(true);
    let [showIDs, setShowIDs] = useState(false);


    useEffect(() => {
        const doubleFriendshipBonusStorage = localStorage.getItem("doubleFriendshipBonus");
        const customBladeBoostAmountStorage = localStorage.getItem("customBladeBoostAmount");
        const showAllPokemonAsShinyStorage = localStorage.getItem("showAllPokemonAsShiny");
        const showAllGmaxStorage = localStorage.getItem("showAllGmax");
        const customPokemonToRankingsStorage = localStorage.getItem("customPokemonToRankings");
        const showCustomPokemonOnRankingsStorage = localStorage.getItem("showCustomPokemonOnRankings");
        const showOnlyCustomPokemonOnRankingsStorage = localStorage.getItem("showOnlyCustomPokemonOnRankings");
        const selfMegaBoostStorage = localStorage.getItem("selfMegaBoost");
        const showDPSOnSoloRaidStorage = localStorage.getItem("showDPSOnSoloRaid");
        const showHPOnSoloRaidStorage = localStorage.getItem("showHPOnSoloRaid");
        const freezeRejoinStorage = localStorage.getItem("freezeRejoin");
        const showIDsStorage = localStorage.getItem("showIDs");

        if (showCustomPokemonOnRankingsStorage) {
            setShowCustomPokemonOnRankings(showCustomPokemonOnRankingsStorage === "true");
        } else {
            localStorage.setItem("showCustomPokemonOnRankings", "false");
        }

        if (showOnlyCustomPokemonOnRankingsStorage) {
            setShowOnlyCustomPokemonOnRankings(showOnlyCustomPokemonOnRankingsStorage === "true");
        } else {
            localStorage.setItem("showOnlyCustomPokemonOnRankings", "false");
        }


        if (customPokemonToRankingsStorage) {
            setCustomPokemonToRankings(customPokemonToRankingsStorage);
        } else {
            localStorage.setItem("customPokemonToRankings", "");
        }

        if (showAllPokemonAsShinyStorage) {
            setShowAllPokemonAsShiny(showAllPokemonAsShinyStorage === "true");
        } else {
            localStorage.setItem("showAllPokemonAsShiny", "false");
        }

        if (showAllGmaxStorage) {
            setShowAllGmax(showAllGmaxStorage === "true");
        } else {
            localStorage.setItem("showAllGmax", "false");
        }

        if (doubleFriendshipBonusStorage) {
            setDoubleFriendshipBonus(doubleFriendshipBonusStorage === "true");
        } else {
            localStorage.setItem("doubleFriendshipBonus", "false");
        }
        if (customBladeBoostAmountStorage) {
            setCustomBladeBoostAmount(parseFloat(customBladeBoostAmountStorage));
        } else {
            localStorage.setItem("customBladeBoostAmount", "0.1");
        }

        if (selfMegaBoostStorage) {
            setSelfMegaBoost(selfMegaBoostStorage === "true");
        } else {
            localStorage.setItem("selfMegaBoost", "false");
        }

        if (showDPSOnSoloRaidStorage) {
            setShowDPSOnSoloRaid(showDPSOnSoloRaidStorage === "true");
        } else {
            localStorage.setItem("showDPSOnSoloRaid", "false");
        }

        if (showHPOnSoloRaidStorage) {
            setShowHPOnSoloRaid(showHPOnSoloRaidStorage === "true");
        } else {
            localStorage.setItem("showHPOnSoloRaid", "false");
        }

        if (freezeRejoinStorage) {
            setFreezeRejoin(freezeRejoinStorage === "true");
        } else {
            localStorage.setItem("freezeRejoin", "true");
        }

        if (showIDsStorage) {
            setShowIDs(showIDsStorage === "true");
        } else {
            localStorage.setItem("showIDs", "false");
        }
    }, []);

    let ChangeBladeBoost = (option: string) => {
        const value = parseFloat(option);
        setCustomBladeBoostAmount(value);
    }

    let ChangeShowAllPokemonAsShiny = (option: boolean) => {
        setShowAllPokemonAsShiny(option);
    }

    let ChangeDoubleFriendshipBonus = (option: boolean) => {
        setDoubleFriendshipBonus(option);
    }

    let ChangeShowAllGmax = (option: boolean) => {
        setShowAllGmax(option);
    }

    let ChangeShowCustomPokemonOnRankings = (option: boolean) => {
        setShowCustomPokemonOnRankings(option);
    }

    let ChangeShowOnlyCustomPokemonOnRankings = (option: boolean) => {
        setShowOnlyCustomPokemonOnRankings(option);
    }

    let ChangeCustomPokemonToRankings = (option: string) => {
        setCustomPokemonToRankings(option);
    }
    

    let ApplyChanges = () => {
        localStorage.setItem("doubleFriendshipBonus", doubleFriendshipBonus.toString());
        localStorage.setItem("customBladeBoostAmount", customBladeBoostAmount.toString());
        localStorage.setItem("showAllPokemonAsShiny", showAllPokemonAsShiny.toString());
        localStorage.setItem("showAllGmax", showAllGmax.toString());
        localStorage.setItem("customPokemonToRankings", customPokemonToRankings);
        localStorage.setItem("showCustomPokemonOnRankings", showCustomPokemonOnRankings.toString());
        localStorage.setItem("showOnlyCustomPokemonOnRankings", showOnlyCustomPokemonOnRankings.toString());
        localStorage.setItem("selfMegaBoost", selfMegaBoost.toString());
        localStorage.setItem("showDPSOnSoloRaid", showDPSOnSoloRaid.toString());
        localStorage.setItem("showHPOnSoloRaid", showHPOnSoloRaid.toString());
        localStorage.setItem("freezeRejoin", freezeRejoin.toString());
        localStorage.setItem("showIDs", showIDs.toString());
        // reload page
        window.location.reload();
    }

    let DefaultChanges = () => {
        setDoubleFriendshipBonus(false);
        setCustomBladeBoostAmount(0.1);
        setShowAllPokemonAsShiny(false);
        setShowAllGmax(false);
        setCustomPokemonToRankings("");
        setShowCustomPokemonOnRankings(false);
        setShowOnlyCustomPokemonOnRankings(false);
        setSelfMegaBoost(false);
        setShowDPSOnSoloRaid(false);
        setShowHPOnSoloRaid(false);
        setFreezeRejoin(true);
        setShowIDs(false);
        localStorage.setItem("doubleFriendshipBonus", "false");
        localStorage.setItem("customBladeBoostAmount", "0.1");
        localStorage.setItem("showAllPokemonAsShiny", "false");
        localStorage.setItem("showAllGmax", "false");
        localStorage.setItem("customPokemonToRankings", "");
        localStorage.setItem("showCustomPokemonOnRankings", "false");
        localStorage.setItem("showOnlyCustomPokemonOnRankings", "false");
        localStorage.setItem("selfMegaBoost", "false");
        localStorage.setItem("showDPSOnSoloRaid", "false");
        localStorage.setItem("showHPOnSoloRaid", "false");
        localStorage.setItem("freezeRejoin", "true");
        localStorage.setItem("showIDs", "false");
        localStorage.removeItem("moveOverrides");
        localStorage.removeItem("customMoveOverrides");
        localStorage.removeItem("newMoveOverrides");
        // reload page
        window.location.reload();
    }
   
    return (
        <NavigationMenu>
            <NavigationMenuList className="bg-black text-white border-b-2 border-white border-opacity-10 rounded-lg flex flex-row justify-between items-center mb-4">
                <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                    <NavigationMenuLink asChild>
                        <Link href="/pokemon-go-damage-calculator" className="text-xs">Menu</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                    <NavigationMenuLink asChild>
                        <Link href={`/`} className="text-xs">Raids</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                    <NavigationMenuLink asChild>
                        <Link href={`/dynamax`} className="text-xs">Max Battles</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                    <NavigationMenuLink asChild>
                        <Link href="/dynamax/rankings/general" className="text-xs">Max General Rankings</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                    <NavigationMenuLink asChild>
                        <Link href="/whatsnew" className="text-xs">Updates</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <Sheet>
                    <SheetTrigger className="text-xs p-2">Config</SheetTrigger>
                    
                        <SheetContent className="h-full w-full bg-black text-white border-b-2 border-white border-opacity-10 rounded-lg p-6">
                        
                        <div className="w-full">
                            <SheetHeader>
                            <SheetTitle>Configuration</SheetTitle>
                            
                            </SheetHeader>
                            
                        </div>
                        <ScrollArea className="h-[70vh]">
                        <div className="flex flex-col gap-4 mt-4 w-full">
                            <SheetDescription className="text-xs text-muted-foreground mt-2">
                                Here you can configure some settings for your calculator, such as double friendship bonus, custom AE boosts from Max Finale and more. These settings will be saved in your local storage, so they will be applied every time you use the calculator. Please note that these settings are not saved in the URL, so if you share a link with someone else, they won't see the same settings as you.
                            </SheetDescription>
                            <SheetFooter>
                                <SheetClose className="mt-4 w-full py-2 text-white bg-green-500 rounded-lg" onClick={ApplyChanges}>Apply Changes</SheetClose>
                                <SheetClose className="mt-4 w-full py-2 text-white bg-red-500 rounded-lg" onClick={DefaultChanges}>Set to Default</SheetClose>
                            </SheetFooter>
                            <Separator className="bg-white bg-opacity-10" />
                            <SheetTitle>Multipliers</SheetTitle>
                            <div className="flex flex-col w-full">
                                <label className="text-sm">Double Friendship Bonus</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={doubleFriendshipBonus} onChange={(e) => ChangeDoubleFriendshipBonus(e.target.checked)} type="checkbox" id="doubleFriendshipBonus" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Activates x2 Friendship Bonus for all Pokémon.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="customBladeBoostAmount" className="text-sm">Custom AE Boost Amount (Blade and Bash)</label>
                                <select value={customBladeBoostAmount} onChange={(e) => ChangeBladeBoost(e.target.value)} id="customBladeBoostAmount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5">
                                    <option value="0.1">x1.1 / x1.05 (Base)</option>
                                    <option value="0.2">x1.2 / x1.1</option>
                                    <option value="0.3">x1.3 / x1.15</option>
                                    <option value="0.4">x1.4 / x1.2</option>
                                    <option value="0.5">x1.5 / x1.25</option>
                                </select>
                                <SheetDescription className="text-xs text-muted-foreground mt-2">
                                    The first value (++) will be used on Raids, while the second value (+) will be used on Max Battles.
                                </SheetDescription>
                            </div>
                            <div className="flex flex-col ">
                                <label className="text-sm">Self Mega Boost</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={selfMegaBoost} onChange={(e) => setSelfMegaBoost(e.target.checked)} type="checkbox" id="selfMegaBoost" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Applies Mega Boost to your own Pokémon, making it not needed to have more than 2 players to activate.
                                    </p>
                                </div>
                            </div>  
                            
                            <Separator className="bg-white bg-opacity-10" />
                            <SheetTitle>Rankings</SheetTitle>
                            <div className="flex flex-col w-full">
                                <label className="text-sm">Show unreleased Gigantamax Pokémon</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showAllGmax} onChange={(e) => ChangeShowAllGmax(e.target.checked)} type="checkbox" id="showAllGmax" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Show all unreleased Gigantamax Pokémon on Max Rankings (Attackers)
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-sm">Show Custom Pokémon on Max Rankings</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showCustomPokemonOnRankings} onChange={(e) => ChangeShowCustomPokemonOnRankings(e.target.checked)} type="checkbox" id="showAllGmax" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Show all custom Pokémon added through the textarea below on Max Rankings.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-sm">Add Custom Pokémon to Max Rankings</label>
                                <div className="flex items-center space-x-2">
                                    <textarea defaultValue={customPokemonToRankings} onChange={(e) => ChangeCustomPokemonToRankings(e.target.value)} id="customPokemonToRankings" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5" placeholder="BULBASAUR IVYSAUR VENUSAUR_GIGANTAMAX RAYQUAZA_MEGA KYUREM_BLACK_FORM" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Write any Pokémon ID separated by spaces to add them to the Max Rankings. If an ID is invalid, it will be ignored.
                                </p>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-sm">Show Custom Pokémon only.</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showOnlyCustomPokemonOnRankings} onChange={(e) => ChangeShowOnlyCustomPokemonOnRankings(e.target.checked)} type="checkbox" id="showAllGmax" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Show all custom Pokémon added through the textarea below on Max Rankings. Only the custom Pokémon will be shown, unreleased Gigantamax Pokémon and all other Pokémon will be hidden.
                                    </p>
                                </div>
                            </div>
                            <Separator className="bg-white bg-opacity-10" />
                            <SheetTitle>Behavior</SheetTitle>
                            <div className="flex flex-col ">
                                <label className="text-sm">Rejoin freeze bug</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={freezeRejoin} onChange={(e) => setFreezeRejoin(e.target.checked)} type="checkbox" id="freezeRejoin" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Enables the 'Rejoin freeze' bug, which makes your Pokémon freeze when rejoining if the boss is casting a move, making you take that damage from the boss. This config is ON by default.
                                    </p>
                                </div>
                            </div>

                            <Separator className="bg-white bg-opacity-10" />
                            <SheetTitle>Customization</SheetTitle>
                            <div className="flex flex-col ">
                                <label className="text-sm">Show all Pokémon as shiny</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showAllPokemonAsShiny} onChange={(e) => ChangeShowAllPokemonAsShiny(e.target.checked)} type="checkbox" id="showAllPokemonAsShiny" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Pokémon have a 100% chance to be shiny instead of 1/4096.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <label className="text-sm">Show DPS on Solo Raid Simulations</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showDPSOnSoloRaid} onChange={(e) => setShowDPSOnSoloRaid(e.target.checked)} type="checkbox" id="showDPSOnSoloRaid" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Shows how many damage per second you are dealing to the boss on Solo Raid Simulations.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <label className="text-sm">Show HP values on Solo Raid Simulations</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showHPOnSoloRaid} onChange={(e) => setShowHPOnSoloRaid(e.target.checked)} type="checkbox" id="showHPOnSoloRaid" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Shows the current HP values of the active Pokémon on Solo Raid Simulations.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <label className="text-sm">Show IDs on Pokémon and Moves</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showIDs} onChange={(e) => setShowIDs(e.target.checked)} type="checkbox" id="showIDs" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Shows the IDs of Pokémon and moves on Pokémon options.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <label className="text-sm">Go to PokéChespin Editor</label>
                                <div className="space-x-2">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Redirects you to PokéChespin Editor, where you will be able to edit moves, Pokémon movesets, and create new moves.
                                    </p>
                                    <div className="flex items-center space-x-2 mx-2">
                                        <SheetClose className="w-full mx-2 text-xs bg-green-500 p-2 rounded-lg" onClick={() => window.location.href = "/editor"}>Go to Editor</SheetClose>
                                    </div>
                                </div>
                            </div>      
                        </div>
                    </ScrollArea>
                    </SheetContent>
                </Sheet>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default Navbar;