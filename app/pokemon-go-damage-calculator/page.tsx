"use client"

import CookieBanner from "@/components/cookie-banner";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { set } from "mongoose";

async function getRankings(func: (data: any) => void) {
    try {
        const res = await fetch(`/api/ranking`, { cache: 'no-store' });
        if (!res.ok) {
            console.error("Failed to fetch rankings:", res.status, res.statusText);
            func([]);
            return [];
        }
        const data = await res.json();
        console.log("Rankings data:", data);
        
        // Handle both counts array and potential error responses
        const counts = Array.isArray(data.counts) ? data.counts : [];
        func(counts.slice(0, 10));
        return counts;
    } catch (err) {
        console.error("Error calling /api/ranking:", err);
        func([]);
        return [];
    }
}

export default function Page() {

    const [allPokemonPB, setAllPokemonPB] = useState<any[]>([]);
    const [searchBarNames, setSearchBarNames] = useState<string[]>([]);
    const [allMoves, setAllMoves] = useState<any[]>([]);
    const [imageLinks, setImageLinks] = useState<{ [key: string]: string }>({});
    const [allEnglishText, setAllEnglishText] = useState<{ [key: string]: string }>({});
    const [types, setTypes] = useState<any[]>([]);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);

    const [rankings, setRankings] = useState<any[]>([]);


        useEffect(() => {
            const fetchAllPokemonPB = async () => {
            
            const pokemonlist = await PoGoAPI.getAllPokemonPB();
            setAllPokemonPB(pokemonlist);
              //console.log("Fetched all Pokémon from PokeBattler API");
        
            const names = await PoGoAPI.getAllPokemonNames();
            setSearchBarNames(names);
              //console.log("Fetched all Pokémon names from API");
        
            const moves = await PoGoAPI.getAllMovesPB();
            setAllMoves(moves);
              //console.log("Fetched all moves from PokeBattler API");
        
            const images = await PoGoAPI.getAllPokemonImagesPB();
            setImageLinks(images);
              //console.log(images);
              //console.log("Fetched all images from PokeBattler API");
        
            const text = await PoGoAPI.getAllEnglishNamesPB();
            setAllEnglishText(text);
            //console.log(text);
              //console.log("Fetched all English text from PokeBattler API");
        
            const allTypesData = await PoGoAPI.getTypes();
            setTypes(allTypesData);
            //console.log("Fetched all types from PokeBattler API");
        
              
            setTimeout(() => {setAllDataLoaded(true);}, 1);
        };

        try {
            getRankings(setRankings);
            
        } catch (error) {
            console.error("Error fetching rankings:", error);
        }

        
        fetchAllPokemonPB();


    }, []);



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
            <a href={"/dynamax/rankings/general"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Check PokéChespin Max General Rankings
                </button>
            </a>
            <a href={"/whatsnew"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  See what's new!
                </button>
            </a>

            {allDataLoaded ? (
                <div className="py-2">
                    <p className="text-white text-lg px-4">Most visited Max Rankings (last 2 weeks)</p>
                    {rankings.length === 0 ? (
                        <p className="text-white text-lg px-4">No ranking data available.</p>
                    ) : (
                        <ul className="px-4 flex flex-row flex-wrap justify-center space-x-4 w-full">
                            {rankings.map((entry) => {
                                
                                return (<li key={entry._id} className="flex items-center space-x-4 mb-4">
                                    <a href={`/dynamax/rankings/${entry._id}`} className="flex flex-col items-center space-x-2 hover:underline">
                                        <Image
                                            unoptimized
                                            className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 bg-white"}
                                            src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(entry._id, imageLinks )}
                                            alt={entry._id + " | Pokémon GO Damage Calculator"}
                                            width={50}
                                            height={50}
                                            style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                                        />
                                    </a>
                                </li>);
                            })}
                        </ul>
                    )}

                

                </div>
            ) : (
                <div className="py-2">
                    <p className="text-white text-lg px-4">Loading data...</p>
                </div>
            )}
            
            <div>
                <p className="italic p-4">Thanks <a className="link" href="https://www.reddit.com/user/soraliink/">u/soraliink</a>, Gerkenator, Someone, Jeff L Perritt and Matthew Bauman for you donations! ♥️</p>
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
