"use client";

import { useEffect, useState } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { Calculator } from "../../lib/calculations";
import { Select, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectContent } from "@radix-ui/react-select";


interface SearchBarAttackerProps {
  onSelect: (pokemon: any) => void;
  onQuickMoveSelect: (moveId: string, move: any) => void;
  onChargedMoveSelect: (moveId: string, move: any) => void;
  onChangedStats: (stats: any) => void;
}

export default function SearchBarAttacker({ onSelect, onQuickMoveSelect, onChargedMoveSelect, onChangedStats }: SearchBarAttackerProps) {
  const [pokemon, setPokemon] = useState<string>("");
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<string>("normal");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuickMove, setSelectedQuickMove] = useState<string | null>(null);
  const [selectedChargedMove, setSelectedChargedMove] = useState<string | null>(null);
  const [stats, setStats] = useState<any>([50, 15, 15, 15]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [allPokemon, setAllPokemon] = useState<any[]>([]);
  
  useEffect(() => {
    if (pokemonData) {
      onSelect(getSelectedForm());
    }
  }, [selectedForm]);

  useEffect(() => {
    onChangedStats(stats);
  } , [stats]);

  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      const names = await PoGoAPI.getAllPokemon();
      setAllPokemon(names);
    };
    fetchAllPokemonNames();
  }, []);

  const searchPokemon = async () => {
    setLoading(true);
    setError(null);
    handleQuickMoveSelect("", null);
    handleChargedMoveSelect("", null);
    setSelectedForm("normal");
    try {
      const response = await PoGoAPI.getPokemonByName(pokemon.toUpperCase());
      setPokemonData(response);
      onSelect(response);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMoveSelect = (moveId: string, move: any) => {
    setSelectedQuickMove(moveId);
    onQuickMoveSelect(moveId, move);
  };

  const handleChargedMoveSelect = (moveId: string, move: any) => {
    setSelectedChargedMove(moveId);
    onChargedMoveSelect(moveId, move);
  };

  
  const formatPokemonName = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-');
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedForm(event.target.value);
    onSelect(getSelectedForm());
    setSelectedQuickMove(null);
    setSelectedChargedMove(null);
  };

  const getSelectedForm = () => {
    if (selectedForm === "normal") {
      return pokemonData;
    } else {
      return pokemonData.megaEvolutions[selectedForm];
    }
  };

  const handleChangeStat = (value: number[], index: number) => {
    setStats((prev: any) => {
      const newStats = [...prev];
      newStats[index] = value[0];

      return newStats;
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPokemon(value);

    // Filtrar sugerencias
    if (value.length > 0) {
      const filteredSuggestions = allPokemon.filter((p: any) =>
        p.id.toLowerCase().startsWith(value.toLowerCase())
    );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setPokemon(suggestion);
    setSuggestions([]);
  };

  const selectedPokemon = pokemonData ? getSelectedForm() : null;
  
  const effAttack = Calculator.getEffectiveAttack(selectedPokemon?.stats.attack, stats[1], stats[0]);
  const effDefense = Calculator.getEffectiveAttack(selectedPokemon?.stats.defense, stats[2], stats[0]);
  const effStamina = Calculator.getEffectiveAttack(selectedPokemon?.stats.stamina, stats[3], stats[0]);

  return (
    <>
      <Input
        placeholder="Search for a Pokémon"
        type="text"
        value={pokemon}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 w-[10%]">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion.id)}
            >
              {suggestion.names.English}
            </li>
          ))}
        </ul>
      )}
      <Button onClick={searchPokemon} className="mt-4 mb-2">Buscar</Button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {pokemonData ? (
        <div>
          <h2>Name: {selectedPokemon.names.English}</h2>
          <p>Type(s): {selectedPokemon.primaryType.names.English + (selectedPokemon.secondaryType ? "/" + selectedPokemon.secondaryType.names.English : "")}</p>
          
          
          <select onChange={handleFormChange} value={selectedForm} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
            <option value="normal">Normal</option>
            {pokemonData.hasMegaEvolution && Object.keys(pokemonData.megaEvolutions).map((form) => (
              <option key={form} value={form}>{pokemonData.megaEvolutions[form].names.English}</option>
            ))}
          </select>

          <p>Stats (PC: {Calculator.getPCs(effAttack, effDefense, effStamina)})</p>
          <p>Attack: {selectedPokemon.stats.attack} <span className="text-xs">(Effective Attack: {Math.floor(effAttack)})</span></p>
          <Progress color={"bg-red-600"} className="w-[60%]" value={(selectedPokemon.stats.attack / 505) * 100}/>
          
          <p>Defense: {selectedPokemon.stats.defense} <span className="text-xs">(Effective Defense: {Math.floor(effDefense)})</span></p> 
          <Progress color={"bg-green-600"} className="w-[60%]" value={(selectedPokemon.stats.defense / 505) * 100}/>
          
          <p>Stamina: {selectedPokemon.stats.stamina} <span className="text-xs">(Effective Stamina: {Math.floor(effStamina)})</span></p> 
          <Progress color={"bg-yellow-600"} className="w-[60%]" value={(selectedPokemon.stats.stamina / 505) * 100}/>
          {selectedPokemon.assets?.image ? (
            <Image
              className="rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 p-2 bg-white dark:bg-gray-800 dark:border-gray-700"
              src={selectedPokemon.assets?.image}
              alt={selectedPokemon.names.English}
              width={400}
              height={400}
              style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
            />
          ) : (
            <Image
                className="rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 p-2 bg-white dark:bg-gray-800 dark:border-gray-700"
                src={"https://img.pokemondb.net/sprites/home/normal/" + formatPokemonName(selectedPokemon.names.English) + ".png"}
                alt={selectedPokemon.names.English}
                width={400}
                height={400}
                style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
            />
          )}
          <div>
            <p>Stat picker</p>
            <p>Level: {stats[0]}</p>
            <Slider onValueChange={(value) => handleChangeStat(value, 0)} defaultValue={[50]} max={51} step={0.5} min={1} className="w-[60%] mb-1" color={stats[0] == 51 ? "bg-blue-500" : "bg-blue-700"}/>
            <p className={stats[1] == 15 ? "text-red-600" : "text-yellow-600"}>Attack: </p>
            <Slider onValueChange={(value) => handleChangeStat(value, 1)} defaultValue={[15]} max={15} step={1} className="w-[60%] mb-1" color={stats[1] == 15 ? "bg-red-500" : "bg-yellow-600"}/>
            <p className={stats[2] == 15 ? "text-red-600" : "text-yellow-600"}>Defense: </p>
            <Slider onValueChange={(value) => handleChangeStat(value, 2)} defaultValue={[15]} max={15} step={1} className="w-[60%] mb-1" color={stats[2] == 15 ? "bg-red-500" : "bg-yellow-600"}/>
            <p className={stats[3] == 15 ? "text-red-600" : "text-yellow-600"}>Stamina: </p>
            <Slider onValueChange={(value) => handleChangeStat(value, 3)} defaultValue={[15]} max={15} step={1} className="w-[60%] mb-5" color={stats[3] == 15 ? "bg-red-500" : "bg-yellow-600"}/>
          </div>
          <div className="flex flex-row space-x-4">
            <div>
              <p>Fast Attacks:</p>
              {Object.values(pokemonData.quickMoves).map((move: any) => (
                <Card
                  key={move.id}
                  className={`mb-4 ${selectedQuickMove === move.id ? 'bg-blue-200' : ''}`}
                  onClick={() => handleQuickMoveSelect(move.id, move)}
                >
                  <CardHeader>
                    <CardTitle>{move.names.English}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Power: {move.power}</CardDescription>
                    <CardDescription>Energy: {move.energy}</CardDescription>
                    <CardDescription>Type: {move.type.names.English}</CardDescription>
                    <CardDescription>Duration: {move.durationMs / 1000}s</CardDescription>
                  </CardContent>
                </Card>
              ))}
              {Object.values(pokemonData.eliteQuickMoves).length > 0 && (
                <>
                  {Object.values(pokemonData.eliteQuickMoves).map((move: any) => (
                    <Card
                      key={move.id}
                      className={`mb-4 ${selectedQuickMove === move.id ? 'bg-blue-200' : ''}`}
                      onClick={() => handleQuickMoveSelect(move.id, move)}
                    >
                      <CardHeader>
                        <CardTitle>{move.names.English} <span className="text-xs">*</span></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>Power: {move.power}</CardDescription>
                        <CardDescription>Energy: {move.energy}</CardDescription>
                        <CardDescription>Type: {move.type.names.English}</CardDescription>
                        <CardDescription>Duration: {move.durationMs / 1000}s</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>

            <div>
              <p>Charged Attacks:</p>
              {Object.values(pokemonData.cinematicMoves).map((move: any) => (
                <Card
                  key={move.id}
                  className={`mb-4 ${selectedChargedMove === move.id ? 'bg-blue-200' : ''}`}
                  onClick={() => handleChargedMoveSelect(move.id, move)}
                >
                  <CardHeader>
                    <CardTitle>{move.names.English}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Power: {move.power}</CardDescription>
                    <CardDescription>Energy cost: {-move.energy}</CardDescription>
                    <CardDescription>Type: {move.type.names.English}</CardDescription>
                    <CardDescription>Duration: {move.durationMs / 1000}s</CardDescription>
                  </CardContent>
                </Card>
              ))}
              {Object.values(pokemonData.eliteCinematicMoves).length > 0 && (
                <>
                  {Object.values(pokemonData.eliteCinematicMoves).map((move: any) => (
                    <Card
                      key={move.id}
                      className={`mb-4 ${selectedChargedMove === move.id ? 'bg-blue-200' : ''}`}
                      onClick={() => handleChargedMoveSelect(move.id, move)}
                    >
                      <CardHeader>
                        <CardTitle>{move.names.English} (Elite)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>Power: {move.power}</CardDescription>
                        <CardDescription>Energy cost: {-move.energy}</CardDescription>
                        <CardDescription>Type: {move.type.names.English}</CardDescription>
                        <CardDescription>Duration: {move.durationMs / 1000}s</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>No Pokémon selected</p>
      )}
    </>
  );
}

function onChangedStats(stats: any) {
  throw new Error("Function not implemented.");
}
