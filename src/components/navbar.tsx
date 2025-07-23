
import React  from "react";
import { NavigationMenu, NavigationMenuList
, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink
} from "./ui/navigation-menu";
import Link from "next/link";

const Navbar = () => {
  return (
    <NavigationMenu>
        <NavigationMenuList className="bg-black text-white border-b-2 border-white border-opacity-10 rounded-lg flex flex-row justify-between items-center mb-4">
            <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                <NavigationMenuLink asChild>
                    <Link href="/pokemon-go-damage-calculator" className="text-sm">Main Menu</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                <NavigationMenuLink asChild>
                    <Link href={`/`} className="text-sm">Raids</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                <NavigationMenuLink asChild>
                    <Link href={`/dynamax`} className="text-sm">Max Battles</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                <NavigationMenuLink asChild>
                    <Link href="/whatsnew" className="text-sm">Whats New</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex items-center justify-center p-2 allign-center">
                <NavigationMenuLink asChild>
                    <Link href="/dynamax/tierlist" className="text-sm">Max Tierlists</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>

        </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;