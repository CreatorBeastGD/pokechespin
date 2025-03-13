"use client"

import CookieBanner from "@/components/cookie-banner";
import { useParams } from "next/navigation";
import { PoGoAPI } from "../../../../lib/PoGoAPI";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



export default function rankingsPage() {

    const [pokemonList, setAllPokemonPB] = useState<any>(null);
    const [searchBarNames, setSearchBarNames] = useState<any>(null);
    const [allMoves, setAllMoves] = useState<any>(null);
    const [imageLinks, setImageLinks] = useState<any>(null);
    const [allEnglishText, setAllEnglishText] = useState<any>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
    const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);
    const [pokemonInfo, setPokemonInfo] = useState<any>(null);
    const [everythingLoaded, setEverythingLoaded] = useState<boolean>(false);
    const [targetedMove, setTargetedMove] = useState<any>(null);
    const [largeMove , setLargeMove] = useState<any>(null);
    const [raidMode, setRaidMode] = useState<string>("raid-t1-dmax");
    const [dmaxPokemon, setDmaxPokemon] = useState<any>(null);
    const [types, setTypes] = useState<any>(null);

    const [bestAttackers, setBestAttackers] = useState<any>(null);
    const [bestDefenders, setBestDefenders] = useState<any>(null);
    
    const sp = useParams();

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
          const dmax = await PoGoAPI.getAvailableMaxPokemonPB();
          setDmaxPokemon(dmax);

          const types = await PoGoAPI.getTypes();
          setTypes(types);
          
          setAllDataLoaded(true);
        };
        fetchAllPokemonPB();
    }, []);
    
    useEffect(() => {
        
        const urlSP = new URLSearchParams(window.location.search);
        if (allDataLoaded) {
            const pokemonId = sp.pokemonId;
            if (pokemonId && typeof pokemonId === 'string') {
                const pokemon = PoGoAPI.getPokemonPBByID(pokemonId, pokemonList)[0];
                setPokemonInfo(pokemon);
                
                const defenderChargedAttack = urlSP.get("defender_cinematic_attack");
                if (defenderChargedAttack) {
                    setTargetedMove(PoGoAPI.getMovePBByID(defenderChargedAttack, allMoves));
                }

                const defenderFastAttack = urlSP.get("defender_fast_attack");
                if (defenderFastAttack) {
                    setLargeMove(PoGoAPI.getMovePBByID(defenderFastAttack, allMoves));
                }
                
                const raidMode = urlSP.get("raid_mode") ? urlSP.get("raid_mode") : "raid-t1-dmax";
                if (raidMode) {
                    setRaidMode(raidMode);
                    const bestAttackers = PoGoAPI.GetBestAttackersDynamax(pokemon, pokemonList, dmaxPokemon, raidMode, allMoves,types);
                    setBestAttackers(bestAttackers);
                    console.log(bestAttackers);
                    const bestDefenders = PoGoAPI.getBestDefendersDynamax(pokemon, pokemonList, dmaxPokemon, raidMode, allMoves,types, defenderFastAttack, defenderChargedAttack);
                    setBestDefenders(bestDefenders);
                    console.log(bestDefenders)
                    urlSP.delete("member");
                    urlSP.delete("slot");
                    window.history.replaceState({}, "", `${window.location.pathname}?${urlSP}`);
                } 
            }
                setEverythingLoaded(true);
        }
    }, [allDataLoaded]);

    const getStars = (raidMode: string) => {
        return raidMode === "normal" ? 5 : parseInt(raidMode.split("-")[1][1]);
    }

    const copyLinkToClipboard = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          alert("Link copied to clipboard!");
        }).catch((err) => {
          console.error("Failed to copy: ", err);
        });
      };

    return (
        <>
        {everythingLoaded ? (
            <div className="flex flex-col flex-row items-center justify-center space-y-4">
                <div className="flex flex-row items-center justify-center space-x-4">
                <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
                    <h1 className="title">
                    PokéChespin Max Rankings
                    </h1>
                <img src="/favicon.ico" alt="Favicon" className="inline-block ml-2 favicon" />
                </div>
                <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
                <h1 className="text-2xl font-bold">Best Attackers and Defenders for {PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)}</h1>
                <a href={`/dynamax${window.location.search}`} className="w-full py-2 text-white bg-primary rounded-lg mt-4 mb-4">
                    <button className="w-full">
                        Go Back
                    </button>
                </a>
                <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
                    <Card className="md:w-1/2 w-full">
                        <CardHeader className="text-xl font-bold">{PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)}'s moves</CardHeader>
                        <CardContent>
                        <Image
                            unoptimized
                            className={"rounded-lg shadow-lg mb-4  border border-gray-200 p-2 bg-white"}
                            src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(pokemonInfo?.pokemonId, imageLinks )}
                            alt={pokemonInfo?.pokemonId + " | Pokémon GO Damage Calculator"}
                            width={150}
                            height={150}
                            style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
                        />
                        <div>
                            <h3 className="text-xl font-bold text-black">Large Move: {PoGoAPI.getMoveNamePB(largeMove?.moveId, allEnglishText)}</h3>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black">Targeted Move: {PoGoAPI.getMoveNamePB(targetedMove?.moveId, allEnglishText)}</h3>
                        </div>
                        <h3 className="text-xl font-bold text-black">{getStars(raidMode)} Star Max Battle</h3>
                        <Separator className="mt-4"/>
                        <CardDescription className="space-y-3 mb-4 mt-4">
                            <p>This calculations don't take in account Weather Boost, Friendship Bonus and Helper Bonus</p>
                            <p>DMG shown in each Pokémon is the damage dealt with their Max Move.</p>
                            <p>PtB means "Percent to Best", which represents how close is this attacker to the best one.</p>
                            <p>Large Tankiness is the tankiness of the Pokémon with their Large Move. This percentage represents HP% left after one Large Move.</p>
                            <p>Target Tankiness is the average tankiness of the Pokémon against the best attackers. This percentage represents HP% left after one Targeted Move when dodged, averaging between best (x0.4 reduction) and worst (x0.7 reduction) case scenario.</p>
                            <p>Tank Score is the average of Large Tankiness and Target Tankiness.</p>
                        </CardDescription>
                        <button onClick={copyLinkToClipboard} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                            Copy ranking link
                        </button>
                        </CardContent>
                    </Card>
                    <Card className="md:w-1/2 w-full">
                        <CardHeader className="text-xl font-bold">Best Attackers</CardHeader>
                        <CardContent>
                            <CardDescription className="space-y-3 mb-4">
                                <p>These are the best attackers to use against {PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)} in a {getStars(raidMode)} star Max Battle.</p>
                                
                            </CardDescription>
                            
                            <div className="flex flex-row items-center justify-center ">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    {bestAttackers?.map((attacker: any, index: number) => (
                                        <Card key={index} className="w-full">
                                            <div  className="flex flex-row  items-center justify-between space-x-4 w-full p-4">
                                                <Image
                                                    unoptimized
                                                    className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200  bg-white"}
                                                    src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(attacker?.pokemon.pokemonId, imageLinks )}
                                                    alt={attacker?.pokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                                                    width={50}
                                                    height={50}
                                                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                                                />
                                                <div>
                                                    <h3 className="text-xl font-bold text-black">{PoGoAPI.getPokemonNamePB(attacker?.pokemon.pokemonId, allEnglishText)}</h3>
                                                    <Separator className="mt-1 mb-1"/>
                                                    <p><span className="text-sm font-bold">Max Move</span> {(attacker.pokemon.pokemonId).endsWith("GIGANTAMAX") ? "G-Max" : "Max"} {PoGoAPI.getMoveNamePB(attacker.maxMove.moveId, allEnglishText)}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-black">DMG</h3>
                                                    <p>{attacker.damage}</p>
                                                    <h3 className="text-xl font-bold text-black mt-2">PtB</h3>
                                                    <p>{((attacker.damage / bestAttackers[0].damage) * 100).toFixed(2)}%</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:w-1/2 w-full">
                        <CardHeader className="text-xl font-bold">Best Defenders</CardHeader>
                        <CardContent>
                            <CardDescription className="space-y-3 mb-4">
                                <p>These are the best defenders to use against {PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)} in a {getStars(raidMode)} star Max Battle.</p>
                            </CardDescription>
                            <div className="flex flex-row items-center justify-center ">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    {bestDefenders?.map((defender: any, index: number) => (
                                        <Card key={index} className="w-full">
                                            <div  className="flex flex-row  items-center justify-between space-x-4 w-full p-4">
                                                <Image
                                                    unoptimized
                                                    className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200  bg-white"}
                                                    src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(defender?.pokemon.pokemonId, imageLinks )}
                                                    alt={defender?.pokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                                                    width={50}
                                                    height={50}
                                                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                                                />
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold text-black">{PoGoAPI.getPokemonNamePB(defender?.pokemon.pokemonId, allEnglishText)}</h3>
                                                    <Separator className="mt-1 mb-1"/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className="text-sm font-bold text-black">Large Tankiness</h3>
                                                        <p>{(defender.large*100).toFixed(2)}%</p>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className="text-sm font-bold text-black">Target Tankiness</h3>
                                                        <p>{(defender.targetAverage*100).toFixed(2)}%</p>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className=" font-bold text-black">Tank Score</h3>
                                                        <p className="font-bold">{(defender.tankScore*100).toFixed(2)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <p className="bottomtext">Version {PoGoAPI.getVersion()}</p>
                <p className="linktext">Pokémon GO API used: <a className="link" href="https://github.com/pokemon-go-api/pokemon-go-api">mario6700-pogo</a> and <a className="link" href="https://www.pokebattler.com">PokéBattler</a></p>
                <Avatar className="mb-4">
                    <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
                    <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <p className="mb-4 bottomtext">Any issues? open a new issue or create a pull request on the <a className="link" href="https://github.com/CreatorBeastGD/pokemongo_damage_calculator/issues">repository</a> to help this project!</p>
                
                <CookieBanner/>
            </div>
        ) : (
            <div className="flex flex-col flex-row items-center justify-center space-y-4">
                <div className="flex flex-row items-center justify-center space-x-4">
                <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
                    <h1 className="title">
                    PokéChespin Max Rankings
                    </h1>
                <img src="/favicon.ico" alt="Favicon" className="inline-block ml-2 favicon" />
                </div>
                <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
    
                <h1 className="text-2xl font-bold">Loading best Attackers and Defenders...</h1>
                <p className="bottomtext">Version {PoGoAPI.getVersion()}</p>
                <p className="linktext">Pokémon GO API used: <a className="link" href="https://github.com/pokemon-go-api/pokemon-go-api">mario6700-pogo</a> and <a className="link" href="https://www.pokebattler.com">PokéBattler</a></p>
                <Avatar className="mb-4">
                    <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
                    <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <p className="mb-4 bottomtext">Any issues? open a new issue or create a pull request on the <a className="link" href="https://github.com/CreatorBeastGD/pokemongo_damage_calculator/issues">repository</a> to help this project!</p>
                
                <CookieBanner/>
            </div>
        )}
        </>
    );
}
