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
import { Progress } from "@/components/ui/progress";
import { parse } from "path";
import Navbar from "@/components/navbar";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Slider } from "@/components/ui/slider";



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
    const [zamaExtraShield, setZamaExtraShield] = useState<boolean>(false);
    const [rankingDisplay, setRankingDisplay] = useState<string>("HP_PERCENT");

    const [bestAttackers, setBestAttackers] = useState<any>(null);
    const [bestDefenders, setBestDefenders] = useState<any>(null);
    const [generalBestDefenders, setGeneralBestDefenders] = useState<any>(null);

    const [showBestAttackers, setShowBestAttackers] = useState<boolean>(false);
    const [showBestDefenders, setShowBestDefenders] = useState<boolean>(false);
    const [showGeneralBestDefenders, setShowGeneralBestDefenders] = useState<boolean>(false);

    const [generalMode, setGeneralMode] = useState<boolean>(false);

    const [dmaxDifficulty, setDmaxDifficulty] = useState<string>("raid-t6-gmax");

    const [showTierListAttackers, setShowTierListAttackers] = useState<any[]>([]);
    const [showTierListDefenders, setShowTierListDefenders] = useState<any[]>([]);

    const [playersInTeam, setPlayersInTeam] = useState<number>(1);

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
            urlSP.get("dmax_difficulty") ? handleDmaxDifficulty(urlSP.get("dmax_difficulty")!) : handleDmaxDifficulty("raid-t6-gmax");
            urlSP.get("ranking_display") ? handleRankingConfig(urlSP.get("ranking_display")!) : handleRankingConfig("HP_DMG");
            urlSP.get("prioritise_fast_attack") ? setPrioritiseFast(urlSP.get("prioritise_fast_attack") === "true") : setPrioritiseFast(false);
            urlSP.get("zamazenta_extra_shield") ? setZamaExtraShield(urlSP.get("zamazenta_extra_shield") === "true") : setZamaExtraShield(false);
            urlSP.get("players_in_team") ? setPlayersInTeam(parseInt(urlSP.get("players_in_team")!)) : setPlayersInTeam(1);

            let tierListAttackers = PoGoAPI.getAttackerTierList(pokemonList, allMoves, types, dmaxDifficulty);
            let tierListDefenders = PoGoAPI.getDefenderTierList(pokemonList, allMoves, types, dmaxDifficulty);
            setBestAttackers(tierListAttackers);
            setBestDefenders(tierListDefenders);

            setEverythingLoaded(true);
        }
    }, [allDataLoaded]);

    useEffect(() => {
        setShowTierListAttackers([]);
        setShowTierListDefenders([]);
        if (sp && allDataLoaded && !paramsLoaded) {
            let tierListAttackers = PoGoAPI.getAttackerTierList(pokemonList, allMoves, types, dmaxDifficulty);
            let tierListDefenders = PoGoAPI.getDefenderTierList(pokemonList, allMoves, types, dmaxDifficulty);
            setBestAttackers(tierListAttackers);
            setBestDefenders(tierListDefenders);
            setEverythingLoaded(true);
        }
    }, [dmaxDifficulty]);

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

    const TankScorePenalization = (defender: any): number => {
        return ((playersInTeam * 2) / (((playersInTeam * 2) - 2) + (1000 / defender.fastMove.durationMs)));
    }

    const toggleShowAllDefenders = () => {
        setShowBestDefenders(!showBestDefenders);
    }
    
    const getHPPercent = (tankScore: number, baseStamina: number, pokemonId: string) => {
        return (tankScore / (Calculator.getEffectiveStamina(baseStamina, 15, 40) + (pokemonId === "ZAMAZENTA_CROWNED_SHIELD_FORM" && zamaExtraShield ? 60 : 0)) * 100);
    }

    const getAverageTankScore = (hpdmg: number, hpper: number) => {
        return (hpdmg + hpper) / 2;
    }   

    const defenderList = bestDefenders;

    defenderList?.sort((a: any, b: any) => {
        if (prioritiseFast) {
            if (rankingDisplay === "HP_DMG") {
                return TankScorePenalization(a) * a.tier - TankScorePenalization(b) * b.tier;
            } else if (rankingDisplay === "HP_PERCENT") {
                return (TankScorePenalization(a) * getHPPercent(a.tier, a.pokemon.stats.baseStamina, a.pokemon.pokemonId) - TankScorePenalization(b) * getHPPercent(b.tier, b.pokemon.stats.baseStamina, b.pokemon.pokemonId));
            } else if (rankingDisplay === "AVG") {
                return TankScorePenalization(a) * getAverageTankScore(a.tier, getHPPercent(a.tier, a.pokemon.stats.baseStamina, a.pokemonId)) - TankScorePenalization(b) * getAverageTankScore(b.tier, getHPPercent(b.tier, b.pokemon.stats.baseStamina, b.pokemonId));
            }
            if (TankScorePenalization(a) * a.tier > TankScorePenalization(b) * b.tier) return 1;
            if (TankScorePenalization(a) * a.tier < TankScorePenalization(b) * b.tier) return -1;
            return 0;
        } else {
            if (rankingDisplay === "HP_DMG") {
                return a.tier - b.tier;
            } else if (rankingDisplay === "HP_PERCENT") {
                return (getHPPercent(a.tier, a.pokemon.stats.baseStamina, a.pokemon.pokemonId) - getHPPercent(b.tier, b.pokemon.stats.baseStamina, b.pokemon.pokemonId));
            } else if (rankingDisplay === "AVG") {
                return getAverageTankScore(a.tankScore, getHPPercent(a.tankScore, a.pokemon.stats.baseStamina, a.pokemon.pokemonId)) - getAverageTankScore(b.tankScore, getHPPercent(b.tankScore, b.pokemon.stats.baseStamina, b.pokemon.pokemonId));
            }
            return 0;
        }
    });


    const chartConfig = {
        tier: {
            label: "Tier",
            color: "#2563eb",
        },
        maxmove: {
            label: "Max Move",
            color: "#ffffffff",
        },
    } satisfies ChartConfig


    const handleSwitch = (checked: boolean, handle: any, param: string) => {
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
        newSearchParams.set(param, checked.toString());
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }

    function handleDmaxDifficulty(value: string): void {
        setDmaxDifficulty(value);

        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("dmax_difficulty", value);
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }

    const handleSlider = (value: number, handle: any, linkSection: string) => {
        handle(value);
        defenderList?.sort((a: any, b: any) => {
            if (prioritiseFast) {
                if (TankScorePenalization(a) * a.tankScore > TankScorePenalization(b) * b.tankScore) return 1;
                if (TankScorePenalization(a) * a.tankScore < TankScorePenalization(b) * b.tankScore) return -1;
                return 0;
            } else {
                return a.tankScore - b.tankScore;
            }
        });
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set(linkSection, value.toString());
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }

    function handleRankingConfig(value: string): void {

        setRankingDisplay(value);
        
        defenderList?.sort((a: any, b: any) => {
            if (value === "HP_DMG") {
                return a.tankScore - b.tankScore;
            } else if (value === "HP_PERCENT") {
                return (getHPPercent(a.tankScore, a.pokemon.stats.baseStamina, a.pokemonId) - getHPPercent(b.tankScore, b.pokemon.stats.baseStamina, b.pokemonId));
            } else if (value === "AVG") {
                return getAverageTankScore(a.tankScore, getHPPercent(a.tankScore, a.pokemon.stats.baseStamina, a.pokemonId)) - getAverageTankScore(b.tankScore, getHPPercent(b.tankScore, b.pokemon.stats.baseStamina, b.pokemonId));
            }
            return 0;
        });
        
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("ranking_display", value);
        const pathname = window.location.pathname;
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }
    
    const GetTankScore = (defender: any): string => {
        if (rankingDisplay === "HP_DMG") {
            return (defender.tier * (prioritiseFast ? TankScorePenalization(defender) : 1)).toFixed(2);
        } else if (rankingDisplay === "HP_PERCENT") {
            return (getHPPercent(defender.tier, defender.pokemon.stats.baseStamina, defender.pokemon.pokemonId) * (prioritiseFast ? TankScorePenalization(defender) : 1)).toFixed(2);
        } else if (rankingDisplay === "AVG") {
            return (getAverageTankScore(defender.tier, getHPPercent(defender.tier, defender.pokemon.stats.baseStamina, defender.pokemonId)) * (prioritiseFast ? TankScorePenalization(defender) : 1)).toFixed(2);
        }
        return "0.00";
    }

    function selectRanking(pokemonId: any): void {
        setShowTierListDefenders([]);
        setShowTierListAttackers(PoGoAPI.getTierForPokemon(pokemonId, pokemonList, allMoves, types, allEnglishText, dmaxDifficulty));
    }

    function selectDefenderRanking(pokemonId: any): void {
        setShowTierListAttackers([]);
        setShowTierListDefenders(PoGoAPI.getDefenderTierForPokemon(pokemonId, pokemonList, allMoves, types, allEnglishText, dmaxDifficulty));
    }

    const getHighestElement = () => {
        if (showTierListAttackers.length > 0) {
            return showTierListAttackers.reduce((prev, current) => {
                return (prev.tier > current.tier) ? prev : current;
            });
        } if (showTierListDefenders.length > 0) {
            return showTierListDefenders.reduce((prev, current) => {
                return (prev.tier > current.tier) ? prev : current;
            });
        }
        return null;
    }

    function getLowestElement() {
        if (showTierListAttackers.length > 0) {
            return showTierListAttackers.reduce((prev, current) => {
                return (prev.tier < current.tier) ? prev : current;
            });
        } if (showTierListDefenders.length > 0) {
            return showTierListDefenders.reduce((prev, current) => {
                return (prev.tier < current.tier) ? prev : current;
            });
        }
        return null;
    }

    const attackersToShow = showBestAttackers ? bestAttackers : bestAttackers?.slice(0, 5);
    const defendersToShow = showBestDefenders ? defenderList : defenderList?.slice(0, 5);


    return (
        <>
        {everythingLoaded ? (
            <div className="flex flex-col flex-row items-center justify-center space-y-4">
                <div className="flex flex-row items-center justify-center space-x-4">
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                    <a href="/pokemon-go-damage-calculator">    
                        <h1 className="title">
                        PokéChespin Max General Rankings
                        </h1>
                    </a>
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                </div>
                <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
                <p className="italic text-red-600">Read the news!</p>
                <Navbar/>

                <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
                    <Card className="md:w-1/3 w-full">
                        <CardContent>
                        
                        
                        <CardHeader className="text-xl font-bold">Attacker Overall Ranking</CardHeader>
                        <Separator className=""/>
                        <CardDescription className="space-y-3 mb-4 mt-4">
                            <p>This calculations don't take into account Friendship Bonus, Helper Bonus, Weather Boost, Blade Boost or Mushrooms. The scores shown are the average of the damage done by any Max Move from the attacker to all bosses of a Tier. The higher the score, the better it is.</p>
                        </CardDescription>
                        <Separator className="mt-4 mb-2"/>
                        <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
                            value={dmaxDifficulty}
                            onChange={(e) => handleDmaxDifficulty(e.target.value)}
                            >
                            <option value="raid-t1-dmax">Tier 1 Max Battles</option>
                            <option value="raid-t2-dmax">Tier 2 Max Battles</option>
                            <option value="raid-t3-dmax">Tier 3 Max Battles</option>
                            <option value="raid-t4-dmax">Tier 4 Max Battles</option>
                            <option value="raid-t5-dmax">Tier 5 Max Battles</option>
                            <option value="raid-t6-gmax">Gigantamax Battles</option>
                            <option value="raid-t6-gmax-standard">Standard Gigantamax Battles</option>
                        </select>
                        
                        <Separator className="mt-4"/>
                            <div className="flex flex-column items-center justify-center space-x-4 w-full">
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
                                                    className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 bg-white"}
                                                    src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(attacker?.pokemon.pokemonId, imageLinks )}
                                                    alt={attacker?.pokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                                                />
                                                
                                                <div className="space-y-1 w-full">
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-black">{PoGoAPI.getPokemonNamePB(attacker?.pokemon.pokemonId, allEnglishText)}</h3>
                                                        </div>
                                                        
                                                        <p className="text-sm italic textgray">#{index+1}</p>
                                                    </div>
                                                    <Separator className="mt-1 mb-1"/>
                                                    
                                                    
                                                    <div className="flex flex-row items-center justify-between space-x-4">

                                                        <h3 className="text-sm font-bold text-black">Global Score</h3>
                                                        <p>{attacker.tier.toFixed(4)}</p>
                                                    </div>
                                                    <Separator/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        
                                                        <h3 className="text-xl font-bold text-black">Percent to Best</h3>
                                                        <p className="font-bold text-black">
                                                            {((attacker.tier / bestAttackers[0].tier) * 100).toFixed(2).split('.')[0]}
                                                            <span className="text-xs align-top">.{((attacker.tier / bestAttackers[0].tier) * 100).toFixed(2).split('.')[1]}</span>%
                                                        </p>
                                                    </div>
                                                    <div className="w-full">
                                                        <Progress color={(attacker.tier / attackersToShow[0].tier) === 1 ? "violet" : (attacker.tier / bestAttackers[0].tier) > 0.75 ? "green" : (attacker.tier / bestAttackers[0].tier) > 0.6 ? "yellow" : (attacker.tier / bestAttackers[0].tier) > 0.5 ? "orange" : "red"} value={(attacker.tier / bestAttackers[0].tier) * 100}/>
                                                    </div>
                                                    
                                                <div className="flex flex-row items-center justify-between mx-4">
                                                    <button onClick={() => selectRanking(attacker?.pokemon.pokemonId)} className="w-full px-4 py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                                        Check Ranking
                                                    </button>
                                                </div>
                                                </div>
                                                
                                            </div>
                                        </Card>
                                    ))}
                                    </div>
                                    
                                </div>
                            
                            </CardContent>
                        </Card>
                    <Card className="md:w-1/3 w-full">
                        <CardContent>
                        
                        
                        <CardHeader className="text-xl font-bold">Tanks Overall Ranking</CardHeader>
                        <Separator className=""/>
                        <CardDescription className="space-y-3 mb-4 mt-4">
                            <p>This calculations don't take into account Friendship Bonus, Helper Bonus, Weather Boost, Blade Boost or Mushrooms. The scores shown are the average of all Tank Scores of one certain Pokémon against all bosses of a Tier. The lower the score, the better it is.</p>
                        </CardDescription>
                        <Separator className="mt-4 mb-2"/>
                            <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
                                value={dmaxDifficulty}
                                onChange={(e) => handleDmaxDifficulty(e.target.value)}
                            >
                                <option value="raid-t1-dmax">Tier 1 Max Battles</option>
                                <option value="raid-t2-dmax">Tier 2 Max Battles</option>
                                <option value="raid-t3-dmax">Tier 3 Max Battles</option>
                                <option value="raid-t4-dmax">Tier 4 Max Battles</option>
                                <option value="raid-t5-dmax">Tier 5 Max Battles</option>
                                <option value="raid-t6-gmax">Gigantamax Battles</option>
                                <option value="raid-t6-gmax-standard">Standard Gigantamax Battles</option>
                            </select>
                        
                        
                        <p className="italic text-slate-700 text-sm mb-4 mt-4"><Switch onCheckedChange={(checked) => handleSwitch(checked, setPrioritiseFast, "prioritise_fast_attack")} checked={prioritiseFast} /> Prioritise Fastest Attacks for Tanks</p>
                        <p className="italic text-slate-700 text-sm mb-4"><Switch onCheckedChange={(checked) => handleSwitch(checked, setZamaExtraShield, "zamazenta_extra_shield")} checked={zamaExtraShield} /> Include Zamazenta - Crowned Shield's Extra Shield</p>
                        
                        <p className="italic text-slate-700 text-sm ">Players in the team: {playersInTeam}</p>
                        <Slider onValueChange={(value) => handleSlider(value[0], setPlayersInTeam, "players_in_team")} value={[playersInTeam]} max={4} step={1} min={1} className="w-[60%] mb-4 mr-2 " color="bg-black"/>
                        
                        <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg "
                                value={rankingDisplay}
                                onChange={(e) => handleRankingConfig(e.target.value)}
                            >
                                <option value="HP_DMG">HP Damage on Average</option>
                                <option value="HP_PERCENT">HP% on Average</option>
                            </select>
                        <Separator className="mt-4"/>
                            <div className="flex flex-column items-center justify-center space-x-4 w-full">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="flex flex-row items-center justify-between space-x-4 w-full">
                                        <button onClick={toggleShowAllDefenders} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                            {showBestDefenders ? "Show Top 5 only" : "Show All"}
                                        </button>
                                    </div>
                                    {defendersToShow?.map((defender: any, index: number) => (
                                        <Card key={index} className="w-full">
                                            <div  className="flex flex-row  items-center justify-between space-x-4 w-full p-4">
                                                <Image
                                                    unoptimized
                                                    className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 bg-white"}
                                                    src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(defender?.pokemon.pokemonId, imageLinks )}
                                                    alt={defender?.pokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: 'scale-down', width: '80px', height: '80px' }}
                                                />
                                                
                                                <div className="space-y-1 w-full">
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-black">{PoGoAPI.getPokemonNamePB(defender?.pokemon.pokemonId, allEnglishText)}</h3>
                                                        </div>
                                                        
                                                        <p className="text-sm italic textgray">#{index+1}</p>
                                                    </div>
                                                    <Separator className="mt-1 mb-1"/>
                                                    
                                                    
                                                    <div className="flex flex-row items-center justify-between space-x-4">

                                                        <h3 className="text-sm font-bold text-black">Global Score</h3>
                                                        <p className={(prioritiseFast && ((defender.fastMove.durationMs / 500) > 1)) ? "text-red-600" : "text-black"}>{GetTankScore(defender)}</p>
                                                    </div>
                                                    <Separator/>
                                                    <div className="flex flex-row items-center justify-between space-x-4">
                                                        
                                                        <h3 className="text-xl font-bold text-black">Percent to Best</h3>
                                                        <p className={"font-bold " + ((prioritiseFast && ((defender.fastMove.durationMs / 500) > 1)) ? "text-red-600" : "text-black")}>
                                                            {((parseFloat(GetTankScore(defendersToShow[0])) / parseFloat(GetTankScore(defender))) * 100).toFixed(2).split('.')[0]}
                                                            <span className="text-xs align-top">.{((parseFloat(GetTankScore(defendersToShow[0])) / parseFloat(GetTankScore(defender))) * 100).toFixed(2).split('.')[1]}</span>%
                                                        </p>
                                                    </div>
                                                    <div className="w-full">
                                                        <Progress color={(parseFloat(GetTankScore(defendersToShow[0])) / parseFloat(GetTankScore(defender))) === 1 ? "violet" : (parseFloat(GetTankScore(defendersToShow[0])) / parseFloat(GetTankScore(defender))) > 0.75 ? "green" : (parseFloat(GetTankScore(defendersToShow[0])) / parseFloat(GetTankScore(defender))) > 0.6 ? "yellow" : (parseFloat(GetTankScore(defendersToShow[0])) / parseFloat(GetTankScore(defender))) > 0.5 ? "orange" : "red"} value={(parseFloat(GetTankScore(defendersToShow[0])) / parseFloat(GetTankScore(defender))) * 100}/>
                                                    </div>
                                                    
                                                <div className="flex flex-row items-center justify-between mx-4">
                                                    <button onClick={() => selectDefenderRanking(defender?.pokemon.pokemonId)} className="w-full px-4 py-2 text-white bg-primary rounded-lg space-y-4 mt-4 text-sm">
                                                        Check Ranking
                                                    </button>
                                                </div>
                                                </div>
                                                
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:w-2/3 w-full">
                            {showTierListAttackers.length > 0 ? (
                            <>
                                <CardHeader className="text-xl font-bold">Attacker Rankings</CardHeader>
                                <CardContent>
                                        <CardDescription className="space-y-3 mb-4">
                                            This list shows how well {PoGoAPI.getPokemonNamePB(showTierListAttackers[0].pokemon.pokemonId, allEnglishText)} performs against different bosses with different Max Moves. The tier is calculated based on the damage output and effectiveness of the move against the boss.
                                        </CardDescription>
                                        {showTierListAttackers.map((entry: any, index: number) => (
                                            <div key={index} className="mb-4">
                                                <div className="flex flex-column items-center justify-between space-x-4">
                                                    <div>
                                                        <p className="text-xs">{"Against " + entry.boss}</p>
                                                        <p className="font-bold">{(entry.pokemon.pokemonId.endsWith("GIGANTAMAX") ? "GMax " : "Max ") + PoGoAPI.getMoveNamePB(entry.maxmove.moveId, allEnglishText)}</p>
                                                    </div>
                                                    <p className="text-2xl font-bold">{entry.tier}</p>
                                                </div>
                                                <Progress value={entry.tier / getHighestElement().tier * 100} className={`mb-2 bg-gray-900`} color={`type-${PoGoAPI.formatTypeName(entry.maxmove.type).toLowerCase()}`} />
                                            </div>
                                        ))}
                                </CardContent>
                            </>
                            ) : showTierListDefenders.length > 0 ? (
                            <>
                                <CardHeader className="text-xl font-bold">Defender Rankings</CardHeader>
                                <CardContent>
                                        <CardDescription className="space-y-3 mb-4">
                                            This list shows how well {PoGoAPI.getPokemonNamePB(showTierListDefenders[0].pokemon.pokemonId, allEnglishText)} performs against different bosses as a Tank. This scores are the same as the "Tank Score" shown for each option on Max Rankings.
                                        </CardDescription>
                                        {showTierListDefenders.map((entry: any, index: number) => (
                                            <div key={index} className="mb-4">
                                                <div className="flex flex-column items-center justify-between space-x-4">
                                                    <div>
                                                        <p className="text-xs">{"Against " + entry.boss}</p>
                                                        
                                                    </div>
                                                    <p className="text-2xl font-bold">{GetTankScore(entry)}</p>
                                                </div>
                                                <Progress value={getLowestElement().tier / entry.tier * 100} className={`mb-2 bg-gray-900`} />
                                            </div>
                                        ))}
                                </CardContent>
                            </>) : (
                            <>
                            
                                <CardHeader className="text-xl font-bold">Select a Pokémon</CardHeader>
                                <CardContent>
                                        <CardDescription className="space-y-3 mb-4">
                                            Select a Pokémon to see how it performs against different bosses!
                                        </CardDescription>
                                </CardContent>
                            </>
                            )}
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
                    PokéChespin Max General Rankings
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
