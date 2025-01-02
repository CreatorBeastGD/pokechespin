"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import { CardHeader, Card, CardTitle, CardContent, CardFooter } from "./ui/card";

export default function CalculateButtonSimulate({
  attacker,
  defender,
  quickMove,
  chargedMove,
  attackerStats,
  defenderStats,
  raidMode
}: {
  attacker: any;
  defender: any;
  quickMove: any;
  chargedMove: any;
  attackerStats: any;
  defenderStats: any;
  raidMode: string;
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
  }, [attacker, defender, quickMove, chargedMove]);

  const calculateDamage = async () => {
    if (!attacker || !defender || !quickMove || !chargedMove) return;
    const {time, quickAttackUses, chargedAttackUses, graphic} = await PoGoAPI.simulate(attacker, defender, quickMove, chargedMove, attackerStats, defenderStats, raidMode);
    setTime(time);
    setQau(quickAttackUses);
    setCau(chargedAttackUses);
    setGraphic(graphic);
  };

  const getRequiredPeople = (raidMode: string) => {
    let raidTime = 0;
    if (raidMode === "raid-t1" || raidMode === "raid-t3" || raidMode === "raid-t4") {
      raidTime = 180;
    } else {
      raidTime = 300;
    }
    return ( ((time ?? 0) / 1000) / raidTime).toFixed(2);
  }
  return (
    <>
      <Button onClick={calculateDamage} className="w-full py-2 text-white bg-primary rounded-lg">
        Calculate
      </Button>
      {time !== 0 && attacker && defender && quickMove && chargedMove && (
        <div>
          <p>
            {attacker.names.English} takes {(time ?? 0) / 1000} seconds to defeat {defender.names.English} with {quickMove.names.English} and {chargedMove.names.English}.
          </p>
          <p>
            {attacker.names.English} needs to use {quickMove.names.English} {qau} times and {chargedMove.names.English} {cau} times to defeat {defender.names.English} the fastest way possible.
          </p>
          {raidMode == "normal" ? (
            <></>
          ) : (<p>
            {getRequiredPeople(raidMode)} people are required to defeat {defender.names.English} in the given time.
          </p>)}
          <Card className="mt-4">
            <CardHeader>
                <CardTitle>Attack Sequence</CardTitle>
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
