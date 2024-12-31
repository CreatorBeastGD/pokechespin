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
  defenderStats
}: {
  attacker: any;
  defender: any;
  move: any;
  attackerStats: any;
  defenderStats: any;
}) {
  const [damage, setDamage] = useState<number | null>(0);
  const [health , setHealth] = useState<number | null>(0);
  const [effStamina, setEffStamina] = useState<number | null>(0);

  useEffect(() => {
    setDamage(0);
    setHealth(0);
  }, [attacker, defender, move]);

  const calculateDamage = async () => {
    if (!attacker || !defender || !move) return;
    console.log(attacker, defender, move, attackerStats, defenderStats);
    const damage = await PoGoAPI.getDamageAttack(attacker, defender, move, attackerStats, defenderStats);
    const effStamina = Calculator.getEffectiveStamina(defender.stats.stamina, defenderStats[3], defenderStats[0]);
    console.log("Effective Stamina: ", effStamina);
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
        <div>
          <p>
          {attacker.names.English} deals {damage} damage to {defender.names.English} with {move.names.English} ({(((damage ?? 0) / (effStamina??0)) * 100).toFixed(2)}%)
        </p>
        <p>
        
        {defender.names.English} has {Math.floor((effStamina ?? 0) - (damage ?? 0)) > 0 ? Math.floor((effStamina ?? 0) - (damage ?? 0)) : 0}HP left ({Math.floor(((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100) > 0 ? (((effStamina ?? 0) - (damage ?? 0)) / (effStamina??0) * 100).toFixed(2) : 0}%)
        </p>
        </div>
      )}
    </>
  );
}
