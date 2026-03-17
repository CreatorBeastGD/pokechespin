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
import { Separator } from "@/components/ui/separator"
import { RaidStatus } from "./RaidStatus";

export default function CalculateButtonSimulateTurnBased({
  attacker,
  defender,
  quickMove,
  chargedMove,
  defenderQuickMove,
  defenderChargedMove,
  attackerStats,
  defenderStats,
  raidMode,
  bonusAttacker,
  bonusDefender,
  allEnglishText,
  weather,
  types,
  allMoves,
  advenEffect,
  relobbyTimer
}: {
  attacker: any;
  defender: any;
  quickMove: any;
  chargedMove: any;
  defenderQuickMove: any;
  defenderChargedMove: any;
  attackerStats: any;
  defenderStats: any;
  raidMode: string;
  bonusAttacker: any;
  bonusDefender: any;
  allEnglishText: any;
  weather: any;
  types: any;
  allMoves: any;
  advenEffect: string;
  relobbyTimer: number;
}) {
  
  const searchParams = useSearchParams();

  const [startedSim, setStartedSim] = useState<boolean>(false);
  
  const [gameStatus, setGameStatus] = useState<RaidStatus | null>(null);
  const [showDPS, setShowDPS] = useState<boolean>(false);
  const [showHP, setShowHP] = useState<boolean>(false);

  useEffect(() => {
    setStartedSim(false);
    setGameStatus(null);

    //console.log("Changed dependencies")

  }, [relobbyTimer, attacker, defender, quickMove, chargedMove, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, defenderQuickMove, defenderChargedMove, advenEffect]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShowDPS(window.localStorage.getItem("showDPSOnSoloRaid") === "true");
    setShowHP(window.localStorage.getItem("showHPOnSoloRaid") === "true");
  }, []);

  const getHealthBarColor = (healthPercent: number) => {
    if (healthPercent > 50) {
      return "bg-green-500";
    } else if (healthPercent > 20) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  }

  const startSimulation = async () => {
    if (!attacker || !defender || !quickMove || !chargedMove || !defenderQuickMove || !defenderChargedMove) return;
    for (let i = 0; i < attacker.length; i++) {
      if (!attacker[i] || !quickMove[i] || !chargedMove[i]) return;
    }
    if (!raidMode || raidMode === "normal" || raidMode === "") return;
    const adventureEffect = searchParams.get("adv_effect");
    
    setStartedSim(true);

    const initGameStatus = PoGoAPI.TurnBasedSimulatorAllyTurnRaid(
        attacker,
        defender,
        quickMove,
        chargedMove,
        defenderQuickMove,
        defenderChargedMove,
        attackerStats,
        bonusAttacker,
        raidMode,
        weather,
        advenEffect,
        "init",
        null,
        types,
        allMoves,
        relobbyTimer
      )

    setGameStatus(
      initGameStatus
    );

  };

  const getIndexOrMax = (index: number, list: any[]): number => {
    if (index >= list.length) {
      return list.length - 1;
    } else {
      return index;
    }
  }

  const SendMessage = async (message: string) => {
    if (message === "charged" && gameStatus!.allyEnergy[gameStatus!.activeAllyIndex] < -chargedMove[gameStatus!.activeAllyIndex].energyDelta) return;
    console.log(raidMode)  
    const newState = PoGoAPI.TurnBasedSimulatorAllyTurnRaid(
        attacker,
        defender,
        quickMove,
        chargedMove,
        defenderQuickMove,
        defenderChargedMove,
        attackerStats,
        bonusAttacker,
        raidMode,
        weather,
        advenEffect,
        message,
        gameStatus,
        types,
        allMoves
      )
      setGameStatus(newState);
  }

  return (
    <>
      <Button onClick={startSimulation} className="w-full py-2 text-white bg-primary rounded-lg">
        Play
      </Button>
      <div className="w-full">
        
      {startedSim &&
        <Card className="mt-4 py-4 px-4 mb-2">
          <div className="flex flex-col space-y-1">
            <div className="flex flex-row justify-between">
              <label className="font-bold text-xs">Raid ({gameStatus ? (300-gameStatus.timer > 0 ? 300-gameStatus.timer : 0) : 0}s)</label>
            </div>
            <Separator className=""/>
            <label className={"text-xs " + (gameStatus?.enrageCurrentMessage?.message.startsWith("Timeout reached") ? "text-red-600" : "")}>{gameStatus?.enrageCurrentMessage?.message}</label>
            <Separator className=""/>
            <label className={"font-bold text-sm " + (gameStatus?.globalCurrentMessage?.message.startsWith("An orb has spawned") ? "text-red-600" : "")}>{gameStatus?.globalCurrentMessage?.message}</label>
          
            <div className="flex flex-row justify-between items-end ">
              <label className="text-xs pt-2">Boss: {PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</label>
              <label className="text-xs pt-2">{showHP ? `HP: ${gameStatus!.enemyPokemonMaxHealth - gameStatus!.enemyPokemonDamage}/${gameStatus?.enemyPokemonMaxHealth}` : ""}</label>
            </div>
            {gameStatus && <Progress color={getHealthBarColor(((gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage) / gameStatus.enemyPokemonMaxHealth) * 100)} value={((gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage) / gameStatus.enemyPokemonMaxHealth) * 100} className="w-full"/>}
            
            <div className="flex flex-row justify-between">
              <label className="text-xs">{gameStatus?.enemyCurrentMessage?.message}</label>
            </div>

            <Separator className="my-2"/>

            <div className="flex flex-row justify-between items-end">
              <label className="text-xs pt-2">Active: {PoGoAPI.getPokemonNamePB(attacker[gameStatus!.activeAllyIndex].pokemonId, allEnglishText)}</label>
              <label className="text-xs pt-2">{showHP ? `HP: ${gameStatus!.allyPokemonMaxHealth[gameStatus!.activeAllyIndex] - gameStatus!.allyPokemonDamage[gameStatus!.activeAllyIndex]}/${gameStatus?.allyPokemonMaxHealth[gameStatus!.activeAllyIndex]}` : ""}</label>
            </div>
            {gameStatus && <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex] - gameStatus.allyPokemonDamage[gameStatus.activeAllyIndex]) / gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex]) * 100)} value={((gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex] - gameStatus.allyPokemonDamage[gameStatus.activeAllyIndex]) / gameStatus.allyPokemonMaxHealth[gameStatus.activeAllyIndex]) * 100} className="w-full"/>}
            
            <div className="flex flex-row justify-between items-end space-x-4">
              <div className="w-[50%]">
                <label className="text-xs items-end">Energy: {gameStatus?.allyEnergy[gameStatus!.activeAllyIndex]}/100</label>
                <Progress separators={Math.floor(100/(-chargedMove[gameStatus!.activeAllyIndex]?.energyDelta))} color={"type-" + PoGoAPI.formatTypeName(chargedMove[gameStatus!.activeAllyIndex == 3 ? 0 : gameStatus!.activeAllyIndex]?.type).toLowerCase()} value={(gameStatus!.allyEnergy[gameStatus!.activeAllyIndex] / 100) * 100} className="w-full"/>
              </div>
              <div className="w-[50%] flex flex-col items-end">
                <label className={"text-xs items-end"}>{showDPS ? ((gameStatus!.enemyPokemonDamage ? gameStatus!.enemyPokemonDamage : 0)/ (gameStatus!.timer || 1)).toFixed(2) + " DPS" : ""} </label>
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <label className="text-xs">{gameStatus?.allyCurrentMessage?.message}</label>
            </div>
            
            
            {(gameStatus!.enemyPokemonMaxHealth - gameStatus!.enemyPokemonDamage > 0) && !(gameStatus!.timeout) &&
              <>
              {gameStatus?.allyCooldown === 0 && gameStatus?.isRelobby === 0 &&
              <>
                <Separator className="my-4"/>
                <Button onClick={() => SendMessage("fast")} className={"w-full py-2 text-white bg-primary rounded-lg type-" + PoGoAPI.formatTypeName(quickMove[gameStatus!.activeAllyIndex]?.type).toLowerCase()}>{PoGoAPI.formatMoveName(quickMove[gameStatus!.activeAllyIndex]?.moveId)}</Button>
                <Button onClick={() => SendMessage("charged")} className={"w-full py-2 text-white bg-primary rounded-lg type-" + PoGoAPI.formatTypeName(chargedMove[gameStatus!.activeAllyIndex]?.type).toLowerCase()}>{PoGoAPI.formatMoveName(chargedMove[gameStatus!.activeAllyIndex]?.moveId)}</Button>
                <Separator className="my-4"/>
                <div className="flex flex-row justify-center items-center space-x-2">
                  <Button onClick={() => SendMessage("dodge")} className="w-full py-2 text-white bg-primary rounded-lg">{"Dodge"}</Button>
                </div>
              </>}
              {gameStatus?.allyCooldown === 0 && gameStatus?.isRelobby === 0 &&
              <>
              
                <Separator className="my-4"/>
                {(gameStatus!.allyPokemonDamage[0] < gameStatus!.allyPokemonMaxHealth[0]) && (gameStatus!.activeAllyIndex !== 0) ? 
                  <>
                    <Button onClick={() => SendMessage("switch0")} className="w-full text-white rounded-lg flex-col">
                      <label className="text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[0].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[0] - gameStatus.allyPokemonDamage[0]) / gameStatus.allyPokemonMaxHealth[0]) * 100)} value={((gameStatus.allyPokemonMaxHealth[0] - gameStatus.allyPokemonDamage[0]) / gameStatus.allyPokemonMaxHealth[0]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                {attacker.length >= 2 && (gameStatus!.allyPokemonDamage[1] < gameStatus!.allyPokemonMaxHealth[getIndexOrMax(1, attacker)]) && (gameStatus!.activeAllyIndex !== 1) ? 
                  <>
                    <Button onClick={() => SendMessage("switch1")} className="w-full text-white bg-primary rounded-lg flex-col">
                      <label className="text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[getIndexOrMax(1, attacker)].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[getIndexOrMax(1, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(1, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(1, attacker)]) * 100)} value={((gameStatus.allyPokemonMaxHealth[getIndexOrMax(1, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(1, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(1, attacker)]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                {attacker.length >= 3 && (gameStatus!.allyPokemonDamage[2] < gameStatus!.allyPokemonMaxHealth[getIndexOrMax(2, attacker)]) && (gameStatus!.activeAllyIndex !== 2) ? 
                  <>
                    <Button onClick={() => SendMessage("switch2")} className="w-full text-white bg-primary rounded-lg flex-col ">
                      <label className=" text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[getIndexOrMax(2, attacker)].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[getIndexOrMax(2, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(2, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(2, attacker)]) * 100)} value={((gameStatus.allyPokemonMaxHealth[getIndexOrMax(2, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(2, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(2, attacker)]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                  {attacker.length >= 4 && (gameStatus!.allyPokemonDamage[3] < gameStatus!.allyPokemonMaxHealth[getIndexOrMax(3, attacker)]) && (gameStatus!.activeAllyIndex !== 3) ?
                  <>
                    <Button onClick={() => SendMessage("switch3")} className="w-full text-white rounded-lg flex-col">
                      <label className="text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[getIndexOrMax(3, attacker)].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[getIndexOrMax(3, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(3, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(3, attacker)]) * 100)} value={((gameStatus.allyPokemonMaxHealth[getIndexOrMax(3, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(3, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(3, attacker)]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                  {attacker.length >= 5 && (gameStatus!.allyPokemonDamage[4] < gameStatus!.allyPokemonMaxHealth[getIndexOrMax(4, attacker)]) && (gameStatus!.activeAllyIndex !== 4) ?
                  <>
                    <Button onClick={() => SendMessage("switch4")} className="w-full text-white rounded-lg flex-col">
                      <label className="text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[getIndexOrMax(4, attacker)].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[getIndexOrMax(4, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(4, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(4, attacker)]) * 100)} value={((gameStatus.allyPokemonMaxHealth[getIndexOrMax(4, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(4, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(4, attacker)]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                  {attacker.length >= 6 && (gameStatus!.allyPokemonDamage[5] < gameStatus!.allyPokemonMaxHealth[getIndexOrMax(5, attacker)]) && (gameStatus!.activeAllyIndex !== 5) ?
                  <>
                    <Button onClick={() => SendMessage("switch5")} className="w-full text-white rounded-lg flex-col">
                      <label className="text-center">Switch to {PoGoAPI.getPokemonNamePB(attacker[getIndexOrMax(5, attacker)].pokemonId, allEnglishText)}</label>
                      <div className="w-full relative">
                        <Progress color={getHealthBarColor(((gameStatus.allyPokemonMaxHealth[getIndexOrMax(5, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(5, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(5, attacker)]) * 100)} value={((gameStatus.allyPokemonMaxHealth[getIndexOrMax(5, attacker)] - gameStatus.allyPokemonDamage[getIndexOrMax(5, attacker)]) / gameStatus.allyPokemonMaxHealth[getIndexOrMax(5, attacker)]) * 100} className="self-end absolute"/>
                      </div>
                    </Button>
                  </> : null}
                  
                  
              </>}
                {gameStatus?.isRelobby !== 2 && (<>
                  <Separator className="my-4"/>
                  <Button onClick={() => SendMessage("next")} className="w-full py-2 text-white bg-primary rounded-lg">Next Turn</Button>
                </>)}
                {gameStatus?.isRelobby !== 1 && gameStatus?.allyCooldown === 0 && (
                  <>
                    <Separator className="my-4"/>
                    <Button onClick={() => SendMessage("relobby")} className="w-full py-2 text-white bg-primary rounded-lg">Relobby</Button>
                  </>
                )}
              </>
            }
          </div>
        </Card>
        }
    </div>
    </>);
}
