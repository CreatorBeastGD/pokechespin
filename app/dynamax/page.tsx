"use client"

import React, { use, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PoGoAPI } from "../../lib/PoGoAPI";
import CalculateButton from "@/components/calculate-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchBarAttackerDynamax from "@/components/search-bar-attacker-dynamax";
import SearchBarDefenderDynamax from "@/components/search-bar-defender-dynamax";
import CalculateButtonSimulateAdvancedDynamax from "@/components/calculate-button-advanced-dynamax";
import CalculateButtonDynamax from "@/components/calculate-button-dynamax";
import { Calculator } from "../../lib/calculations";
import { Slider } from "@/components/ui/slider";
import CookieBanner from "@/components/cookie-banner";
import CalculateButtonMaxBoss from "@/components/calculate-button-maxboss";
import { Button } from "@/components/ui/button";

export default function Home() {
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [numMembers, setNumMembers] = useState<number>(searchParams.get("num_members") ? parseInt(searchParams.get("num_members") as string) : 4);
  const [attackingPokemon, setAttackingPokemon] = useState<any>(Array(numMembers).fill(Array(3).fill(null)));
  const [defendingPokemon, setDefendingPokemon] = useState<any>(null);
  const [selectedQuickMoveAttacker, setSelectedQuickMoveAttacker] = useState<any | null>(Array(numMembers).fill(Array(3).fill(null)));
  const [selectedMaxMoveAttacker, setSelectedMaxMoveAttacker] = useState<any | null>(Array(numMembers).fill(Array(3).fill(null)));
  const [selectedChargedMoveAttacker, setSelectedChargedMoveAttacker] = useState<any | null>(Array(numMembers).fill(Array(3).fill(null)));
  const [selectedQuickMoveDefender, setSelectedQuickMoveDefender] = useState<any | null>(null);
  const [selectedChargedMoveDefender, setSelectedChargedMoveDefender] = useState<any | null>(null);
  const [attackerStats, setAttackerStats] = useState<any>(Array(numMembers).fill(Array(3).fill([50, 15, 15, 15])));
  const [maxMoves, setMaxMoves] = useState<any|null>(Array(numMembers).fill(Array(3).fill([1,0,0])));
  const [defenderStats, setDefenderStats] = useState<any | null>([40, 15, 15, 15]);
  const [raidMode, setRaidMode] = useState<any>(searchParams.get("raidMode") ? searchParams.get("raidMode") : "raid-t1-dmax");
  
  const [weather, setWeather] = useState<any>(searchParams.get("weather") ? searchParams.get("weather") : "EXTREME");
  const [bonusAttacker, setBonusAttacker] = useState<any[]>(Array(numMembers).fill(Array(3).fill([searchParams.get("weather") ? searchParams.get("weather") : "EXTREME", false, false, 0])));
  const [bonusDefender, setBonusDefender] = useState<any[]>([searchParams.get("weather") ? searchParams.get("weather") : "EXTREME", false, false, 0]);
  const [pokemonList, setAllPokemonPB] = useState<any>(null);
  const [searchBarNames, setSearchBarNames] = useState<any>(null);
  const [allMoves, setAllMoves] = useState<any>(null);
  const [imageLinks, setImageLinks] = useState<any>(null);
  const [allEnglishText, setAllEnglishText] = useState<any>(null);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);

  const [cleared, setCleared] = useState<boolean>(true);


  const [selectedMember, setSelectedMember] = useState<number>(searchParams.get("member") ? parseInt(searchParams.get("member") as string) : 1);
  const [selectedPokemonSlot, setSelectedPokemonSlot] = useState<number>(searchParams.get("slot") ? parseInt(searchParams.get("slot") as string) : 1);

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("num_members", numMembers.toString());
    setTimeout(() => {
      for (let j = numMembers + 1; j < 4 ; j++) {
        for (let i = 1; i <= 3; i++) {
          searchParams.delete(`attacker${j}${i}`);
          searchParams.delete(`attacker_fast_attack${j}${i}`);
          searchParams.delete(`attacker_cinematic_attack${j}${i}`);
          searchParams.delete(`attacker_stats${j}${i}`);
          searchParams.delete(`attacker_max_moves${j}${i}`);
        }
      }
      window.history.replaceState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
    }, 1);
  }, [numMembers]);

  const handleNumMembersChange = (value: number[]) => {
    const newNumMembers = value[0];

    if (selectedMember > newNumMembers)  {
      setSelectedMember(newNumMembers);
    }

    const newAttackingPokemon = [...attackingPokemon.slice(0, newNumMembers)];
    const newSelectedQuickMoveAttacker = [...selectedQuickMoveAttacker.slice(0, newNumMembers)];
    const newSelectedMaxMoveAttacker = [...selectedMaxMoveAttacker.slice(0, newNumMembers)];
    const newSelectedChargedMoveAttacker = [...selectedChargedMoveAttacker.slice(0, newNumMembers)];
    const newAttackerStats = [...attackerStats.slice(0, newNumMembers)];
    const newMaxMoves = [...maxMoves.slice(0, newNumMembers)];
    const newBonusAttacker = [...bonusAttacker.slice(0, newNumMembers)];

    // Add new empty arrays if increasing the number of members
    while (newAttackingPokemon.length < newNumMembers) {
      newAttackingPokemon.push(Array(3).fill(null));
      newSelectedQuickMoveAttacker.push(Array(3).fill(null));
      newSelectedMaxMoveAttacker.push(Array(3).fill(null));
      newSelectedChargedMoveAttacker.push(Array(3).fill(null));
      newAttackerStats.push(Array(3).fill([50, 15, 15, 15]));
      newMaxMoves.push(Array(3).fill([1, 0, 0]));
      newBonusAttacker.push(Array(3).fill(["EXTREME", false, false, 0]));
      
    }

    setNumMembers(newNumMembers);
    setAttackingPokemon(newAttackingPokemon);
    setSelectedQuickMoveAttacker(newSelectedQuickMoveAttacker);
    setSelectedMaxMoveAttacker(newSelectedMaxMoveAttacker);
    setSelectedChargedMoveAttacker(newSelectedChargedMoveAttacker);
    setAttackerStats(newAttackerStats);
    setMaxMoves(newMaxMoves);
    setBonusAttacker(newBonusAttacker);
  };

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
      
      setAllDataLoaded(true);
    };
    fetchAllPokemonPB();
  }, []);

  useEffect(() => {
    if (allDataLoaded) {
      // Fetch data from params
      const newAttackingPokemon = Array.from({ length: numMembers }, (_, i) => Array.from({ length: 3 }, (_, j) => attackingPokemon[i][j]));
      const newQuickMoveList = Array.from({ length: numMembers }, (_, i) => Array.from({ length: 3 }, (_, j) => selectedQuickMoveAttacker[i][j]));
      const newChargedMoveList = Array.from({ length: numMembers }, (_, i) => Array.from({ length: 3 }, (_, j) => selectedChargedMoveAttacker[i][j]));
      const newStats = Array.from({ length: numMembers }, (_, i) => Array.from({ length: 3 }, (_, j) => attackerStats[i][j]));
      const newMaxMoveList = Array.from({ length: numMembers }, (_, i) => Array.from({ length: 3 }, (_, j) => maxMoves[i][j]));
  
      const newUrlParams = new URLSearchParams(window.location.search);
      newUrlParams.delete('member');
      newUrlParams.delete('slot');
      window.history.replaceState({}, '', `${window.location.pathname}?${newUrlParams}`);
      
      for (let i = 1; i <= numMembers; i++) {
        for (let j = 1; j <= 3; j++) {
          const attacker = searchParams.get(`attacker${i}${j}`);
          const quickMove = searchParams.get(`attacker_fast_attack${i}${j}`);
          const chargedMove = searchParams.get(`attacker_cinematic_attack${i}${j}`);
          const stats = searchParams.get(`attacker_stats${i}${j}`);
          const maxMoveStats = searchParams.get(`attacker_max_moves${i}${j}`);
  
          if (attacker !== null) {
            newAttackingPokemon[i - 1][j - 1] = PoGoAPI.getPokemonPBByID(attacker, pokemonList)[0];
          }
          if (quickMove !== null) {
            newQuickMoveList[i - 1][j - 1] = PoGoAPI.getMovePBByID(quickMove, allMoves);
          }
          if (chargedMove !== null) {
            newChargedMoveList[i - 1][j - 1] = PoGoAPI.getMovePBByID(chargedMove, allMoves);
          }
          if (stats !== null) {
            newStats[i - 1][j - 1] = stats.split(",").map((stat: string) => parseFloat(stat));
          }
          if (maxMoveStats !== null) {
            newMaxMoveList[i - 1][j - 1] = maxMoveStats.split(",").map((stat: string) => parseInt(stat));
          }
        }
      }
  
      setAttackingPokemon(newAttackingPokemon);
      setSelectedQuickMoveAttacker(newQuickMoveList);
      setSelectedChargedMoveAttacker(newChargedMoveList);
      setAttackerStats(newStats);
      setMaxMoves(newMaxMoveList);
  
      const defender = searchParams.get("defender");
      const quickMoveDefender = searchParams.get("defender_fast_attack");
      const chargedMoveDefender = searchParams.get("defender_cinematic_attack");
      const defenderStats = searchParams.get("defender_stats");
      const raidMode = searchParams.get("raid_mode");
  
      if (defender !== null) {
        handleDefenderSelect(PoGoAPI.getPokemonPBByID(defender, pokemonList)[0]);
      }
      if (quickMoveDefender !== null) {
        handleQuickMoveSelectDefender(quickMoveDefender, PoGoAPI.getMovePBByID(quickMoveDefender, allMoves));
      }
      if (chargedMoveDefender !== null) {
        handleChargedMoveSelectDefender(chargedMoveDefender, PoGoAPI.getMovePBByID(chargedMoveDefender, allMoves));
      }
      if (defenderStats !== null) {
        handleChangedStatsDefender(defenderStats.split(",").map((stat: string) => parseInt(stat)));
      }
      if (raidMode !== null) {
        setRaidMode(raidMode);
      }

  
      setLoaded(true);
    }
  }, [allDataLoaded]);

  const handleAttackerSelect = (pokemon: any, member: any, slot: any) => {
    if (pokemon === null) {
      setCleared(false);
      const newSearchParams = new URLSearchParams(window.location.search);
      const newAttackingPokemon = attackingPokemon.map((memberArray: any[], index: number) => 
        index === member - 1 ? memberArray.map((poke: any, slotIndex: number) => 
          slotIndex === slot - 1 ? null : poke
        ) : memberArray
      );
      setAttackingPokemon(newAttackingPokemon);
      newSearchParams.delete(`attacker${member}${slot}`);

      const newQuickMoveList = selectedQuickMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? null : m
        ) : memberArray
      );
      setSelectedQuickMoveAttacker(newQuickMoveList);
      newSearchParams.delete(`attacker_fast_attack${member}${slot}`);

      const newChargedMoveList = selectedChargedMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? null : m
        ) : memberArray
      );
      setSelectedChargedMoveAttacker(newChargedMoveList);
      newSearchParams.delete(`attacker_cinematic_attack${member}${slot}`);

      const newStats = attackerStats.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((stat: any, slotIndex: number) =>
          slotIndex === slot - 1 ? [50, 15, 15, 15] : stat
        ) : memberArray
      );
      setAttackerStats(newStats);
      newSearchParams.delete(`attacker_stats${member}${slot}`);

      const newMaxMoveList = maxMoves.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? [1,0,0] : m
        ) : memberArray
      );
      setMaxMoves(newMaxMoveList);
      newSearchParams.delete(`attacker_max_moves${member}${slot}`);
      window.history.replaceState({}, "", `${window.location.pathname}?${newSearchParams}`);
      
      setTimeout(() => {
        setCleared(true);
      }, 100);

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

  function allPokemonSelected() {
    for (let i = 0; i < attackingPokemon.length; i++) {
      for (let j = 0; j < attackingPokemon[i].length; j++) {
        if (attackingPokemon[i][j] === null || attackingPokemon[i][j] === undefined || selectedQuickMoveAttacker[i][j] === null || selectedQuickMoveAttacker[i][j] === undefined || selectedChargedMoveAttacker[i][j] === null || selectedChargedMoveAttacker[i][j] === undefined) {
          return false;
        }
      }
    }
    return true
  }


  const handleDefenderSelect = (pokemon: any) => {
    if (pokemon !== undefined) {
      setDefendingPokemon(pokemon);
      setSelectedQuickMoveDefender(null);
      setSelectedChargedMoveDefender(null);
    }
  };
  

  const handleWeatherSelect = (weatherBoost: any) => {
    setWeather(weatherBoost);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("weather", weatherBoost);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);

    setBonusAttacker(Array(4).fill(Array(3).fill([weatherBoost, false, false, 0])))
    
    setBonusDefender([weatherBoost, bonusDefender[1], bonusDefender[2], bonusDefender[3]]);
  }
    

  const handleQuickMoveSelectAttacker = (moveId: any, move: any, member: any, slot: any) => {
    if (move !== undefined) {
      const newMoveList = selectedQuickMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 ? move : m
        ) : memberArray
      );
      setSelectedQuickMoveAttacker(newMoveList);

      const newMaxMoveAttackerList = selectedMaxMoveAttacker.map((memberArray: any[], index: number) =>
        index === member - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === slot - 1 && move ? PoGoAPI.getDynamaxAttack(attackingPokemon[member-1][slot-1].pokemonId, move.type, allMoves, maxMoves[member-1][slot-1][0]) : m
        ) : memberArray
      );
      setSelectedMaxMoveAttacker(newMaxMoveAttackerList);
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

  const handleChangeMaxMoveStats = (maxMoveStats: any, member: any, slot: any) => {
    const newStats = maxMoves.map((memberArray: any[], index: number) =>
      index === member - 1 ? memberArray.map((stat: any, slotIndex: number) =>
        slotIndex === slot - 1 ? maxMoveStats : stat
      ) : memberArray
    );
    setMaxMoves(newStats);
  }

  useEffect(() => {
    if (selectedQuickMoveAttacker[selectedMember-1][selectedPokemonSlot-1] !== null && selectedQuickMoveAttacker[selectedMember-1][selectedPokemonSlot-1] !== undefined) {
      const newMaxMoveList = selectedMaxMoveAttacker.map((memberArray: any[], index: number) =>
        index === selectedMember - 1 ? memberArray.map((m: any, slotIndex: number) =>
          slotIndex === selectedPokemonSlot - 1 ? PoGoAPI.getDynamaxAttack(attackingPokemon[selectedMember-1][selectedPokemonSlot-1].pokemonId, selectedQuickMoveAttacker[selectedMember-1][selectedPokemonSlot-1].type, allMoves, maxMoves[selectedMember-1][selectedPokemonSlot-1][0]) : m
        ) : memberArray
      );
      setSelectedMaxMoveAttacker(newMaxMoveList);
    }
  }, [maxMoves]);

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

  const handleSwitch = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRaidMode(event.target.value);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("raid_mode", event.target.value);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }

  const raidSurname = (raidMode: string) => {
    if (raidMode === "raid-t1-dmax") {
      return "Tier 1 Max Battle";
    } else if (raidMode === "raid-t2-dmax") {
      return "Tier 2 Max Battle";
    } else if (raidMode === "raid-t3-dmax") {
      return "Tier 3 Max Battle";
    } else if (raidMode === "raid-t4-dmax") {
      return "Tier 4 Max Battle";
    } else if (raidMode === "raid-t5-dmax") {
      return "Tier 5 Max Battle";
    } else if (raidMode === "raid-t6-gmax") {
      return "Gigantamax Battle";
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
      const newUrl = `${window.location.origin}${window.location.pathname}/breakpoints?${searchParams.toString()}&slot=${selectedPokemonSlot}&member=${selectedMember}`;
      router.push(newUrl);
    } else {
      alert("Please select all required fields before checking breakpoints! (Attacker Pokémon, Defender Pokémon, Attacker's Fast Attack, Attacker's Charged Attack)");
    }
  }

  const handleBarChange = (bar: string, value: number) => {
    if (bar === "member") {
      setSelectedMember(value);
    } else if (bar === "slot") {
      setSelectedPokemonSlot(value);
    }
  }

  //console.log(maxMoves);

  return (
    <div className="flex flex-col flex-row items-center justify-center space-y-4">
      <div className="flex flex-row items-center justify-center space-x-4">
      <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
        <h1 className="title">
          PokéChespin for Max Battles
        </h1>
      <img src="/favicon.ico" alt="Favicon" className="inline-block ml-2 favicon" />
      </div>
      <a href="https://pokemongo-damage-calculator.vercel.app/" className="link">
        <p className="italic text-sm font-bold">Back to Gym and Raid Simulations</p>
      </a>
      <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
      
      <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
        <Card className="md:w-1/2 w-full">
        
          <CardHeader>
            <CardTitle>Attacking Team</CardTitle>
            <CardDescription>Set an attacking Team</CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>
            <CardDescription>Select the number of members in your team ({numMembers})</CardDescription>
            <Slider onValueChange={handleNumMembersChange} value={[numMembers]} min={1} max={4} step={1} className="w-[60%] mb-1" color={"bg-blue-500"} />
          </CardHeader>
          
          {(pokemonList && searchBarNames && allMoves && loaded && cleared) ? (
          <CardContent>
            <Tabs defaultValue={"member-"+(selectedMember)+""} value={"member-"+(selectedMember)+""} className="">
              <TabsList className="flex flex-row items-center space-x-4 w-full">
                {attackingPokemon.map((i: any, idx: any) => {
                  return <TabsTrigger key={idx} value={`member-${idx + 1}`} onClick={() => handleBarChange("member", idx + 1)}>M{idx+1}</TabsTrigger>
                })}
              </TabsList>
            </Tabs>
            <Tabs defaultValue={"pokemon-"+(selectedPokemonSlot)+""} className="">
              <TabsList className="flex flex-row items-center space-x-4 w-full">
                <TabsTrigger value="pokemon-1" className={attackingPokemon[selectedMember-1][0] !== null ? selectedChargedMoveAttacker[selectedMember-1][0] !== null && selectedQuickMoveAttacker[selectedMember-1][0] !== null ? "green text-white data-[state=active]:bg-green-500" : "bg-blue-500 text-white data-[state=active]:bg-blue-500" : "bg-red-500 text-white data-[state=active]:bg-red-500" } onClick={() => handleBarChange("slot", 1)}>P1</TabsTrigger>
                <TabsTrigger value="pokemon-2" className={attackingPokemon[selectedMember-1][1] !== null ? selectedChargedMoveAttacker[selectedMember-1][1] !== null && selectedQuickMoveAttacker[selectedMember-1][1] !== null ? "green text-white data-[state=active]:bg-green-500" : "bg-blue-500 text-white data-[state=active]:bg-blue-500" : "bg-red-500 text-white data-[state=active]:bg-red-500" } onClick={() => handleBarChange("slot", 2)}>P2</TabsTrigger>
                <TabsTrigger value="pokemon-3" className={attackingPokemon[selectedMember-1][2] !== null ? selectedChargedMoveAttacker[selectedMember-1][2] !== null && selectedQuickMoveAttacker[selectedMember-1][2] !== null ? "green text-white data-[state=active]:bg-green-500" : "bg-blue-500 text-white data-[state=active]:bg-blue-500" : "bg-red-500 text-white data-[state=active]:bg-red-500" } onClick={() => handleBarChange("slot", 3)}>P3</TabsTrigger>
              </TabsList>
            </Tabs>

            <div>
            
          <p className="text-primary text-sm my-2 mx-2">Checking member {selectedMember}, Pokémon slot {selectedPokemonSlot}...</p>
            {Array.from({ length: numMembers }, (_, memberIndex) => (
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
                      onChangedMaxMoveStats={handleChangeMaxMoveStats}
                      slot={slotIndex + 1}
                      paramsLoaded={paramsLoaded}
                      member={memberIndex + 1}
                      number={slotIndex + 1}
                      initialValues={{
                        attacker: attackingPokemon[memberIndex][slotIndex],
                        quickMove: selectedQuickMoveAttacker[memberIndex][slotIndex],
                        chargedMove: selectedChargedMoveAttacker[memberIndex][slotIndex],
                        attackerStats: attackerStats[memberIndex][slotIndex],
                        maxMoves: maxMoves[memberIndex][slotIndex]
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
          {(pokemonList && searchBarNames && allMoves && loaded) ? (
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
                  bonusAttacker: bonusDefender,
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
              <CardDescription>Defender: {raidMode === "normal" ? "" : raidSurname(raidMode) + " Boss"} {PoGoAPI.getPokemonNamePB(defendingPokemon?.pokemonId, allEnglishText) !== "???" ? (bonusDefender[1] !== false ? "Shadow " : "") + (PoGoAPI.getPokemonNamePB(defendingPokemon?.pokemonId, allEnglishText) + (raidMode === "normal" ? (" (Level " + defenderStats[0] + " " + defenderStats[1] + "-" + defenderStats[2] + "-" + defenderStats[3] + ")") : "")): "TBD"}</CardDescription>
            </CardHeader>
            <CardContent>
              
            
            <p className="italic text-slate-700 text-sm">Weather: </p>
              <select onChange={(e) => handleWeatherSelect(e.target.value)} value={weather} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                <option key={"EXTREME"} value={"EXTREME"}>Extreme</option>
                <option key={"CLOUDY"} value={"CLOUDY"}>Cloudy</option>
                <option key={"RAINY"} value={"RAINY"}>Rainy</option>
                <option key={"SUNNY"} value={"SUNNY"}>Sunny</option>
                <option key={"PARTLY_CLOUDY"} value={"PARTLY_CLOUDY"}>Partly Cloudy</option>
                <option key={"WINDY"} value={"WINDY"}>Windy</option>
                <option key={"SNOW"} value={"SNOW"}>Snow</option>
                <option key={"FOG"} value={"FOG"}>Fog</option>
              </select>
            
            <p className="italic text-slate-700 text-sm">Raid difficulty: </p>
              <select onChange={handleSwitch} value={raidMode} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                
                <option key={"raid-t1-dmax"} value={"raid-t1-dmax"}>Tier-1 Max Battle (1700HP) </option>
                <option key={"raid-t2-dmax"} value={"raid-t2-dmax"}>Tier-2 Max Battle (5000HP) </option>
                <option key={"raid-t3-dmax"} value={"raid-t3-dmax"}>Tier-3 Max Battle (10000HP) </option>
                <option key={"raid-t4-dmax"} value={"raid-t4-dmax"}>Tier-4 Max Battle (20000HP) </option>
                <option key={"raid-t5-dmax"} value={"raid-t5-dmax"}>Tier-5 Max Battle (Varying) </option>
                <option key={"raid-t6-gmax"} value={"raid-t6-gmax"}>Gigantamax Battle (90000HP) </option>

              </select>

            <p className="italic text-slate-700 text-sm">
              *DEV NOTE* Suicune stats have been updated for Tier 5 Max Battles on v1.17.5 and adjusted some numbers. All values should be more precise now :). Thanks u/soraliink for the donation!
            </p>
            <p className="italic text-slate-700 text-sm mt-2">
              Friendship Bonus and Helper Bonus are only taken into account on Max Battle Simulation. Helper Bonus is not accurate and needs further investigation.
            </p>
            {(raidMode === "raid-t6-gmax") && (
              <p className="italic text-slate-700 text-sm mt-2">
                Gigantamax bosses have a 0.9 multiplier applied to their defense. Results may be slightly inaccurate.
              </p>
            )}



              {(raidMode === "raid-t5-dmax" && defendingPokemon) && (
                <p className="italic text-slate-700 text-sm mt-2">Tier 5 Max Battles have varying HP. {PoGoAPI.getPokemonNamePB(defendingPokemon.pokemonId, allEnglishText)} has {Calculator.getEffectiveDMAXHP(raidMode, defendingPokemon.pokemonId)}HP</p>
                )}

              <div className="flex flex-row items-center justify-center space-x-4 mt-4 mb-4 w-full">
              <button onClick={copyLinkToClipboard} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                Copy setup link
              </button>
              <a href={"https://pokemongo-damage-calculator.vercel.app/dynamax"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Clean this setup
                </button>
              </a>
              <button onClick={checkBreakpoints} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                Breakpoint Check
              </button>
              </div>

              <CardDescription>View Rankings {(defendingPokemon) ? "" : "(Select a defender first!)"}</CardDescription>
              <Button className="w-full py-2 text-white bg-primary rounded-lg" 
                onClick={() => {
                  if (defendingPokemon) {
                    const newUrl = `${window.location.origin}${window.location.pathname}/rankings/${defendingPokemon.pokemonId}?${searchParams.toString()}&slot=${selectedPokemonSlot}&member=${selectedMember}`;
                    router.push(newUrl);
                  }
                }}>
                Rankings
              </Button>
            </CardContent>

            <CardContent>
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
            {selectedQuickMoveAttacker[selectedMember-1][selectedPokemonSlot-1] !== null &&(
            <CardContent>
              <CardDescription> Damage dealt per MAX attack</CardDescription>
              <CalculateButtonDynamax
                allEnglishText={allEnglishText}
                attacker={attackingPokemon[selectedMember-1][selectedPokemonSlot-1]} 
                defender={defendingPokemon} 
                move={selectedMaxMoveAttacker[selectedMember-1][selectedPokemonSlot-1]}
                attackerStats={attackerStats[selectedMember-1][selectedPokemonSlot-1]}
                defenderStats={defenderStats}
                bonusAttacker={bonusAttacker[selectedMember-1][selectedPokemonSlot-1]}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                maxLevel={maxMoves[selectedMember-1][selectedPokemonSlot-1][0]}
              />
            </CardContent>
            )}
            <CardContent>
              <CardDescription> Damage received from Large Attack</CardDescription>
              <CalculateButtonMaxBoss
                allEnglishText={allEnglishText}
                attacker={defendingPokemon} 
                defender={attackingPokemon[selectedMember-1][selectedPokemonSlot-1]} 
                move={selectedQuickMoveDefender}
                attackerStats={defenderStats}
                defenderStats={attackerStats[selectedMember-1][selectedPokemonSlot-1]}
                bonusAttacker={bonusDefender}
                bonusDefender={bonusAttacker[selectedMember-1][selectedPokemonSlot-1]}
                raidMode={raidMode} 
                isLarge={true}/>
            </CardContent>
            <CardContent>
              <CardDescription> Damage received from Targeted Attack</CardDescription>
              <CalculateButtonMaxBoss
                allEnglishText={allEnglishText}
                attacker={defendingPokemon} 
                defender={attackingPokemon[selectedMember-1][selectedPokemonSlot-1]} 
                move={selectedChargedMoveDefender}
                attackerStats={defenderStats}
                defenderStats={attackerStats[selectedMember-1][selectedPokemonSlot-1]}
                bonusAttacker={bonusDefender}
                bonusDefender={bonusAttacker[selectedMember-1][selectedPokemonSlot-1]}
                raidMode={raidMode} 
                isLarge={false}/>
            </CardContent>
            {allPokemonSelected() ? (
              <CardContent>
                <CardDescription>Max Battle Simulation (Beta)</CardDescription>
                <CalculateButtonSimulateAdvancedDynamax 
                  allEnglishText={allEnglishText}
                  attacker={attackingPokemon} 
                  defender={defendingPokemon} 
                  quickMove={selectedQuickMoveAttacker} 
                  chargedMove={selectedChargedMoveAttacker}
                  largeAttack={selectedQuickMoveDefender}
                  targetAttack={selectedChargedMoveDefender}
                  attackerStats={attackerStats}
                  defenderStats={defenderStats}
                  bonusAttacker={bonusAttacker}
                  bonusDefender={bonusDefender}
                  raidMode={raidMode}
                  maxMoves={maxMoves}
                  weather={weather}
                />
              </CardContent>
            ) : (
              <CardContent>
                <CardDescription>You must select all Pokémon and moves to be able to simulate a Max Battle! (All boxes should be displayed in green)</CardDescription>
              </CardContent>
            )
            }
            <CardContent>
              <p className="text-sm text-slate-700 italic font-bold">
                Dynamax Simulator is in beta, results may not be accurate and more updates are planned for the future. Please report any bugs to CreatorBeastGD via Reddit or GitHub.
              </p>
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
      
      <CookieBanner />
    </div>
  );
}