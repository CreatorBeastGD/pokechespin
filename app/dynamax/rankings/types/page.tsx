"use client"

import CookieBanner from "@/components/cookie-banner";
import { useParams, useRouter } from "next/navigation";
import { PoGoAPI } from "../../../../lib/PoGoAPI";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Calculator } from "../../../../lib/calculations";
import { Progress } from "@/components/ui/progress";
import { parse } from "path";
import Navbar from "@/components/navbar";
import TypeBadge from "@/components/TypeBadge";
import { Slider } from "@/components/ui/slider";



export default function rankingsPage() {

    const [pokemonList, setAllPokemonPB] = useState<any>(null);
    const [searchBarNames, setSearchBarNames] = useState<any>(null);
    const [allMoves, setAllMoves] = useState<any>(null);
    const [imageLinks, setImageLinks] = useState<any>(null);
    const [allEnglishText, setAllEnglishText] = useState<any>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
    const [pokemonInfo, setPokemonInfo] = useState<any>(null);
    const [everythingLoaded, setEverythingLoaded] = useState<boolean>(false);
    const [raidMode, setRaidMode] = useState<string>("raid-t1-dmax");
    const [weather, setWeather] = useState<string>("EXTREME");
    const [dmaxPokemon, setDmaxPokemon] = useState<any>(null);
    const [types, setTypes] = useState<any>(null);

    const [currentType, setCurrentType] = useState<string>("POKEMON_TYPE_NORMAL");

    const [bestAttackers, setBestAttackers] = useState<any>(null);
    const [bestAttackerReference, setBestAttackerReference] = useState<any>(null);
    const [bestDefenders, setBestDefenders] = useState<any>(null);
    const [generalBestDefenders, setGeneralBestDefenders] = useState<any>(null);
    const [bestAttackersSpecific, setBestAttackersSpecific] = useState<any>(null);
    const [bestAttackerSpecificReference, setBestAttackerSpecificReference] = useState<any>(null);

    const [showBestAttackers, setShowBestAttackers] = useState<boolean>(false);
    const [showBestDefenders, setShowBestDefenders] = useState<boolean>(false);
    const [showGeneralBestDefenders, setShowGeneralBestDefenders] = useState<boolean>(false);

    const [generalMode, setGeneralMode] = useState<boolean>(false);

    const [zamaExtraShield, setZamaExtraShield] = useState<boolean>(false);
    
    const [dCannon, setDCannon] = useState<boolean>(false);

    const [extraHP, setExtraHP] = useState<number>(0);

    const [playersInTeam, setPlayersInTeam] = useState<number>(1);


    const [showingCounters, setShowingCounters] = useState<boolean>(false);

    const router = useRouter();
    const sp = useParams();

    async function postRankingEntry(pokemonId: string) {
        try {
            const res = await fetch(`/api/ranking/${pokemonId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pokemon: pokemonId,
                    // Add other ranking data as needed
                })
            });
            if (!res.ok) {
                console.error("Failed to post ranking entry:", res.status, res.statusText);
                return;
            }
            const data = await res.json();
            console.log("Ranking entry posted successfully:", data);
        } catch (err) {
            console.error("Error posting ranking entry:", err);
        }
    }
    

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
            
                const zamaExtraShieldAtt = urlSP.get("zamazenta_extra_shield") ? urlSP.get("zamazenta_extra_shield") === "true" : false;
                if (zamaExtraShieldAtt) {
                    setZamaExtraShield(zamaExtraShieldAtt);
                }

                const extraHPAtt = urlSP.get("extra_shields") ? parseInt(urlSP.get("extra_shields") ?? "0") : 0;
                setExtraHP(extraHPAtt);

                const weatherBoost = urlSP.get("weather") ?? "EXTREME";
                if (weather) {
                    setWeather(weatherBoost);
                }

                const dcannonboost = urlSP.get("dynamax_cannon") ? urlSP.get("dynamax_cannon") === "true" : false;
                if (dcannonboost) {
                    setDCannon(dcannonboost);
                }

                const cType = urlSP.get("current_type") ? urlSP.get("current_type") ?? "POKEMON_TYPE_NORMAL" : "POKEMON_TYPE_NORMAL";
                setCurrentType(cType);

                const playersAmount = urlSP.get("players_in_team") ? parseInt(urlSP.get("players_in_team") ?? "1") : 1;
                setPlayersInTeam(playersAmount);

                const isShowingCounters = urlSP.get("show_counters") ? urlSP.get("show_counters") === "true" : false;
                setShowingCounters(isShowingCounters);

                setRaidMode(raidMode);
                const bestAttackers = PoGoAPI.GetBestAttackersDynamaxType(cType, pokemonList, dmaxPokemon, allMoves, types, weatherBoost, dCannon);
                setBestAttackers(bestAttackers);
                const bestAttackersSpecific = PoGoAPI.GetBestAttackersDynamaxTypeSpecific(cType, pokemonList, dmaxPokemon, allMoves, types, weatherBoost, dCannon);
                setBestAttackersSpecific(bestAttackersSpecific);
                const bestDefenders = PoGoAPI.getBestDefendersDynamaxType(cType, pokemonList, dmaxPokemon, allMoves, types, weatherBoost, dCannon);
                setBestDefenders(bestDefenders);
                urlSP.delete("member");
                urlSP.delete("slot");
                window.history.replaceState({}, "", `${window.location.pathname}?${urlSP}`);
                load=true;
                
            }
            if (load) {
                setEverythingLoaded(true);
            }
    }, [allDataLoaded]);

    useEffect(() => {
        if (pokemonInfo && allEnglishText) {
            document.title = `${PoGoAPI.getPokemonNamePB(pokemonInfo?.pokemonId, allEnglishText)} (${getStars(raidMode)} Max Battle) | PokéChespin Max Rankings`;
        }
    }, [pokemonInfo, allEnglishText]);

    const getStars = (raidMode: string) => {
        return raidMode === "normal" ? 5 : (raidMode === "raid-custom-dmax" || raidMode === "raid-custom-gmax") ? "Custom" : (parseInt(raidMode.split("-")[1][1]) + " Stars");
    }

    const copyLinkToClipboard = () => {
        const urlSP = new URLSearchParams();
        urlSP.set("weather", weather);
        urlSP.set("zamazenta_extra_shield", zamaExtraShield.toString());
        urlSP.set("extra_shields", extraHP.toString());
        urlSP.set("dynamax_cannon", dCannon.toString());
        urlSP.set("show_counters", showingCounters.toString());
        const url = window.location.href.split("?")[0] + "?" + urlSP.toString();
        navigator.clipboard.writeText(url).then(() => {
          alert("Link copied to clipboard!");
        }).catch((err) => {
          console.error("Failed to copy: ", err);
        });
      };

    const toggleShowingCounters = (showing: boolean) => {
        setShowingCounters(showing);

        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("show_counters", showing.toString());
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }

    const toggleShowAllAttackers = () => {
        setShowBestAttackers(!showBestAttackers);
    }

    const toggleShowAllDefenders = () => {
        setShowBestDefenders(!showBestDefenders);
    }

    const getHPPercent = (tankScore: number, baseStamina: number, pokemonId: string) => {
        return (tankScore / (Calculator.getEffectiveStamina(baseStamina, 15, 40) + currentExtraHPForPokemon(pokemonId))) * 100;
    }

    const currentExtraHPForPokemon = (pokemonId: string) => {
        return extraHP + (pokemonId === "ZAMAZENTA_CROWNED_SHIELD_FORM" && zamaExtraShield ? 60 : 0) + (dCannon ? (pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_FORM" && pokemonId !== "ZACIAN_CROWNED_SWORD_FORM") ? 60 : 0 : 0);
    }

    const defenderList = showGeneralBestDefenders ? generalBestDefenders : generalMode ? generalBestDefenders : bestDefenders;

    defenderList?.sort((a: any, b: any) => {
        return (-PoGoAPI.GetBulk(a.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(a.pokemon.pokemonId))) + (PoGoAPI.GetBulk(b.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(b.pokemon.pokemonId)));    
    });

    useEffect(() => {
        if (allDataLoaded) {
            let bestAttackerRef = null;
            let bestAttackerSpecificRef = null;
            const bestAttackersNonDCannon = PoGoAPI.GetBestAttackersDynamaxType(currentType, pokemonList, dmaxPokemon, allMoves, types, weather, false);
            const bestAttackersSpecificNoCannon = PoGoAPI.GetBestAttackersDynamaxTypeSpecific(currentType, pokemonList, dmaxPokemon, allMoves, types, weather, false);
            if (dCannon) {
                bestAttackerRef = bestAttackersNonDCannon ? bestAttackersNonDCannon[0] : null;
                bestAttackerSpecificRef = bestAttackersSpecificNoCannon ? bestAttackersSpecificNoCannon[0] : null;
            } else if (!dCannon) {
                bestAttackerRef = null;
                bestAttackerSpecificRef = null;
            }
            const bestAttackersDCannon = PoGoAPI.GetBestAttackersDynamaxType(currentType, pokemonList, dmaxPokemon, allMoves, types, weather, dCannon);
            const bestAttackersSpecificDCannon = PoGoAPI.GetBestAttackersDynamaxTypeSpecific(currentType, pokemonList, dmaxPokemon, allMoves, types, weather, dCannon);
            
            setBestAttackers(bestAttackersDCannon);
            setBestAttackersSpecific(bestAttackersSpecificDCannon);
            //console.log(bestAttackerRef);

            setBestAttackerReference(bestAttackerRef);
            setBestAttackerSpecificReference(bestAttackerSpecificRef);
        }}, [dCannon]);
    
    let attackersToShow = showingCounters ? bestAttackers : bestAttackersSpecific;
    attackersToShow = showBestAttackers ? attackersToShow : attackersToShow?.slice(0, 5);
    const defendersToShow = showBestDefenders ? defenderList : defenderList?.slice(0, 5);


    const handleSwitch = (checked: boolean, handle: any, linkSection: string) => {
        handle(checked);
        
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set(linkSection, checked.toString());
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);

        setTimeout(() => {
            defenderList?.sort((a: any, b: any) => {
            if (checked) {
                if (PoGoAPI.GetBulk(a.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(a.pokemon.pokemonId)) > PoGoAPI.GetBulk(b.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(b.pokemon.pokemonId))) return 1;
                if (PoGoAPI.GetBulk(a.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(a.pokemon.pokemonId)) < PoGoAPI.GetBulk(b.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(b.pokemon.pokemonId))) return -1;
                return 0;
            } else {
                return PoGoAPI.GetBulk(a.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(a.pokemon.pokemonId)) - PoGoAPI.GetBulk(b.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(b.pokemon.pokemonId));
            }
        });
        }, 3000);
    }

    const handleSlider = (value: number, handle: any, linkSection: string) => {
        handle(value);
        defenderList?.sort((a: any, b: any) => {
                return PoGoAPI.GetBulk(a.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(a.pokemon.pokemonId)) - PoGoAPI.GetBulk(b.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(b.pokemon.pokemonId));
        });
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set(linkSection, value.toString());
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }

    function handleTypeChange(value: string): void {
        setCurrentType(value);
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("current_type", value);
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
        const bestAttackers = PoGoAPI.GetBestAttackersDynamaxType(value, pokemonList, dmaxPokemon, allMoves, types, weather, dCannon);
        setBestAttackers(bestAttackers);
        const bestAttackersNonDCannon = PoGoAPI.GetBestAttackersDynamaxType(value, pokemonList, dmaxPokemon, allMoves, types, weather, false);
        setBestAttackerReference(bestAttackersNonDCannon ? bestAttackersNonDCannon[0] : null);
        
        const bestAttackersSpecific = PoGoAPI.GetBestAttackersDynamaxTypeSpecific(value, pokemonList, dmaxPokemon, allMoves, types, weather, dCannon);
        setBestAttackersSpecific(bestAttackersSpecific);
        const bestAttackersSpecificNoCannon = PoGoAPI.GetBestAttackersDynamaxTypeSpecific(value, pokemonList, dmaxPokemon, allMoves, types, weather, false);
        setBestAttackerSpecificReference(bestAttackersSpecificNoCannon ? bestAttackersSpecificNoCannon[0] : null);

        const bestDefenders = PoGoAPI.getBestDefendersDynamaxType(value, pokemonList, dmaxPokemon, allMoves, types, weather, dCannon);
        setBestDefenders(bestDefenders);
    }

    function handleWeatherChange(value: string): void {
        setWeather(value);
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("weather", value);
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
        
        const bestAttackers = PoGoAPI.GetBestAttackersDynamaxType(currentType, pokemonList, dmaxPokemon, allMoves, types, value, dCannon);
        setBestAttackers(bestAttackers);
        const bestAttackersNonDCannon = PoGoAPI.GetBestAttackersDynamaxType(currentType, pokemonList, dmaxPokemon, allMoves, types, value, false);
        setBestAttackerReference(bestAttackersNonDCannon ? bestAttackersNonDCannon[0] : null);
        
        const bestAttackersSpecific = PoGoAPI.GetBestAttackersDynamaxTypeSpecific(currentType, pokemonList, dmaxPokemon, allMoves, types, value, dCannon);
        setBestAttackersSpecific(bestAttackersSpecific);
        const bestAttackersSpecificNoCannon = PoGoAPI.GetBestAttackersDynamaxTypeSpecific(currentType, pokemonList, dmaxPokemon, allMoves, types, value, false);
        setBestAttackerSpecificReference(bestAttackersSpecificNoCannon ? bestAttackersSpecificNoCannon[0] : null);


        const bestDefenders = PoGoAPI.getBestDefendersDynamaxType(currentType, pokemonList, dmaxPokemon, allMoves, types, value, dCannon);
        setBestDefenders(bestDefenders);
    }

    const GetLargeTankiness = (defender: any) => {
        return (getHPPercent(defender.large, defender.pokemon.stats.baseStamina, defender.pokemon.pokemonId)).toFixed(2);
    }

    const GetColorForDefender = (defender: any) => {
            return (GetValueToShow(defender)) >= 100 ? "violet" :
            (GetValueToShow(defender)) > 75 ? "green" :
            (GetValueToShow(defender)) > 60 ? "yellow" :
            (GetValueToShow(defender)) > 50 ? "orange" : "red";

    }


    function GetValueToShow(defender: any): number {
        return 100 * (PoGoAPI.GetBulk(defender.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(defender.pokemon.pokemonId)) /
            PoGoAPI.GetBulk(defendersToShow[0].pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(defendersToShow[0].pokemon.pokemonId)));
    }

    return (
        <>
        {everythingLoaded ? (
            <div className="flex flex-col flex-row items-center justify-center space-y-4">
                <div className="flex flex-row items-center justify-center space-x-4">
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                    <a href="/pokemon-go-damage-calculator">    
                        <h1 className="title">
                        PokéChespin Max Rankings
                        </h1>
                    </a>
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                </div>
                <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
                
                <Navbar/>
                <h1 className="text-2xl font-bold">Best Attackers and Defenders - {PoGoAPI.formatTypeName(currentType)} Type</h1>
                <a href={`/dynamax${window.location.search}`} className="w-full py-2 text-white bg-primary rounded-lg mt-4 mb-4">
                    <button className="w-full">
                        Go to Max Battles Calculator
                    </button>
                </a>
                <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
                    <Card className="md:w-1/2 w-full">
                        <CardHeader className="text-xl font-bold">Best Pokémon - {PoGoAPI.formatTypeName(currentType)} Type</CardHeader>
                        
                        
                        <CardContent>
                        <Separator className="mt-4"/>
                        
                        <CardDescription className="space-y-3 mb-4 mt-4">
                            <p>Select your Type</p>
                            <select onChange={(e) => { handleTypeChange(e.target.value);}} value={currentType} className="mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                                <option key={"POKEMON_TYPE_NORMAL"} value={"POKEMON_TYPE_NORMAL"}>Normal</option>
                                <option key={"POKEMON_TYPE_FIRE"} value={"POKEMON_TYPE_FIRE"}>Fire</option>
                                <option key={"POKEMON_TYPE_WATER"} value={"POKEMON_TYPE_WATER"}>Water</option>
                                <option key={"POKEMON_TYPE_GRASS"} value={"POKEMON_TYPE_GRASS"}>Grass</option>
                                <option key={"POKEMON_TYPE_ELECTRIC"} value={"POKEMON_TYPE_ELECTRIC"}>Electric</option>
                                <option key={"POKEMON_TYPE_ICE"} value={"POKEMON_TYPE_ICE"}>Ice</option>
                                <option key={"POKEMON_TYPE_FIGHTING"} value={"POKEMON_TYPE_FIGHTING"}>Fighting</option>
                                <option key={"POKEMON_TYPE_POISON"} value={"POKEMON_TYPE_POISON"}>Poison</option>
                                <option key={"POKEMON_TYPE_GROUND"} value={"POKEMON_TYPE_GROUND"}>Ground</option>
                                <option key={"POKEMON_TYPE_FLYING"} value={"POKEMON_TYPE_FLYING"}>Flying</option>
                                <option key={"POKEMON_TYPE_PSYCHIC"} value={"POKEMON_TYPE_PSYCHIC"}>Psychic</option>
                                <option key={"POKEMON_TYPE_BUG"} value={"POKEMON_TYPE_BUG"}>Bug</option>
                                <option key={"POKEMON_TYPE_ROCK"} value={"POKEMON_TYPE_ROCK"}>Rock</option>
                                <option key={"POKEMON_TYPE_GHOST"} value={"POKEMON_TYPE_GHOST"}>Ghost</option>
                                <option key={"POKEMON_TYPE_DRAGON"} value={"POKEMON_TYPE_DRAGON"}>Dragon</option>
                                <option key={"POKEMON_TYPE_DARK"} value={"POKEMON_TYPE_DARK"}>Dark</option>
                                <option key={"POKEMON_TYPE_STEEL"} value={"POKEMON_TYPE_STEEL"}>Steel</option>
                                <option key={"POKEMON_TYPE_FAIRY"} value={"POKEMON_TYPE_FAIRY"}>Fairy</option>
                            </select>
                            <p>This calculations don't take in account Friendship Bonus and Helper Bonus. Weather affects both best Attackers and best Tanks</p>
                            <p>For the calculations on this page, a {PoGoAPI.formatTypeName(currentType)} type dummy with a {PoGoAPI.formatTypeName(currentType)} type move is used. This dummy has 180 base stat on all stats, 0.8cpm, x2 attack multiplier, and the move will have 100 power. For "Best Attackers", it will take a dummy weak to all types.</p>
                            <p>Energy Gain Multiplier is x4. The best charged moves will show according to this multiplier.</p>
                            <p>Damage shown in each Pokémon is the damage dealt with their Max Move.</p>
                            <p>"Percent to Best" represents how close one attacker is to the best one.</p>
                            <p>"Damage Received" is how much damage would a dummy move deal to a Pokémon, in percentage of HP.</p>
                            <p>"Hits to Faint" is the number of times a dummy move would need to hit a Pokémon to defeat it.</p>
                            <p>"Bulk" represents the overall durability of a Pokémon against the dummy move. It's a calculation consisting of Defense * (Stamina + Shields) * Effectiveness. The best tanks are ordered by their bulk value.</p>
                            <p>"Use Dynamax Cannon Adventure Effect" adds one extra shield to all compatible Pokémon and will increase 100 power to all compatible attacker moves.</p>
                            
                        </CardDescription>
                        <button onClick={copyLinkToClipboard} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                            Copy ranking link
                        </button>

                        <p className="italic text-slate-700 text-sm mb-4"><Switch onCheckedChange={(checked) => handleSwitch(checked, setDCannon, "dynamax_cannon")} checked={dCannon} /> Use Dynamax Cannon Adventure Effect</p>

                        <p className="italic text-slate-700 text-sm ">Weather</p>
                        <select onChange={(e) => handleWeatherChange(e.target.value)} value={weather} className="mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                            <option value="EXTREME">Extreme</option>
                            <option value="SUNNY">Sunny</option>
                            <option value="WINDY">Windy</option>
                            <option value="RAINY">Rainy</option>
                            <option value="FOG">Fog</option>
                            <option value="PARTLY_CLOUDY">Partly Cloudy</option>
                            <option value="CLOUDY">Cloudy</option>
                            <option value="SNOW">Snow</option>
                        </select>

                        {(
                            <>
                            <p className="italic text-slate-700 text-sm mb-4"><Switch onCheckedChange={(checked) => handleSwitch(checked, setZamaExtraShield, "zamazenta_extra_shield")} checked={zamaExtraShield} /> Include Zamazenta - Crowned Shield's Extra Shield</p>
                        <p className="italic text-slate-700 text-sm ">Shield Amount: {extraHP}</p>
                        <Slider onValueChange={(value) => handleSlider(value[0], setExtraHP, "extra_shields")} value={[extraHP]} max={180} step={60} min={0} className="w-[60%] mb-4 mr-2 " color="bg-black"/>
                            </>)
                        }
                        
                        </CardContent>
                    </Card>
                    <Card className="md:w-1/2 w-full">
                        <CardHeader className="text-xl font-bold">Best {PoGoAPI.formatTypeName(currentType)} Type {showingCounters ? "Counters" : "Attackers"}</CardHeader>
                        <CardContent>
                            <CardDescription className="space-y-3 mb-4">
                                {showingCounters ? (
                                    <p>These are the best counters to use against {PoGoAPI.formatTypeName(currentType)} Type Pokémon in a Max Battle under {weather.toLowerCase().replaceAll("_", " ")} weather.</p>
                                ) : (
                                    <p>These are the best {PoGoAPI.formatTypeName(currentType)} Type Attackers to use in a Max Battle under {weather.toLowerCase().replaceAll("_", " ")} weather.</p>
                                )}
                                <p>The best Charged Move for a Pokémon will show if it provides a higher Energy Per Turn (EPT) than only using Fast Moves. A Charged Move will show in <span className="font-bold text-red-600">bold red</span> if it requires a Mushroom to be effective. This list considers all Pokémon are at Level 40 with perfect IVs.</p>
                            </CardDescription>
                            
                            <div className="flex flex-row items-center justify-center ">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    
                                    
                                    <div className="flex flex-row items-center justify-between space-x-4 w-full">
                                        <button onClick={toggleShowAllAttackers} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                            {showBestAttackers ? "Show Top 5 only" : "Show All"}
                                        </button>
                                        <button onClick={() => toggleShowingCounters(!showingCounters)} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                            {showingCounters ? "Show Attackers" : "Show Counters"}
                                        </button>
                                    </div>
                                    {attackersToShow?.length === 0 && (
                                        <p className="text-sm italic text-gray-500">No attackers found! Check your configurations!</p>
                                    )}
                                    {attackersToShow?.map((attacker: any, index: number) => (
                                        <Card key={index} className="w-full">
                                            <div className="flex flex-row items-center justify-between space-x-4 w-full p-4">
                                                <Image
                                                    unoptimized
                                                    className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 bg-white"}
                                                    src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(attacker?.pokemon.pokemonId, imageLinks)}
                                                    alt={attacker?.pokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                                                />
                                                
                                                <div className="space-y-1 w-full">
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-black"><TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(attacker.maxMove.moveId, allMoves)).type)} customtext={" "} dot={true} />  {PoGoAPI.getPokemonNamePB(attacker?.pokemon.pokemonId, allEnglishText)}</h3>
                                                            <p className="text-sm italic text-black">w/ {PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(attacker.quickMove.moveId, allMoves)).moveId)} {(attacker.chargedMove.ept >= 1 || attacker.chargedMove.needsMushroom) ? <span className={attacker.chargedMove.needsMushroom ? "font-bold text-red-600" : ""}>& {PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(attacker.chargedMove.move.moveId, allMoves)).moveId)}</span> : ''} </p>
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
                                                        <p className="font-bold text-black">
                                                            {((attacker.damage / (showingCounters ? (bestAttackerReference ? bestAttackerReference.damage : bestAttackers[0].damage) : (bestAttackerSpecificReference ? bestAttackerSpecificReference.damage : bestAttackersSpecific[0].damage))) * 100).toFixed(2).split('.')[0]}
                                                            <span className="text-xs align-top">.{((attacker.damage / (showingCounters ? (bestAttackerReference ? bestAttackerReference.damage : bestAttackers[0].damage) : (bestAttackerSpecificReference ? bestAttackerSpecificReference.damage : bestAttackersSpecific[0].damage))) * 100).toFixed(2).split('.')[1]}</span>%
                                                        </p>
                                                    </div>
                                                    <div className="w-full">
                                                        <Progress color={(attacker.damage / attackersToShow[0].damage) === 1 ? "violet" : (attacker.damage / (showingCounters ? bestAttackers[0].damage : bestAttackersSpecific[0].damage)) > 0.75 ? "green" : (attacker.damage / (showingCounters ? bestAttackers[0].damage : bestAttackersSpecific[0].damage)) > 0.6 ? "yellow" : (attacker.damage / (showingCounters ? bestAttackers[0].damage : bestAttackersSpecific[0].damage)) > 0.5 ? "orange" : "red"} value={(attacker.damage / (showingCounters ? bestAttackers[0].damage : bestAttackersSpecific[0].damage)) * 100}/>
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
                        <CardHeader className="text-xl font-bold">Best Tanks against {PoGoAPI.formatTypeName(currentType)} Type Moves</CardHeader>
                        <CardContent>
                            <CardDescription className="space-y-3 mb-4">
                                <p>These are the best tanks to use against {PoGoAPI.formatTypeName(currentType)} Type moves in a Max Battle under {weather.toLowerCase().replaceAll("_", " ")} weather.</p>
                                <p>The best Charged Move for a Pokémon will show if it provides a higher Energy Per Turn (EPT) than only using Fast Moves. A Charged Move will show in <span className="font-bold text-red-600">bold red</span> if it requires a Mushroom to be effective. This list considers all Pokémon are at Level 40 with perfect IVs.</p>
                            </CardDescription>
                            <div className="flex flex-row items-center justify-center ">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    
                                        <button onClick={toggleShowAllDefenders}  className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                            {showBestDefenders ? "Show Top 5 only" : "Show All"}
                                        </button>
                                    {defendersToShow?.length === 0 && (
                                        <p className="text-sm italic text-gray-500">No defenders found! Check your configurations!</p>
                                    )}
                                    {defendersToShow?.map((defender: any, index: number) => (
                                        
                                        <Card className="w-full" key={index}>
                                            <div  className="flex flex-row items-center justify-between space-x-4 w-full p-4">
                                                <Image
                                                    unoptimized
                                                    className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200  bg-white"}
                                                    src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(defender?.pokemon.pokemonId, imageLinks )}
                                                    alt={defender?.pokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                                                    width={50}
                                                    height={50}
                                                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                                                />
                                                <div className="space-y-1 w-full">
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-black"><TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(defender.fastMove.moveId, allMoves)).type)} customtext={" "} dot={true} />  {PoGoAPI.getPokemonNamePB(defender?.pokemon.pokemonId, allEnglishText)}</h3>
                                                            <p className="text-sm italic text-black">w/ {PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(defender.fastMove.moveId, allMoves)).moveId)} ({(defender.fastMove.durationMs / 1000)}s) {(defender.chargedMove.ept >= 1 || defender.chargedMove.needsMushroom) ? <span className={defender.chargedMove.needsMushroom ? "font-bold text-red-600" : ""}>& {PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(defender.chargedMove.move.moveId, allMoves)).moveId)}</span> : ''} </p>
                                                        </div>
                                                        <p className="text-sm italic textgray">#{index+1}</p>
                                                    </div>
                                                    <Separator className="mt-1 mb-1"/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className="text-sm font-bold text-black">Damage Received</h3>
                                                        <p >{GetLargeTankiness(defender)}%</p>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className="text-sm font-bold text-black">Hits to Faint</h3>
                                                        <p >{(100 / parseFloat(GetLargeTankiness(defender) + "")).toFixed(2)}</p>
                                                    </div>
                                                    <Separator/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <h3 className=" font-bold text-black text-xl">Bulk</h3>
                                                        <p className={"font-bold "}>
                                                        {
                                                            (() => {
                                                            const value = parseFloat(PoGoAPI.GetBulk(defender.pokemon, [40,15,15,15], types, currentType, currentExtraHPForPokemon(defender.pokemon.pokemonId)).toFixed(2));
                                                            const [intPart, decPart] = value.toFixed(2).split(".");
                                                            return (
                                                                <>
                                                                {intPart}
                                                                <span className="text-xs align-top">.{decPart}</span>
                                                                </>
                                                            );
                                                            })()
                                                        }
                                                        </p>
                                                    </div>
                                                    <div className="w-full">
                                                        <Progress color={GetColorForDefender(defender)} value={GetValueToShow(defender)}/>
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
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                    <h1 className="title">
                    PokéChespin Max Rankings
                    </h1>
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                </div>
                <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
                
                <Navbar/>

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
