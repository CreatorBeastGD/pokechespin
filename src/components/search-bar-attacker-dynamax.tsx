"use client";

import { useEffect, useRef, useState } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { Calculator } from "../../lib/calculations";
import { useSearchParams, usePathname } from "next/navigation";
import { clear } from "console";
import TypeBadge from "./TypeBadge";


interface SearchBarAttackerProps {
  onSelect: (pokemon: any, member: any, slot: any) => void;
  onQuickMoveSelect: (moveId: string, move: any, member: any, slot: any) => void;
  onChargedMoveSelect: (moveId: string, move: any, member: any, slot: any) => void;
  onChangedStats: (stats: any, member: any, slot: any) => void;
  onClickedClearButton: (member:any, slot: any) => void;
  onChangedMaxMoveStats: (maxMoves: any, member: any, slot: any) => void;
  onClickedImportButton: () => void;
  pokemonList: any;
  searchBarNames: any;
  allMoves: any;
  assets: any;
  allEnglishText: any;
  raidMode?: string;
  slot?: number;
  initialValues?: any;
  paramsLoaded?: boolean;
  member?: any;
  number?: any;
}

export default function SearchBarAttackerDynamax({ 
    onSelect, 
    onQuickMoveSelect, 
    onChargedMoveSelect, 
    onChangedStats,
    onClickedClearButton,
    onClickedImportButton,
    onChangedMaxMoveStats,
    raidMode, 
    pokemonList, 
    searchBarNames, 
    allMoves, 
    assets, 
    allEnglishText,
    slot,
    initialValues,
    paramsLoaded,
    member,
    number
  }: SearchBarAttackerProps, ) {
  const [pokemon, setPokemon] = useState<string>("");
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<string>("normal");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuickMove, setSelectedQuickMove] = useState<string | null>(null);
  const [selectedChargedMove, setSelectedChargedMove] = useState<string | null>(null);
  const [stats, setStats] = useState<any>([50, 15, 15, 15]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedBonuses, setSelectedBonuses] = useState<any[]>(["EXTREME", false, false, 0]);
  const [availableForms, setAvailableForms] = useState<any[]>([]);
  const [clickedSuggestion, setClickedSuggestion] = useState<boolean>(false);
  const [maxMoves, setMaxMoves] = useState<any>([1,0,0]);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [exportBonus, setExportBonus] = useState<any[]>(["EXTREME", false, false, 0]);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialLoad = useRef(false);



  useEffect(() => {
    //console.log(initialValues);
    if (!initialLoad.current && initialValues) {
      initialLoad.current = true;
      if (initialValues.attacker) searchPokemonInit(initialValues.attacker);
      if (initialValues.attackerStats) handleStatsSelect(initialValues.attackerStats);
      if (initialValues.quickMove) handleQuickMoveSelect(initialValues.quickMove.moveId, initialValues.quickMove);
      if (initialValues.chargedMove) handleChargedMoveSelect(initialValues.chargedMove.moveId, initialValues.chargedMove);
      if (initialValues.maxMoves) handleMaxMovesSelect(initialValues.maxMoves);
    } 
  }, []); // Agrega `initialValues` como dependencia

  const handleMaxMovesSelect = (maxMoves: any) => {
    setMaxMoves(maxMoves);
    onChangedMaxMoveStats(maxMoves, member, number);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("attacker_max_moves"+member+""+number, maxMoves.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }

  const handleQuickMoveSelect = (moveId: string, move: any) => {
    setSelectedQuickMove(moveId);
    onQuickMoveSelect(moveId, move, member, number);
    setTimeout(() => {
      if (moveId !== "") {
        //console.log("attacker_fast_attack"+member+""+number);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("attacker_fast_attack"+member+""+number, moveId);
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
      } else {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("attacker_fast_attack"+member+""+number);
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
      }
    }, 1);
  };

  const handleChargedMoveSelect = (moveId: string, move: any) => {
    setSelectedChargedMove(moveId);
    onChargedMoveSelect(moveId, move, member, number);
    //console.log(moveId);
    setTimeout(() => {
      if (moveId !== "") {
        //console.log("attacker_cinematic_attack"+member+""+number);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("attacker_cinematic_attack"+member+""+number, moveId);
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
      } else {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("attacker_cinematic_attack"+member+""+number);
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
      }
    }, 1);
  }

  const handleStatsSelect = (stats: any) => {
    setStats(stats);
    onChangedStats(stats, member, number);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("attacker_stats"+member+""+number, stats.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }
  
  useEffect(() => {
    onChangedMaxMoveStats(maxMoves, member, number);
    
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("attacker_max_moves"+member+""+number, maxMoves.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }, [maxMoves]);

  useEffect(() => {
    
    onChangedStats(stats, member, number);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("attacker_stats"+member+""+number, stats.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }, [stats]);
  
  useEffect(() => {
    if (clickedSuggestion) {
      searchPokemon();
      setClickedSuggestion(false);
    }
  } , [clickedSuggestion]);

  
  const searchPokemonInit = (pokemonD: any) => {
    setPokemon(pokemonD.pokedex.pokemonId);
    handleQuickMoveSelect("", null);
    handleChargedMoveSelect("", null);
    setLoading(true);
    setError(null);
    try {
      const response = PoGoAPI.getPokemonPBByID(pokemonD.pokemonId, pokemonList)[0];
      setPokemonData(response);
      onSelect(response, member, number);
      //console.log();
      const allForms = pokemonList.filter((p: any) => p.pokedex.pokemonId === pokemonD.pokedex.pokemonId && (p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX"));
      setAvailableForms(allForms);// Construir nueva URL
      setSelectedForm(pokemonD.pokemonId);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("attacker"+member+""+number, response?.pokemonId);
      window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const searchPokemon = () => {
    setLoading(true);
    setError(null);
    handleQuickMoveSelect("", null);
    handleChargedMoveSelect("", null);
    setSelectedForm("normal");
    setSuggestions([])
    //console.log(searchBarNames)
    let searchParam = PoGoAPI.getKey(pokemon, searchBarNames);
    //console.log(searchParam)
    try {
      const response = PoGoAPI.getPokemonPBByID(searchParam, pokemonList)[0];
      setPokemonData(response);
      onSelect(response, member, number);
      const allForms = PoGoAPI.getPokemonPBByName(pokemon.toUpperCase(), pokemonList).filter((p: any) => p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX");
      setAvailableForms(allForms);// Construir nueva URL
      setTimeout(() => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("attacker"+member+""+number, response?.pokemonId);
        newSearchParams.delete("attacker_fast_attack"+member+""+number);
        newSearchParams.delete("attacker_cinematic_attack"+member+""+number);  
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
      }, 1);
    } finally {
      setLoading(false);
    }
  };

  const searchForm = (form: string) => {
    setLoading(true);
    setError(null);
    handleQuickMoveSelect("", null);
    handleChargedMoveSelect("", null);
    try {
      const response = PoGoAPI.getPokemonPBByID(form, pokemonList)[0];
      setPokemonData(response);
      onSelect(response, member, number);
      setTimeout(() => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("attacker"+member+""+number, response?.pokemonId);
        newSearchParams.delete("attacker_fast_attack"+member+""+number);
        newSearchParams.delete("attacker_cinematic_attack"+member+""+number);  
        window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
      }, 1);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedForm(event.target.value);
    onSelect(searchForm(event.target.value), member, number);
    setSelectedQuickMove(null);
    setSelectedChargedMove(null);
  };

  // [level, attack, defense, stamina]
 const handleChangeStat = (value: number[], index: number) => {
  if (index === 0 && (value[0] < 1 || value[0] > 51)) return;
  if (index > 0 && (value[0] < 0 || value[0] > 15)) return;

  setStats((prev: number[]) => {
    const newStats = [...prev];
    newStats[index] = value[0];
    return newStats;
  });
};

  const handleChangeMaxMoves = (value: number[], index: number) => {
    setMaxMoves((prev: any) => {
      if (!(index === 0 && value[0] === 0)) {
        const newMaxMoves = [...prev];
        newMaxMoves[index] = value[0];
        return newMaxMoves;
      } else {
        return prev;
      }
    });
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPokemon(value);

    // Filtrar sugerencias
    if (value.length > 0) {
      const filteredSuggestions = PoGoAPI.getPokemonPBBySpeciesName(value, pokemonList, allEnglishText).filter((p: any) => ((PoGoAPI.getPokemonNamePB(p.pokedex.pokemonId, allEnglishText))
        .toLowerCase()))
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setPokemon(suggestion);
    setClickedSuggestion(true);
    searchPokemon();
    setSuggestions([]);
  };

  const clearButton = () => {
    setPokemon("");
    setPokemonData(null);
    setSelectedForm("normal");
    setSelectedQuickMove(null);
    setSelectedChargedMove(null);
    setStats([50, 15, 15, 15]);
    setSelectedBonuses(["EXTREME", false, false, 0]);
    setSuggestions([]);
    onClickedClearButton(member, slot)
  }

  const getMaxSpiritLevel = (stamina: number) => {
    if (stamina === 0) {
      return 0;
    } else if (stamina === 1) {
      return 0.08;
    } else if (stamina === 2) {
      return 0.12;
    } else if (stamina === 3) {
      return 0.16;
    }
    return 0;
  }

  const exportPokemon = () => {
    if (!pokemonData || !selectedQuickMove || !selectedChargedMove) {
      setError("To export, please select a Pokémon and both moves.");
      return;
      
    }

    const exportData = {
      pokemon: pokemonData.pokemonId,
      stats: stats,
      quickMove: selectedQuickMove ? selectedQuickMove : null,
      chargedMove: selectedChargedMove ? selectedChargedMove : null,
      bonuses: exportBonus,
      maxmoves: maxMoves,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pokemonData.pokemonId.toLowerCase()}_attackerdata.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

const importPokemon = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.pokemon && data.stats && data.quickMove && data.chargedMove && data.maxmoves) {
                    setIsImporting(true);
                    try {
                        setExportBonus(data.bonuses || ["EXTREME", false, false, 0]);
                        const urlParams = new URLSearchParams(window.location.search);
                        const prefix = `attacker`;

                        const DataPokemon = PoGoAPI.getPokemonPBByID(data.pokemon, pokemonList)[0];

                       if (!(DataPokemon.quickMoves).includes(data.quickMove)) 
                        {
                            setError("The selected Quick Move is not available for this Pokémon.");
                            setIsImporting(false);
                            return;
                        }

                          else if (!(DataPokemon.cinematicMoves).includes(data.chargedMove)) {
                              setError("The selected Charged Move is not available for this Pokémon.");
                              setIsImporting(false);
                              return;
                          }
                          
                          else if (data.stats.length !== 4 || data.bonuses.length !== 4) {
                              setError("Invalid data format in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.stats[0] < 1 || data.stats[0] > 51 || data.stats[1] < 0 || data.stats[1] > 15 || data.stats[2] < 0 || data.stats[2] > 15 || data.stats[3] < 0 || data.stats[3] > 15) {
                              setError("Invalid stats in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.bonuses[3] < 0 || data.bonuses[3] > 4) {
                              setError("Invalid friendship level in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.maxmoves.length !== 3 || data.maxmoves.some((move: number) => move < 0 || move > 3)) {
                              setError("Invalid max moves in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.maxmoves[0] < 1) {
                              setError("Invalid max moves in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                        
                          urlParams.set(`${prefix}${member}${number}`, data.pokemon);
                          urlParams.set(`${prefix}_stats${member}${number}`, data.stats.join(","));
                          urlParams.set(`${prefix}_max_moves${member}${number}`, data.maxmoves.join(","));
                          urlParams.set(`${prefix}_fast_attack${member}${number}`, data.quickMove);
                          urlParams.set(`${prefix}_cinematic_attack${member}${number}`, data.chargedMove);

                          const newUrl = `${pathname}?${urlParams.toString()}`;
                          window.history.replaceState({}, '', newUrl);
                          
                          setTimeout(() => {
                            onClickedImportButton();
                          }, 100);
                        

                        
                    } finally {
                        setIsImporting(false);
                    }
                }
            } catch (error) {
                console.error(error);
                setError(`Error importing: ${error}`);
                setIsImporting(false);
            }
        };
        reader.readAsText(file);
    };
    input.click();
};
  const selectedPokemon = pokemonData //? getSelectedForm() : null;
  
  const effAttack = Calculator.getEffectiveAttack(selectedPokemon?.stats?.baseAttack, stats[1], stats[0]);
  const effDefense = Calculator.getEffectiveDefense(selectedPokemon?.stats?.baseDefense, stats[2], stats[0]);
  const effStamina = Calculator.getEffectiveStamina(selectedPokemon?.stats?.baseStamina, stats[3], stats[0]);

  const raidmode = raidMode ? raidMode : "normal";

  //console.log(selectedPokemon? selectedPokemon : "null");

  const suffixes = ["_MEGA", "_MEGA_X", "_MEGA_Y"];

  const preferredMoves = suffixes.some(suffix => selectedPokemon?.pokemonId?.endsWith(suffix)) ? PoGoAPI.getPreferredMovesPB((selectedPokemon?.pokemonId)?.replace("_MEGA", "").replace("_X", "").replace("_Y", ""), selectedPokemon?.pokemonId, pokemonList) : { preferredMovesQuick: selectedPokemon?.quickMoves, preferredMovesCharged: selectedPokemon?.cinematicMoves };
  const preferredMovesQuick = 'preferredMovesQuick' in preferredMoves ? preferredMoves.preferredMovesQuick : selectedPokemon?.quickMoves;
  const preferredMovesCharged = 'preferredMovesCharged' in preferredMoves ? preferredMoves.preferredMovesCharged : selectedPokemon?.cinematicMoves;

  const dynamaxMove = selectedQuickMove ? PoGoAPI.getDynamaxAttack(selectedPokemon?.pokemonId, (PoGoAPI.getMovePBByID(selectedQuickMove ?? "a", allMoves)).type, allMoves, maxMoves[0], (PoGoAPI.getMovePBByID(selectedQuickMove ?? "a", allMoves))) : null;
  
  return (
    <>
      <Input
        placeholder="Search for a Pokémon"
        type="text"
        value={pokemon}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && searchPokemon()}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 resp-box-suggest ">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.pokemonId}
              className="p-2 cursor-pointer hover:bg-gray-200 "
              onClick={() => handleSuggestionClick(PoGoAPI.getPokemonNamePB(suggestion.pokemonId, allEnglishText))}
            >
              {PoGoAPI.getPokemonNamePB(suggestion.pokemonId, allEnglishText)}
            </li>
          ))}
        </ul>
      )}
      <Button onClick={searchPokemon} className="mt-4 mb-2 mr-2">Search</Button>
      <Button onClick={exportPokemon} className="mt-4 mb-2 mr-2">Export</Button>
      <Button onClick={importPokemon} className="mt-4 mb-2 mr-2" disabled={isImporting}>Import</Button>
      <Button onClick={() => clearButton()} className="mt-4 mb-2 mr-2">Clear</Button>
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {pokemonData ? (
        <div>
          <h2>Name: {PoGoAPI.getPokemonNamePB(selectedPokemon.pokemonId, allEnglishText)}</h2>
          <p>Type(s): <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type)} />  {(selectedPokemon.type2) && <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type2)} />}</p>

          
          <select onChange={handleFormChange} value={selectedForm} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
            {availableForms && (availableForms).map((form: any) => (
              <option key={form.pokemonId} value={form.pokemonId}>{PoGoAPI.getPokemonNamePB(form.pokemonId, allEnglishText)}</option>
            ))}
          </select>

          <p>Stats (CP {raidmode == "normal" ? Calculator.getPCs(effAttack, effDefense, effStamina) : Calculator.getRawPCs(selectedPokemon?.stats?.baseAttack, selectedPokemon?.stats?.baseDefense, Calculator.getRaidBossHP(raidmode))}) </p>
          <p>Attack: {selectedPokemon.stats?.baseAttack} <span className="text-xs">(Effective Attack: {(effAttack)})</span></p>
          <Progress color={"bg-red-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseAttack / 505) * 100}/>
          
          <p>Defense: {selectedPokemon.stats?.baseDefense} <span className="text-xs">(Effective Defense: {(effDefense)})</span></p> 
          <Progress color={"bg-green-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseDefense / 505) * 100}/>
          
          <p>Stamina: {selectedPokemon.stats?.baseStamina} <span className="text-xs">(Effective Stamina: {Math.floor(effStamina)})</span></p> 
          <Progress color={"bg-yellow-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseStamina / 505) * 100}/>
          
            <Image
                unoptimized
                className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 p-2 " + (selectedBonuses[1] === true ? "bg-gradient-to-t from-purple-900 to-violet-100" : "bg-white") + " dark:bg-gray-800 dark:border-gray-700"}
                src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(selectedPokemon.pokemonId, assets )}
                alt={selectedPokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                width={400}
                height={400}
                style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
            />
          <div className="grid grid-cols-1">
            <p>Stat picker <span className="italic text-xs">(You can slide to select your desired stats!)</span> </p>
            <p>Level: {stats[0]}</p>
            <div className="flex flex-row">
              <Slider onValueChange={(value) => handleChangeStat(value, 0)} value={[stats[0]]} max={51} step={0.5} min={1} className="w-[60%] mb-1 mr-2" color={stats[0] == 51 ? "bg-blue-500" : "bg-blue-700"}/>
              <button onClick={() => handleChangeStat([stats[0]-0.5], 0)} className="bg-blue-500 text-white px-4 rounded mr-2">–</button>
              <button onClick={() => handleChangeStat([stats[0]+0.5], 0)} className="bg-blue-500 text-white px-4 rounded">+</button>
            </div>
            <p className={stats[1] == 15 ? "text-red-600" : "text-yellow-600"}>Attack: </p>
            <div className="flex flex-row">
              <Slider onValueChange={(value) => handleChangeStat(value, 1)} value={[stats[1]]} max={15} step={1} className="w-[60%] mb-1 mr-2" color={stats[1] == 15 ? "bg-red-500" : "bg-yellow-600"}/>
              <button onClick={() => handleChangeStat([stats[1]-1], 1)} className="bg-yellow-600 text-white px-4 rounded mr-2">–</button>
              <button onClick={() => handleChangeStat([stats[1]+1], 1)} className="bg-yellow-600 text-white px-4 rounded">+</button>
            </div>
            <p className={stats[2] == 15 ? "text-red-600" : "text-yellow-600"}>Defense: </p>
            <div className="flex flex-row">
              <Slider onValueChange={(value) => handleChangeStat(value, 2)} value={[stats[2]]} max={15} step={1} className="w-[60%] mb-1 mr-2" color={stats[2] == 15 ? "bg-red-500" : "bg-yellow-600"}/>
              <button onClick={() => handleChangeStat([stats[2]-1], 2)} className="bg-yellow-600 text-white px-4 rounded mr-2">–</button>
              <button onClick={() => handleChangeStat([stats[2]+1], 2)} className="bg-yellow-600 text-white px-4 rounded">+</button>
            </div>
            <p className={stats[3] == 15 ? "text-red-600" : "text-yellow-600"}>Stamina: </p>
            <div className="flex flex-row">
              <Slider onValueChange={(value) => handleChangeStat(value, 3)} value={[stats[3]]} max={15} step={1} className="w-[60%] mb-1 mr-2" color={stats[3] == 15 ? "bg-red-500" : "bg-yellow-600"}/>
              <button onClick={() => handleChangeStat([stats[3]-1], 3)} className="bg-yellow-600 text-white px-4 rounded mr-2">–</button>
              <button onClick={() => handleChangeStat([stats[3]+1], 3)} className="bg-yellow-600 text-white px-4 rounded">+</button>
            </div>
          </div>
          <div className="grid grid-cols-1 mb-4">
            <p>Max moves</p>
            <p className="text-red-600">Max Attack {maxMoves[0] === 3 ? "MAX" : maxMoves[0]}</p>
           
            <Slider  onValueChange={(value) => handleChangeMaxMoves(value, 0)} defaultValue={[maxMoves[0]]} min={1} max={3} step={1} className="w-[60%] mb-1" color={"bg-red-800"}/>
           
            <p className="text-red-600">Max Guard {maxMoves[1] === 3 ? "MAX" : maxMoves[1]}</p>
            <Slider onValueChange={(value) => handleChangeMaxMoves(value, 1)} defaultValue={[maxMoves[1]]}  max={3} step={1} className="w-[60%] mb-1" color={"bg-red-800"}/>
            <div className="flex flex-row justify-between w-[60%]">
            <p className="text-red-600 ">Max Spirit {maxMoves[2] === 3 ? "MAX" : maxMoves[2]}</p>
            {maxMoves[2] > 0 && <p className="text-red-600 italic text-xs">({Math.floor(Math.floor(effStamina)*getMaxSpiritLevel(maxMoves[2]))}HP/use)</p>}

            </div>
            <Slider onValueChange={(value) => handleChangeMaxMoves(value, 2)} defaultValue={[maxMoves[2]]} max={3} step={1} className="w-[60%] mb-1" color={"bg-red-800"}/>


          </div>
          <div className="flex flex-row space-x-4">
            <div>
              <p>Fast Attacks:</p>
              {preferredMovesQuick.map((move: string) => (
                PoGoAPI.getMovePBByID(move, allMoves).type && (
                <Card
                  key={move}
                  className={`mb-4 ${selectedQuickMove === move ? 'bg-blue-200' : ''}`}
                  onClick={() => handleQuickMoveSelect(move, PoGoAPI.getMovePBByID(move, allMoves))}
                >
                  <CardHeader>
                    <CardTitle>{PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(move, allMoves)).moveId)}{(selectedPokemon?.eliteQuickMove ?? []).includes(move) ? " *" : ""}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Type: <TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)} /></CardDescription>
                    <CardDescription>Power: {(PoGoAPI.getMovePBByID(move, allMoves)).power ?? 0}</CardDescription>
                    <CardDescription>Energy: {(PoGoAPI.getMovePBByID(move, allMoves)).energyDelta ?? 0}</CardDescription>
                    <CardDescription>Duration: {PoGoAPI.getMovePBByID(move, allMoves).durationMs / 1000}s</CardDescription>
                  </CardContent>
                </Card>
              )))}
              {dynamaxMove && (
                <>
                <p>Max move:</p>
              <Card
                  key={dynamaxMove.moveId}
                  className={`mb-4 bg-gradient-to-t from-rose-400 to-red-950`}
                >
                <CardHeader>
                  <CardTitle className="text-white">{PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(dynamaxMove.moveId, allMoves)).moveId)}</CardTitle>
                </CardHeader>
                  <CardContent>
                  <CardDescription className="text-slate-300">Type: <TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(dynamaxMove.moveId, allMoves)).type)} /></CardDescription>
                  <CardDescription className="text-slate-300">Power: {(PoGoAPI.getMovePBByID(dynamaxMove.moveId, allMoves)).power ?? 0}</CardDescription>
                  <CardDescription className="text-slate-300">Duration: {PoGoAPI.getMovePBByID(dynamaxMove.moveId, allMoves).durationMs / 1000}s</CardDescription>
                </CardContent>
              </Card>
                </>
                )}
            </div>

            <div>
              <p>Charged Attacks:</p>
              {preferredMovesCharged.map((move: string) => (
                PoGoAPI.getMovePBByID(move, allMoves).type && (
                <Card
                  key={move}
                  className={`mb-4 ${selectedChargedMove === move ? 'bg-blue-200' : ''}`}
                  onClick={() => handleChargedMoveSelect(move, PoGoAPI.getMovePBByID(move, allMoves))}
                >
                  <CardHeader>
                    <CardTitle>{PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(move, allMoves)).moveId)}{(selectedPokemon?.eliteCinematicMove ?? []).includes(move) ? " *" : ""}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Type: <TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)} /></CardDescription>
                    <CardDescription>Power: {(PoGoAPI.getMovePBByID(move, allMoves)).power}</CardDescription>
                    <CardDescription>Duration: {PoGoAPI.getMovePBByID(move, allMoves).durationMs / 1000}s</CardDescription>
                    
                    <CardDescription>Energy cost: {(-(PoGoAPI.getMovePBByID(move, allMoves)).energyDelta) > -100 ? (-(PoGoAPI.getMovePBByID(move, allMoves)).energyDelta) : 0}</CardDescription>
                    <div className="w-full flex flex-row justify-between mt-2 space-x-2">
                      {(-(PoGoAPI.getMovePBByID(move, allMoves)).energyDelta) <= 100 && (
                        <TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)} show={false} />
                      )}
                      {(-(PoGoAPI.getMovePBByID(move, allMoves)).energyDelta) <= 50 && (
                        <TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)} show={false} />
                      )}
                      {(-(PoGoAPI.getMovePBByID(move, allMoves)).energyDelta) <= 33 && (
                        <TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)} show={false} />
                      )}
                    </div>
                  </CardContent>
                </Card>)
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No Pokémon selected</p>
      )}
    </>
  );
}