"use client"

import React, { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Home() {
  const [attackingPokemon, setAttackingPokemon] = useState<any>(null);
  const [defendingPokemon, setDefendingPokemon] = useState<any>(null);
  const [selectedQuickMoveAttacker, setSelectedQuickMoveAttacker] = useState<any | null>(null);
  const [selectedChargedMoveAttacker, setSelectedChargedMoveAttacker] = useState<any | null>(null);
  const [selectedQuickMoveDefender, setSelectedQuickMoveDefender] = useState<any | null>(null);
  const [selectedChargedMoveDefender, setSelectedChargedMoveDefender] = useState<any | null>(null);
  const [attackerStats, setAttackerStats] = useState<any | null>([50, 15, 15, 15]);
  const [defenderStats, setDefenderStats] = useState<any | null>([50, 15, 15, 15]);
  const [raidMode, setRaidMode] = useState<any>("normal");
  const [bonusAttacker, setBonusAttacker] = useState<any[]>(["EXTREME", false, false, 0]);
  const [bonusDefender, setBonusDefender] = useState<any[]>(["EXTREME", false, false, 0]);

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

  const handleBonusChangeAttacker = (bonus: any) => {
    setBonusAttacker(bonus);
  };

  const handleBonusChangeDefender = (bonus: any) => {
    setBonusDefender(bonus);
  };

  const handleSwitch = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRaidMode(event.target.value);
  }

  useEffect(() => {
    console.log("Raid mode updated:", raidMode);
  }, [raidMode]);

  const raidSurname = (raidMode: string) => {
    if (raidMode === "raid-t1") {
      return "Tier 1";
    } else if (raidMode === "raid-t3") {
      return "Tier 3";
    } else if (raidMode === "raid-t4") {
      return "Tier 4";
    } else if (raidMode === "raid-mega") {
      return "Mega";
    } else if (raidMode === "raid-t5") {
      return "Tier 5";
    } else if (raidMode === "raid-elite") {
      return "Elite";
    } else if (raidMode === "raid-primal") {
      return "Primal";
    } else if (raidMode === "raid-mega-leg") {
      return "Mega Legendary";
    } else {
      return "Normal";
    }
  }

  return (
    <div className="flex flex-col flex-row items-center justify-center space-y-4">
      <h1 className="mb-10 title">Pokémon GO Damage (and PC) Calculator</h1>
      <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
      
      <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
        <Card className="md:w-1/2 w-full">
          <CardHeader>
            <CardTitle>Attacking Pokémon</CardTitle>
            <CardDescription>Set an attacking Pokémon</CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBarAttacker
              onSelect={handleAttackerSelect}
              onQuickMoveSelect={handleQuickMoveSelectAttacker}
              onChargedMoveSelect={handleChargedMoveSelectAttacker}
              onChangedStats={handleChangedStatsAttacker}
              onBonusChange={handleBonusChangeAttacker}
            />
          </CardContent>
        </Card>
        <Card className="md:w-1/2 w-full">
          <CardHeader>
            <CardTitle>Defending Pokémon</CardTitle>
            <CardDescription>Set a defending Pokémon</CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBarAttacker
              onSelect={handleDefenderSelect}
              onQuickMoveSelect={handleQuickMoveSelectDefender}
              onChargedMoveSelect={handleChargedMoveSelectDefender}
              onChangedStats={handleChangedStatsDefender}
              onBonusChange={handleBonusChangeDefender}
              raidMode={raidMode}
            />
          </CardContent>
        </Card>
        <Card className="md:w-1/2 w-full ">
            <CardHeader >
              <CardTitle>Results</CardTitle>
              <CardDescription>Assumming the following stats:</CardDescription>
              <CardDescription>Attacker: {attackingPokemon?.names.English ? (bonusAttacker[1] !== false ? "Shadow " : "") + attackingPokemon?.names.English + " (Level " + attackerStats[0] + " " + attackerStats[1] + "-" + attackerStats[2] + "-" + attackerStats[3] + ")" : "TBD"}</CardDescription>
              <CardDescription>Defender: {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} {defendingPokemon?.names.English ? (bonusDefender[1] !== false ? "Shadow " : "") + (defendingPokemon?.names.English + (raidMode === "normal" ? (" (Level " + defenderStats[0] + " " + defenderStats[1] + "-" + defenderStats[2] + "-" + defenderStats[3] + ")") : "")): "TBD"}</CardDescription>
            </CardHeader>
            <CardContent>
              <select onChange={handleSwitch} value={raidMode} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
                <option key="normal" value="normal">Normal</option>
                <option key={"raid-t1"} value={"raid-t1"}>Tier-1 Raid (600HP) </option>
                <option key={"raid-t3"} value={"raid-t3"}>Tier-3 Raid (3600HP) </option>
                <option key={"raid-t4"} value={"raid-t4"}>Tier-4 Raid (9000HP) </option>
                <option key={"raid-t5"} value={"raid-t5"}>Tier-5 Raid (15000HP) </option>
                <option key={"raid-mega"} value={"raid-mega"}>Mega Raid (9000HP) </option>
                <option key={"raid-mega-leg"} value={"raid-mega-leg"}>Mega Legendary Raid (22500HP) </option>
                <option key={"raid-elite"} value={"raid-elite"}>Elite Raid (20000HP) </option>
                <option key={"raid-primal"} value={"raid-primal"}>Primal Raid (22500HP) </option>

              </select>
              <CardDescription> Damage dealt per fast attack</CardDescription>
              <CalculateButton 
                attacker={attackingPokemon} 
                defender={defendingPokemon} 
                move={selectedQuickMoveAttacker} 
                attackerStats={attackerStats}
                defenderStats={defenderStats}
                bonusAttacker={bonusAttacker}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
                />
            </CardContent>
            <CardContent>
              <CardDescription> Damage dealt per charged attack</CardDescription>
              <CalculateButton 
                attacker={attackingPokemon} 
                defender={defendingPokemon} 
                move={selectedChargedMoveAttacker}
                attackerStats={attackerStats}
                defenderStats={defenderStats}
                bonusAttacker={bonusAttacker}
                bonusDefender={bonusDefender}
                raidMode={raidMode}
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
                raidMode={raidMode}
                bonusAttacker={bonusAttacker}
                bonusDefender={bonusDefender}
                />
            </CardContent>
        </Card>
      </div>
      
      <p className="bottomtext">Version 1.3.1</p>
      <p className="linktext">Pokémon GO API made by <a className="link" href="https://github.com/pokemon-go-api/pokemon-go-api">mario6700-pogo</a></p>
      <Avatar>
        <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
        <AvatarFallback>CB</AvatarFallback>
      </Avatar>
    </div>
  );
}