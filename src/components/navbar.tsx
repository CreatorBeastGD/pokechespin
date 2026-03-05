
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

    useEffect(() => {
        const doubleFriendshipBonusStorage = localStorage.getItem("doubleFriendshipBonus");
        const customBladeBoostAmountStorage = localStorage.getItem("customBladeBoostAmount");
        const showAllPokemonAsShinyStorage = localStorage.getItem("showAllPokemonAsShiny");
        const showAllGmaxStorage = localStorage.getItem("showAllGmax");
        const customPokemonToRankingsStorage = localStorage.getItem("customPokemonToRankings");
        const showCustomPokemonOnRankingsStorage = localStorage.getItem("showCustomPokemonOnRankings");
        const showOnlyCustomPokemonOnRankingsStorage = localStorage.getItem("showOnlyCustomPokemonOnRankings");

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
        localStorage.setItem("doubleFriendshipBonus", "false");
        localStorage.setItem("customBladeBoostAmount", "0.1");
        localStorage.setItem("showAllPokemonAsShiny", "false");
        localStorage.setItem("showAllGmax", "false");
        localStorage.setItem("customPokemonToRankings", "");
        localStorage.setItem("showCustomPokemonOnRankings", "false");
        localStorage.setItem("showOnlyCustomPokemonOnRankings", "false");
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
                        <ScrollArea className="h-[80vh]">
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
                            <SheetTitle>Customization</SheetTitle>
                            <div className="flex flex-col ">
                                <label className="text-sm">Show all Pokémon as shiny</label>
                                <div className="flex items-center space-x-2">
                                    <input checked={showAllPokemonAsShiny} onChange={(e) => ChangeShowAllPokemonAsShiny(e.target.checked)} type="checkbox" id="doubleFriendshipBonus" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Pokémon have a 100% chance to be shiny instead of 1/4096.
                                    </p>
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