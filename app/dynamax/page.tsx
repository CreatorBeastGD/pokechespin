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
import Navbar from "@/components/navbar";
import Image from "next/image";
import CalculateButtonSimulateTurnBasedDynamax from "@/components/calculate-button-turn-based-dynamax";

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
  const [types, setTypes] = useState<any>(null);
  const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);

  const [previewShroom, setPreviewShroom] = useState<boolean>(false);
  const [previewFriendship, setPreviewFriendship] = useState<number>(0);
  const [previewHelper, setPreviewHelper] = useState<number>(0);
  const [previewAdvEffect, setPreviewAdvEffect] = useState<string>("none");

  const [cleared, setCleared] = useState<boolean>(true);


  const [selectedMember, setSelectedMember] = useState<number>(searchParams.get("member") ? parseInt(searchParams.get("member") as string) : 1);
  const [selectedPokemonSlot, setSelectedPokemonSlot] = useState<number>(searchParams.get("slot") ? parseInt(searchParams.get("slot") as string) : 1);

  const [customHP, setCustomHP] = useState<number>(searchParams.get("custom_hp") ? parseInt(searchParams.get("custom_hp") as string) : 100000);
  const [customCPM, setCustomCPM] = useState<number>(searchParams.get("custom_cpm") ? parseFloat(searchParams.get("custom_cpm") as string) : 0.85);
  const [customAtkMult, setCustomAtkMult] = useState<number>(searchParams.get("custom_atk_mult") ? parseFloat(searchParams.get("custom_atk_mult") as string) : 0.9);

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("num_members", numMembers.toString());
    searchParams.set("custom_hp", customHP.toString());
    searchParams.set("custom_cpm", customCPM.toString());
    searchParams.set("custom_atk_mult", customAtkMult.toString());

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
      const typesData = await PoGoAPI.getTypes();
      setTypes(typesData);
      
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

      const customHP = searchParams.get("custom_hp");
      const customCPM = searchParams.get("custom_cpm");
      const customAtkMult = searchParams.get("custom_atk_mult");
      
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
      if (customHP !== null) {
        setCustomHP(parseInt(customHP));
      }
      if (customCPM !== null) {
        setCustomCPM(parseFloat(customCPM));
      }
      if (customAtkMult !== null) {
        setCustomAtkMult(parseFloat(customAtkMult));
      }

  
      setLoaded(true);
    }
  }, [allDataLoaded]);

const handleLoadImportFromLink = (member: any, slot: any) => {
    setCleared(false);

    // ¡Lee los parámetros directamente de la URL actual!
    const urlParams = new URLSearchParams(window.location.search);

    // 1. Actualizar Pokémon primero
    const pokemon = urlParams.get(`attacker${member}${slot}`);
    //console.log(`Loading Pokémon for member ${member}, slot ${slot}:`, pokemon);

    if (pokemon) {
        const newAttackingPokemon = [...attackingPokemon];
        newAttackingPokemon[member - 1] = [...newAttackingPokemon[member - 1]];
        newAttackingPokemon[member - 1][slot - 1] = PoGoAPI.getPokemonPBByID(pokemon, pokemonList)[0];
        setAttackingPokemon(newAttackingPokemon);
    }

    // 2. Actualizar movimientos
    const quickMove = urlParams.get(`attacker_fast_attack${member}${slot}`);
    if (quickMove) {
        const newQuickMoveList = [...selectedQuickMoveAttacker];
        newQuickMoveList[member - 1] = [...newQuickMoveList[member - 1]];
        newQuickMoveList[member - 1][slot - 1] = PoGoAPI.getMovePBByID(quickMove, allMoves);
        setSelectedQuickMoveAttacker(newQuickMoveList);
    }

    const chargedMove = urlParams.get(`attacker_cinematic_attack${member}${slot}`);
    if (chargedMove) {
        const newChargedMoveList = [...selectedChargedMoveAttacker];
        newChargedMoveList[member - 1] = [...newChargedMoveList[member - 1]];
        newChargedMoveList[member - 1][slot - 1] = PoGoAPI.getMovePBByID(chargedMove, allMoves);
        setSelectedChargedMoveAttacker(newChargedMoveList);
    }

    // 3. Actualizar stats
    const stats = urlParams.get(`attacker_stats${member}${slot}`);
    if (stats) {
        const newStats = [...attackerStats];
        newStats[member - 1] = [...newStats[member - 1]];
        newStats[member - 1][slot - 1] = stats.split(",").map(s => parseFloat(s));
        setAttackerStats(newStats);
    }

    // 4. Actualizar max moves
    const maxMoveStats = urlParams.get(`attacker_max_moves${member}${slot}`);
    if (maxMoveStats) {
        const newMaxMoveList = [...maxMoves];
        newMaxMoveList[member - 1] = [...newMaxMoveList[member - 1]];
        newMaxMoveList[member - 1][slot - 1] = maxMoveStats.split(",").map(s => parseInt(s));
        setMaxMoves(newMaxMoveList);
    }
    setTimeout(() => {
        setCleared(true);
    }, 100);
};

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

  const setCustomMaxBattleValues = (HP: number, CPM: number, atkMult: number) => {
    if (HP < 1) {
      HP = 1;
    }
    if (CPM < 0.1) {
      CPM = 0.1;
    }
    if (atkMult < 0.1) {
      atkMult = 0.1;
    }
    if (HP > 9999999) {
      HP = 9999999;
    }
    if (CPM > 10) {
      CPM = 10;
    }
    if (atkMult > 10) {
      atkMult = 10;
    }
    setCustomHP(HP);
    setCustomCPM(CPM);
    setCustomAtkMult(atkMult);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("custom_hp", HP.toString());
    newSearchParams.set("custom_cpm", CPM.toString());
    newSearchParams.set("custom_atk_mult", atkMult.toString());
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);

  }
  

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
          slotIndex === selectedPokemonSlot - 1 ? PoGoAPI.getDynamaxAttack(attackingPokemon[selectedMember-1][selectedPokemonSlot-1].pokemonId, selectedQuickMoveAttacker[selectedMember-1][selectedPokemonSlot-1].type, allMoves, maxMoves[selectedMember-1][selectedPokemonSlot-1][0], selectedQuickMoveAttacker[selectedMember-1][selectedPokemonSlot-1]) : m
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
    } else if (raidMode === "raid-t6-gmax-standard") {
      return "Gigantamax Battle (Standard)";
    } else if (raidMode === "raid-custom-dmax") {
      return "Custom Max Battle";
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
      const newUrl = `${window.location.origin}${window.location.pathname}/breakpoints?${searchParams.toString()}&slot=${selectedPokemonSlot}&member=${selectedMember}&helper=${previewHelper}&advEffect=${previewAdvEffect}&friendship=${previewFriendship}&shroom=${previewShroom}`;
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

  
  //<p className="italic text-red-600">Read the news!</p>

  return (
    <div className="flex flex-col flex-row items-center justify-center space-y-4">
      <div className="flex flex-row items-center justify-center space-x-4">
      <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
        <a href="/pokemon-go-damage-calculator">
        <h1 className="title">
          PokéChespin for Max Battles
        </h1>
        </a>
      <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
      </div>
      <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
      
      <Navbar/>
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
                      onClickedImportButton={() => handleLoadImportFromLink(memberIndex + 1, slotIndex + 1)}
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
                      }}
                      allTypes={types}
                    />
                  )
                ))}
              </div>
            ))}
          </div>
          </CardContent>
            ) : (
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
                <option key={"raid-t6-gmax"} value={"raid-t6-gmax"}>Gigantamax Battle (Varying) </option>
                <option key={"raid-t6-gmax-standard"} value={"raid-t6-gmax-standard"}>Standard Gigantamax Battle (115000HP) </option>
                <option key={"raid-custom-dmax"} value={"raid-custom-dmax"}>Custom Dynamax Battle</option>
              </select>

              {
              (raidMode === "raid-custom-dmax") && (
                <Card className="w-full mt-4 mb-4 p-4">
                  <CardTitle className="italic text-slate-700 text-sm mt-2">
                    Custom Max Battle Parameters
                  </CardTitle>
                  <div className="flex flex-col mt-2 mb-4 w-full space-y-2">
                    <label>Custom Boss HP: </label>
                  <input type="number" min={1000} max={10000000} className="p-2 mt-1 bg-white border border-gray-300 rounded-lg" value={customHP}
                  onChange={(e) => setCustomMaxBattleValues(Number(e.target.value), customCPM, customAtkMult)}
                  />
                  
                  <label>Custom CPM: </label>
                  <input type="number" step="0.01" min={0.1} max={10} className="p-2 mt-1 bg-white border border-gray-300 rounded-lg" value={customCPM} 
                  onChange={(e) => setCustomMaxBattleValues(customHP, Number(e.target.value), customAtkMult)}/>

                  <label>Custom Attack Multiplier</label>
                  <input type="number" step="0.01" min={0.1} max={10} className="p-2 mt-1 bg-white border border-gray-300 rounded-lg" value={customAtkMult} 
                  onChange={(e) => setCustomMaxBattleValues(customHP, customCPM, Number(e.target.value))}/>

                  </div>
                </Card>
              )
              }

              <Card className="w-full mt-4 mb-4 p-4">
                <CardTitle className="italic text-slate-700 text-sm mt-2">
                  Preview Bonuses (only used on calculations)
                </CardTitle>

                <div className="flex flex-col mt-2 mb-4 w-full space-y-2">
                  <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
                  value={previewShroom.toString()}
                  onChange={(e) => setPreviewShroom(e.target.value === "true")}
                  >
                    <option value="false">No shrooms</option>
                    <option value="true">Shroom (x2)</option>
                  </select>
                  <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
                  value={previewAdvEffect.toString()}
                  onChange={(e) => setPreviewAdvEffect(e.target.value)}
                  >
                    <option value="none">No Adventure Effect</option>
                    <option value="blade">Behemoth Blade (x1.05 ATK)</option>
                    <option value="bash">Behemoth Bash (x1.05 DEF)</option>
                    <option value="cannon">Dynamax Cannon (+1 max level)</option>
                  </select>

                  <div className="w-full">
                    <label>Friendship level ({previewFriendship}) <label className="italic">(Doubled this season!)</label></label>
                    <Slider onValueChange={(value) => setPreviewFriendship(value[0])} value={[previewFriendship]} max={5} step={1} min={0} className="w-full mb-1" color="bg-blue-700"/>
                  </div>

                  <div className="w-full">
                    <label>Helper bonus ({previewHelper + (previewHelper == 15 ? "+" : "")})</label>
                    <Slider onValueChange={(value) => setPreviewHelper(value[0])} value={[previewHelper]} max={15} step={1} min={0} className="w-full mb-1" color="bg-blue-700"/>
                    <div className="flex flex-row items-center space-x-2">

                      <button onClick={() => setPreviewHelper(previewHelper - 1 < 0 ? 0 : previewHelper - 1)} className="bg-yellow-600 text-white px-4 rounded mr-2">–</button>
                      <button onClick={() => setPreviewHelper(previewHelper + 1 > 15 ? 15 : previewHelper + 1)} className="bg-yellow-600 text-white px-4 rounded">+</button>
                    </div>
                  </div>
                </div>
              </Card>

              {((raidMode === "raid-t5-dmax" || raidMode === "raid-t6-gmax") && defendingPokemon) && (
                <p className="italic text-slate-700 text-sm mt-2">Tier 5 and 6 Max Battles have varying HP. {PoGoAPI.getPokemonNamePB(defendingPokemon.pokemonId, allEnglishText)} has {Calculator.getEffectiveDMAXHP(raidMode, defendingPokemon.pokemonId, PoGoAPI.hasDoubleWeaknesses(defendingPokemon.type, defendingPokemon.type2, types))}HP</p>
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
                bonusAttacker={[weather, false, false, previewFriendship]}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                additionalBonus={PoGoAPI.getHelperBonusDamage(previewHelper) * (previewAdvEffect === "blade" ? 1.05 : 1)}
                shroomBonus={previewShroom ? 2 : 1}
                bladeBoost={previewAdvEffect === "blade"}
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
                bonusAttacker={[weather, false, false, previewFriendship]}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                additionalBonus={PoGoAPI.getHelperBonusDamage(previewHelper) * (previewAdvEffect === "blade" ? 1.05 : 1)}
                shroomBonus={previewShroom ? 2 : 1}
                bladeBoost={previewAdvEffect === "blade"}
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
                bonusAttacker={[weather, false, false, previewFriendship]}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                maxLevel={maxMoves[selectedMember-1][selectedPokemonSlot-1][0]}
                additionalBonus={PoGoAPI.getHelperBonusDamage(previewHelper) * (previewAdvEffect === "blade" ? 1.05 : 1)}
                shroomBonus={previewShroom ? 2 : 1}
                dynamaxCannonBonus={previewAdvEffect === "cannon"}
                bladeBoost={previewAdvEffect === "blade"}
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
                isLarge={true}
                bashBoost={previewAdvEffect === "bash"}/>
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
                isLarge={false}
                bashBoost={previewAdvEffect === "bash"}/>
            </CardContent>
            {allPokemonSelected() ? (
              <>
              <CardContent>
                <CardDescription>Max Battle Simulation</CardDescription>
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
              {numMembers == 1 ? (
              <CardContent>
                <CardDescription>Play Max Battle Simulation (One member only)</CardDescription>
                <CalculateButtonSimulateTurnBasedDynamax
                  allEnglishText={allEnglishText}
                  attacker={attackingPokemon[0]} 
                  defender={defendingPokemon}
                  quickMove={selectedQuickMoveAttacker[0]}
                  chargedMove={selectedChargedMoveAttacker[0]}
                  largeAttack={selectedQuickMoveDefender}
                  targetAttack={selectedChargedMoveDefender}
                  attackerStats={attackerStats[0]}
                  defenderStats={defenderStats}
                  bonusAttacker={bonusAttacker[0]}
                  bonusDefender={bonusDefender}
                  raidMode={raidMode}
                  maxMoves={maxMoves[0]}
                  weather={weather}
                  types={types}
                  allMoves={allMoves}
                />
              </CardContent>
            ) : (<></>)}
              </>
            ) : (
              <CardContent>
                <CardDescription>You must select all Pokémon and moves to be able to simulate a Max Battle! (All boxes should be displayed in green)</CardDescription>
              </CardContent>
            )
            }
            <CardContent>
              <p className="text-sm text-slate-700 italic font-bold">
                Using the simulator, be aware that there may be a huge difference in the playstyle between the simulation and a real life battle! This can give you an idea of how a max battle will go, but it can be improved by the player in real life!
              </p>
              <p className="text-sm text-slate-700 italic font-bold mt-2"> 
                Stats for future Legendary and Gigantamax Battles are not definitive and they use a default value. Their real stats will be added once their Max Battles are available in the game.
              </p>
            </CardContent>
        </Card>
        
      </div>
      
      <p className="bottomtext">Version {PoGoAPI.getVersion()}</p>
      <Avatar className="mb-4">
        <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
        <AvatarFallback>CB</AvatarFallback>
      </Avatar>
      <p className="mb-4 bottomtext px-4">Any issues? open a new issue or create a pull request on the <a className="link" href="https://github.com/CreatorBeastGD/pokemongo_damage_calculator/issues">repository</a> to help this project!</p>
      
      <CookieBanner />
    </div>
  );
}