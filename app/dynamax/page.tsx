"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchBarAttacker from "@/components/search-bar-attacker";
import { PoGoAPI } from "../../lib/PoGoAPI";
import CalculateButton from "@/components/calculate-button";
import CalculateButtonSimulate from "@/components/calculate-button-simulate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CalculateButtonSimulateAdvanced from "@/components/calculate-button-advanced-simulate";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchBarAttackerDynamax from "@/components/search-bar-attacker-dynamax";
import SearchBarDefenderDynamax from "@/components/search-bar-defender-dynamax";

export default function Home() {
  const [attackingPokemon, setAttackingPokemon] = useState<any>(Array(4).fill(Array(3).fill(null)));
  const [defendingPokemon, setDefendingPokemon] = useState<any>(null);
  const [selectedQuickMoveAttacker, setSelectedQuickMoveAttacker] = useState<any | null>(Array(4).fill(Array(3).fill(null)));
  const [selectedChargedMoveAttacker, setSelectedChargedMoveAttacker] = useState<any | null>(Array(4).fill(Array(3).fill(null)));
  const [selectedQuickMoveDefender, setSelectedQuickMoveDefender] = useState<any | null>(null);
  const [selectedChargedMoveDefender, setSelectedChargedMoveDefender] = useState<any | null>(null);
  const [attackerStats, setAttackerStats] = useState<any>(Array(4).fill(Array(3).fill([50, 15, 15, 15])));
  const [defenderStats, setDefenderStats] = useState<any | null>([40, 15, 15, 15]);
  const [raidMode, setRaidMode] = useState<any>("normal");
  const [bonusAttacker, setBonusAttacker] = useState<any[]>(Array(4).fill(Array(3).fill(["EXTREME", false, false, 0])));
  const [bonusDefender, setBonusDefender] = useState<any[]>(["EXTREME", false, false, 0]);
  const [pokemonList, setAllPokemonPB] = useState<any>(null);
  const [searchBarNames, setSearchBarNames] = useState<any>(null);
  const [allMoves, setAllMoves] = useState<any>(null);
  const [imageLinks, setImageLinks] = useState<any>(null);
  const [allEnglishText, setAllEnglishText] = useState<any>(null);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);

  const [selectedMember, setSelectedMember] = useState<number>(1);
  const [selectedPokemonSlot, setSelectedPokemonSlot] = useState<number>(1);


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

      
      setAllDataLoaded(true);
    };
    fetchAllPokemonPB();
    
  }, []);

  const handleAttackerSelect = (pokemon: any, member: any, slot: any) => {
    if (pokemon === null) {
      const newAttackingPokemon = attackingPokemon.map((memberArray: any[], index: number) => 
        index === member - 1 ? memberArray.map((poke: any, slotIndex: number) => 
          slotIndex === slot - 1 ? null : poke
        ) : memberArray
      );
      setAttackingPokemon(newAttackingPokemon);
      const newQuickMoveList = selectedQuickMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? null : m
        ) : memberArray
      );
      setSelectedQuickMoveAttacker(newQuickMoveList);
      const newChargedMoveList = selectedChargedMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? null : m
        ) : memberArray
      );
      setSelectedChargedMoveAttacker(newChargedMoveList);
      const newStats = attackerStats.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((stat: any, slotIndex: number) =>
          slotIndex === slot - 1 ? [50, 15, 15, 15] : stat
        ) : memberArray
      );
      setAttackerStats(newStats);
    }
    if (pokemon !== undefined) {
      const newAttackingPokemon = attackingPokemon.map((memberArray: any[], index: number) => 
        index === member - 1 ? memberArray.map((poke: any, slotIndex: number) => 
          slotIndex === slot - 1 ? pokemon : poke
        ) : memberArray
      );
      setAttackingPokemon(newAttackingPokemon);
    }
  };

  useEffect(() => {
    console.log(attackingPokemon)
    console.log(attackingPokemon[0][0]?.pokemonId);
  }, [attackingPokemon]);

  useEffect(() => {
    console.log(selectedQuickMoveAttacker);
  }, [selectedQuickMoveAttacker]);

  useEffect(() => {
    console.log(selectedChargedMoveAttacker);
  }, [selectedChargedMoveAttacker]);

  const handleDefenderSelect = (pokemon: any) => {
    if (pokemon !== undefined) {
      setDefendingPokemon(pokemon);
      setSelectedQuickMoveDefender(null);
      setSelectedChargedMoveDefender(null);
    }
  };

  const handleQuickMoveSelectAttacker = (moveId: any, move: any, member: any, slot: any) => {
    if (move !== undefined) {
      const newMoveList = selectedQuickMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? move : m
        ) : memberArray
      );
      setSelectedQuickMoveAttacker(newMoveList);
    }
  };

  const handleChargedMoveSelectAttacker = (moveId: any, move: any, member: any, slot: any) => {
    if (move !== undefined) {
      const newMoveList = selectedChargedMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? move : m
        ) : memberArray
      );
      setSelectedChargedMoveAttacker(newMoveList);
    }
  };

  const handleQuickMoveSelectDefender = (moveId: string, move: any) => {
    setSelectedQuickMoveDefender(move);
  };

  const handleChargedMoveSelectDefender = (moveId: string, move: any) => {
    setSelectedChargedMoveDefender(move);
  };

  const handleChangedStatsAttacker = (stats: any, member:any, slot:any) => {
    const newStats = attackerStats.map((memberArray: any[], index: number) =>
      index === member - 1 ? memberArray.map((stat: any, slotIndex: number) =>
        slotIndex === slot - 1 ? stats : stat
      ) : memberArray
    );
    setAttackerStats(newStats);
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

  useEffect(() => {
    console.log("Selected member: ", selectedMember);
  }, [selectedMember]);

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

  const raidSurname = (raidMode: string) => {
    if (raidMode === "raid-t1-dmax") {
      return "Tier 1 Dynamax";
    } else if (raidMode === "raid-t2-dmax") {
      return "Tier 2 Dynamax";
    } else if (raidMode === "raid-t3-dmax") {
      return "Tier 3 Dynamax";
    } else if (raidMode === "raid-t4-dmax") {
      return "Tier 4 Dynamax";
    } else if (raidMode === "raid-t5-dmax") {
      return "Tier 5 Dynamax";
    } else if (raidMode === "raid-t6-gmax") {
      return "Gigantamax";
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
      <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
        <h1 className="title">
        Pokémon GO Damage (and PC) Calculator</h1>
      <img src="/favicon.ico" alt="Favicon" className="inline-block ml-2 favicon" />
      </div>
      <p className="italic text-sm font-bold">Now running Dynamax simulations!</p>
      <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
      
      <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
        <Card className="md:w-1/2 w-full">
          <CardHeader>
            <CardTitle>Attacking Team</CardTitle>
            <CardDescription>Set an attacking Team</CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>
          </CardHeader>
          {(pokemonList && searchBarNames && allMoves) ? (
          <CardContent>
            <Tabs defaultValue="member-1" className="">
              <TabsList className="flex flex-row items-center space-x-4 w-full">
                <TabsTrigger value="member-1" onClick={() => setSelectedMember(1)}>M1</TabsTrigger>
                <TabsTrigger value="member-2" onClick={() => setSelectedMember(2)}>M2</TabsTrigger>
                <TabsTrigger value="member-3" onClick={() => setSelectedMember(3)}>M3</TabsTrigger>
                <TabsTrigger value="member-4" onClick={() => setSelectedMember(4)}>M4</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="pokemon-1" className="">
              <TabsList className="flex flex-row items-center space-x-4 w-full">
                <TabsTrigger value="pokemon-1" className={attackingPokemon[selectedMember-1][0] !== null ? selectedChargedMoveAttacker[selectedMember-1][0] !== null && selectedQuickMoveAttacker[selectedMember-1][0] !== null ? "green text-white data-[state=active]:bg-green-500" : "bg-blue-500 text-white data-[state=active]:bg-blue-500" : "bg-red-500 text-white data-[state=active]:bg-red-500" } onClick={() => setSelectedPokemonSlot(1)}>P1</TabsTrigger>
                <TabsTrigger value="pokemon-2" className={attackingPokemon[selectedMember-1][1] !== null ? selectedChargedMoveAttacker[selectedMember-1][1] !== null && selectedQuickMoveAttacker[selectedMember-1][1] !== null ? "green text-white data-[state=active]:bg-green-500" : "bg-blue-500 text-white data-[state=active]:bg-blue-500" : "bg-red-500 text-white data-[state=active]:bg-red-500" } onClick={() => setSelectedPokemonSlot(2)}>P2</TabsTrigger>
                <TabsTrigger value="pokemon-3" className={attackingPokemon[selectedMember-1][2] !== null ? selectedChargedMoveAttacker[selectedMember-1][2] !== null && selectedQuickMoveAttacker[selectedMember-1][2] !== null ? "green text-white data-[state=active]:bg-green-500" : "bg-blue-500 text-white data-[state=active]:bg-blue-500" : "bg-red-500 text-white data-[state=active]:bg-red-500" } onClick={() => setSelectedPokemonSlot(3)}>P3</TabsTrigger>
              </TabsList>
            </Tabs>

            <div>
            
          <p className="text-primary text-sm my-2 mx-2">Checking member {selectedMember}, Pokémon slot {selectedPokemonSlot}...</p>
            {Array.from({ length: 4 }, (_, memberIndex) => (
              <div key={memberIndex}>
                {Array.from({ length: 3 }, (_, slotIndex) => (
                  selectedMember === memberIndex + 1 && selectedPokemonSlot === slotIndex + 1 && (
                    <SearchBarAttackerDynamax
                      key={`${memberIndex}-${slotIndex}`}
                      allEnglishText={allEnglishText}
                      assets={imageLinks}
                      allMoves={allMoves}
                      searchBarNames={searchBarNames}
                      pokemonList={pokemonList}
                      onSelect={(pokemon) => handleAttackerSelect(pokemon, memberIndex + 1, slotIndex + 1)}
                      onQuickMoveSelect={handleQuickMoveSelectAttacker}
                      onChargedMoveSelect={handleChargedMoveSelectAttacker}
                      onChangedStats={handleChangedStatsAttacker}
                      onClickedClearButton={() => handleAttackerSelect(null, memberIndex + 1, slotIndex + 1)}
                      slot={slotIndex + 1}
                      paramsLoaded={paramsLoaded}
                      member={memberIndex + 1}
                      number={slotIndex + 1}
                      initialValues={{
                        
                        attacker: attackingPokemon[memberIndex][slotIndex],
                        quickMove: selectedQuickMoveAttacker[memberIndex][slotIndex],
                        chargedMove: selectedChargedMoveAttacker[memberIndex][slotIndex],
                        attackerStats: attackerStats[memberIndex][slotIndex],
                      }
                      }
                    />
                  )
                ))}
              </div>
            ))}
          </div>
          </CardContent>
            ) : (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4 mb-4">
          <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
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
            <SearchBarDefenderDynamax
              allEnglishText={allEnglishText}
              assets={imageLinks}
              allMoves={allMoves}
              searchBarNames={searchBarNames}
              pokemonList={pokemonList}
              onSelect={handleDefenderSelect}
              onQuickMoveSelect={handleQuickMoveSelectDefender}
              onChargedMoveSelect={handleChargedMoveSelectDefender}
              onChangedStats={handleChangedStatsDefender}
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
            /></CardContent>) : (
              <div className="flex flex-col items-center justify-center space-y-2 mt-4 mb-4">
                <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
                <p className="text-primary text-lg">Loading...</p>
              </div>
            )}
        </Card>
        <Card className="md:w-1/2 w-full ">
            <CardHeader >
              <CardTitle>Results</CardTitle>
              <CardDescription>Assumming the following stats:</CardDescription>
              <CardDescription>Attacker: {attackingPokemon[selectedMember-1][selectedPokemonSlot-1] !== null ? PoGoAPI.getPokemonNamePB((attackingPokemon[selectedMember-1][selectedPokemonSlot-1])?.pokemonId, allEnglishText)  + " (Level " + attackerStats[selectedMember-1][selectedPokemonSlot-1][0] + " " + attackerStats[selectedMember-1][selectedPokemonSlot-1][1] + "-" + attackerStats[selectedMember-1][selectedPokemonSlot-1][2] + "-" + attackerStats[selectedMember-1][selectedPokemonSlot-1][3] + ")" : "TBD"}</CardDescription>
              <CardDescription>Defender: {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} {PoGoAPI.getPokemonNamePB(defendingPokemon?.pokemonId, allEnglishText) !== "???" ? (bonusDefender[1] !== false ? "Shadow " : "") + (PoGoAPI.getPokemonNamePB(defendingPokemon?.pokemonId, allEnglishText) + (raidMode === "normal" ? (" (Level " + defenderStats[0] + " " + defenderStats[1] + "-" + defenderStats[2] + "-" + defenderStats[3] + ")") : "")): "TBD"}</CardDescription>
            </CardHeader>
            <CardContent>
              
            
            
            <p className="italic text-slate-700 text-sm">Raid difficulty: </p>
              <select onChange={handleSwitch} value={raidMode} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                
                <option key={"raid-t1-dmax"} value={"raid-t1-dmax"}>Tier-1 Dynamax Raid (1700HP) </option>
                <option key={"raid-t2-dmax"} value={"raid-t2-dmax"}>Tier-2 Dynamax Raid (5000HP) </option>
                <option key={"raid-t3-dmax"} value={"raid-t3-dmax"}>Tier-3 Dynamax Raid (10000HP) </option>
                <option key={"raid-t4-dmax"} value={"raid-t4-dmax"}>Tier-4 Dynamax Raid (20000HP) </option>
                <option key={"raid-t5-dmax"} value={"raid-t5-dmax"}>Tier-5 Dynamax Raid (60000HP) BETA </option>
                <option key={"raid-t6-gmax"} value={"raid-t6-gmax"}>Gigantamax Raid (90000HP) </option>

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
                attacker={attackingPokemon[selectedMember-1][selectedPokemonSlot-1]} 
                defender={defendingPokemon} 
                move={selectedQuickMoveAttacker[selectedMember-1][selectedPokemonSlot-1]} 
                attackerStats={attackerStats[selectedMember-1][selectedPokemonSlot-1]}
                defenderStats={defenderStats}
                bonusAttacker={bonusAttacker[selectedMember-1][selectedPokemonSlot-1]}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                />
            </CardContent>
            <CardContent>
              <CardDescription> Damage dealt per charged attack</CardDescription>
              <CalculateButton 
                allEnglishText={allEnglishText}
                attacker={attackingPokemon[selectedMember-1][selectedPokemonSlot-1]} 
                defender={defendingPokemon} 
                move={selectedChargedMoveAttacker[selectedMember-1][selectedPokemonSlot-1]}
                attackerStats={attackerStats[selectedMember-1][selectedPokemonSlot-1]}
                defenderStats={defenderStats}
                bonusAttacker={bonusAttacker[selectedMember-1][selectedPokemonSlot-1]}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
              />
            </CardContent>
            <CardContent>
            <CardDescription> Advanced simulation (random)</CardDescription>
            
            <CardDescription className="italic">To be able to run a simulation, every selectable Pokémon on the Attacking Team should be correctly configured (button will be displayed in green if that case is given.)</CardDescription>
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
                />
            </CardContent>
        </Card>
      </div>
      
      <p className="bottomtext">Version 1.8.1</p>
      <p className="linktext">Pokémon GO API used: <a className="link" href="https://github.com/pokemon-go-api/pokemon-go-api">mario6700-pogo</a> and <a className="link" href="https://www.pokebattler.com">PokéBattler</a></p>
      <Avatar className="mb-4">
        <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
        <AvatarFallback>CB</AvatarFallback>
      </Avatar>
      <p className="mb-4 bottomtext">Any issues? open a new issue or create a pull request on the <a className="link" href="https://github.com/CreatorBeastGD/pokemongo_damage_calculator/issues">repository</a> to help this project!</p>
      <p></p>
    </div>
  );
}


/*

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

*/