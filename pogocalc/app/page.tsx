"use client"

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchBarDefender from "@/components/search-bar";
import SearchBarAttacker from "@/components/search-bar-attacker";
import { Calculator } from "../lib/calculations";
import { PoGoAPI } from "../lib/PoGoAPI";
import CalculateButton from "@/components/calculate-button";
import CalculateButtonSimulate from "@/components/calculate-button-simulate";

export default function Home() {
  const [attackingPokemon, setAttackingPokemon] = useState<any>(null);
  const [defendingPokemon, setDefendingPokemon] = useState<any>(null);
  const [selectedQuickMove, setSelectedQuickMove] = useState<any | null>(null);
  const [selectedChargedMove, setSelectedChargedMove] = useState<any | null>(null);

  const handleAttackerSelect = async (pokemon: any) => {
    setAttackingPokemon(pokemon);
    setSelectedQuickMove(null);
    setSelectedChargedMove(null);
  };

  const handleDefenderSelect = (pokemon: any) => {
    setDefendingPokemon(pokemon);
  };

  const handleQuickMoveSelect = (moveId: string, move: any) => {
    setSelectedQuickMove(move);
  };

  const handleChargedMoveSelect = (moveId: string, move: any) => {
    setSelectedChargedMove(move);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="mb-10">Pokémon GO Damage Calculator</h1>
      <div className="flex flex-row space-x-4">
        <Card className="w-1/2 mr-4 bg-black text-white">
          <CardHeader>
            <CardTitle>Attacking Pokémon</CardTitle>
            <CardDescription>Set an attacking Pokémon</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBarAttacker
              onSelect={handleAttackerSelect}
              onQuickMoveSelect={handleQuickMoveSelect}
              onChargedMoveSelect={handleChargedMoveSelect}
            />
          </CardContent>
        </Card>
        <Card className="w-1/2 ml-4 ">
          <CardHeader>
            <CardTitle>Defending Pokémon</CardTitle>
            <CardDescription>Set a defending Pokémon</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBarDefender onSelect={handleDefenderSelect} />
          </CardContent>
        </Card>
      </div>
      <Card className="flex flex-col mt-4 w-1/2">
        <CardHeader >
          <CardTitle>Results</CardTitle>
          <CardDescription>Assumming level 50 and 100% stats on both Pokémon:</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription> Damage dealt per fast attack</CardDescription>
          <CalculateButton attacker={attackingPokemon} defender={defendingPokemon} move={selectedQuickMove} />
        </CardContent>
        <CardContent>
          <CardDescription> Damage dealt per charged attack</CardDescription>
          <CalculateButton attacker={attackingPokemon} defender={defendingPokemon} move={selectedChargedMove} />
        </CardContent>
        <CardContent>
          <CardDescription> Time to defeat using fast and charged attacks</CardDescription>
          <CalculateButtonSimulate attacker={attackingPokemon} defender={defendingPokemon} quickMove={selectedQuickMove} chargedMove={selectedChargedMove} />
        </CardContent>
        <CardFooter>
          <p>Results will be displayed here</p>
        </CardFooter>
      </Card>
    </div>
  );
}