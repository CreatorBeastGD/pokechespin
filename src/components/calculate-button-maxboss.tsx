"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Calculator } from "../../lib/calculations";

export default function CalculateButtonMaxBoss({
  attacker,
  defender,
  move,
  attackerStats,
  defenderStats,
  bonusAttacker,
  bonusDefender,
  raidMode,
  allEnglishText,
  isLarge,
  bashBoost = false,
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
  isLarge: boolean;
  bashBoost?: boolean;
}) {
  
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

  const [damage, setDamage] = useState<number | null>(0);
  const [health , setHealth] = useState<number | null>(0);
  const [effStamina, setEffStamina] = useState<number | null>(0);
  const [damageBestCase, setDamageBestCase] = useState<number | null>(0);
  const [damageWorstCase, setDamageWorstCase] = useState<number | null>(0);
  const [customCPM, setCustomCPM] = useState<number>((Number)(searchParams.get("custom_cpm") || 1));
  const [customAtkMult, setCustomAtkMult] = useState<number>((Number)(searchParams.get("custom_atk_mult") || 1));

  useEffect(() => {
    setDamage(0);
    setHealth(0);
  }, [attacker, defender, move, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, bashBoost, customCPM, customAtkMult]);

  useEffect(() => {
    setCustomCPM((Number)(searchParams.get("custom_cpm") || 1));
    setCustomAtkMult((Number)(searchParams.get("custom_atk_mult") || 1));
  }, [searchParams]);

  const calculateDamage = async () => {
    if (!attacker || !defender || !move) return;
    const types = await PoGoAPI.getTypes();
    const attackingPoke = attacker;
    const defendingPoke = defender;
    const attackingStats = PoGoAPI.convertStats(attackerStats, raidMode, attacker.pokemonId);
    const defendingStats = defenderStats;
    const bonusAttacking = bonusAttacker;
    const bonusDefending = bonusDefender;

    if (raidMode === "raid-custom-dmax") {
      attackingStats[0] = customCPM;
    }

    const damage = PoGoAPI.getDamage(
      attackingPoke, 
      defendingPoke, 
      move, 
      types, 
      attackingStats, 
      defendingStats, 
      bonusAttacking, 
      bonusDefending, 
      "normal", 
      0, 
      (raidMode === "raid-custom-dmax" ? customAtkMult : PoGoAPI.getDamageMultiplier(raidMode, false, false, attackingPoke)) * (bashBoost ? (1/1.05) : 1) * (isLarge ? 1 : 2),
      raidMode === "raid-custom-dmax" ? true : false
    );
    setDamageBestCase(PoGoAPI.getDamage(
      attackingPoke, 
      defendingPoke,
      move,
      types,
      attackingStats,
      defendingStats,
      bonusAttacking,
      bonusDefending,
      "normal",
      0,
      (raidMode === "raid-custom-dmax" ? customAtkMult : PoGoAPI.getDamageMultiplier(raidMode, false, false, attackingPoke)) * (bashBoost ? (1/1.05) : 1) * (2 * 0.3),
      raidMode === "raid-custom-dmax" ? true : false
    ));
    setDamageWorstCase(PoGoAPI.getDamage(
      attackingPoke, 
      defendingPoke,
      move,
      types,
      attackingStats,
      defendingStats,
      bonusAttacking,
      bonusDefending,
      "normal",
      0,
      (raidMode === "raid-custom-dmax" ? customAtkMult : PoGoAPI.getDamageMultiplier(raidMode, false, false, attackingPoke)) * (bashBoost ? (1/1.05) : 1) * (2 * 0.6),
      raidMode === "raid-custom-dmax" ? true : false
    )); 
    const effStamina = Calculator.getEffectiveStamina(defender.stats.baseStamina, defenderStats[3], defenderStats[0]);
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
          <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> deals {damage} damage to <span className="font-bold">{(bonusDefender[1] === true && raidMode === "normal") ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> with {PoGoAPI.formatMoveName(move.moveId)}{bashBoost ? " using Behemoth Bash Adventure Effect" : ""} ({(((damage ?? 0) / (effStamina??0)) * 100).toFixed(2)}%){!isLarge && <span>, which will be reduced to <span className="font-bold">{damageBestCase}-{damageWorstCase} damage</span> if dodged. </span>}
          </p>
          <p>
          
          <span className="font-bold">{(bonusDefender[1] === true && raidMode === "normal") ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> has {Math.floor((effStamina ?? 0) - (damage ?? 0)) > 0 ? Math.floor((effStamina ?? 0) - (damage ?? 0)) : 0}HP left ({Math.floor(((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100) > 0 ? (((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100).toFixed(2) : 0}%)
          </p>
        </div>
      )}
    </>
  );
}
