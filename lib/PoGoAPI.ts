import { get } from "http";
import nextConfig from "../next.config";
import { Calculator } from "./calculations";

import { useState } from "react";

const API = nextConfig.API_URL;

export class PoGoAPI {
    static async getAllPokemon() {
        const response = await fetch(API + "pokedex.json");
        return await response.json();
    }

    static async getAllPokemonNames() {
        const response = await this.getAllPokemon();
        return await response.map((pokemon: any) => pokemon.id);
    }

    static async getPokemonByID(id: number) {
        const response = await fetch(API + `pokedex/id/${id}.json`);
        return await response.json();
    }

    static async getPokemonByName(name: string) {
        const response = await fetch(API + `pokedex/name/${name}.json`);
        if (!response.ok) {
            console.log("Error fetching pokemon data");
        }
        const data = await response.json();
        return data;
    }
    
    static async getTypes () {
        const response = await fetch(API + "types.json");
        return await response.json();
    }

    static getTypeWeaknesses(type: string, allTypes: any[]) {
        const objType = allTypes.find((t: any) => t.type === type);
        let weaknesses: { [key: string]: number } = {};
    
        if (!objType) {
            console.error(`Type ${type} not found in allTypes`);
            return weaknesses;
        }
    
        allTypes.forEach((t: any) => {
            if (objType.doubleDamageFrom.includes(t.type)) {
                weaknesses[t.type] = 1.6;
            } else if (objType.halfDamageFrom.includes(t.type)) {
                weaknesses[t.type] = 0.63;
            } else if (objType.noDamageFrom.includes(t.type)) {
                weaknesses[t.type] = 0.39;
            }
        });
    
        return weaknesses;
    }

    static getEfectiveness(defendingPokemon: any, move: any, types: any) {
        const defenderFirstType = defendingPokemon.primaryType.names.English;
        const defenderSecondType = defendingPokemon.secondaryType?.names.English;

        
        const defenderFirstTypeWeaknesses = this.getTypeWeaknesses(defenderFirstType, types);
        const defenderSecondTypeWeaknesses = defenderSecondType ? this.getTypeWeaknesses(defenderSecondType, types) : {};
        const effectiveness = (defenderFirstTypeWeaknesses[move.type.names.English] ?? 1) * (defenderSecondTypeWeaknesses[move.type.names.English] ?? 1);
        
        return effectiveness;
    }

    static async getDamageAttack(attackingPokemon: any, defendingPokemon: any, move: any, attackerStats: any, defenderStats: any, bonusAttacker?: any, bonusDefender?: any, raidMode?: any) {
        const raid = raidMode ? raidMode : "normal";
        if (raid !== "normal") {
            defenderStats = this.convertStats(defenderStats, raid);
        }
        const types = await this.getTypes();
        const effectiveness = this.getEfectiveness(defendingPokemon, move, types);
        return Calculator.calculateDamage(
            move.power, 
            Calculator.getEffectiveAttack(attackingPokemon.stats.attack, attackerStats[1], attackerStats[0]), 
            Calculator.getEffectiveDefense(defendingPokemon.stats.defense, defenderStats[2], defenderStats[0]),
            attackingPokemon.primaryType.type == move.type.type || attackingPokemon.secondaryType?.type == move.type.type ? 1.2 : 1, 
            effectiveness,
            move.type.type,
            bonusAttacker,
            bonusDefender,
        );
    }
    
    static getDamage(attacker: any, defender: any, move: any, types: any, attackerStats: any, defenderStats: any, bonusAttacker?: any, bonusDefender?: any, raidMode?: any) {
        const raid = raidMode ? raidMode : "normal";
        if (raid !== "normal") {
            defenderStats = this.convertStats(defenderStats, raid);
        }
        const effectiveness = this.getEfectiveness(defender, move, types);
        return Calculator.calculateDamage(
            move.power, 
            Calculator.getEffectiveAttack(attacker.stats.attack, attackerStats[1] , attackerStats[0]), 
            Calculator.getEffectiveDefense(defender.stats.defense, defenderStats[2], defenderStats[0]),
            attacker.primaryType.type == move.type.type || attacker.secondaryType?.type == move.type.type ? 1.2 : 1, 
            effectiveness,
            move.type.type,
            bonusAttacker,
            bonusDefender
        );
    }

    static convertStats(defenderStats: any, raidMode: any) {
        let convertedStats = [];
        console.log("def: ", defenderStats)
        if (raidMode === "raid-t1") {
            convertedStats = [20, 15, 15, 600];
        } else if (raidMode === "raid-t3") {
            convertedStats = [30, 15, 15, 3600];
        } else if (raidMode === "raid-t4" || raidMode === "raid-mega") {
            convertedStats = [40, 15, 15, 9000];
        } else if (raidMode === "raid-t5") {
            convertedStats = [40, 15, 15, 15000];
        } else if (raidMode === "raid-elite") {
            convertedStats = [40, 15, 15, 20000];
        } else if (raidMode === "raid-primal" || raidMode === "raid-mega-leg") {
            convertedStats = [40, 15, 15, 22500];
        } else {
            convertedStats = defenderStats;
        }
        return convertedStats;
    }

    static getRaidHealth (raidMode: any) {
        if (raidMode === "raid-t1") {
            return 600;
        } else if (raidMode === "raid-t3") {
            return 3600;
        } else if (raidMode === "raid-t4" || raidMode === "raid-mega") {
            return 9000;
        } else if (raidMode === "raid-t5") {
            return 15000;
        } else if (raidMode === "raid-elite") {
            return 20000;
        } else if (raidMode === "raid-primal" || raidMode === "raid-mega-leg") {
            return 22500;
        } else {
            return 0;
        }
    }

    /**
     * Simulates a battle between two pokemon
     * 
     * @param attacker 
     * @param defender 
     * @param quickMove 
     * @param chargedMove 
     * @returns 
     */
    static async simulate(attacker: any, defender: any, quickMove: any, chargedMove: any, attackerStats: any, defenderStats: any, raidMode: any, bonusAttacker: any, bonusDefender: any) {
        if (raidMode !== "normal") {
            defenderStats = this.convertStats(defenderStats, raidMode);
        }
        console.log(bonusAttacker, bonusDefender);
        const types = await this.getTypes();
        let energy = 0;
        let time = 0;
        let damage = 0;
        let quickAttackUses = 0;
        let chargedAttackUses = 0;
        let turn = 0;
        let graphic = [];
        console.log(defenderStats, raidMode);
        let maxHealth = Calculator.getEffectiveStamina(defender.stats.stamina, defenderStats[3], defenderStats[0]);
        if (raidMode !== "normal") {
            maxHealth = this.getRaidHealth(raidMode);
        }
        console.log("Max health: ", maxHealth)
        while (damage <= maxHealth) {
            damage += this.getDamage(attacker, defender, quickMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
            time += quickMove.durationMs;
            energy += quickMove.energy;
            if (energy > 100) {
                energy = 100;
            }
            quickAttackUses++;
            turn++;
            graphic.push({"turn": turn, "type": "quick"});
            if (damage >= maxHealth) {
                break;
            }
            
            // WARNING: chargedMove.energy is negative
            if (energy >= -chargedMove.energy) {
                const projectedDamageCharged = this.getDamage(attacker, defender, chargedMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
                const projectedDamageQuick = this.getDamage(attacker, defender, quickMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
                if ((damage + (projectedDamageQuick * chargedMove.durationMs / quickMove.durationMs) < maxHealth)) {
                    if ((projectedDamageCharged > (projectedDamageQuick * (Math.floor(chargedMove.durationMs / quickMove.durationMs))))) {
                        energy = energy + chargedMove.energy <= 0 ? 0 : energy + chargedMove.energy;
                        time += chargedMove.durationMs;
                        chargedAttackUses++;
                        damage += this.getDamage(attacker, defender, chargedMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
                        turn++;
                        graphic.push({"turn": turn, "type": "charged"});
                    }
                }
            }
        }
        return {time, quickAttackUses, chargedAttackUses, graphic};
    }
}