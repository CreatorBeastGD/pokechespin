
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

const Navbar = () => {

    let [doubleFriendshipBonus, setDoubleFriendshipBonus] = useState(false);
    let [customBladeBoostAmount, setCustomBladeBoostAmount] = useState(0.1);

    useEffect(() => {
        const doubleFriendshipBonusStorage = localStorage.getItem("doubleFriendshipBonus");
        const customBladeBoostAmountStorage = localStorage.getItem("customBladeBoostAmount");

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

    let ChangeDoubleFriendshipBonus = (option: boolean) => {
        setDoubleFriendshipBonus(option);
    }

    let ApplyChanges = () => {
        localStorage.setItem("doubleFriendshipBonus", doubleFriendshipBonus.toString());
        localStorage.setItem("customBladeBoostAmount", customBladeBoostAmount.toString());

        // reload page
        window.location.reload();
    }

    let DefaultChanges = () => {
        setDoubleFriendshipBonus(false);
        setCustomBladeBoostAmount(0.1);
        localStorage.setItem("doubleFriendshipBonus", "false");
        localStorage.setItem("customBladeBoostAmount", "0.1");

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
                    <SheetContent className="bg-black text-white border-b-2 border-white border-opacity-10 rounded-lg">
                        <SheetHeader>
                        <SheetTitle>Configuration</SheetTitle>
                        <SheetDescription>
                            Here you can configure some settings for your calculator, such as double friendship bonus, custom AE boosts from Max Finale and more. These settings will be saved in your local storage, so they will be applied every time you use the calculator. Please note that these settings are not saved in the URL, so if you share a link with someone else, they won't see the same settings as you.
                        </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex items-center space-x-2">
                                <input checked={doubleFriendshipBonus} onChange={(e) => ChangeDoubleFriendshipBonus(e.target.checked)} type="checkbox" id="doubleFriendshipBonus" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2" />
                                <label className="text-sm">Double Friendship Bonus</label>
                            </div>
                            <div className="flex space-x-2 flex-col">
                                <label htmlFor="customBladeBoostAmount" className="text-sm">Custom AE Boost Amount (Blade and Bash)</label>
                                <select value={customBladeBoostAmount} onChange={(e) => ChangeBladeBoost(e.target.value)} id="customBladeBoostAmount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5">
                                    <option value="0.1">x1.1 / x1.05 (Base)</option>
                                    <option value="0.2">x1.2 / x1.1</option>
                                    <option value="0.3">x1.3 / x1.15</option>
                                    <option value="0.4">x1.4 / x1.2</option>
                                    <option value="0.5">x1.5 / x1.25</option>
                                </select>
                                <SheetDescription className="mt-2">
                                    The first value (++) will be used on Raids, while the second value (+) will be used on Max Battles.
                                </SheetDescription>
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose className="mt-4 w-full py-2 text-white bg-primary rounded-lg" onClick={ApplyChanges}>Apply Changes</SheetClose>
                            <SheetClose className="mt-4 w-full py-2 text-white bg-primary rounded-lg" onClick={DefaultChanges}>Set to Default</SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default Navbar;