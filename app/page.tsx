"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchBarAttacker from "@/components/search-bar-attacker";
import { PoGoAPI } from "../lib/PoGoAPI";
import CalculateButton from "@/components/calculate-button";
import CalculateButtonSimulate from "@/components/calculate-button-simulate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CalculateButtonSimulateAdvanced from "@/components/calculate-button-advanced-simulate";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CookieBanner from "@/components/cookie-banner";
import Navbar from "@/components/navbar";

export default function Home() {
  const [attackingPokemon, setAttackingPokemon] = useState<any>(null);
  const [defendingPokemon, setDefendingPokemon] = useState<any>(null);
  const [selectedQuickMoveAttacker, setSelectedQuickMoveAttacker] = useState<any | null>(null);
  const [selectedChargedMoveAttacker, setSelectedChargedMoveAttacker] = useState<any | null>(null);
  const [selectedQuickMoveDefender, setSelectedQuickMoveDefender] = useState<any | null>(null);
  const [selectedChargedMoveDefender, setSelectedChargedMoveDefender] = useState<any | null>(null);
  const [attackerStats, setAttackerStats] = useState<any | null>([50, 15, 15, 15]);
  const [defenderStats, setDefenderStats] = useState<any | null>([50, 15, 15, 15]);
  const [raidMode, setRaidMode] = useState<any>("normal");
  const [bonusAttacker, setBonusAttacker] = useState<any[]>(["EXTREME", false, false, 0]);
  const [bonusDefender, setBonusDefender] = useState<any[]>(["EXTREME", false, false, 0]);
  const [pokemonList, setAllPokemonPB] = useState<any>(null);
  const [searchBarNames, setSearchBarNames] = useState<any>(null);
  const [allMoves, setAllMoves] = useState<any>(null);
  const [imageLinks, setImageLinks] = useState<any>(null);
  const [allEnglishText, setAllEnglishText] = useState<any>(null);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);
  const [advEffect, setAdvEffect] = useState<string>("none");

   const [types, setTypes] = useState<any>(null);

  const [defenderBonusBug, setDefenderBonusBug] = useState<any>("EXTREME,false,false,0");

  

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchAllPokemonPB = async () => {
      setDefenderBonusBug(searchParams.get("defender_bonuses") ?? "EXTREME,false,false,0");
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

      
      setAllDataLoaded(true);
    };
    fetchAllPokemonPB();
    
  }, []);

  useEffect(() => {
    if (allDataLoaded) {
      //console.log ("All data loaded, checking for URL parameters");
      const loadParams = () => {
        const attacker = searchParams.get("attacker");
        const defender = searchParams.get("defender");
        const attackerStats = searchParams.get("attacker_stats");
        const defenderStats = searchParams.get("defender_stats");
        const bonusAttacker = searchParams.get("attacker_bonuses");
        const bonusDefender = searchParams.get("defender_bonuses");
        const attackerFastAttack = searchParams.get("attacker_fast_attack");
        const defenderFastAttack = searchParams.get("defender_fast_attack");
        const attackerChargedAttack = searchParams.get("attacker_cinematic_attack");
        const defenderChargedAttack = searchParams.get("defender_cinematic_attack");
        const weather = searchParams.get("weather");
        const raidMode = searchParams.get("raid_mode");
        const advEffect = searchParams.get("adv_effect");

        if (attacker) {
          const attackerPokemon = PoGoAPI.getPokemonPBByID(attacker, pokemonList)[0];
          setAttackingPokemon(attackerPokemon);
        }
        if (defender) {
          const defenderPokemon = PoGoAPI.getPokemonPBByID(defender, pokemonList)[0];
          setDefendingPokemon(defenderPokemon);
        }
        if (attackerFastAttack) {
          const fastAttack = PoGoAPI.getMovePBByID(attackerFastAttack, allMoves);
          setSelectedQuickMoveAttacker(fastAttack);
        }
        if (attackerChargedAttack) {
          const chargedAttack = PoGoAPI.getMovePBByID(attackerChargedAttack, allMoves);
          setSelectedChargedMoveAttacker(chargedAttack);
        }
        if (defenderFastAttack) {
          const fastAttack = PoGoAPI.getMovePBByID(defenderFastAttack, allMoves);
          setSelectedQuickMoveDefender(fastAttack);
        }
        if (defenderChargedAttack) {
          const chargedAttack = PoGoAPI.getMovePBByID(defenderChargedAttack, allMoves);
          setSelectedChargedMoveDefender(chargedAttack);
        }
        if (attackerStats) {
          setAttackerStats(attackerStats.split(",").map((stat: string) => parseFloat(stat)));
        }
        if (defenderStats) {
          setDefenderStats(defenderStats.split(",").map((stat: string) => parseFloat(stat)));
        }
        //console.log("BA", bonusAttacker);
        if (bonusAttacker) {
          const ba = bonusAttacker.split(",");
          ba[0] = weather ? weather : ba[0];
          setBonusAttacker(ba);
        } if (bonusAttacker === null) {
          setBonusAttacker([weather ? weather : "EXTREME", false, false, 0]);
        }
        //console.log("BD", bonusDefender);
        if (bonusDefender) {
          setBonusDefender(defenderBonusBug.split(","));
        }
        if (raidMode) {
          setRaidMode(raidMode);
        }
        if (advEffect) {
          setAdvEffect(advEffect);
        }
        setParamsLoaded(true);
      }
      loadParams();
    }
  }, [allDataLoaded]);

  const handleAttackerSelect = (pokemon: any) => {
    if (pokemon !== undefined) {
      setAttackingPokemon(pokemon);
      setSelectedQuickMoveAttacker(null);
      setSelectedChargedMoveAttacker(null);
    }
  };

  const handleDefenderSelect = (pokemon: any) => {
    if (pokemon !== undefined) {
      setDefendingPokemon(pokemon);
      setSelectedQuickMoveDefender(null);
      setSelectedChargedMoveDefender(null);
    }
  };

  const handleQuickMoveSelectAttacker = (moveId: string, move: any) => {
    setSelectedQuickMoveAttacker(move);
  };

  const handleChargedMoveSelectAttacker = (moveId: string, move: any) => {
    setSelectedChargedMoveAttacker(move);
  };

  const handleQuickMoveSelectDefender = (moveId: string, move: any) => {
    setSelectedQuickMoveDefender(move);
  };

  const handleChargedMoveSelectDefender = (moveId: string, move: any) => {
    setSelectedChargedMoveDefender(move);
  };

  const handleChangedStatsAttacker = (stats: any) => {
    setAttackerStats(stats);
  };

  const handleChangedStatsDefender = (stats: any) => {
    setDefenderStats(stats);
  };

  const handleBonusChangeAttacker = (bonus: any) => {
    setBonusAttacker(bonus);
  };

  const handleBonusChangeDefender = (bonus: any) => {
    setBonusDefender(bonus);
  };

  const handleBonusChange = (value: string) => {
    setBonusAttacker([value, bonusAttacker[1], bonusAttacker[2], bonusAttacker[3]]);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("weather", value);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }

  const handleSwitch = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRaidMode(event.target.value);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("raid_mode", event.target.value);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }

  const handleAdvEffectChange = (value: string) => {
    setAdvEffect(value);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("adv_effect", value);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }

  const raidSurname = (raidMode: string) => {
    if (raidMode === "raid-t1") {
      return "Tier 1";
    } else if (raidMode === "raid-t3") {
      return "Tier 3";
    } else if (raidMode === "raid-t4") {
      return "Tier 4";
    } else if (raidMode === "raid-mega") {
      return "Mega";
    } else if (raidMode === "raid-t5") {
      return "Tier 5";
    } else if (raidMode === "raid-elite") {
      return "Elite";
    } else if (raidMode === "raid-primal") {
      return "Primal";
    } else if (raidMode === "raid-mega-leg") {
      return "Mega Legendary";
    } else if (raidMode === "raid-t7-supermega") {
      return "Super Mega";
    } else if (raidMode === "raid-t1-shadow") {
      return "Tier 1 Shadow";
    } else if (raidMode === "raid-t3-shadow") {
      return "Tier 3 Shadow";
    } else if (raidMode === "raid-t5-shadow") {
      return "Tier 5 Shadow";
    } else {
      return "Normal";
    }
  }

  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  function checkBreakpoints(event: React.MouseEvent<HTMLButtonElement>): void {
    if (defenderStats && attackingPokemon && defendingPokemon && selectedQuickMoveAttacker && selectedChargedMoveAttacker) {
      const newUrl = `${window.location.origin}${window.location.pathname}/breakpoints?${searchParams.toString()}`;
      router.push(newUrl);
    } else {
      alert("Please select all required fields before checking breakpoints! (Attacker Pokémon, Defender Pokémon, Attacker's Fast Attack, Attacker's Charged Attack)");
    }
      
  }

  return (
    <div className="flex flex-col flex-row items-center justify-center space-y-4">
      <div className="flex flex-row items-center justify-center space-x-4">
        <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
        <a href="/pokemon-go-damage-calculator">
        <h1 className="mb-10 title">
        PokéChespin for Raids
        </h1>
        </a>
      <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
      </div>
      <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
      
      <Navbar/>
      <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
        <Card className="md:w-1/2 w-full">
          <CardHeader>
            <CardTitle>Attacking Pokémon</CardTitle>
            <CardDescription>Set an attacking Pokémon</CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>
          </CardHeader>
          {(pokemonList && searchBarNames && allMoves) ? (
            <CardContent>
            <SearchBarAttacker
              allEnglishText={allEnglishText}
              assets={imageLinks}
              allMoves={allMoves}
              searchBarNames={searchBarNames}
              pokemonList={pokemonList}
              onSelect={handleAttackerSelect}
              onQuickMoveSelect={handleQuickMoveSelectAttacker}
              onChargedMoveSelect={handleChargedMoveSelectAttacker}
              onChangedStats={handleChangedStatsAttacker}
              onBonusChange={handleBonusChangeAttacker}
              slot={1}
              initialValues={
                {
                  attacker: attackingPokemon,
                  quickMove: selectedQuickMoveAttacker,
                  chargedMove: selectedChargedMoveAttacker,
                  attackerStats: attackerStats,
                  bonusAttacker: bonusAttacker
                }
              }
              paramsLoaded={paramsLoaded}
              allTypes={types}
            />
          </CardContent>) : (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4 mb-4">
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
        </Card>
        <Card className="md:w-1/2 w-full">
          <CardHeader>
            <CardTitle>Defending Pokémon</CardTitle>
            <CardDescription>Set a defending Pokémon</CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>
          </CardHeader>
          {(pokemonList && searchBarNames && allMoves) ? (
            <CardContent>
            <SearchBarAttacker
              allEnglishText={allEnglishText}
              assets={imageLinks}
              allMoves={allMoves}
              searchBarNames={searchBarNames}
              pokemonList={pokemonList}
              onSelect={handleDefenderSelect}
              onQuickMoveSelect={handleQuickMoveSelectDefender}
              onChargedMoveSelect={handleChargedMoveSelectDefender}
              onChangedStats={handleChangedStatsDefender}
              onBonusChange={handleBonusChangeDefender}
              raidMode={raidMode}
              slot={2}
              initialValues={
                {
                  attacker: defendingPokemon,
                  quickMove: selectedQuickMoveDefender,
                  chargedMove: selectedChargedMoveDefender,
                  attackerStats: defenderStats,
                  bonusAttacker: bonusDefender
                }
              }
              paramsLoaded={paramsLoaded}
              allTypes={types}
              
            /></CardContent>) : (
              <div className="flex flex-col items-center justify-center space-y-2 mt-4 mb-4">
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                <p className="text-primary text-lg">Loading...</p>
              </div>
            )}
        </Card>
        <Card className="md:w-1/2 w-full ">
            <CardHeader >
              <CardTitle>Results</CardTitle>
              <CardDescription>Assumming the following stats:</CardDescription>
              <CardDescription>Attacker: {PoGoAPI.getPokemonNamePB(attackingPokemon?.pokemonId, allEnglishText) !== "???" ? (bonusAttacker[1] !== false ? "Shadow " : "") + PoGoAPI.getPokemonNamePB(attackingPokemon?.pokemonId, allEnglishText)  + " (Level " + attackerStats[0] + " " + attackerStats[1] + "-" + attackerStats[2] + "-" + attackerStats[3] + ")" : "TBD"}</CardDescription>
              <CardDescription>Defender: {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} {PoGoAPI.getPokemonNamePB(defendingPokemon?.pokemonId, allEnglishText) !== "???" ? (bonusDefender[1] !== false ? "Shadow " : "") + (PoGoAPI.getPokemonNamePB(defendingPokemon?.pokemonId, allEnglishText) + (raidMode === "normal" ? (" (Level " + defenderStats[0] + " " + defenderStats[1] + "-" + defenderStats[2] + "-" + defenderStats[3] + ")") : "")): "TBD"}</CardDescription>
            </CardHeader>
            <CardContent>
            <p className="italic text-slate-700 text-sm">Weather: </p>
            <select onChange={(e) => handleBonusChange(e.target.value)} value={bonusAttacker[0]} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
              <option value="EXTREME">Extreme</option>
              <option value="SUNNY">Sunny</option>
              <option value="WINDY">Windy</option>
              <option value="RAINY">Rainy</option>
              <option value="FOG">Fog</option>
              <option value="PARTLY_CLOUDY">Partly Cloudy</option>
              <option value="CLOUDY">Cloudy</option>
              <option value="SNOW">Snow</option>
            </select>
            
            <p className="italic text-slate-700 text-sm">Raid difficulty: </p>
              <select onChange={handleSwitch} value={raidMode} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                <option key="normal" value="normal">Default (Gym Battle)</option>
                <option key={"raid-t1"} value={"raid-t1"}>Tier-1 Raid (600HP) </option>
                <option key={"raid-t3"} value={"raid-t3"}>Tier-3 Raid (3600HP) </option>
                <option key={"raid-t4"} value={"raid-t4"}>Tier-4 Raid (9000HP) </option>
                <option key={"raid-t5"} value={"raid-t5"}>Tier-5 Raid (15000HP) </option>
                <option key={"raid-mega"} value={"raid-mega"}>Mega Raid (9000HP) </option>
                <option key={"raid-mega-leg"} value={"raid-mega-leg"}>Mega Legendary Raid (22500HP) </option>
                <option key={"raid-t7-supermega"} value={"raid-t7-supermega"}>Super Mega Raid (25000HP) </option>
                <option key={"raid-elite"} value={"raid-elite"}>Elite Raid (20000HP) </option>
                <option key={"raid-primal"} value={"raid-primal"}>Primal Raid (22500HP) </option>
                <option key={"raid-t1-shadow"} value={"raid-t1-shadow"}>Tier-1 Shadow Raid (600HP) </option>
                <option key={"raid-t3-shadow"} value={"raid-t3-shadow"}>Tier-3 Shadow Raid (3600HP) </option>
                <option key={"raid-t5-shadow"} value={"raid-t5-shadow"}>Tier-5 Shadow Raid (15000HP) </option>
              </select>

            <p className="italic text-slate-700 text-sm">Adventure Effect: </p>
            <select onChange={(e) => handleAdvEffectChange(e.target.value)} value={advEffect} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
              <option value={"none"}>No Adventure Effect</option>
              <option value={"blade"}>Behemoth Blade (x1.1 ATK)</option>
              <option value={"bash"}>Behemoth Bash (x1.1 DEF)</option>
            </select>

              <div className="flex flex-row items-center justify-center space-x-4 mt-4 mb-4 w-full">
              <button onClick={copyLinkToClipboard} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                Copy setup link
              </button>
              <a href={"https://pokemongo-damage-calculator.vercel.app"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Clean this setup
                </button>
              </a>
              <button onClick={checkBreakpoints} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                Breakpoint Check
              </button>
              </div>

              <CardDescription> Damage dealt per fast attack</CardDescription>
              <CalculateButton 
                allEnglishText={allEnglishText}
                attacker={attackingPokemon} 
                defender={defendingPokemon} 
                move={selectedQuickMoveAttacker} 
                attackerStats={attackerStats}
                defenderStats={defenderStats}
                bonusAttacker={bonusAttacker}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                additionalBonus={advEffect === "blade" ? 1.1 : 1}
                bladeBoost={advEffect === "blade"}
                />
            </CardContent>
            <CardContent>
              <CardDescription> Damage dealt per charged attack</CardDescription>
              <CalculateButton 
                allEnglishText={allEnglishText}
                attacker={attackingPokemon} 
                defender={defendingPokemon} 
                move={selectedChargedMoveAttacker}
                attackerStats={attackerStats}
                defenderStats={defenderStats}
                bonusAttacker={bonusAttacker}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                additionalBonus={advEffect === "blade" ? 1.1 : 1}
                bladeBoost={advEffect === "blade"}
              />
            </CardContent>
            <CardContent>
              <CardDescription> Time to defeat using fast and charged attacks</CardDescription>
              <CalculateButtonSimulate 
                allEnglishText={allEnglishText}
                attacker={attackingPokemon} 
                defender={defendingPokemon} 
                quickMove={selectedQuickMoveAttacker} 
                chargedMove={selectedChargedMoveAttacker}
                attackerStats={attackerStats}
                defenderStats={defenderStats}
                raidMode={raidMode}
                bonusAttacker={bonusAttacker}
                bonusDefender={bonusDefender}
                bladeBoost={advEffect === "blade"}
                />
            </CardContent>
            <CardContent>
              <CardDescription> Advanced simulation (random)</CardDescription>
              <CalculateButtonSimulateAdvanced 
                allEnglishText={allEnglishText}
                attacker={attackingPokemon} 
                defender={defendingPokemon} 
                quickMove={selectedQuickMoveAttacker} 
                chargedMove={selectedChargedMoveAttacker}
                quickMoveDefender={selectedQuickMoveDefender}
                chargedMoveDefender={selectedChargedMoveDefender}
                attackerStats={attackerStats}
                defenderStats={defenderStats}
                raidMode={raidMode}
                bonusAttacker={bonusAttacker}
                bonusDefender={bonusDefender}
                boost={advEffect}
                />
            </CardContent>
        </Card>
      </div>
      
      <p className="bottomtext">Version {PoGoAPI.getVersion()}</p>
      <Avatar className="mb-4">
        <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
        <AvatarFallback>CB</AvatarFallback>
      </Avatar>
      <p className="mb-4 bottomtext">Any issues? open a new issue or create a pull request on the <a className="link" href="https://github.com/CreatorBeastGD/pokemongo_damage_calculator/issues">repository</a> to help this project!</p>
      <h1 className="textslate">Pokémon GO Damage Calculator | PokéChespin</h1>
      
      <CookieBanner />
    </div>
    
  );
}