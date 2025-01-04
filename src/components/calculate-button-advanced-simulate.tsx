"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import { CardHeader, Card, CardTitle, CardContent, CardFooter, CardDescription } from "./ui/card";
import { Switch } from "./ui/switch";

export default function CalculateButtonSimulateAdvanced({
  attacker,
  defender,
  quickMove,
  chargedMove,
  quickMoveDefender,
  chargedMoveDefender,
  attackerStats,
  defenderStats,
  raidMode,
  bonusAttacker,
  bonusDefender,
  allEnglishText
}: {
  attacker: any;
  defender: any;
  quickMove: any;
  chargedMove: any;
  quickMoveDefender: any;
  chargedMoveDefender: any;
  attackerStats: any;
  defenderStats: any;
  raidMode: string;
  bonusAttacker: any;
  bonusDefender: any;
  allEnglishText: any;
}) {
  const [time, setTime] = useState<number | null>(0);
  const [qau, setQau] = useState<any | null>({ attackerQuickAttackUses: 0, defenderQuickAttackUses: 0 });
  const [cau, setCau] = useState<any | null>({ attackerChargedAttackUses: 0, defenderChargedAttackUses: 0 });
  const [graphic, setGraphic] = useState<any | null>(null);
  const [faints, setFaints] = useState<any | null>(null);
  const [oneMember, setOneMember] = useState<boolean>(false);

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
  }, [attacker, defender, quickMove, chargedMove, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, oneMember, quickMoveDefender, chargedMoveDefender]);

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
    if (!attacker || !defender || !quickMove || !chargedMove || !quickMoveDefender || !chargedMoveDefender) return;

    // Both should have the same weather boost.
    const attackerBonusesMod = [bonusAttacker[0], bonusAttacker[1], bonusAttacker[2], bonusAttacker[3]];
    const defenderBonusesMod = [bonusAttacker[0], bonusDefender[1], bonusDefender[2], bonusDefender[3]];
    const {time, attackerQuickAttackUses, attackerChargedAttackUses, defenderQuickAttackUses, defenderChargedAttackUses, battleLog, attackerFaints} = await PoGoAPI.advancedSimulation(attacker, defender, quickMove, chargedMove, quickMoveDefender, chargedMoveDefender, attackerStats, defenderStats, raidMode, attackerBonusesMod, defenderBonusesMod, oneMember);
    setTime(time);
    setQau({attackerQuickAttackUses, defenderQuickAttackUses});
    setCau({attackerChargedAttackUses, defenderChargedAttackUses});
    setFaints(attackerFaints);
    setGraphic(battleLog);
  };

  const handleSwitch = (checked: boolean) => {
    setOneMember(checked);
  }

  useEffect(() => {
    setOneMember(oneMember);
    console.log(oneMember);
    
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
  }, [oneMember]);

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
      <p className="italic text-slate-700 text-sm my-2">
        <Switch onCheckedChange={(checked) => handleSwitch(checked)} checked={oneMember} /> Only one Pokémon in the raid party
      </p>
      {time !== 0 && attacker && defender && quickMove && chargedMove && quickMoveDefender && chargedMoveDefender && (
        <div className="mt-4 space-y-4">
          <p>
            <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> takes {((time ?? 0) / 1000).toFixed(1)} seconds to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{bonusDefender[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> with {PoGoAPI.formatMoveName(quickMove.moveId)} and {PoGoAPI.formatMoveName(chargedMove.moveId)} under {bonusAttacker[0].toLowerCase().replaceAll("_", " ")} weather{bonusAttacker[1] == true ? ", Shadow bonus (x1.2)" : ""}{bonusAttacker[2] ? ", Mega boost (x1.3)" : ""} and Friendship Level {bonusAttacker[3]} bonus.
          </p>
          <p>
            <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> needs to use {PoGoAPI.formatMoveName(quickMove.moveId)} {qau.attackerQuickAttackUses} times and {PoGoAPI.formatMoveName(chargedMove.moveId)} {cau.attackerChargedAttackUses} times to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{bonusDefender[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> the fastest way possible.
          </p>
          <p>
            <span className="font-bold">{bonusDefender[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> uses {PoGoAPI.formatMoveName(quickMoveDefender.moveId)} as its Fast Attack and {PoGoAPI.formatMoveName(chargedMoveDefender.moveId)} as its Charged Attack.
          </p>
          <p>
            <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> faints {faints} times.
          </p>
          {raidMode == "normal" ? (
            <></>
          ) : (<p>
            {getRequiredPeople(raidMode)} people are required to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{bonusDefender[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> in the given time within given conditions. ({getRaidTime(raidMode)} seconds)
          </p>)}
          
          <p className="text-sm text-slate-700 italic">
            This simulation takes in consideration a team of {oneMember ? "one" : "six"} {bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}, not avoiding, and casting a Charged Attack whenever is possible. This is not the only available simulation, since {PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}'s attacking patterns are random.
          </p>

          {graphic && (
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Attack Sequence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <div className="flex flex-col space-y-4">
                                {graphic.map((item: any, index: number) => (
                                    item.damage ? (
                                    <div key={index} className={"grid grid-cols-2 space-x-7 space-y-3" + (item.attacker === "attacker" ? " bg-green-200" : " bg-red-200") + " p-2 rounded-lg"}>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm text-slate-700">Turn {(item.turn/1000).toFixed(1)}s</p>
                                            <p className="text-sm text-slate-700">Attacker: {PoGoAPI.getPokemonNamePB((item.attacker === "attacker" ? attacker.pokemonId : defender.pokemonId), allEnglishText)}</p>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm text-slate-700">Move: {PoGoAPI.getMoveNamePB(item.move, allEnglishText)}</p>
                                            <p className="text-sm text-slate-700">Damage: {item.damage}</p>
                                            <p className="text-sm text-slate-700">Energy: {item.energy}</p>
                                        </div>
                                    </div>) : (
                                    <div key={index} className={"grid grid-cols-2 space-x-7 space-y-3 bg-slate-200 p-2 rounded-lg"}>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm text-slate-700">Turn {(item.turn/1000).toFixed(1)}s</p>
                                            <p className="text-sm text-slate-700">{PoGoAPI.getPokemonNamePB((item.attacker === "attacker" ? attacker.pokemonId : defender.pokemonId), allEnglishText)}</p>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm text-slate-700">{(item.relobby ? "All party fainted. Relobby is needed." : "Fainted.")}</p>
                                        </div>
                                    </div>)
                                ))}
                            </div>
                        </CardDescription>
                    </CardContent>
                </Card>
            )}
          
        </div>
      )}
    </>
  );
}
