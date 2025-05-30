"use client"

import CookieBanner from "@/components/cookie-banner";
import { useParams, useRouter } from "next/navigation";
import { PoGoAPI } from "../../../../lib/PoGoAPI";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Calculator } from "../../../../lib/calculations";



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
    const [weather, setWeather] = useState<string>("EXTREME");
    const [dmaxPokemon, setDmaxPokemon] = useState<any>(null);
    const [types, setTypes] = useState<any>(null);
    const [prioritiseFast, setPrioritiseFast] = useState<boolean>(false);
    const [rankingDisplay, setRankingDisplay] = useState<string>("HP_PERCENT");

    const [bestAttackers, setBestAttackers] = useState<any>(null);
    const [bestDefenders, setBestDefenders] = useState<any>(null);
    const [generalBestDefenders, setGeneralBestDefenders] = useState<any>(null);

    const [showBestAttackers, setShowBestAttackers] = useState<boolean>(false);
    const [showBestDefenders, setShowBestDefenders] = useState<boolean>(false);
    const [showGeneralBestDefenders, setShowGeneralBestDefenders] = useState<boolean>(false);

    const [generalMode, setGeneralMode] = useState<boolean>(false);
    
    const router = useRouter();
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
        let load = false;
        if (allDataLoaded) {
            const pokemonId = sp.pokemonId;
            if (pokemonId && typeof pokemonId === 'string') {

                const pokemon = PoGoAPI.getPokemonPBByID(pokemonId, pokemonList)[0];
                setPokemonInfo(pokemon);
                
                const defenderChargedAttack = urlSP.get("defender_cinematic_attack");
                
                if (defenderChargedAttack !== null) {
                    setTargetedMove(PoGoAPI.getMovePBByID(defenderChargedAttack, allMoves));
                } 

                const defenderFastAttack = urlSP.get("defender_fast_attack");
                
                if (defenderFastAttack !== null) {
                    setLargeMove(PoGoAPI.getMovePBByID(defenderFastAttack, allMoves));
                }

                const prioritiseFastAtt = urlSP.get("prioritise_fast_attack") ? urlSP.get("prioritise_fast_attack") === "true" : false;
                if (prioritiseFastAtt) {
                    setPrioritiseFast(prioritiseFastAtt);
                }

                const rankingDisplay = urlSP.get("ranking_display") ? urlSP.get("ranking_display") : "HP_PERCENT";
                if (rankingDisplay) {
                    setRankingDisplay(rankingDisplay);
                }

                const weatherBoost = urlSP.get("weather") ?? "EXTREME";
                if (weather) {
                    setWeather(weatherBoost);
                }

                const general = urlSP.get("general") ? urlSP.get("general") === "true" : false;
                if (general) {
                    setShowGeneralBestDefenders(general);
                }

                const raidMode = urlSP.get("raid_mode") ? urlSP.get("raid_mode") : "raid-t1-dmax";


                if (raidMode && defenderFastAttack && defenderChargedAttack) {
                    setRaidMode(raidMode);
                    const bestAttackers = PoGoAPI.GetBestAttackersDynamax(pokemon, pokemonList, dmaxPokemon, raidMode, allMoves, types, weatherBoost);
                    setBestAttackers(bestAttackers);
                    const bestDefenders = PoGoAPI.getBestDefendersDynamax(pokemon, pokemonList, dmaxPokemon, raidMode, allMoves, types, defenderFastAttack, defenderChargedAttack, weatherBoost);
                    setBestDefenders(bestDefenders);
                    const bestGeneralDefenders = PoGoAPI.getGeneralBestDefendersDynamax(pokemon, pokemonList, dmaxPokemon, raidMode, allMoves, types, weatherBoost);
                    setGeneralBestDefenders(bestGeneralDefenders);
                    urlSP.delete("member");
                    urlSP.delete("slot");
                    window.history.replaceState({}, "", `${window.location.pathname}?${urlSP}`);
                    load=true;
                } else if (raidMode && (!defenderFastAttack || !defenderChargedAttack)) {
                    setRaidMode(raidMode);
                    const bestAttackers = PoGoAPI.GetBestAttackersDynamax(pokemon, pokemonList, dmaxPokemon, raidMode, allMoves, types, weatherBoost);
                    setBestAttackers(bestAttackers);
                    const bestGeneralDefenders = PoGoAPI.getGeneralBestDefendersDynamax(pokemon, pokemonList, dmaxPokemon, raidMode, allMoves, types, weatherBoost);
                    setGeneralBestDefenders(bestGeneralDefenders);
                    setGeneralMode(true);
                    setShowGeneralBestDefenders(true);
                    urlSP.delete("member");
                    urlSP.delete("slot");
                    window.history.replaceState({}, "", `${window.location.pathname}?${urlSP}`);
                    load=true;
                } else {
                    const newUrl = `${window.location.origin}/dynamax?defender=${pokemonId}`;
                    router.push(newUrl);
                }

                
            }
            if (load) {
                setEverythingLoaded(true);
            }
        }
    }, [allDataLoaded]);

    useEffect(() => {
        if (pokemonInfo && allEnglishText) {
            document.title = `${PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)} (${getStars(raidMode)} Star Max Battle) | PokéChespin Max Rankings`;
        }
    }, [pokemonInfo, allEnglishText]);

    const getStars = (raidMode: string) => {
        return raidMode === "normal" ? 5 : parseInt(raidMode.split("-")[1][1]);
    }

    const copyLinkToClipboard = () => {
        const urlSP = new URLSearchParams();
        if (!generalMode) {
            
            urlSP.set("defender_fast_attack", largeMove?.moveId);
            urlSP.set("defender_cinematic_attack", targetedMove?.moveId);
        }
        urlSP.set("raid_mode", raidMode);
        urlSP.set("defender", pokemonInfo?.pokemonId);
        urlSP.set("weather", weather);
        urlSP.set("general", showGeneralBestDefenders.toString());
        urlSP.set("prioritise_fast_attack", prioritiseFast.toString());
        urlSP.set("ranking_display", rankingDisplay);
        const url = window.location.href.split("?")[0] + "?" + urlSP.toString();
        navigator.clipboard.writeText(url).then(() => {
          alert("Link copied to clipboard!");
        }).catch((err) => {
          console.error("Failed to copy: ", err);
        });
      };

    const toggleShowAllAttackers = () => {
        setShowBestAttackers(!showBestAttackers);
    }

    const toggleShowAllDefenders = () => {
        setShowBestDefenders(!showBestDefenders);
    }

    const toggleGeneralDefenders = () => {
        setShowGeneralBestDefenders(!showGeneralBestDefenders);
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("general", showGeneralBestDefenders ? "false" : "true");
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }
    
    
    const getHPPercent = (tankScore: number, baseStamina: number) => {
        return (tankScore / Calculator.getEffectiveStamina(baseStamina, 15, 40) * 100);
    }

    const getAverageTankScore = (hpdmg: number, hpper: number) => {
        return (hpdmg + hpper) / 2;
    }   

    const defenderList = showGeneralBestDefenders ? generalBestDefenders : generalMode ? generalBestDefenders : bestDefenders;

    defenderList?.sort((a: any, b: any) => {
        if (prioritiseFast) {
            if (rankingDisplay === "HP_DMG") {
                return a.fastMove.durationMs * a.tankScore - b.fastMove.durationMs * b.tankScore;
            } else if (rankingDisplay === "HP_PERCENT") {
                return (a.fastMove.durationMs * getHPPercent(a.tankScore, a.pokemon.stats.baseStamina) - b.fastMove.durationMs * getHPPercent(b.tankScore, b.pokemon.stats.baseStamina));
            } else if (rankingDisplay === "AVG") {
                return a.fastMove.durationMs * getAverageTankScore(a.tankScore, getHPPercent(a.tankScore, a.pokemon.stats.baseStamina)) - b.fastMove.durationMs * getAverageTankScore(b.tankScore, getHPPercent(b.tankScore, b.pokemon.stats.baseStamina));
            }
            if (a.fastMove.durationMs * a.tankScore > b.fastMove.durationMs * b.tankScore) return 1;
            if (a.fastMove.durationMs * a.tankScore < b.fastMove.durationMs * b.tankScore) return -1;
            return 0;
        } else {
            if (rankingDisplay === "HP_DMG") {
                return a.tankScore - b.tankScore;
            } else if (rankingDisplay === "HP_PERCENT") {
                return (getHPPercent(a.tankScore, a.pokemon.stats.baseStamina) - getHPPercent(b.tankScore, b.pokemon.stats.baseStamina));
            } else if (rankingDisplay === "AVG") {
                return getAverageTankScore(a.tankScore, getHPPercent(a.tankScore, a.pokemon.stats.baseStamina)) - getAverageTankScore(b.tankScore, getHPPercent(b.tankScore, b.pokemon.stats.baseStamina));
            }
            return 0;
        }
    });

    const attackersToShow = showBestAttackers ? bestAttackers : bestAttackers?.slice(0, 5);
    const defendersToShow = showBestDefenders ? defenderList : defenderList?.slice(0, 5);


    const handleSwitch = (checked: boolean, handle: any) => {
        handle(checked);
        defenderList?.sort((a: any, b: any) => {
            if (checked) {
                if (a.fastMove.durationMs * a.tankScore > b.fastMove.durationMs * b.tankScore) return 1;
                if (a.fastMove.durationMs * a.tankScore < b.fastMove.durationMs * b.tankScore) return -1;
                return 0;
            } else {
                return a.tankScore - b.tankScore;
            }
        });
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("prioritise_fast_attack", checked.toString());
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }


    function handleRankingConfig(value: string): void {
        setRankingDisplay(value);
        
        defenderList?.sort((a: any, b: any) => {
            if (value === "HP_DMG") {
                return a.tankScore - b.tankScore;
            } else if (value === "HP_PERCENT") {
                return (getHPPercent(a.tankScore, a.pokemon.stats.baseStamina) - getHPPercent(b.tankScore, b.pokemon.stats.baseStamina));
            } else if (value === "AVG") {
                return getAverageTankScore(a.tankScore, getHPPercent(a.tankScore, a.pokemon.stats.baseStamina)) - getAverageTankScore(b.tankScore, getHPPercent(b.tankScore, b.pokemon.stats.baseStamina));
            }
            return 0;
        });
        
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("ranking_display", value);
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }

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
                        {generalMode ? (
                            <div>
                                <h3 className="text-xl font-bold text-black">No moves were selected.</h3>
                            </div>
                        ) :(
                            <>
                                <div>
                                    <h3 className="text-xl font-bold text-black">Large Move: {PoGoAPI.getMoveNamePB(largeMove?.moveId, allEnglishText)}</h3>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black">Targeted Move: {PoGoAPI.getMoveNamePB(targetedMove?.moveId, allEnglishText)}</h3>
                                </div>
                            </>
                        )}
                        <h3 className="text-xl font-bold text-black">{getStars(raidMode)} Star Max Battle</h3>
                        <Separator className="mt-4"/>
                        <CardDescription className="space-y-3 mb-4 mt-4">
                            <p>This calculations don't take in account Friendship Bonus and Helper Bonus. Weather Boost has been added, and will affect both best Attackers and best Tanks</p>
                            {!generalMode && (<p>{PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)}'s best Tanks with {PoGoAPI.getMoveNamePB(largeMove?.moveId, allEnglishText)} as a Large Move and {PoGoAPI.getMoveNamePB(targetedMove?.moveId, allEnglishText)} as a Targeted Move are the shown here. These tanks can vary depending on the Boss' moveset.</p>)}
                            <p>Damage shown in each Pokémon is the damage dealt with their Max Move.</p>
                            <p>"Percent to Best" represents how close one attacker is to the best one.</p>
                            <p>Large Tankiness is the tankiness of the Pokémon with their Large Move. This number represents the Damage taken from one Large Attack.</p>
                            <p>Target Tankiness is the average tankiness of the Pokémon against the best attackers. This number represents the Damage taken from one Targeted Move when dodged, averaging between best (x0.4 reduction) and worst (x0.7 reduction) case scenario.</p>
                            <p>Tank Score is the average of Large Tankiness and Target Tankiness. Lower scores are better.</p>
                        </CardDescription>
                        <button onClick={copyLinkToClipboard} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                            Copy ranking link
                        </button>
                        <p className="italic text-slate-700 text-sm mb-4"><Switch onCheckedChange={(checked) => handleSwitch(checked, setPrioritiseFast)} checked={prioritiseFast} /> Prioritise Fastest Attacks for Tanks</p>
                            <p className="italic text-slate-700 text-sm">Tank Ranking shown</p>
                            <select onChange={(e) => handleRankingConfig(e.target.value)} value={rankingDisplay} className="mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                                <option key={"HP_PERCENT"} value={"HP_PERCENT"}>HP% taken from an Attack</option>
                                <option key={"HP_DMG"} value={"HP_DMG"}>HP taken from an Attack</option>
                                <option key={"AVG"} value={"AVG"}>Average</option>
                            </select>
                        </CardContent>
                    </Card>
                    <Card className="md:w-1/2 w-full">
                        <CardHeader className="text-xl font-bold">Best Attackers</CardHeader>
                        <CardContent>
                            <CardDescription className="space-y-3 mb-4">
                                <p>These are the best attackers to use against {PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)} in a {getStars(raidMode)} star Max Battle under {weather.toLowerCase().replaceAll("_", " ")} weather.</p>
                                
                            </CardDescription>
                            
                            <div className="flex flex-row items-center justify-center ">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    
                                    
                                    <div className="flex flex-row items-center justify-between space-x-4 w-full">
                                        <button onClick={toggleShowAllAttackers} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                            {showBestAttackers ? "Show Top 5 only" : "Show All"}
                                        </button>
                                    </div>
                                    {attackersToShow?.map((attacker: any, index: number) => (
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
                                                <div className="space-y-1 w-full">
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-black">{PoGoAPI.getPokemonNamePB(attacker?.pokemon.pokemonId, allEnglishText)}</h3>
                                                            <p className="text-sm italic text-black">w/ {PoGoAPI.getMoveNamePB(attacker.fastMove.moveId, allEnglishText)}</p>
                                                        </div>
                                                        
                                                        <p className="text-sm italic textgray">#{index+1}</p>
                                                    </div>
                                                    <Separator className="mt-1 mb-1"/>
                                                    
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <p className="text-sm font-bold">Max Move</p>
                                                        <p>{(attacker.pokemon.pokemonId).endsWith("GIGANTAMAX") ? "G-Max" : "Max"} {PoGoAPI.getMoveNamePB(attacker.maxMove.moveId, allEnglishText)}</p>
                                                    </div>
                                                    
                                                    <div className="flex flex-row items-center justify-between space-x-4">

                                                        <h3 className="text-sm font-bold text-black">Damage</h3>
                                                        <p>{attacker.damage}</p>
                                                    </div>
                                                    <Separator/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        
                                                        <h3 className="text-xl font-bold text-black">Percent to Best</h3>
                                                        <p className="font-bold text-black">{((attacker.damage / bestAttackers[0].damage) * 100).toFixed(2)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:w-1/2 w-full">
                        <CardHeader className="text-xl font-bold">Best Tanks {showGeneralBestDefenders ? "in general" : ""}</CardHeader>
                        <CardContent>
                            <CardDescription className="space-y-3 mb-4">
                                <p>These are the best tanks to use against {PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)} in a {getStars(raidMode)} star Max Battle under {weather.toLowerCase().replaceAll("_", " ")} weather.</p>
                            </CardDescription>
                            <div className="flex flex-row items-center justify-center ">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    
                                    <div className="flex flex-row items-center justify-between space-x-4 w-full">
                                        <button onClick={toggleShowAllDefenders}  className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                            {showBestDefenders ? "Show Top 5 only" : "Show All"}
                                        </button>
                                        {!generalMode && (<button onClick={toggleGeneralDefenders}  className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                            {showGeneralBestDefenders ? "Show Best Defenders" : "Show General Best Defenders"}
                                        </button>)}
                                    </div>
                                    {defendersToShow?.map((defender: any, index: number) => (
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
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-black">{PoGoAPI.getPokemonNamePB(defender?.pokemon.pokemonId, allEnglishText)}</h3>
                                                            <p className="text-sm italic text-black">w/ {PoGoAPI.getMoveNamePB(defender.fastMove.moveId, allEnglishText)} ({defender.fastMove.durationMs/1000}s)</p>
                                                        </div>
                                                        <p className="text-sm italic textgray">#{index+1}</p>
                                                    </div>
                                                    <Separator className="mt-1 mb-1"/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className="text-sm font-bold text-black">Large Tankiness</h3>
                                                        <p>{rankingDisplay === "HP_DMG" ? (defender.large.toFixed(2)) : rankingDisplay === "HP_PERCENT" ? (getHPPercent(defender.large, defender.pokemon.stats.baseStamina)).toFixed(2) : getAverageTankScore(defender.large, getHPPercent(defender.large, defender.pokemon.stats.baseStamina)).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className="text-sm font-bold text-black">Target Tankiness</h3>
                                                        <p><span className="text-blue-600">{rankingDisplay === "HP_DMG" ? (defender.targetBest.toFixed(2)) : rankingDisplay === "HP_PERCENT" ? (getHPPercent(defender.targetBest, defender.pokemon.stats.baseStamina)).toFixed(2) : getAverageTankScore(defender.targetBest, getHPPercent(defender.targetBest, defender.pokemon.stats.baseStamina)).toFixed(2)} </span>/ <span className="text-sm">{rankingDisplay === "HP_DMG" ? (defender.targetWorst.toFixed(2)) : rankingDisplay === "HP_PERCENT" ? (getHPPercent(defender.targetWorst, defender.pokemon.stats.baseStamina)).toFixed(2) : getAverageTankScore(defender.targetWorst, getHPPercent(defender.targetWorst, defender.pokemon.stats.baseStamina)).toFixed(2)}</span> <span className="text-xs">(avg. {rankingDisplay === "HP_DMG" ? (defender.targetAvg.toFixed(2)) : rankingDisplay === "HP_PERCENT" ? (getHPPercent(defender.targetAvg, defender.pokemon.stats.baseStamina)).toFixed(2) : getAverageTankScore(defender.targetAvg, getHPPercent(defender.targetAvg, defender.pokemon.stats.baseStamina)).toFixed(2)})</span></p>
                                                    </div>
                                                    <Separator/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className=" font-bold text-black">Tank Score</h3>
                                                        <p className="font-bold">{((((rankingDisplay === "HP_DMG" ? (defender.tankScore) : rankingDisplay === "HP_PERCENT" ? (getHPPercent(defender.tankScore, defender.pokemon.stats.baseStamina)) : getAverageTankScore(defender.tankScore, getHPPercent(defender.tankScore, defender.pokemon.stats.baseStamina))) * (prioritiseFast ? defender.fastMove.durationMs / 500 : 1))).toFixed(2))}</p>
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
