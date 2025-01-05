"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import { CardHeader, Card, CardTitle, CardContent, CardFooter, CardDescription } from "./ui/card";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";

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
  const [time, setTime] = useState<number>(0);
  const [qau, setQau] = useState<any | null>({ attackerQuickAttackUses: 0, defenderQuickAttackUses: 0 });
  const [cau, setCau] = useState<any | null>({ attackerChargedAttackUses: 0, defenderChargedAttackUses: 0 });
  const [graphic, setGraphic] = useState<any | null>(null);
  const [faints, setFaints] = useState<any | null>(null);
  const [oneMember, setOneMember] = useState<boolean>(false);
  const [ignoreRelobby, setIgnoreRelobby] = useState<boolean>(false);
  const [avoidCharged, setAvoidCharged] = useState<boolean>(false);
  const [attackerDamage, setAttackerDamage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleEntries, setVisibleEntries] = useState(50);

  const loadMoreEntries = () => {
    setVisibleEntries(prev => prev + 50);
  };

  const showLessEntries = () => {
    setVisibleEntries(50);
  }

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

    setLoading(true);
    // Both should have the same weather boost.
    const attackerBonusesMod = [bonusAttacker[0], bonusAttacker[1], bonusAttacker[2], bonusAttacker[3]];
    const defenderBonusesMod = [bonusAttacker[0], bonusDefender[1], bonusDefender[2], bonusDefender[3]];
    const {time, attackerQuickAttackUses, attackerChargedAttackUses, defenderQuickAttackUses, defenderChargedAttackUses, battleLog, attackerFaints, attackerDamage} = await PoGoAPI.advancedSimulation(attacker, defender, quickMove, chargedMove, quickMoveDefender, chargedMoveDefender, attackerStats, defenderStats, raidMode, attackerBonusesMod, defenderBonusesMod, oneMember, avoidCharged, ignoreRelobby);
    setLoading(false);
    setVisibleEntries(50);
    setTime(time);
    setQau({attackerQuickAttackUses, defenderQuickAttackUses});
    setCau({attackerChargedAttackUses, defenderChargedAttackUses});
    setFaints(attackerFaints);
    setGraphic(battleLog);
    setAttackerDamage(attackerDamage);
  };

  const handleSwitch = (checked: boolean, handle: any) => {
    handle(checked);
  }

  useEffect(() => {
    setOneMember(oneMember);
    setIgnoreRelobby(ignoreRelobby);
    setAvoidCharged(avoidCharged);
    
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(0);
  }, [oneMember, ignoreRelobby, avoidCharged]);

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(0);
  } , [raidMode]);

  const getRequiredPeople = (raidMode: string) => {
    
    return ( ((time ?? 0) / 1000) / getRaidTime(raidMode)).toFixed(2);
  }

  const getRaidTime = (raidMode: string) => {
    let raidTime = 0;
    if (raidMode === "raid-t1" || raidMode === "raid-t3" || raidMode === "raid-t4") {
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
      <div className="italic text-slate-700 text-sm my-2 space-y-2 flex flex-col">
        <p><Switch onCheckedChange={(checked) => handleSwitch(checked, setOneMember)} checked={oneMember} /> Only one Pokémon in the raid party.</p>
        <p><Switch onCheckedChange={(checked) => handleSwitch(checked, setIgnoreRelobby)} checked={ignoreRelobby} /> Ignore relobby time. (8s -{">"} 1s)</p>
        <p><Switch onCheckedChange={(checked) => handleSwitch(checked, setAvoidCharged)} checked={avoidCharged} /> Try to dodge charged attacks if attacker doesn't faint. (75% damage reduction)</p>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
      {!loading && time !== 0 && attacker && defender && quickMove && chargedMove && quickMoveDefender && chargedMoveDefender && (
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
            <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> faints {faints} times, dealing an average TDO (Total Damage Output) of {(attackerDamage / (faints === 0 ? 1 : faints+1)).toFixed(2)} damage to the Raid Boss and an average DPS of {(attackerDamage / ((time ? time : 0) / 1000)).toFixed(2)}.
          </p>
          {raidMode == "normal" ? (
            <></>
          ) : (<p>
            {getRequiredPeople(raidMode)} people are required to defeat {raidMode === "normal" ? "" : raidSurname(raidMode) + " Raid Boss"} <span className="font-bold">{bonusDefender[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> in the given time within given conditions. ({getRaidTime(raidMode)} seconds)
          </p>)}
          
          <p className="text-sm text-slate-700 italic">
            This simulation takes in consideration a team of {oneMember ? "one" : "six"} {bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}, not avoiding, and casting a Charged Attack whenever is possible. This is not the only available simulation, since {PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}'s attacking patterns are random.
          </p>
          <p className="text-sm text-slate-700 italic">
            The simulation does not take into consideration the use of dodges or any other mechanic that might affect the outcome of the battle. Changing a Pokémon when it faints takes 1 second, and relobbying when all team members faint takes {ignoreRelobby === true ? "1 second (ignored relobby time)" : "8 seconds"} in this simulation.
          </p>
          {avoidCharged && (
            <p className="text-sm text-slate-700 italic">
              The simulation takes into consideration that the attacker will dodge the next Charged Attack if it doesn't faint. This will reduce the damage taken by 75%.
            </p>
          )} 

        {graphic && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Attack Sequence</CardTitle>
              <CardDescription>Showing {visibleEntries > graphic.length ? graphic.length : visibleEntries} of {graphic.length} steps.</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <div className="flex flex-col space-y-4">
                  {graphic.slice(0, visibleEntries).map((item: any, index: number) => (
                    item.damage ? (
                      <div key={index} className={"grid grid-cols-2 space-x-7" + (item.attacker === "attacker" ? " bg-green-200" : " bg-red-200") + " p-2 rounded-xl"}>
                        <div className="flex flex-col space-y-1">
                          <Badge className="opacity-90"><p className="text-sm text-slate-400">Time {(item.turn / 1000).toFixed(1)}s</p></Badge>
                          <p className="text-sm text-slate-700 ">Attacker: <span className="font-extrabold">{PoGoAPI.getPokemonNamePB((item.attacker === "attacker" ? attacker.pokemonId : defender.pokemonId), allEnglishText)}</span></p>
                          <Progress className="w-full" value={(Math.floor(item.health - item.stackedDamage) * (100 / item.health))} max={Math.floor(item.health)} />Opponent's HP: {Math.floor(item.health - item.stackedDamage > 0 ? item.health - item.stackedDamage : 0)} / {Math.floor(item.health)}
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Badge className="opacity-90" variant="default"><p className={"text-sm " + (item.move.endsWith("_FAST") ? "text-slate-400" : "text-red-300")}>Move: {PoGoAPI.getMoveNamePB(item.move, allEnglishText)}</p></Badge>
                          <p className="text-sm text-slate-700">Damage: <span className="font-extrabold">{item.damage}</span></p>
                          <p className="text-sm text-slate-700">Energy: <span className="font-extrabold">{item.energy}</span></p>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className={"grid grid-cols-2 space-x-7 space-y-3 bg-slate-200 p-2 rounded-lg"}>
                        <div className="flex flex-col space-y-1">
                          <Badge className="opacity-90"><p className="text-sm text-slate-400">Time {(item.turn / 1000).toFixed(1)}s</p></Badge>
                          <p className="text-sm text-slate-700 font-extrabold">{PoGoAPI.getPokemonNamePB((item.attacker === "attacker" ? attacker.pokemonId : defender.pokemonId), allEnglishText)}</p>
                        </div>
                        <div className="flex flex-col space-y-1">
                          {(item.relobby === true || item.relobby === false) ? (<p className="text-sm text-slate-700">{(item.relobby ? "All party fainted. Relobby is needed." : (item.attacker == "attacker" ? "Attacker has fainted." : "Raid Boss has fainted."))}</p>) : (<></>)}
                          {item.dodge ? (<p className="text-sm text-slate-700">{(item.dodge ? "Attacker dodges the next attack." : "")}</p>) : (<></>)}
                          <p className="text-sm text-slate-700">{(item.tdo ? ("TDO: " + item.tdo) : "")}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                {visibleEntries < graphic.length ? (
                  <button onClick={loadMoreEntries} className="w-full py-2 text-white bg-primary rounded-lg mt-4">
                    Load More
                  </button>
                ) : (
                  graphic.length > 50 ? (
                    <button onClick={showLessEntries} className="w-full py-2 text-white bg-primary rounded-lg mt-4">
                      Set to 50 entries
                    </button>
                  ) : (<></>)
                )}
              </CardDescription>
            </CardContent>
          </Card>
        )}
        </div>
      )}
    </>
  );
}
