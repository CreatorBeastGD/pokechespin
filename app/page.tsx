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
  const [selectedQuickMoveAttacker, setSelectedQuickMoveAttacker] = useState<any | null>(null);
  const [selectedChargedMoveAttacker, setSelectedChargedMoveAttacker] = useState<any | null>(null);
  const [selectedQuickMoveDefender, setSelectedQuickMoveDefender] = useState<any | null>(null);
  const [selectedChargedMoveDefender, setSelectedChargedMoveDefender] = useState<any | null>(null);
  const [attackerStats, setAttackerStats] = useState<any | null>([50, 15, 15, 15]);
  const [defenderStats, setDefenderStats] = useState<any | null>([50, 15, 15, 15]);

  const handleAttackerSelect = async (pokemon: any) => {
    setAttackingPokemon(pokemon);
    setSelectedQuickMoveAttacker(null);
    setSelectedChargedMoveAttacker(null);
  };

  const handleDefenderSelect = (pokemon: any) => {
    setDefendingPokemon(pokemon);
  };

  const handleQuickMoveSelectAttacker = (moveId: string, move: any) => {
    setSelectedQuickMoveAttacker(move);
  };

  const handleChargedMoveSelectAttacker = (moveId: string, move: any) => {
    setSelectedChargedMoveAttacker(move);
  };

  const handleQuickMoveSelectDefender = (moveId: string, move: any) => {
    setSelectedQuickMoveDefender(move);
  };

  const handleChargedMoveSelectDefender = (moveId: string, move: any) => {
    setSelectedChargedMoveDefender(move);
  };

  const handleChangedStatsAttacker = (stats: any) => {
    setAttackerStats(stats);
  };

  const handleChangedStatsDefender = (stats: any) => {
    setDefenderStats(stats);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="mb-10">Pokémon GO Damage Calculator</h1>
      <div className="flex md:flex-col flex-row justify-center space-x-4">
        <Card className="mr-4 text-black w-1/2">
          <CardHeader>
            <CardTitle>Attacking Pokémon</CardTitle>
            <CardDescription>Set an attacking Pokémon</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBarAttacker
              onSelect={handleAttackerSelect}
              onQuickMoveSelect={handleQuickMoveSelectAttacker}
              onChargedMoveSelect={handleChargedMoveSelectAttacker}
              onChangedStats={handleChangedStatsAttacker}
            />
          </CardContent>
        </Card>
        <Card className="w-1/2 ml- text-black">
          <CardHeader>
            <CardTitle>Defending Pokémon</CardTitle>
            <CardDescription>Set a defending Pokémon</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBarAttacker 
              onSelect={handleDefenderSelect} 
              onQuickMoveSelect={handleQuickMoveSelectDefender}
              onChargedMoveSelect={handleChargedMoveSelectDefender}
              onChangedStats={handleChangedStatsDefender}/>
          </CardContent>
        </Card>
      </div>
      <Card className="flex flex-col mt-4 w-1/2">
        <CardHeader >
          <CardTitle>Results</CardTitle>
          <CardDescription>Assumming the following stats:</CardDescription>
          <CardDescription>Attacker: {attackingPokemon?.names.English ? attackingPokemon?.names.English + " (Level " + attackerStats[0] + " " + attackerStats[1] + "-" + attackerStats[2] + "-" + attackerStats[3] + ")" : "TBD"}</CardDescription>
          <CardDescription>Defender: {defendingPokemon?.names.English ? defendingPokemon?.names.English + " (Level " + defenderStats[0] + " " + defenderStats[1] + "-" + defenderStats[2] + "-" + defenderStats[3] + ")" : "TBD"}</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription> Damage dealt per fast attack</CardDescription>
          <CalculateButton 
            attacker={attackingPokemon} 
            defender={defendingPokemon} 
            move={selectedQuickMoveAttacker} 
            attackerStats={attackerStats}
            defenderStats={defenderStats}/>
        </CardContent>
        <CardContent>
          <CardDescription> Damage dealt per charged attack</CardDescription>
          <CalculateButton 
            attacker={attackingPokemon} 
            defender={defendingPokemon} 
            move={selectedChargedMoveAttacker}
            attackerStats={attackerStats}
            defenderStats={defenderStats}
          />
        </CardContent>
        <CardContent>
          <CardDescription> Time to defeat using fast and charged attacks</CardDescription>
          <CalculateButtonSimulate 
            attacker={attackingPokemon} 
            defender={defendingPokemon} 
            quickMove={selectedQuickMoveAttacker} 
            chargedMove={selectedChargedMoveAttacker}
            attackerStats={attackerStats}
            defenderStats={defenderStats}
            />
        </CardContent>
        <CardFooter>
          <p>Results will be displayed here</p>
        </CardFooter>
      </Card>
    </div>
  );
}