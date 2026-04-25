"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Calculator } from "../../lib/calculations";


export default function CalculateButton({
  attacker,
  defender,
  move,
  attackerStats,
  defenderStats,
  bonusAttacker,
  bonusDefender,
  raidMode,
  allEnglishText,
  additionalBonus = 1,
  shroomBonus = 1,
  bladeBoost = false,
  simplifyCalculationText = false,
}: {
  attacker: any;
  defender: any;
  move: any;
  attackerStats: any;
  defenderStats: any;
  bonusAttacker: any;
  bonusDefender: any;
  raidMode: string;
  allEnglishText: any;
  additionalBonus?: number;
  shroomBonus?: number;
  bladeBoost?: boolean;
  simplifyCalculationText?: boolean;
}) {
  const [damage, setDamage] = useState<number | null>(0);
  const [health , setHealth] = useState<number | null>(0);
  const [effStamina, setEffStamina] = useState<number>(0);
  

  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

  const customHP = raidMode === "raid-custom-dmax" ? (Number)(searchParams.get("custom_hp") || 10000) : 10000;
  const customCPM = raidMode === "raid-custom-dmax" ? (Number)(searchParams.get("custom_cpm") || 1) : null;
  const customAtkMult = raidMode === "raid-custom-dmax" ? (Number)(searchParams.get("custom_atk_mult") || 1) : null;

  useEffect(() => {
    setDamage(0);
    setHealth(0);
  }, [bladeBoost, simplifyCalculationText, attacker, defender, move, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, additionalBonus]);

  const calculateDamage = async () => {
    if (!attacker || !defender || !move) return;
    //console.log(customHP, customCPM, customAtkMult);

    let defenderStatsModified = [...defenderStats];

    if (raidMode === "raid-custom-dmax") {
      defenderStatsModified[0] = customCPM;
    }
    
    const types = await PoGoAPI.getTypes();
    const damage = await PoGoAPI.getDamageAttack(attacker, defender, move, attackerStats, defenderStatsModified, bonusAttacker, bonusDefender, raidMode, additionalBonus * (bladeBoost ? Calculator.BladeBoost(raidMode) : 1), shroomBonus);
    const effStamina = 
      raidMode === "normal" ? Calculator.getEffectiveStamina(defender.stats.baseStamina, defenderStatsModified[3], defenderStatsModified[0]) : 
      (raidMode === "raid-custom-dmax" ? customHP : Calculator.getEffectiveDMAXHP(raidMode, defender.pokemonId, PoGoAPI.hasDoubleWeaknesses(defender.type, defender.type2, types)));
    const remainingStamina = effStamina - damage;
    setDamage(damage);
    setHealth(remainingStamina);
    setEffStamina(effStamina);
  };

  return (
    <>
      <Button onClick={calculateDamage} className="w-full py-2 text-white bg-primary rounded-lg">
        Calculate
      </Button>
      {damage !== 0 && attacker && defender && move && (
        <div className="mt-4 space-y-4">
          <p>
          <span className="font-bold">{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> (Level {attackerStats[0]}, Attack IV {attackerStats[1]}) 
          deals {damage} damage to <span className="font-bold">{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)} </span> 
          with {PoGoAPI.formatMoveName(move?.moveId)}
          {(raidMode.endsWith("dmax") || raidMode.endsWith("gmax")) ? <span className="font-bold"> gaining {Calculator.getMaxEnergyGain((damage??0), effStamina, raidMode, defender.pokemonId)} Max Energy </span> : " "}
          {!simplifyCalculationText && <span>
            under {PoGoAPI.formatWeatherName(bonusAttacker[0])} weather, 
          {bladeBoost ? " using Behemoth Blade Adventure Effect (x" + Calculator.BladeBoost(raidMode) + ") " : " "} 
           
          with Friendship Level {bonusAttacker[3]} (x{Calculator.getFriendshipBonus(bonusAttacker[3])})
          {(raidMode.endsWith("dmax") || raidMode.endsWith("gmax")) ? <span>, Helper Bonus Level {PoGoAPI.getRevertedHelperBonusDamage(additionalBonus)}  (x{additionalBonus}){shroomBonus ? " and using Max Mushroom." : "."}</span> : <span>{additionalBonus > 1 ? " and using " + (additionalBonus == 1.1 ? "Non-Same Type" : "Same Type") + " Mega Boost (x" + additionalBonus + ")" : ""}</span>}
            </span>} ({(((damage ?? 0) / (effStamina??0)) * 100).toFixed(2)}%)
          
          </p>
          <p>
          
          <span className="font-bold">{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> has {Math.floor((effStamina ?? 0) - (damage ?? 0)) > 0 ? Math.floor((effStamina ?? 0) - (damage ?? 0)) : 0}HP left ({Math.floor(((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100) > 0 ? (((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100).toFixed(2) : 0}%)
          </p>
        </div>
      )}
    </>
  );
}
