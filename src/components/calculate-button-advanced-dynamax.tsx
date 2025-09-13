"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import { CardHeader, Card, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calculator } from "../../lib/calculations";
import { Switch } from "./ui/switch";
import Image from "next/image";

export default function CalculateButtonSimulateAdvancedDynamax({
  attacker,
  defender,
  quickMove,
  chargedMove,
  largeAttack,
  targetAttack,
  attackerStats,
  defenderStats,
  raidMode,
  bonusAttacker,
  bonusDefender,
  allEnglishText,
  maxMoves,
  weather
}: {
  attacker: any;
  defender: any;
  quickMove: any;
  chargedMove: any;
  largeAttack: any;
  targetAttack: any;
  attackerStats: any;
  defenderStats: any;
  raidMode: string;
  bonusAttacker: any;
  bonusDefender: any;
  allEnglishText: any;
  maxMoves: any;
  weather: any;
}) {
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [time, setTime] = useState<number>(0);
  const [qau, setQau] = useState<any | null>({ attackerQuickAttackUses: 0, defenderQuickAttackUses: 0 });
  const [cau, setCau] = useState<any | null>({ attackerChargedAttackUses: 0, defenderChargedAttackUses: 0 });
  const [graphic, setGraphic] = useState<any | null>(null);
  const [faints, setFaints] = useState<any | null>(null);
  const [helperBonus, sethelperBonus] = useState<number>(parseInt(searchParams.get("helper_bonus") ?? "0"));
  const [relobbyTime, setRelobbyTime] = useState<number>(parseInt(searchParams.get("relobby_time") ?? "8"));
  const [avoidCharged, setAvoidCharged] = useState<boolean>(searchParams.get("can_dodge") === "true");
  const [attackerDamage, setAttackerDamage] = useState<any[][]>(attacker.map(() => [0,0,0]));
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleEntries, setVisibleEntries] = useState(50);
  const [enraged, setEnraged] = useState<boolean>(searchParams.get("enraged") === "true");
  const [peopleCount, setPeopleCount] = useState<number>(parseInt(searchParams.get("teams_number") ?? "1"));
  const [strategy, setStrategy] = useState<string[]>(searchParams.get("strategy")?.split(",") ?? ["dmg", "dmg", "dmg", "dmg"]);
  const [shroom, setShroom] = useState<string[]>(searchParams.get("shroom")?.split(",") ?? ["false", "false", "false", "false"]);
  const [friendship, setFriendship] = useState<number[]>(searchParams.get("friendship")?.split(",").map((x) => parseInt(x)) ?? [0,0,0,0]);
  const [win, setWin] = useState<boolean | null>(null);
  const [phases, setPhases] = useState<number>(0);
  const [prioritiseEnergy, setPrioritiseEnergy] = useState<boolean>(searchParams.get("prioritise_energy") === "true");
  const [types, setTypes] = useState<any[]>([]);
  
  useEffect(() => {
    const loadParams = () => {
      const dodge = searchParams.get("can_dodge");
      const enraged = searchParams.get("enraged");
      const helper_bonus = searchParams.get("helper_bonus");
      const relobby_time = searchParams.get("relobby_time");
      const teams_number = searchParams.get("teams_number");
      const strategy = searchParams.get("strategy");
      const shroom = searchParams.get("shroom");
      const fs = searchParams.get("friendship");

      if (dodge) {
        setAvoidCharged(dodge === "true");
      }
      if (enraged) {
        setEnraged(enraged === "true");
      }
      if (helper_bonus) {
        sethelperBonus(parseInt(helper_bonus));
      }
      if (relobby_time) {
        setRelobbyTime(parseInt(relobby_time));
      }
      if (teams_number) {
        setPeopleCount(parseInt(teams_number));
      }
      if (strategy) {
        setStrategy(strategy.split(","));
      }
      if (shroom) {
        setShroom(shroom.split(","));
      }
      if (fs) {
        setFriendship(fs.split(",").map((x) => parseInt(x)));
      }
    }

    loadParams();
  }, []);

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

  }, [attacker, defender, quickMove, chargedMove, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, largeAttack, targetAttack]);

  const raidSurname = (raidMode: string) => {
    if (raidMode === "raid-t1-dmax") {
      return "Tier 1 Dynamax";
    } else if (raidMode === "raid-t2-dmax") {
        return "Tier 2 Dynamax";
    } else if (raidMode === "raid-t3-dmax") {
      return "Tier 3 Dynamax";
    } else if (raidMode === "raid-t4-dmax") {
      return "Tier 4 Dynamax";
    } else if (raidMode === "raid-t5-dmax") {
      return "Tier 5 Dynamax";
    } else if (raidMode === "raid-t6-gmax" || raidMode === "raid-t6-gmax-standard") {
        return "Gigantamax";
    } else {
      return "Normal";
    }
  }
  
  const sumAllDamage = () => {
    let sum = 0;
    for (let i = 0; i < attackerDamage.length; i++) {
      for (let j = 0; j < attackerDamage[i].length; j++) {
        sum += attackerDamage[i][j];
      }
    }
    return sum;
  }

  const calculateDamage = async () => {
    if (!attacker || !defender || !quickMove || !chargedMove || !largeAttack || !targetAttack) return;

    setLoading(true);
    // Both should have the same weather boost.
    const { time, attackerQuickAttackUses, attackerChargedAttackUses, defenderLargeAttackUses, defenderTargetAttackUses, battleLog, attackerFaints, attackerDamage, win, dynamaxPhases} = await PoGoAPI.AdvancedSimulationDynamax(attacker, defender, quickMove, chargedMove, attackerStats, largeAttack, targetAttack, raidMode, maxMoves, strategy, shroom, weather, helperBonus, friendship, prioritiseEnergy);
    setTypes(await PoGoAPI.getTypes());
    setLoading(false);
    setVisibleEntries(50);
    setTime(time);
    setQau({attackerQuickAttackUses, defenderLargeAttackUses});
    setCau({attackerChargedAttackUses, defenderTargetAttackUses});
    setFaints(attackerFaints);
    setGraphic(battleLog);
    setWin(win);
    setPhases(dynamaxPhases);
    setAttackerDamage(attackerDamage);
  };

  const handleSwitch = (checked: boolean, handle: any) => {
    handle(checked);
  }



  useEffect(() => {

    setStrategy(strategy);
    
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("strategy", strategy.join(","));
    sp.set("shroom", shroom.join(","));
    sp.set("friendship", friendship.join(","));
    sp.set("prioritise_energy", prioritiseEnergy.toString());
    window.history.replaceState({}, "", `${pathname}?${sp.toString()}`);
    
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(attacker.map(() => [0,0,0]));
  }, [strategy, shroom, friendship, prioritiseEnergy]);

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(attacker.map(() => [0,0,0]));
  } , [raidMode]);

  function handleHelperBonus(value: number[]): void {
    if (value[0] < 0) value[0] = 0;
    if (value[0] > 15) value[0] = 15;
    sethelperBonus(value[0]);

    const sp = new URLSearchParams(searchParams.toString());
    sp.set("helper_bonus", value[0].toString());

    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(attacker.map(() => [0,0,0]));

    window.history.replaceState({}, "", `${pathname}?${sp.toString()}`);
  }

  const handleStrategyChange = (index: number, value: string) => {
    const newStrategies = [...strategy];
    newStrategies[index] = value;
    setStrategy(newStrategies);
  };

  const handleShroomChange = (index: number, value: string) => {
    const newShrooms = [...shroom];
    newShrooms[index] = value;
    setShroom(newShrooms);
  }

  const handleFriendshipChange = (index: number, value: number) => {
    const newFriendship = [...friendship];
    newFriendship[index] = value;
    setFriendship(newFriendship);
  }

  return (
    <>
      <Button onClick={calculateDamage} className="w-full py-2 text-white bg-primary rounded-lg">
        Simulate
      </Button>
      <div className="w-full">
      {Array.from({ length: attacker.length }, (_, i) => (
        <Card className="mt-4 py-4 px-4 mb-2" key={i}>
          <div className="flex flex-col space-y-3" key={i}>
            <label >Member {i + 1}</label>
            <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
              value={strategy[i]}
              onChange={(e) => handleStrategyChange(i, e.target.value)}
            >
              <option value="dmg">DPS</option>
              <option value="tank">Tank</option>
              <option value="heal">Healer</option>
            </select>
            <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
              value={shroom[i]}
              onChange={(e) => handleShroomChange(i, e.target.value)}
            >
              <option value="false">No shrooms</option>
              <option value="true">Shroom (x2)</option>
            </select>
            <div className="2-full">
              <label>Friendship: ({friendship[i]})</label>
              <Slider onValueChange={(value) => handleFriendshipChange(i, value[0])} defaultValue={[friendship[i]]} max={4} step={1} min={0} className="w-full mb-1" color="bg-blue-700"/>
            </div>
          </div>
      </Card>
      ))}
    </div>
    
    <p>Helper Bonus ({helperBonus + (helperBonus == 15 ? "+" : "")})</p>
    <div className="flex flex-row items-center space-x-2">
      <Slider onValueChange={(value) => handleHelperBonus(value)} value={[helperBonus]} max={15} step={1} min={0} className="w-[60%] mb-1" color="bg-blue-700"/>
      <button onClick={() => handleHelperBonus([helperBonus - 1])} className="bg-yellow-600 text-white px-4 rounded mr-2">–</button>
      <button onClick={() => handleHelperBonus([helperBonus + 1])} className="bg-yellow-600 text-white px-4 rounded">+</button>
    </div>

    <p className="mt-2"><Switch onCheckedChange={(checked) => handleSwitch(checked, setPrioritiseEnergy)} checked={prioritiseEnergy}/> Prioritise Energy generation </p>    
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
      {!loading && time !== 0 && attacker && defender && quickMove && chargedMove && largeAttack && targetAttack && (
        <div className="mt-4 space-y-4">
          {raidMode == "normal" ? (
            <></>
          ) : (<p>
            The chosen team has {win == true ? "WON" : "LOST"} the Max Battle in {Math.ceil(time / 500) / 2} seconds after {phases} Dynamax phases.
          </p>)}

          {win == false && (
            <p> The defender Pokémon has {Calculator.getEffectiveDMAXHP(raidMode, defender.pokemonId, PoGoAPI.hasDoubleWeaknesses(defender.type, defender.type2, types))-sumAllDamage()}/{Calculator.getEffectiveDMAXHP(raidMode, defender.pokemonId,PoGoAPI.hasDoubleWeaknesses(defender.type, defender.type2, types))} HP left.</p>
          )}
          
          <p className="text-sm text-slate-700 italic">
            This simulation doesn't take in count any time spent during Dynamax phases.
          </p>
          <p className="text-sm text-slate-700 italic">
            All attackers will dodge if a Targeted Attack is coming to it. This will reduce the damage taken by 50%.
          </p>

          <p className="text-sm text-slate-700 italic">
            All members will swap to their best Pokémon following their role when starting a new Dynamax phase, and will change to their best tank when finishing it.
          </p>

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
                    (item.damage || item.damage === 0) ? (
                      <div key={index} className={"grid grid-cols-2 space-x-7 " + (item.attacker === "attacker" ? (item.dynamax ?"bg-pink-200" :"bg-green-200") : "bg-red-200") + " p-2 rounded-xl"}>
                        <div className="flex flex-col space-y-1">
                          <Badge className="opacity-90"><p className="text-sm text-slate-400">Time {(item.turn / 1000).toFixed(1)}s</p></Badge>
                          <p className="text-sm text-slate-700 ">Attacker: <span className="font-extrabold">{PoGoAPI.getPokemonNamePB((item.attacker === "attacker" ? (item.attackerID.pokemonId) : defender.pokemonId), allEnglishText)}</span>{item.attacker === "attacker" && (" (member " + (item.member+1) + ")")}</p>
                          <Progress className="w-full" value={(Math.floor(item.health - item.stackedDamage) * (100 / item.health))} max={Math.floor(item.health)} />
                          <p>Opponent's HP: {Math.floor(item.health - item.stackedDamage > 0 ? item.health - item.stackedDamage : 0)} / {Math.floor(item.health)}</p>
                          {item.attacker === "defender" && <p>Remaining Shield: {item.remainingShields ?? 0} HP</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Badge className="opacity-90" variant="default"><p className={"text-sm " + (item.move.endsWith("_FAST") ? "text-slate-400" : "text-red-300")}>Move: {PoGoAPI.getMoveNamePB(item.move, allEnglishText)}</p></Badge>
                          <p className="text-sm text-slate-700">Damage: <span className="font-extrabold">{item.damage}</span></p>
                          <p className="text-sm text-slate-700">Energy: <span className="font-extrabold">{item.energy}</span></p>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className={"grid grid-cols-2 space-x-7 space-y-3 " + ((item.dynamax || item.energyGain) ? "bg-pink-200" : "bg-slate-200") + " p-2 rounded-lg"}>
                        <div className="flex flex-col space-y-1">
                          <Badge className="opacity-90"><p className="text-sm text-slate-400">Time {(item.turn / 1000).toFixed(1)}s</p></Badge>
                          {(item.heal || item.dynamax) && (<p className="text-sm text-slate-700">Attacker: <span className="font-extrabold">{PoGoAPI.getPokemonNamePB((item.attacker === "attacker" ? (item.attackerID.pokemonId) : defender.pokemonId), allEnglishText)}</span>{item.attacker === "attacker" && (" (member " + (item.member+1) + ")")}</p>)}
                        </div>
                        <div className="flex flex-col space-y-1">
                          {(item.relobby === true || item.relobby === false) ? 
                            (<p className="text-sm text-slate-700">
                              {(item.relobby ? "All party fainted. Relobby is needed." : 
                            (item.attacker == "attacker" ? "Attacker has fainted." : "Max Battle boss has fainted."))}</p>) : 
                            (item.lost ? "Your team has lost." : "")}
                          {item.dodge ? 
                            (<p className="text-sm text-slate-700">{(item.dodge ? "Attacker dodges the next attack." : "")}</p>) : 
                            (item.purifiedgem ? "Purified Gem used." : 
                              item.desperate ? "Defender Pokémon' attacks are getting stronger!" :
                               item.enraged ? "The defender Pokémon is getting desperate!" : 
                               item.energyGain ? ("Energy gained: " + item.energyGain) : 
                               item.shield ? "Shield used by member " + (item.member+1) :
                               item.heal ? "Heal used by member " + (item.member+1) : 
                               item.particle ? "Max Orb has been generated on member " + (item.member+1) :
                               item.maxOrb ? "Max Orb has been claimed by member " + (item.member+1) + " (+10 ENERGY)":
                               item.cheer ? "Cheer used by member " + (item.member+1) + " (+25 ENERGY)":"" 
                            )}
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
