import { get } from "http";
import nextConfig from "../next.config";
import { Calculator } from "./calculations";

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

    static async getBestQuickMove(pokemon: any, defendingPokemon: any) {
        
        const types = await this.getTypes();
        const bestQuickMove = pokemon.quickMoves.reduce((best: any, move: any) => {
            const power = this.movepower(move, pokemon, defendingPokemon, types);
            if (power > best.power) {
                return {move, power};
            }
            return best;
        });

        const bestEliteQuickMove = pokemon.eliteQuickMoves.reduce((best: any, move: any) => {
            const power = this.movepower(move, pokemon, defendingPokemon, types);
            if (power > best.power) {
                return {move, power};
            }
            return best;
        });

        return this.movepower(bestQuickMove.move, pokemon, defendingPokemon, types) > 
              this.movepower(bestEliteQuickMove.move, pokemon, defendingPokemon, types) ? 
              bestQuickMove : bestEliteQuickMove;
    }

    static async getTypes () {
        const response = await fetch(API + "types.json");
        return await response.json();
    }

    

    static async movepower(move: any, attackingPokemon: any, defendingPokemon: any, types: any) {
        const stabMultiplier = move.type.type == attackingPokemon.primaryType.type || move.type.type == attackingPokemon.secondaryType.type ? 1.2 : 1;
        const speed = move.durationMS / 1000;
        const power = move.power;
        const energy = move.energy;
        const defenderFirstType = defendingPokemon.primaryType.type;
        const defenderSecondType = defendingPokemon.secondaryType?.type;
        
        const defenderFirstTypeWeaknesses = this.getTypeWeaknesses(defenderFirstType, types);
        const defenderSecondTypeWeaknesses = this.getTypeWeaknesses(defenderSecondType, types);
        const effectiveness = (defenderFirstTypeWeaknesses[move.type.type] ?? 1) * (defenderSecondTypeWeaknesses[move.type.type] ?? 1);
        
        const EPS = energy / speed;
        const DPS = (power*effectiveness*stabMultiplier) / speed;

        return EPS+DPS;
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

    static async getDamageAttack(attackingPokemon: any, defendingPokemon: any, move: any) {
        const types = await this.getTypes();
        const effectiveness = this.getEfectiveness(defendingPokemon, move, types);
        return Calculator.calculateDamage(
            move.power, 
            Calculator.getEffectiveAttack(attackingPokemon.stats.attack, 50), 
            Calculator.getEffectiveDefense(defendingPokemon.stats.defense, 50),
            attackingPokemon.primaryType.type == move.type.type || attackingPokemon.secondaryType?.type == move.type.type ? 1.2 : 1, 
            effectiveness
        );
    }
    
    static getDamage(attacker: any, defender: any, move: any, types: any) {
        const effectiveness = this.getEfectiveness(defender, move, types);
        return Calculator.calculateDamage(
            move.power, 
            Calculator.getEffectiveAttack(attacker.stats.attack, 50), 
            Calculator.getEffectiveDefense(defender.stats.defense, 50),
            attacker.primaryType.type == move.type.type || attacker.secondaryType?.type == move.type.type ? 1.2 : 1, 
            effectiveness
        );
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
    static async simulate(attacker: any, defender: any, quickMove: any, chargedMove: any) {
        const types = await this.getTypes();
        let energy = 0;
        let time = 0;
        let damage = 0;
        let quickAttackUses = 0;
        let chargedAttackUses = 0;
        let turn = 0;
        let graphic = [];
        let maxHealth = Calculator.getEffectiveStamina(defender.stats.stamina, 50);
        console.log(quickMove, chargedMove);
        while (damage <= maxHealth) {
            damage += this.getDamage(attacker, defender, quickMove, types);
            time += quickMove.durationMs;
            energy += quickMove.energy;
            quickAttackUses++;
            turn++;
            graphic.push({"turn": turn, "type": "quick"});
            if (damage >= maxHealth) {
                break;
            }
            
            // WARNING: chargedMove.energy is negative
            if (energy >= -chargedMove.energy) {
                if (damage + (this.getDamage(attacker, defender, quickMove, types) * chargedMove.durationMs / quickMove.durationMs) < maxHealth) { 
                    energy = energy + chargedMove.energy <= 0 ? 0 : energy + chargedMove.energy;
                    time += chargedMove.durationMs;
                    chargedAttackUses++;
                    damage += this.getDamage(attacker, defender, chargedMove, types);
                    turn++;
                    graphic.push({"turn": turn, "type": "charged"});
                }
            }
        }
        return {time, quickAttackUses, chargedAttackUses, graphic};
    }
}