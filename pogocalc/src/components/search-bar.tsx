"use client";

import { useState } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {Progress} from "./ui/progress";

interface SearchBarDefenderProps {
    onSelect: (pokemon: any) => void;
  }
  
  export default function SearchBarDefender({ onSelect }: SearchBarDefenderProps) {
    const [pokemon, setPokemon] = useState<string>("");
    const [pokemonData, setPokemonData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const searchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await PoGoAPI.getPokemonByName(pokemon.toUpperCase());
        setPokemonData(response);
        onSelect(response);
      } finally {
        setLoading(false);
      }
    };
    
  const formatPokemonName = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-');
  };

  
  return (
    <>
      <Input
        placeholder="Search for a Pokémon"
        type="text"
        onChange={(e) => setPokemon(e.target.value)}
      />
      <Button onClick={searchPokemon} className="mt-4 mb-2">Buscar</Button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {pokemonData ? (
        <div>
            <h2>Name: {pokemonData.names.English}</h2>
            <p>Type(s): {pokemonData.primaryType.names.English + (pokemonData.secondaryType ? "/" + pokemonData.secondaryType.names.English : "")}</p>
            <p>Stats</p>
            <p>Attack: {pokemonData.stats.attack}</p>
            <Progress color={"bg-red-600"} className="w-[60%]" value={(pokemonData.stats.attack / 505) * 100}/>
            <p>Defense: {pokemonData.stats.defense}</p>
            
            <Progress color={"bg-green-600"} className="w-[60%]" value={(pokemonData.stats.defense / 505) * 100}/>
            <p>Stamina: {pokemonData.stats.stamina}</p>
            
            <Progress color={"bg-yellow-600"} className="w-[60%]" value={(pokemonData.stats.stamina / 505) * 100}/>
            {pokemonData.assets?.image ? (
            <Image
            className="rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 p-2 bg-white dark:bg-gray-800 dark:border-gray-700"
                src={pokemonData.assets?.image}
                alt={pokemonData.names.English}
                width={400}
                height={400}
                style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
            />
            ) : (
                <Image
              className="rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 p-2 bg-white dark:bg-gray-800 dark:border-gray-700"
              src={"https://img.pokemondb.net/sprites/home/normal/" + formatPokemonName(pokemonData.names.English) + ".png"}
              alt={pokemonData.names.English}
              width={400}
              height={400}
              style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
            />
            )
                }
            <div className="flex flex-row space-x-4">
                <div>
                    <p>Fast Attacks:</p>
                    {Object.values(pokemonData.quickMoves).map((move: any) => (
                    <Card key={move.id} className="mb-4">
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
                            <Card key={move.id} className="mb-4">
                                <CardHeader>
                                    <CardTitle>{move.names.English} (Elite)</CardTitle>
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
                        <Card key={move.id} className="mb-4">
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
                            <Card key={move.id} className="mb-4">
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
      ): (
        <p>No Pokémon selected</p>
      )}
    </>
  );
}