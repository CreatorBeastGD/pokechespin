"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import { CardHeader, Card, CardTitle, CardContent, CardFooter, CardDescription } from "./ui/card";

export default function CalculateButtonSimulate({
  attacker,
  defender,
  quickMove,
  chargedMove,
  attackerStats,
  defenderStats,
  raidMode,
  bonusAttacker,
  bonusDefender
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
}) {
  const [time, setTime] = useState<number | null>(0);
  const [qau, setQau] = useState<number | null>(0);
  const [cau, setCau] = useState<number | null>(0);
  const [graphic, setGraphic] = useState<any | null>(null);

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
  }, [attacker, defender, quickMove, chargedMove, bonusAttacker, bonusDefender, attackerStats, defenderStats]);

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
    const {time, quickAttackUses, chargedAttackUses, graphic} = await PoGoAPI.simulate(attacker, defender, quickMove, chargedMove, attackerStats, defenderStats, raidMode, bonusAttacker, bonusDefender);
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
            {attacker.names.English} takes {(time ?? 0) / 1000} seconds to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{defender.names.English}</span> with {quickMove.names.English} and {chargedMove.names.English} under {bonusAttacker[0].toLowerCase().replaceAll("_", " ")} weather{bonusAttacker[1] == true ? ", Shadow bonus" : ""}{bonusAttacker[2] ? ", Mega bonus" : ""} and Friendship Level {bonusAttacker[3]} bonus.
          </p>
          <p>
            {attacker.names.English} needs to use {quickMove.names.English} {qau} times and {chargedMove.names.English} {cau} times to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{defender.names.English}</span> the fastest way possible.
          </p>
          {raidMode == "normal" ? (
            <></>
          ) : (<p>
            {getRequiredPeople(raidMode)} people are required to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{defender.names.English}</span> in the given time. ({getRaidTime(raidMode)} seconds)
          </p>)}
          <Card className="mt-4">
            
            <CardHeader>
                <CardTitle>Attack Sequence</CardTitle>
                <CardDescription>This sequence doesn't take in count any damage produced by the defender Pokémon. In a realistic scenario, a player should need to use multiple Pokémon and heal them, so more time would be needed.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                {graphic.map((g: any) => (
                    <Badge key={g.turn} variant={g.type === "quick" ? "primary" : "destructive"}>
                    {g.type === "quick" ? "Q" : "C"}
                    </Badge>
                ))}
                </div>
            </CardContent>
            <CardContent>
                <Badge variant="primary">Q</Badge> Fast Attack <Badge variant="destructive">C</Badge> Charged Attack
            </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}
