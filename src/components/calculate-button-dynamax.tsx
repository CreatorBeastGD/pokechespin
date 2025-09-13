"use client";

import { useState, useEffect } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";
import { Calculator } from "../../lib/calculations";

export default function CalculateButtonDynamax({
  attacker,
  defender,
  move,
  attackerStats,
  defenderStats,
  bonusAttacker,
  bonusDefender,
  raidMode,
  allEnglishText,
  maxLevel,
  additionalBonus = 1,
  shroomBonus = 1
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
  maxLevel: number;
  additionalBonus?: any;
  shroomBonus?: number;
}) {
  const [damage, setDamage] = useState<number | null>(0);
  const [health , setHealth] = useState<number | null>(0);
  const [effStamina, setEffStamina] = useState<number | null>(0);

  
  useEffect(() => {
    setDamage(0);
    setHealth(0);
  }, [attacker, defender, move, bonusAttacker, bonusDefender, attackerStats, defenderStats, raidMode, maxLevel]);

  const calculateDamage = async () => {
    if (!attacker || !defender || !move) return;
    const types = await PoGoAPI.getTypes();
    const damage = await PoGoAPI.getDamageAttackDynamax(attacker, defender, move, attackerStats, defenderStats, bonusAttacker, bonusDefender, raidMode, maxLevel, additionalBonus, shroomBonus);
    const effStamina = raidMode === "normal" ? Calculator.getEffectiveStamina(defender.stats.baseStamina, defenderStats[3], defenderStats[0]) : Calculator.getEffectiveDMAXHP(raidMode, defender.pokemonId, PoGoAPI.hasDoubleWeaknesses(defender.type, defender.type2, types));
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
          <span className="font-bold">{bonusAttacker[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(attacker.pokemonId, allEnglishText)}</span> deals {damage} damage to <span className="font-bold">{bonusDefender[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> with {PoGoAPI.formatMoveName(move.moveId)} ({(((damage ?? 0) / (effStamina??0)) * 100).toFixed(2)}%)
          </p>
          <p>
          
          <span className="font-bold">{bonusDefender[1] === true ? "Shadow " : ""}{PoGoAPI.getPokemonNamePB(defender.pokemonId, allEnglishText)}</span> has {Math.floor((effStamina ?? 0) - (damage ?? 0)) > 0 ? Math.floor((effStamina ?? 0) - (damage ?? 0)) : 0}HP left ({Math.floor(((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100) > 0 ? (((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100).toFixed(2) : 0}%)
          </p>
        </div>
      )}
    </>
  );
}
