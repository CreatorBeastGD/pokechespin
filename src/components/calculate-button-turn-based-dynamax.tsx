"use client";
"strict mode";

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
import { GameStatus } from "./GameStatus";
import { Separator } from "@/components/ui/separator"

export default function CalculateButtonSimulateTurnBasedDynamax({
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
  weather,
  types,
  allMoves,
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
  types: any;
  allMoves: any;
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
  const [attackerDamage, setAttackerDamage] = useState<any[][]>(attacker.map(() => [0,0,0]));
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleEntries, setVisibleEntries] = useState(50);
  
  const [startedSim, setStartedSim] = useState<boolean>(false);
  
  const [shroom, setShroom] = useState<string[]>(searchParams.get("shroom")?.split(",") ?? ["false", "false", "false", "false"]);
  const [advEffect, setAdvEffect] = useState<string[]>(searchParams.get("adv_effect")?.split(",") ?? ["none", "none", "none", "none"]);
  
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);

  const [win, setWin] = useState<boolean | null>(null);
  const [phases, setPhases] = useState<number>(0);

  const [customBossCPM, setCustomBossCPM] = useState<number>((Number)(searchParams.get("custom_cpm") || 1));
  const [customBossAtkMult, setCustomBossAtkMult] = useState<number>((Number)(searchParams.get("custom_atk_mult") || 1));
  const [customBossHP, setCustomBossHP] = useState<number>((Number)(searchParams.get("custom_hp") || 10000));
  
  useEffect(() => {
    setCustomBossCPM((Number)(searchParams.get("custom_cpm") || 1));
    setCustomBossAtkMult((Number)(searchParams.get("custom_atk_mult") || 1));
    setCustomBossHP((Number)(searchParams.get("custom_hp") || 10000));
  }, [searchParams]);
  //console.log(customBossHP, customBossCPM, customBossAtkMult);

  useEffect(() => {
    const loadParams = () => {
      const helper_bonus = searchParams.get("helper_bonus");
      const shroom = searchParams.get("shroom");
      const advEffect = searchParams.get("adv_effect");

      
      if (helper_bonus) {
        sethelperBonus(parseInt(helper_bonus));
      }
      if (shroom) {
        setShroom(shroom.split(","));
      }
      if (advEffect) {
        setAdvEffect(advEffect.split(","));
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
    setStartedSim(false);
    setGameStatus(null);
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(attacker.map(() => [0,0,0]));

  }, [attacker, defender, quickMove, chargedMove, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, largeAttack, targetAttack, customBossHP, customBossCPM, customBossAtkMult, shroom, advEffect]);

  const getHealthBarColor = (healthPercent: number) => {
    if (healthPercent > 50) {
      return "bg-green-500";
    } else if (healthPercent > 20) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  }

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
    } else if (raidMode === "raid-custom-dmax") {
      return "Custom Max Battle";
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

  const startSimulation = async () => {
    if (!attacker || !defender || !quickMove || !chargedMove || !largeAttack || !targetAttack) return;
    setStartedSim(true);

    const initGameStatus = PoGoAPI.TurnBasedSimulatorAllyTurn(
        attacker,
        defender,
        quickMove,
        chargedMove,
        targetAttack,
        largeAttack,
        attackerStats,
        raidMode,
        maxMoves,
        shroom[0],
        weather,
        helperBonus,
        advEffect[0],
        customBossHP,
        customBossCPM,
        customBossAtkMult,
        "init",
        null,
        types,
        allMoves
      )

    setGameStatus(
      initGameStatus
    );

  };

  const SendMessage = async (message: string) => {
    if (message === "charged" && gameStatus!.allyEnergy[gameStatus!.activeAllyIndex] < -chargedMove[gameStatus!.activeAllyIndex].energyDelta) return;
      const newState = PoGoAPI.TurnBasedSimulatorAllyTurn(
        attacker,
        defender,
        quickMove,
        chargedMove,
        targetAttack,
        largeAttack,
        attackerStats,
        raidMode,
        maxMoves,
        shroom[0],
        weather,
        helperBonus,
        advEffect[0],
        customBossHP,
        customBossCPM,
        customBossAtkMult,
        message,
        gameStatus,
        types,
        allMoves
      )
      setGameStatus(newState);
  }

  useEffect(() => {
    
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("shroom", shroom.join(","));
    sp.set("adv_effect", advEffect.join(","));
    window.history.replaceState({}, "", `${pathname}?${sp.toString()}`);
    
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(attacker.map(() => [0,0,0]));
  }, [shroom, advEffect]);

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


  const handleShroomChange = (index: number, value: string) => {
    const newShrooms = [...shroom];
    newShrooms[index] = value;
    setShroom(newShrooms);
  }

  const handleAdvEffectChange = (index: number, value: string) => {
    const newAdvEffect = [...advEffect];
    newAdvEffect[index] = value;
    setAdvEffect(newAdvEffect);
  }

  return (
    <>
      <Button onClick={startSimulation} className="w-full py-2 text-white bg-primary rounded-lg">
        Play
      </Button>
      <div className="w-full">
        {!startedSim &&
        <Card className="mt-4 py-4 px-4 mb-2">
          <div className="flex flex-col space-y-3">
            <label >Member</label>
            
            <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
              value={shroom[0]}
              onChange={(e) => handleShroomChange(0, e.target.value)}
            >
              <option value="false">No shrooms</option>
              <option value="true">Shroom (x2)</option>
            </select>
            <select className="p-2 mt-1 bg-white border border-gray-300 rounded-lg"
              value={advEffect[0]}
              onChange={(e) => handleAdvEffectChange(0, e.target.value)}
            >
              <option value="none">No Adventure effect</option>
              <option value="blade">Behemoth Blade (x1.05 ATK)</option>
              <option value="bash">Behemoth Bash (x1.05 DEF)</option>
              <option value="cannon">Dynamax Cannon (+1 max level)</option>
            </select>

            <p>Helper Bonus ({helperBonus + (helperBonus == 15 ? "+" : "")})</p>
            <div className="flex flex-row items-center space-x-2">
              <Slider onValueChange={(value) => handleHelperBonus(value)} value={[helperBonus]} max={15} step={1} min={0} className="w-[60%] mb-1" color="bg-blue-700"/>
              <button onClick={() => handleHelperBonus([helperBonus - 1])} className="bg-yellow-600 text-white px-4 rounded mr-2">–</button>
              <button onClick={() => handleHelperBonus([helperBonus + 1])} className="bg-yellow-600 text-white px-4 rounded">+</button>
            </div>
          </div>
        </Card>
        }
      {startedSim &&
        <Card className="mt-4 py-4 px-4 mb-2">
          <div className="flex flex-col space-y-1">
            <div className="flex flex-row justify-between">
              <label className="font-bold text-xs">Max Battle ({gameStatus?.timer}s)</label>
              <label className="font-bold text-xs">Max Meter: {gameStatus?.maxEnergy}</label>
            </div>
            <Separator className=""/>
            <label className={"text-xs " + (gameStatus?.enrageCurrentMessage?.message.startsWith("Timeout reached") ? "text-red-600" : "")}>{gameStatus?.enrageCurrentMessage?.message}</label>
            <Separator className=""/>
            <label className={"font-bold text-sm " + (gameStatus?.globalCurrentMessage?.message.startsWith("An orb has spawned") ? "text-red-600" : "")}>{gameStatus?.globalCurrentMessage?.message}</label>
          
            <div className="flex flex-row justify-between items-end ">
              <label className="text-xs pt-2">Boss: {PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</label>
              
            </div>
            {gameStatus && <Progress color={getHealthBarColor(((gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage) / gameStatus.enemyPokemonMaxHealth) * 100)} value={((gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage) / gameStatus.enemyPokemonMaxHealth) * 100} className="w-full"/>}
            
            <div className="flex flex-row justify-between">
              <label className="text-xs">{gameStatus?.enemyCurrentMessage?.message}</label>
            </div>

            <Separator className="my-2"/>

            <div className="flex flex-row justify-between items-end ">
              <label className="text-xs pt-2">Active: {PoGoAPI.getPokemonNamePB(attacker[gameStatus!.activeAllyIndex == 3 ? 0 : gameStatus!.activeAllyIndex].pokemonId, allEnglishText)}</label>
              
            </div>
            {gameStatus && <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex] - gameStatus.allyPokemonDamage[gameStatus.activeAllyIndex]) / gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex]) * 100)} value={((gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex] - gameStatus.allyPokemonDamage[gameStatus.activeAllyIndex]) / gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex]) * 100} className="w-full"/>}
            
            <div className="flex flex-row justify-between items-end space-x-4">
              <div className="w-[50%]">
                <label className="text-xs items-end">Energy: {gameStatus?.allyEnergy[gameStatus!.activeAllyIndex]}/100</label>
                <Progress separators={Math.floor(100/-chargedMove[gameStatus!.activeAllyIndex].energyDelta)} color={"type-" + PoGoAPI.formatTypeName(chargedMove[gameStatus!.activeAllyIndex].type).toLowerCase()} value={(gameStatus!.allyEnergy[gameStatus!.activeAllyIndex] / 100) * 100} className="w-full"/>
              </div>
              <div className="w-[50%]">
                <label className="text-xs items-end">Shields: {gameStatus?.allyPokemonShields[gameStatus!.activeAllyIndex]}/{gameStatus?.allyPokemonMaxShields[gameStatus!.activeAllyIndex]}</label>
                <Progress separators={3} color="bg-blue-500" value={(gameStatus!.allyPokemonShields[gameStatus!.activeAllyIndex] / gameStatus!.allyPokemonMaxShields[gameStatus!.activeAllyIndex]) * 100} className="w-full"/>
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <label className="text-xs">{gameStatus?.allyCurrentMessage?.message}</label>
            </div>
            
            
            {(gameStatus!.enemyPokemonMaxHealth - gameStatus!.enemyPokemonDamage > 0) && !(gameStatus!.activeAllyIndex === 3) && !(gameStatus!.timeout) &&
              <>
              {gameStatus?.maxPhaseCounter === 0 && gameStatus?.allyCooldown === 0 &&
              <>
                <Separator className="my-4"/>
                <Button onClick={() => SendMessage("fast")} className={"w-full py-2 text-white bg-primary rounded-lg type-" + PoGoAPI.formatTypeName(quickMove[gameStatus!.activeAllyIndex].type).toLowerCase()}>{PoGoAPI.formatMoveName(quickMove[gameStatus.activeAllyIndex].moveId)}</Button>
                <Button onClick={() => SendMessage("charged")} className={"w-full py-2 text-white bg-primary rounded-lg type-" + PoGoAPI.formatTypeName(chargedMove[gameStatus!.activeAllyIndex].type).toLowerCase()}>{PoGoAPI.formatMoveName(chargedMove[gameStatus.activeAllyIndex].moveId)}</Button>
                <Separator className="my-4"/>
                <div className="flex flex-row justify-center items-center space-x-2">
                  <Button onClick={() => SendMessage("dodgeleft")} className="w-full py-2 text-white bg-primary rounded-lg">{"← Dodge"}</Button>
                  <Button onClick={() => SendMessage("dodgeright")} className="w-full py-2 text-white bg-primary rounded-lg">{"Dodge →"}</Button>
                </div>
              </>}
              {(gameStatus?.maxPhaseCounter === 4 || gameStatus?.maxPhaseCounter === 0) && gameStatus?.allyCooldown === 0 &&
              <>
              
                <Separator className="my-4"/>
                {(gameStatus!.allyPokemonDamage[0] < gameStatus!.allyPokemonMaxHealth[0]) && (gameStatus!.activeAllyIndex !== 0 || gameStatus!.maxPhaseCounter == 4) ? 
                  <>
                    <Button onClick={() => SendMessage("switch0")} className="w-full text-white rounded-lg flex-col">
                      <label className="text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[0].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[0] - gameStatus.allyPokemonDamage[0]) / gameStatus.allyPokemonMaxHealth[0]) * 100)} value={((gameStatus.allyPokemonMaxHealth[0] - gameStatus.allyPokemonDamage[0]) / gameStatus.allyPokemonMaxHealth[0]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                {(gameStatus!.allyPokemonDamage[1] < gameStatus!.allyPokemonMaxHealth[1]) && (gameStatus!.activeAllyIndex !== 1 || gameStatus!.maxPhaseCounter == 4) ? 
                  <>
                    <Button onClick={() => SendMessage("switch1")} className="w-full text-white bg-primary rounded-lg flex-col">
                      <label className="text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[1].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[1] - gameStatus.allyPokemonDamage[1]) / gameStatus.allyPokemonMaxHealth[1]) * 100)} value={((gameStatus.allyPokemonMaxHealth[1] - gameStatus.allyPokemonDamage[1]) / gameStatus.allyPokemonMaxHealth[1]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                {(gameStatus!.allyPokemonDamage[2] < gameStatus!.allyPokemonMaxHealth[2]) && (gameStatus!.activeAllyIndex !== 2 || gameStatus!.maxPhaseCounter == 4) ? 
                  <>
                    <Button onClick={() => SendMessage("switch2")} className="w-full text-white bg-primary rounded-lg flex-col ">
                      <label className=" text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[2].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[2] - gameStatus.allyPokemonDamage[2]) / gameStatus.allyPokemonMaxHealth[2]) * 100)} value={((gameStatus.allyPokemonMaxHealth[2] - gameStatus.allyPokemonDamage[2]) / gameStatus.allyPokemonMaxHealth[2]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
              </>}
              {(gameStatus?.maxPhaseCounter! > 0 && gameStatus?.maxPhaseCounter! < 4 ) && gameStatus?.allyCooldown === 0 &&
              <>
                <Button onClick={() => SendMessage("maxattack")} className="w-full py-2 text-white bg-primary rounded-lg">{PoGoAPI.formatMoveName(PoGoAPI.getDynamaxAttack(attacker[gameStatus!.activeAllyIndex].pokemonId, quickMove[gameStatus!.activeAllyIndex].type, allMoves, maxMoves[gameStatus!.activeAllyIndex][0], quickMove[gameStatus!.activeAllyIndex].moveId).moveId)}</Button>
                {((maxMoves[gameStatus!.activeAllyIndex][1] + (advEffect[0] == "cannon" && !(attacker[gameStatus!.activeAllyIndex].pokemonId === "ZACIAN_CROWNED_SWORD_FORM" || attacker[gameStatus!.activeAllyIndex].pokemonId === "ZAMAZENTA_CROWNED_SHIELD_FORM" ) ? 1 : 0)) > 0) && <Button onClick={() => SendMessage("maxbarrier")} className="w-full py-2 text-white bg-primary rounded-lg">Max Guard</Button>}
                {((maxMoves[gameStatus!.activeAllyIndex][2] + (advEffect[0] == "cannon" && !(attacker[gameStatus!.activeAllyIndex].pokemonId === "ZACIAN_CROWNED_SWORD_FORM" || attacker[gameStatus!.activeAllyIndex].pokemonId === "ZAMAZENTA_CROWNED_SHIELD_FORM" ) ? 1 : 0)) > 0) && <Button onClick={() => SendMessage("maxspirit")} className="w-full py-2 text-white bg-primary rounded-lg">Max Healing</Button>}
              </>
              }
              {(gameStatus) &&
              <>
                <Separator className="my-4"/>
                <Button onClick={() => SendMessage("next")} className="w-full py-2 text-white bg-primary rounded-lg">Skip Turn</Button>
              </>
                

              }
              </>
            }
          </div>
        </Card>
        }
    </div>
    </>);
}
