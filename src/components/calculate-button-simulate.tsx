"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import { CardHeader, Card, CardTitle, CardContent, CardDescription } from "./ui/card";

export default function CalculateButtonSimulate({
  attacker,
  defender,
  quickMove,
  chargedMove,
  attackerStats,
  defenderStats,
  raidMode,
  bonusAttacker,
  bonusDefender,
  allEnglishText,
  bladeBoost = false,
}: {
  attacker: any;
  defender: any;
  quickMove: any;
  chargedMove: any;
  attackerStats: any;
  defenderStats: any;
  raidMode: string;
  bonusAttacker: any;
  bonusDefender: any;
  allEnglishText: any;
  bladeBoost?: boolean;
}) {
  const [time, setTime] = useState<number | null>(0);
  const [qau, setQau] = useState<number | null>(0);
  const [cau, setCau] = useState<number | null>(0);
  const [graphic, setGraphic] = useState<any | null>(null);
  const [shownGraphic, setShownGraphic] = useState<any>(false);

  const showGraphic = () => {
    setShownGraphic(true);
  }

  const hideGraphic = () => {
    setShownGraphic(false);
  }

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
  }, [attacker, defender, quickMove, chargedMove, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, bladeBoost]);

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

  const calculateDamage = async () => {
    if (!attacker || !defender || !quickMove || !chargedMove) return;
    
    const defenderBonusesMod = [bonusAttacker[0], raidMode==="normal" ? bonusDefender[1] : false, raidMode === "normal" ? bonusDefender[2] : false, raidMode === "normal" ? bonusDefender[3] : 0];
    const {time, quickAttackUses, chargedAttackUses, graphic} = await PoGoAPI.simulate(attacker, defender, quickMove, chargedMove, attackerStats, defenderStats, raidMode, bonusAttacker, defenderBonusesMod, bladeBoost);
    setShownGraphic(false);
    setTime(time);
    setQau(quickAttackUses);
    setCau(chargedAttackUses);
    setGraphic(graphic);
  };

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
  } , [raidMode]);

  const getRequiredPeople = (raidMode: string) => {
    
    return ( ((time ?? 0) / 1000) / getRaidTime(raidMode)).toFixed(2);
  }

  const getRaidTime = (raidMode: string) => {
    let raidTime = 0;
    if (raidMode === "raid-t1" || raidMode === "raid-t3" || raidMode === "raid-t4" || raidMode === "raid-mega") {
      raidTime = 180;
    } else {
      raidTime = 300;
    }
    return raidTime;
  }

  return (
    <>
      <Button onClick={calculateDamage} className="w-full py-2 text-white bg-primary rounded-lg">
        Calculate
      </Button>
      {time !== 0 && attacker && defender && quickMove && chargedMove && (
        <div className="mt-4 space-y-4">
          <p>
            <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> takes {(time ?? 0) / 1000} seconds to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{(bonusDefender[1] === true && raidMode === "normal") ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> with {PoGoAPI.formatMoveName(quickMove.moveId)} and {PoGoAPI.formatMoveName(chargedMove.moveId)} under {bonusAttacker[0].toLowerCase().replaceAll("_", " ")} weather{bonusAttacker[1] == true ? ", Shadow bonus (x1.2)" : ""}{bonusAttacker[2] ? ", Mega boost (x1.3)" : ""} and Friendship Level {bonusAttacker[3]} bonus{bladeBoost && " using Behemoth Blade Adventure Effect"}.
          </p>
          <p>
            <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> needs to use {PoGoAPI.formatMoveName(quickMove.moveId)} {qau} times and {PoGoAPI.formatMoveName(chargedMove.moveId)} {cau} times to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{(bonusDefender[1] === true && raidMode === "normal") ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> the fastest way possible.
          </p>
          {raidMode == "normal" ? (
            <></>
          ) : (<p>
            {getRequiredPeople(raidMode)} people are required to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{(bonusDefender[1] === true && raidMode === "normal") ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> in the given time. ({getRaidTime(raidMode)} seconds)
          </p>)}
          <Card className="mt-4">
            
            <CardHeader>
                <CardTitle>Attack Sequence</CardTitle>
                <CardDescription>This sequence doesn't take in count any damage produced by the defender Pokémon. In a realistic scenario, a player should need to use multiple Pokémon and heal them, so more time would be needed.</CardDescription>
            </CardHeader>
            <CardContent>
                {shownGraphic ? (
                  <>
                  <div className="flex flex-wrap gap-2">
                  {graphic.map((g: any) => (
                      <Badge key={g.turn} variant={g.type === "quick" ? "primary" : "destructive"}>
                      {g.type === "quick" ? "F" : "C"}
                      </Badge>
                  ))}
                  </div>
                  <button onClick={hideGraphic} className="w-full py-2 text-white bg-primary rounded-lg mt-2">Hide graphic</button></>
                ) : (
                  <button onClick={showGraphic} className="w-full py-2 text-white bg-primary rounded-lg">Show graphic</button>
                )}
            </CardContent>
            <CardContent>
                <Badge variant="primary">F</Badge> Fast Attack <Badge variant="destructive">C</Badge> Charged Attack
            </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}
