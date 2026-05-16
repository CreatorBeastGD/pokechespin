"use client";

import { useState, useEffect, useRef } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import { CardHeader, Card, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function CalculateButtonMultiSimulateAdvanced({
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
  allEnglishText,
  boost = "none",
  allTypes,
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
  boost: string;
  allTypes: any;
}) {

  const TOTAL_SIM_AMOUNT = 2000;
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [time, setTime] = useState<number>(0);
  const [qau, setQau] = useState<any | null>({ attackerQuickAttackUses: 0, defenderQuickAttackUses: 0 });
  const [cau, setCau] = useState<any | null>({ attackerChargedAttackUses: 0, defenderChargedAttackUses: 0 });
  const [graphic, setGraphic] = useState<any | null>(null);
  const [faints, setFaints] = useState<any | null>(null);
  const [teamCount, setTeamCount] = useState<number>(parseInt(searchParams.get("pokemon_team_number") ?? "6"));
  const [relobbyTime, setRelobbyTime] = useState<number>(parseInt(searchParams.get("relobby_time") ?? "8"));
  const [avoidCharged, setAvoidCharged] = useState<boolean>(searchParams.get("can_dodge") === "true");
  const [attackerDamage, setAttackerDamage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleEntries, setVisibleEntries] = useState(50);
  const [peopleCount, setPeopleCount] = useState<number>(parseInt(searchParams.get("teams_number") ?? "1"));
  const [partyPower, setPartyPower] = useState<boolean>(searchParams.get("party_power") === "true");
  const [energyResolveBug, setEnergyResolveBug] = useState<boolean>(searchParams.get("energy_resolve_bug") === "true");
  
  const [simHasWon, setSimHasWon] = useState<number>(0);

  const [simAmount, setSimAmount] = useState<number>(0);
  const [winAmount, setWinAmount] = useState<number>(0);

  const [allyStats, setAllyStats] = useState<{ tdo: number[]; turns: number[] }>({ tdo: Array(6).fill(0), turns: Array(6).fill(0) });
  const [bestDPS, setBestDPS] = useState<number[]>(Array(6).fill(0));
  const [worstDPS, setWorstDPS] = useState<number[]>(Array(6).fill(9999999999));

  const runIdRef = useRef(0);

  useEffect(() => {
    const loadParams = () => {
      const dodge = searchParams.get("can_dodge");
      const pokemon_team_number = searchParams.get("pokemon_team_number");
      const relobby_time = searchParams.get("relobby_time");
      const teams_number = searchParams.get("teams_number");
      const party_power = searchParams.get("party_power");
      const energy_resolve_bug = searchParams.get("energy_resolve_bug");

      if (dodge) {
        setAvoidCharged(dodge === "true");
      }
      if (pokemon_team_number) {
        setTeamCount(parseInt(pokemon_team_number));
      }
      if (relobby_time) {
        setRelobbyTime(parseInt(relobby_time));
      }
      if (teams_number) {
        setPeopleCount(parseInt(teams_number));
      }
      if (party_power) {
        setPartyPower(party_power === "true");
      }
      if (energy_resolve_bug) {
        setEnergyResolveBug(energy_resolve_bug === "true");
      }
    }

    loadParams();
  }, []);

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    cancelSimulation();

  }, [attacker, defender, quickMove, chargedMove, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, quickMoveDefender, chargedMoveDefender, boost]);

  const calculateDamage = async () => {
    if (!attacker || !defender || !quickMove || !chargedMove || !quickMoveDefender || !chargedMoveDefender) return;
    for (let i = 0; i < attacker.length; i++) {
      if (attacker[i]) {
        if (!attackerStats[i]) {
          return;
        }
        if (!quickMove[i]) {
          return;
        }
        if (!chargedMove[i]) {
          return;
        }
      }
    }

    const yieldToBrowser = () => new Promise<void>(resolve => setTimeout(resolve, 0));

    // increment run id to identify this run; cancel by incrementing again
    runIdRef.current += 1;
    const currentRunId = runIdRef.current;

    setLoading(true);
    setSimAmount(0);
    setWinAmount(0);
    setSimHasWon(0);
    // Both should have the same weather boost.
    const defenderBonusesMod = [bonusAttacker[0][0], bonusDefender[1], raidMode === "normal" ? bonusDefender[2] : false, raidMode === "normal" ? bonusDefender[3] : 0];
    let completedSimulations = 0;
    let completedWins = 0;

    let avgTDO = Array(attacker.length).fill(0);
    let avgTurns = Array(attacker.length).fill(0);
    
    for (let i = 0; i < TOTAL_SIM_AMOUNT; i++) {
      // check for cancellation
      if (runIdRef.current !== currentRunId) {
        console.log(`Simulation run ${currentRunId} cancelled at iteration ${i}`);
        break;
      }

      const { success, totalTDO, turns } = await PoGoAPI.RaidSimulatorSTATUS(attacker, defender, quickMove, chargedMove, quickMoveDefender, chargedMoveDefender, attackerStats, defenderStats, raidMode, bonusAttacker, defenderBonusesMod, teamCount, allTypes, avoidCharged, relobbyTime, raidMode.endsWith("shadow"), peopleCount, partyPower, boost, energyResolveBug);
      completedSimulations += 1;
      if (success) {
        completedWins += 1;
      }
      for (let j = 0; j < totalTDO.length; j++) {
        let dps = totalTDO[j] / turns[j];
        // update bestDPS using functional updater to avoid stale closures
        setBestDPS(prev => {
          if (dps > prev[j]) {
            const newBest = [...prev];
            newBest[j] = dps;
            return newBest;
          }
          return prev;
        });

        // update worstDPS using functional updater to avoid stale closures
        setWorstDPS(prev => {
          if (dps < prev[j]) {
            const newWorst = [...prev];
            newWorst[j] = dps;
            return newWorst;
          }
          return prev;
        });
      }
      for (let j = 0; j < totalTDO.length; j++) {
        avgTDO[j] = avgTDO[j] + totalTDO[j] / TOTAL_SIM_AMOUNT;
      }
      for (let j = 0; j < turns.length; j++) {
        avgTurns[j] = avgTurns[j] + turns[j] / TOTAL_SIM_AMOUNT;
      }
      // if cancelled while processing results, stop updating
      if (runIdRef.current !== currentRunId) {
        console.log(`Simulation run ${currentRunId} cancelled after iteration ${i + 1}`);
        break;
      }

      setSimAmount(completedSimulations);
      setWinAmount(completedWins);
      setSimHasWon((completedWins / completedSimulations) * 100);

      setAllyStats({tdo: avgTDO, turns: avgTurns});

      if ((i + 1) % 25 === 0) {
        await yieldToBrowser();
      }
    }
    // only unset loading if this run is still the active one
    if (runIdRef.current === currentRunId) {
      setLoading(false);
    }
  };

  function cancelSimulation() {
    // bump run id to invalidate current run
    runIdRef.current += 1;
    setLoading(false);
    setSimAmount(0);
    setWinAmount(0);
    setSimHasWon(0);
    console.log('Simulation cancelled by user or input change');
  }

  const handleSwitch = (checked: boolean, handle: any) => {
    handle(checked);
  }

  useEffect(() => {

    setTeamCount(teamCount);
    setRelobbyTime(relobbyTime);
    setAvoidCharged(avoidCharged);
    setPeopleCount(peopleCount);
    setPartyPower(partyPower);
    setEnergyResolveBug(energyResolveBug);
    
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("can_dodge", avoidCharged.toString());
    sp.set("pokemon_team_number", teamCount.toString());
    sp.set("relobby_time", relobbyTime.toString());
    sp.set("teams_number", peopleCount.toString());
    sp.set("party_power", partyPower.toString());
    sp.set("energy_resolve_bug", energyResolveBug.toString());
    window.history.replaceState({}, "", `${pathname}?${sp.toString()}`);
    
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(0);
    cancelSimulation();
  }, [teamCount, relobbyTime, avoidCharged, peopleCount, partyPower, energyResolveBug]);

  useEffect(() => {
    setTime(0);
    setQau(0);
    setCau(0);
    setGraphic(null);
    setAttackerDamage(0);
    cancelSimulation();
  } , [raidMode]);

 

  const getRequiredPeople = (raidMode: string) => {
    
    return (( ((time ?? 0) / 1000) / PoGoAPI.getRaidTime(raidMode))*peopleCount).toFixed(2);
  }

  function handleRelobbyTime(value: number[]): void {
    setRelobbyTime(value[0]);
  }

  function handleTeamCount(value: number[]): void {
    setTeamCount(value[0]);
  }

  function handlePeopleCount(value: number[]): void {
    setPeopleCount(value[0]);
  }

  return (
    <>
      <Button onClick={calculateDamage} className="w-full py-2 text-white bg-primary rounded-lg">
        Simulate
      </Button>
      <div className="italic text-slate-700 text-sm my-2 space-y-2 flex flex-col">
        <p><Switch onCheckedChange={(checked) => handleSwitch(checked, setAvoidCharged)} checked={avoidCharged} /> Try to dodge charged attacks if attacker doesn't faint. (75% damage reduction)</p>
        <p><Switch onCheckedChange={(checked) => handleSwitch(checked, setEnergyResolveBug)} checked={energyResolveBug}/> Energy Resolve Bug</p>
        <p>Set custom relobby time ({relobbyTime} seconds):</p>
        <Slider onValueChange={(value) => handleRelobbyTime(value)} value={[relobbyTime]} max={10} step={1} min={1} className="w-[60%] mb-1" color="bg-blue-700"/>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
          <Progress value={100 * simAmount / TOTAL_SIM_AMOUNT} className="w-full" />
        </div>
      )}
      {!loading && (
        <div className="mt-4 space-y-4">
          {simAmount > 0 ? (
          <>
            <p>
              {simHasWon.toFixed(2)}% of simulations resulted in your team winning the raid. {simAmount} simulations were done in the process.
            </p>
            <p>
              These are the stats of your Pokémon on average:
            </p>
            {allyStats.tdo.map((tdo, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Ally {index + 1}</h3>
                <p>Average TDO: {allyStats.tdo[index].toFixed(2)}</p>
                <p>Average DPS: {(allyStats.tdo[index] / allyStats.turns[index]).toFixed(2)}</p>
                <p>Best DPS: {bestDPS[index].toFixed(2)}</p>
                <p>Worst DPS: {worstDPS[index].toFixed(2)}</p>
              </div>
            ))}
          </>
          ) : (
          <p>
            No simulations run yet. Click the simulate button to start.
          </p>
          )}
        </div>
      )}
    </>
  );
}
