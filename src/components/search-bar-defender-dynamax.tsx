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
    number
  }: SearchBarAttackerProps, ) {
    const raidModeLevelMultiplier = raidMode === "normal" ? 40 : 
                                  raidMode === "raid-t1-dmax" ? 8001 : 
                                  raidMode === "raid-t2-dmax" ? 8002 :
                                  raidMode === "raid-t3-dmax" ? 8003 :
                                  raidMode === "raid-t4-dmax" ? 8004 :
                                  raidMode === "raid-t5-dmax" ? 8005 :
                                  raidMode === "raid-t6-gmax" ? 8006 : 1;
  
  const [pokemon, setPokemon] = useState<string>("");
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<string>("normal");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuickMove, setSelectedQuickMove] = useState<string | null>(null);
  const [selectedChargedMove, setSelectedChargedMove] = useState<string | null>(null);
  const [stats, setStats] = useState<any>([raidModeLevelMultiplier, 15, 15, 15]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedBonuses, setSelectedBonuses] = useState<any[]>(["EXTREME", false, false, 0]);
  const [availableForms, setAvailableForms] = useState<any[]>([]);
  const [clickedSuggestion, setClickedSuggestion] = useState<boolean>(false);
  
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
      setPokemonData(response);
      onSelect(response, member, number);
      //console.log();
      const allForms = pokemonList.filter((p: any) => p.pokedex.pokemonId === pokemonD.pokedex.pokemonId);
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
      setPokemonData(response);
      onSelect(response, member, number);
      const allForms = PoGoAPI.getPokemonPBByName(pokemon.toUpperCase(), pokemonList);
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
  
  const effAttack = Calculator.getEffectiveAttack(selectedPokemon?.stats?.baseAttack, stats[1], raidModeLevelMultiplier);
  const effDefense = Calculator.getEffectiveDefense(selectedPokemon?.stats?.baseDefense, stats[2], raidModeLevelMultiplier);
  const effStamina = Calculator.getEffectiveStamina(selectedPokemon?.stats?.baseStamina, stats[3], raidModeLevelMultiplier);

  const raidmode = raidMode ? raidMode : "normal";

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
      <Button onClick={searchPokemon} className="mt-4 mb-2">Search</Button>
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {pokemonData ? (
        <div>
          <h2>Name: {PoGoAPI.getPokemonNamePB(selectedPokemon.pokemonId, allEnglishText)}</h2>
          <p>Type(s): {PoGoAPI.formatTypeName(selectedPokemon.type) + (selectedPokemon.type2 ? " / " + PoGoAPI.formatTypeName(selectedPokemon.type2) : "")}</p>
          
          
          <select onChange={handleFormChange} value={selectedForm} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
            {availableForms && (availableForms).map((form: any) => (
              <option key={form.pokemonId} value={form.pokemonId}>{PoGoAPI.getPokemonNamePB(form.pokemonId, allEnglishText)}</option>
            ))}
          </select>

          <p>Stats (PC: {raidmode == "normal" ? Calculator.getPCs(effAttack, effDefense, effStamina) : Calculator.getRawPCs(selectedPokemon?.stats?.baseAttack, selectedPokemon?.stats?.baseDefense, Calculator.getRaidBossHP(raidmode))}) </p>
          
          <p>Attack: {selectedPokemon.stats?.baseAttack} <span className="text-xs">(Effective Attack: {Math.floor(effAttack)})</span></p>
          <Progress color={"bg-red-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseAttack / 505) * 100}/>
          
          <p>Defense: {selectedPokemon.stats?.baseDefense} <span className="text-xs">(Effective Defense: {Math.floor(effDefense)})</span></p> 
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
                    <CardDescription>Type: {PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)}</CardDescription>
                    <CardDescription>Power: {(PoGoAPI.getMovePBByID(move, allMoves)).power ?? 0}</CardDescription>
                    <CardDescription>Duration: {PoGoAPI.getMovePBByID(move, allMoves).durationMs / 1000}s</CardDescription>
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
                    <CardDescription>Type: {PoGoAPI.formatTypeName((PoGoAPI.getMovePBByID(move, allMoves)).type)}</CardDescription>
                    <CardDescription>Power: {(PoGoAPI.getMovePBByID(move, allMoves)).power ?? 0}</CardDescription>
                    <CardDescription>Duration: {PoGoAPI.getMovePBByID(move, allMoves).durationMs / 1000}s</CardDescription>
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