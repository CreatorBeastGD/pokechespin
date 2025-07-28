"use client"

import CookieBanner from "@/components/cookie-banner";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
            <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
            <h1 className="title">Pokémon GO Damage Calculator | PokéChespin <span className="text-lg">v{PoGoAPI.getVersion()}</span></h1>
            <p className="text-white text-lg px-4">Calculate the damage output of your Pokémon in Pokémon GO! Simulate battles and raids, and find out the best moveset for your Pokémon.</p>
            <a href={"/"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Go to PokéChespin for Raids
                </button>
            </a>
            <a href={"/dynamax"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Go to PokéChespin for Max Battles
                </button>
            </a>
            <a href={"/whatsnew"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  See what's new!
                </button>
            </a>
            <div>
                <p className="italic p-4">Thanks <a className="link" href="https://www.reddit.com/user/soraliink/">u/soraliink</a>, Gerkenator, Someone and Jeff L Perritt for you donations! ♥️</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 mt-4 mb-4">
                <Avatar className="mb-4">
                    <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
                    <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <p className="mb-4 bottomtext">Any issues? open a new issue or create a pull request on the <a className="link" href="https://github.com/CreatorBeastGD/pokemongo_damage_calculator/issues">repository</a> to help this project!</p>
                <h1 className="textslate">PokéChespin</h1>
            </div>
            <CookieBanner />
        </div>
        
    );
}
