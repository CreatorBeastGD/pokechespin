"use client";

import { useEffect, useRef, useState } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Calculator } from "../../lib/calculations";
import { useSearchParams, usePathname } from "next/navigation";
import TypeBadge from "./TypeBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import WeaknessResistanceTable from "./WeaknessResistanceTable";


interface SearchBarAttackerProps {
  onSelect: (pokemon: any, member: any, slot: any) => void;
  onQuickMoveSelect: (moveId: string, move: any, member: any, slot: any) => void;
  onChargedMoveSelect: (moveId: string, move: any, member: any, slot: any) => void;
  onChangedStats: (stats: any, member: any, slot: any) => void;
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
  allTypes?: any;
}

export default function SearchBarDefenderDynamax({ 
    onSelect, 
    onQuickMoveSelect, 
    onChargedMoveSelect, 
    onChangedStats,
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
    number,
    allTypes
  }: SearchBarAttackerProps, ) {
  
  const [pokemon, setPokemon] = useState<string>("");
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<string>("normal");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuickMove, setSelectedQuickMove] = useState<string | null>(null);
  const [selectedChargedMove, setSelectedChargedMove] = useState<string | null>(null);
  
  let raidModeLevelMultiplier = (pokemon !== "" ? PoGoAPI.convertStats([40, 15, 15, 15], raidMode, pokemon) : PoGoAPI.convertStats([40, 15, 15, 15], raidMode))[0];
  const [stats, setStats] = useState<any>([raidModeLevelMultiplier, 15, 15, 15]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedBonuses, setSelectedBonuses] = useState<any[]>(["EXTREME", false, false, 0]);
  const [availableForms, setAvailableForms] = useState<any[]>([]);
  const [clickedSuggestion, setClickedSuggestion] = useState<boolean>(false);
  
  const [showWeaknesses, setShowWeaknesses] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialLoad = useRef(false);

  useEffect(() => {
    //console.log(initialValues);
    if (!initialLoad.current && initialValues) {
      initialLoad.current = true;
      if (initialValues.attacker) searchPokemonInit(initialValues.attacker);
      if (initialValues.quickMove) handleQuickMoveSelect(initialValues.quickMove.moveId, initialValues.quickMove);
      if (initialValues.chargedMove) handleChargedMoveSelect(initialValues.chargedMove.moveId, initialValues.chargedMove);
      //console.log("Initial values loaded");
    }
  }, [initialValues]); // Agrega `initialValues` como dependencia

  const handleQuickMoveSelect = (moveId: string, move: any) => {
    setSelectedQuickMove(moveId);
    onQuickMoveSelect(moveId, move, member, number);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("defender_fast_attack", moveId);
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  };

  const handleChargedMoveSelect = (moveId: string, move: any) => {
    setSelectedChargedMove(moveId);
    onChargedMoveSelect(moveId, move, member, number);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("defender_cinematic_attack", moveId);
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
      raidModeLevelMultiplier = (response ? PoGoAPI.convertStats([40, 15, 15, 15], raidMode, response.pokemonId) : PoGoAPI.convertStats([40, 15, 15, 15], raidMode))[0];
      setPokemonData(response);
      onSelect(response, member, number);
      //console.log();
      const allForms = pokemonList.filter((p: any) => p.pokedex.pokemonId === pokemonD.pokedex.pokemonId && (p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX"));
      setAvailableForms(allForms);// Construir nueva URL
      setSelectedForm(pokemonD.pokemonId);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("defender", response?.pokemonId);
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
      raidModeLevelMultiplier = (response ? PoGoAPI.convertStats([40, 15, 15, 15], raidMode, response.pokemonId) : PoGoAPI.convertStats([40, 15, 15, 15], raidMode))[0];
      setPokemonData(response);
      onSelect(response, member, number);
      const allForms = PoGoAPI.getPokemonPBByName(pokemon.toUpperCase(), pokemonList).filter((p: any) => p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX");
      setAvailableForms(allForms);// Construir nueva URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("defender", response?.pokemonId);
      newSearchParams.delete("defender_fast_attack");
      newSearchParams.delete("defender_cinematic_attack");  
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
      raidModeLevelMultiplier = (response ? PoGoAPI.convertStats([40, 15, 15, 15], raidMode, response.pokemonId) : PoGoAPI.convertStats([40, 15, 15, 15], raidMode))[0];
      setPokemonData(response);
      onSelect(response, member, number);
      const newSearchParams = new URLSearchParams(searchParams.toString());    
      newSearchParams.set("defender", response?.pokemonId);
      newSearchParams.delete("defender_fast_attack");
      newSearchParams.delete("defender_cinematic_attack");
      
      window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
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

  // Bonuses = [weather-boost, shadow, mega, friendship]
  const handleBonusChange = (bonusIndex: number, value: any) => {
    setSelectedBonuses((prev: any) => {
      const newBonuses = [...prev];
      newBonuses[bonusIndex] = value;
      return newBonuses;
    });
  };

  useEffect(() => {
    
    onChangedStats(stats, member, number);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("defender_stats", stats.join(","));
    window.history.replaceState({}, "", `${pathname}?${newSearchParams.toString()}`);
  }, [stats]);


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

  const selectedPokemon = pokemonData //? getSelectedForm() : null;

  raidModeLevelMultiplier = (selectedPokemon ? PoGoAPI.convertStats([40, 15, 15, 15], raidMode, selectedPokemon.pokemonId) : PoGoAPI.convertStats([40, 15, 15, 15], raidMode))[0];
  
  if (raidMode === "raid-custom-dmax") {
      searchParams.get("custom_hp");
      searchParams.get("custom_cpm");
      searchParams.get("custom_atk_mult");
  }

  const effAttack =  Calculator.getEffectiveAttackRawCPM(selectedPokemon?.stats?.baseAttack, stats[1], (Number)(raidMode === "raid-custom-dmax" ? searchParams.get("custom_cpm") : Calculator.getCPM(raidModeLevelMultiplier)));
  const effDefense = Calculator.getEffectiveDefenseRawCPM(selectedPokemon?.stats?.baseDefense, stats[2], (Number)(raidMode === "raid-custom-dmax" ? searchParams.get("custom_cpm") : Calculator.getCPM(raidModeLevelMultiplier)));
  const effStamina = Calculator.getEffectiveStaminaRawCPM(selectedPokemon?.stats?.baseStamina, stats[3], (Number)(raidMode === "raid-custom-dmax" ? searchParams.get("custom_cpm") : Calculator.getCPM(raidModeLevelMultiplier)));

  const raidmode = raidMode ? raidMode : "normal";

  

  //console.log(selectedPokemon? selectedPokemon : "null");

  const suffixes = ["_MEGA", "_MEGA_X", "_MEGA_Y", "_MEGA_Z", "_MEGA_COMPLETE", "_MEGA_C"];

  const preferredMoves = suffixes.some(suffix => selectedPokemon?.pokemonId?.endsWith(suffix)) ? PoGoAPI.getPreferredMovesPB((selectedPokemon?.pokemonId)?.replace("_MEGA_COMPLETE", "").replace("_MEGA_C", "").replace("_MEGA", "").replace("_X", "").replace("_Y", "").replace("_Z", ""), selectedPokemon?.pokemonId, pokemonList) : { preferredMovesQuick: selectedPokemon?.quickMoves, preferredMovesCharged: selectedPokemon?.cinematicMoves };
  const preferredMovesCharged = 'preferredMovesCharged' in preferredMoves ? preferredMoves.preferredMovesCharged : selectedPokemon?.cinematicMoves;

  const damageMultiplier = raidMode === "raid-custom-dmax" ? (Number)(searchParams.get("custom_atk_mult") || 1) : PoGoAPI.getDamageMultiplier(raidMode, false ,false ,selectedPokemon?.pokemonId);

  const weaknesses = selectedPokemon ? PoGoAPI.getAllWeaknesses(selectedPokemon.type, selectedPokemon.type2, allTypes) : null;

  return (
    <TooltipProvider>
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
      <Button onClick={searchPokemon} className="mt-4 mb-2">Search</Button>
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
          <p>Type(s): <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type)} />  {(selectedPokemon.type2) && <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type2)} />} <button onClick={() => setShowWeaknesses(!showWeaknesses)}>?</button></p>
          
          {weaknesses && showWeaknesses && (
            <WeaknessResistanceTable weaknesses={weaknesses} />
          )}
          
          <select onChange={handleFormChange} value={selectedForm} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
            {availableForms && (availableForms).map((form: any) => (
              <option key={form.pokemonId} value={form.pokemonId}>{PoGoAPI.getPokemonNamePB(form.pokemonId, allEnglishText)}</option>
            ))}
          </select>
          
          <p>Stats (CP {raidMode == "normal" ? Calculator.getPCs(effAttack, effDefense, effStamina) : Calculator.getRawPCs(selectedPokemon?.stats?.baseAttack, selectedPokemon?.stats?.baseDefense, (Number)(raidMode === "raid-custom-dmax" ? searchParams.get("custom_hp") : Calculator.getEffectiveDMAXHP(raidmode, selectedPokemon?.pokemonId)) )}) </p>
          
          <div className="flex flex-row items-center space-x-2">  
            <p>Attack: {selectedPokemon.stats?.baseAttack} <span className="text-xs">(Effective Attack: {( effAttack * damageMultiplier).toFixed(3)})</span></p>
            <Popover>
              <PopoverTrigger asChild>
                <button className="" >?</button>
              </PopoverTrigger>
              <PopoverContent>
                <p>Effective Attack: {"(" + selectedPokemon?.stats?.baseAttack + " + " + stats[1] + ") x " + (raidMode === "raid-custom-dmax" ? searchParams.get("custom_cpm") : Calculator.getCPM(raidModeLevelMultiplier)) + " x " + damageMultiplier + " = " + (effAttack * damageMultiplier).toFixed(3)}</p>
              </PopoverContent>
            </Popover>
          </div>
          
          <Progress color={"bg-red-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseAttack / 505) * 100}/>
          <div className="flex flex-row items-center space-x-2">
            <p>Defense: {selectedPokemon.stats?.baseDefense} <span className="text-xs">(Effective Defense: {(effDefense)})</span></p>
            <Popover>
              <PopoverTrigger asChild>
                <button className="" >?</button>
              </PopoverTrigger>
              <PopoverContent>
                <p>Effective Defense: {"(" + selectedPokemon?.stats?.baseDefense + " + " + stats[2] + ") x " + (raidMode === "raid-custom-dmax" ? searchParams.get("custom_cpm") : Calculator.getCPM(raidModeLevelMultiplier)) + " = " + (effDefense)}</p>
              </PopoverContent>
            </Popover>
          </div>
          <Progress color={"bg-green-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseDefense / 505) * 100}/>

          <p>Stamina: {selectedPokemon.stats?.baseStamina} <span className="text-xs">(Effective Stamina: {Math.floor(effStamina) + " (" + (raidMode === "raid-custom-dmax" ? searchParams.get("custom_hp") : Calculator.getEffectiveDMAXHP(raidmode, selectedPokemon?.pokemonId, PoGoAPI.hasDoubleWeaknesses(selectedPokemon.type, selectedPokemon.type2, allTypes))) + ")"})</span></p>
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
          <div className="flex flex-row space-x-4">
            <div>
              <p>Large Attack:</p>
              {preferredMovesCharged.map((move: string) => (
                PoGoAPI.getMovePBByID(move, allMoves).type && (<Card
                  key={move}
                  className={`mb-4 ${selectedQuickMove === move ? 'bg-blue-200' : ''}`}
                  onClick={() => handleQuickMoveSelect(move, PoGoAPI.getMovePBByID(move, allMoves))}
                >
                  <CardHeader>
                    <CardTitle>{PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(move, allMoves)).moveId)}{(selectedPokemon?.eliteCinematicMove ?? []).includes(move) ? " *" : ""}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Type: <TypeBadge type={PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)} /></CardDescription>
                    <CardDescription>Power: {(PoGoAPI.getMovePBByID(move, allMoves)).power ?? 0}</CardDescription>
                    <CardDescription>Duration: {PoGoAPI.getMovePBByID(move, allMoves).durationMs / 1000}s</CardDescription>
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

            <div>
              <p>Targeted Attack:</p>
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
                    <CardDescription>Power: {(PoGoAPI.getMovePBByID(move, allMoves)).power ?? 0}</CardDescription>
                    <CardDescription>Duration: {PoGoAPI.getMovePBByID(move, allMoves).durationMs / 1000}s</CardDescription>
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
    </TooltipProvider>
  );
}