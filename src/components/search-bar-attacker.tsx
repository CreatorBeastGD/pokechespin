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
import { Switch } from "./ui/switch";
import { useSearchParams, usePathname } from "next/navigation";
import TypeBadge from "./TypeBadge";


interface SearchBarAttackerProps {
  onSelect: (pokemon: any) => void;
  onQuickMoveSelect: (moveId: string, move: any) => void;
  onChargedMoveSelect: (moveId: string, move: any) => void;
  onChangedStats: (stats: any) => void;
  onBonusChange: (bonuses: any) => void;
  pokemonList: any;
  searchBarNames: any;
  allMoves: any;
  assets: any;
  allEnglishText: any;
  raidMode?: string;
  slot?: number;
  initialValues?: any;
  paramsLoaded?: boolean;
}

export default function SearchBarAttacker({ 
    onSelect, 
    onQuickMoveSelect, 
    onChargedMoveSelect, 
    onChangedStats, 
    onBonusChange, 
    raidMode, 
    pokemonList, 
    searchBarNames, 
    allMoves, 
    assets, 
    allEnglishText,
    slot,
    initialValues,
    paramsLoaded
  }: SearchBarAttackerProps, ) {

    const raidModeLevelMultiplier = PoGoAPI.convertStats([40, 15, 15, 15], raidMode)[0];

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
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [importMaxMove, setImportMaxMove] = useState<number[]>([1, 0, 0]);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialLoad = useRef(false);


  useEffect(() => {
    //console.log(initialValues);
    if (!initialLoad.current && initialValues && paramsLoaded) {
      initialLoad.current = true;
      if (initialValues.attacker) searchPokemonInit(initialValues.attacker);
      if (initialValues.attackerStats) handleStatsSelect(initialValues.attackerStats);
      if (initialValues.bonusAttacker) {
        const normalizedBonuses = initialValues.bonusAttacker.map((bonus: any, index: number) => {
          if (index === 0) return bonus; // EXTREME sigue como string
          if (index === 3) return parseInt(bonus); // Último es número
          return bonus === "true"; // Conviértelo en booleano
        });
        handleBonusSelect(normalizedBonuses);
      }
      if (initialValues.quickMove) handleQuickMoveSelect(initialValues.quickMove.moveId, initialValues.quickMove);
      if (initialValues.chargedMove) handleChargedMoveSelect(initialValues.chargedMove.moveId, initialValues.chargedMove);
      //console.log("Initial values loaded");
    }
  }, [initialValues]); // Agrega `initialValues` como dependencia

  const handleQuickMoveSelect = (moveId: string, move: any) => {
    setSelectedQuickMove(moveId);
    onQuickMoveSelect(moveId, move);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(slot === 1 ? "attacker_fast_attack" : "defender_fast_attack", moveId);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  };

  const handleStatsSelect = (stats: any) => {
    setStats(stats);
    onChangedStats(stats);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(slot === 1 ? "attacker_stats" : "defender_stats", stats.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }

  const handleBonusSelect = (bonus: any) => {
    setSelectedBonuses(bonus);
    onBonusChange(bonus);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(slot == 1 ? "attacker_bonuses" : "defender_bonuses", bonus.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }
  
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
      onSelect(response);
      //console.log();
      const allForms = pokemonList.filter((p: any) => p.pokedex.pokemonId === pokemonD.pokedex.pokemonId && (p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX"));
      setAvailableForms(allForms);// Construir nueva URL
      setSelectedForm(pokemonD.pokemonId);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(slot === 1 ? "attacker" : "defender", response?.pokemonId);
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
    let searchParam = PoGoAPI.getKey(pokemon, searchBarNames);
    try {
      const response = PoGoAPI.getPokemonPBByID(searchParam, pokemonList)[0];
      setPokemonData(response);
      onSelect(response);
      const allForms = PoGoAPI.getPokemonPBByName(pokemon.toUpperCase(), pokemonList).filter((p: any) => p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX");
      setAvailableForms(allForms);// Construir nueva URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(slot === 1 ? "attacker" : "defender", response?.pokemonId);
      newSearchParams.delete(slot === 1 ? "attacker_fast_attack" : "defender_fast_attack");
      newSearchParams.delete(slot === 1 ? "attacker_cinematic_attack" : "defender_cinematic_attack");  
      window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
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
      onSelect(response);
      const newSearchParams = new URLSearchParams(searchParams.toString());    
      newSearchParams.set(slot === 1 ? "attacker" : "defender", response?.pokemonId);
      newSearchParams.delete(slot === 1 ? "attacker_fast_attack" : "defender_fast_attack");
      newSearchParams.delete(slot === 1 ? "attacker_cinematic_attack" : "defender_cinematic_attack");
      
      window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChargedMoveSelect = (moveId: string, move: any) => {
    if (paramsLoaded) {
      
    setSelectedChargedMove(moveId);
    onChargedMoveSelect(moveId, move);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(slot === 1 ? "attacker_cinematic_attack" : "defender_cinematic_attack", moveId);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedForm(event.target.value);
    onSelect(searchForm(event.target.value));
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

  // Bonuses = [weather-boost, shadow, mega, friendship]
  const handleBonusChange = (bonusIndex: number, value: any) => {
    setSelectedBonuses((prev: any) => {
      const newBonuses = [...prev];
      newBonuses[bonusIndex] = value;
      return newBonuses;
    });
  };

  useEffect(() => {
    
    onChangedStats(stats);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(slot === 1 ? "attacker_stats" : "defender_stats", stats.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }, [stats]);

  useEffect(() => {
    onBonusChange(selectedBonuses);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(slot === 1 ? "attacker_bonuses" : "defender_bonuses", selectedBonuses.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }, [selectedBonuses]);


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
      bonuses: selectedBonuses,
      maxmoves: importMaxMove,
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
                  if (data.pokemon && data.stats && data.quickMove && data.chargedMove && data.bonuses) {
                      setIsImporting(true);
                      try {
                          // Primero obtenemos todos los datos necesarios
                          const pokemonData = PoGoAPI.getPokemonPBByID(data.pokemon, pokemonList)[0];
                          const quickMove = PoGoAPI.getMovePBByID(data.quickMove, allMoves);
                          const chargedMove = PoGoAPI.getMovePBByID(data.chargedMove, allMoves);

                          if (!(pokemonData.quickMoves).includes(data.quickMove)) 
                        {
                            setError("The selected Quick Move is not available for this Pokémon.");
                            setIsImporting(false);
                            return;
                        }

                          else if (!(pokemonData.cinematicMoves).includes(data.chargedMove)) {
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


                          // Luego actualizamos todo en orden
                          await searchPokemonInit(pokemonData);
                          handleStatsSelect(data.stats);
                          handleBonusSelect(data.bonuses);

                          setImportMaxMove(data.maxmoves || [1, 0, 0]);

                          // Pequeño delay para asegurar que el pokémon se cargó completamente
                          setTimeout(() => {
                              handleQuickMoveSelect(data.quickMove, quickMove);
                              handleChargedMoveSelect(data.chargedMove, chargedMove);
                              
                              // Actualizamos la URL una sola vez al final
                              const newSearchParams = new URLSearchParams(searchParams.toString());
                              newSearchParams.set(slot === 1 ? "attacker" : "defender", pokemonData.pokemonId);
                              newSearchParams.set(slot === 1 ? "attacker_stats" : "defender_stats", data.stats.join(","));
                              newSearchParams.set(slot === 1 ? "attacker_bonuses" : "defender_bonuses", data.bonuses.join(","));
                              newSearchParams.set(slot === 1 ? "attacker_fast_attack" : "defender_fast_attack", data.quickMove);
                              newSearchParams.set(slot === 1 ? "attacker_cinematic_attack" : "defender_cinematic_attack", data.chargedMove);
                              window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
                          }, 100);
                      } finally {
                          setTimeout(() => {
                            setIsImporting(false);
                          }, 100);
                      }
                  } else {
                      setError("Invalid file format.");
                  }
              } catch (error) {
                  setError("Error reading file: " + error);
              }
          };
          reader.readAsText(file);
      };
      input.click();
  };

  const selectedPokemon = pokemonData //? getSelectedForm() : null;

  const raidmode = raidMode ? raidMode : "normal";
  
  const effAttack = Calculator.getEffectiveAttack(selectedPokemon?.stats?.baseAttack, (slot == 1 ? stats[1] : (slot == 2 && raidMode === "normal") ? stats[1] : 15), slot == 1 ? stats[0] : (slot == 2 && raidMode === "normal") ? stats[0] : raidModeLevelMultiplier);
  const effDefense = Calculator.getEffectiveDefense(selectedPokemon?.stats?.baseDefense, (slot == 1 ? stats[2] : (slot == 2 && raidMode === "normal") ? stats[2] : 15), slot == 1 ? stats[0] : (slot == 2 && raidMode === "normal") ? stats[0] : raidModeLevelMultiplier);
  const effStamina = Calculator.getEffectiveStamina(selectedPokemon?.stats?.baseStamina, (slot == 1 ? stats[3] : (slot == 2 && raidMode === "normal") ? stats[3] : 15), slot == 1 ? stats[0] : (slot == 2 && raidMode === "normal") ? stats[0] : raidModeLevelMultiplier);


  //console.log(selectedPokemon? selectedPokemon : "null");

  const suffixes = ["_MEGA", "_MEGA_X", "_MEGA_Y"];

  const preferredMoves = suffixes.some(suffix => selectedPokemon?.pokemonId?.endsWith(suffix)) ? PoGoAPI.getPreferredMovesPB((selectedPokemon?.pokemonId)?.replace("_MEGA", "").replace("_X", "").replace("_Y", ""), selectedPokemon?.pokemonId, pokemonList) : { preferredMovesQuick: selectedPokemon?.quickMoves, preferredMovesCharged: selectedPokemon?.cinematicMoves };
  const preferredMovesQuick = 'preferredMovesQuick' in preferredMoves ? preferredMoves.preferredMovesQuick : selectedPokemon?.quickMoves;
  const preferredMovesCharged = 'preferredMovesCharged' in preferredMoves ? preferredMoves.preferredMovesCharged : selectedPokemon?.cinematicMoves;

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
      <div>
        <Button onClick={searchPokemon} className="mt-4 mb-2 mr-2">Search</Button>
        {slot === 1 && (<Button onClick={exportPokemon} className="mt-4 mb-2 mr-2">Export</Button>)}
        {slot === 1 && (<Button onClick={importPokemon} className="mt-4 mb-2">Import</Button>)}
      </div>
      {loading || isImporting && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <Image unoptimized src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {(pokemonData && !isImporting) ? (
        <div>
          <h2>Name: {PoGoAPI.getPokemonNamePB(selectedPokemon.pokemonId, allEnglishText)}</h2>
          <p>Type(s): <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type)} />  {(selectedPokemon.type2) && <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type2)} />}</p>


          <select onChange={handleFormChange} value={selectedForm} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
            {availableForms && (availableForms).map((form: any) => (
              <option key={form.pokemonId} value={form.pokemonId}>{PoGoAPI.getPokemonNamePB(form.pokemonId, allEnglishText)}</option>
            ))}
          </select>

          <p>Stats (CP {raidmode == "normal" ? Calculator.getPCs(effAttack, effDefense, effStamina) : Calculator.getRawPCs(selectedPokemon?.stats?.baseAttack, selectedPokemon?.stats?.baseDefense, Calculator.getRaidBossHP(raidmode))}) </p>
          <p>Attack: {selectedPokemon.stats?.baseAttack} <span className="text-xs">(Effective Attack: {effAttack })</span></p>
          <Progress color={"bg-red-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseAttack / 505) * 100}/>
          
          <p>Defense: {selectedPokemon.stats?.baseDefense} <span className="text-xs">(Effective Defense: {effDefense})</span></p> 
          <Progress color={"bg-green-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseDefense / 505) * 100}/>
          
          <p>Stamina: {selectedPokemon.stats?.baseStamina} <span className="text-xs">(Effective Stamina: {Math.floor(effStamina)})</span></p> 
          <Progress color={"bg-yellow-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseStamina / 505) * 100}/>
          
            <Image
              unoptimized
                className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 p-2 " + ((selectedBonuses[1] === true && (slot === 1 || (slot === 2 && raidMode === "normal"))) ? "bg-gradient-to-t from-purple-900 to-violet-100" : "bg-white") + " dark:bg-gray-800 dark:border-gray-700"}
                src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(selectedPokemon.pokemonId, assets )}
                alt={selectedPokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                width={400}
                height={400}
                style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
            />
          {(slot === 1 || (slot === 2 && raidMode === "normal")) && 
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
          }
          {raidmode === "normal" ? (
          <div className="grid grid-cols-1 mb-4 space-y-2">
            <p>Bonuses</p>
            
            <p className="italic text-slate-700">
              <Switch onCheckedChange={(checked) => handleBonusChange(1, checked)} checked={selectedBonuses[1]} /> Shadow Pokémon
            </p>
            <p className="italic text-slate-700">
              <Switch onCheckedChange={(checked) => handleBonusChange(2, checked)} checked={selectedBonuses[2]} /> Mega boost
            </p>
            <p>Friendship level ({selectedBonuses[3]}) </p>
            <Slider onValueChange={(value) => handleBonusChange(3, value[0])} defaultValue={[selectedBonuses[3]]} max={4} step={1} className="w-[60%] mb-5" color={"bg-blue-500"}/>
          </div>) : (<p className="italic text-xs">You have set a Raid Boss as the Defender Pokémon. Bonuses won't be affected.</p>)}
          <div className="flex flex-row space-x-4">
            <div>
              <p>Fast Attacks:</p>
              {preferredMovesQuick.map((move: string) => (
                PoGoAPI.getMovePBByID(move, allMoves).type && (<Card
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
                </Card>)
              ))}     
            </div>

            <div>
              <p>Charged Attacks:</p>
              {preferredMovesCharged.map((move: string) => (
                PoGoAPI.getMovePBByID(move, allMoves).type && (<Card
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
        (!isImporting) ? (<p>No Pokémon selected</p>) : (<p>Importing data...</p>)
      )}
    </>
  );
}