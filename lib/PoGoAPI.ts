import { get } from "http";
import nextConfig from "../next.config";
import { Calculator } from "./calculations";

const API = nextConfig.API_URL;
const API_PB = nextConfig.API_PB_URL;
const API_STATIC_PB = nextConfig.API_STATIC_PB_URL;

export class PoGoAPI {
    static async getAllPokemon() {
        const response = await fetch(API + "pokedex.json");
        return await response.json();
    }

    static async getAllPokemonPB() {
        const response = await fetch(API_PB + "pokemon");
        return (await response.json()).pokemon;
    }

    static async getAllPokemonImagesPB() {
        const response = await fetch(API_STATIC_PB + "pokemonImages.json");
        return (await response.json()).pokemon;
    }

    static async getAllEnglishNamesPB() {
        const response = await fetch(API_STATIC_PB + "locales/en-US/constants.json");
        return (await response.json());
    }

    static formatPokemonText(text: string, constants: any) {
        return text.replace(/\$t\(constants:pokemon\.(\w+)\)/g, (_, key) => {
          return constants.pokemon[key] || key;
        });
      }

    static getPokemonNamePB(pokemonId: string, textList: any) {
        return pokemonId ? this.formatPokemonText(textList.pokemon[pokemonId], textList) : "???";
    }

    static getMoveNamePB(moveId: string, textList: any) {
        return textList.moves[moveId];
    }

    static getPokemonImageByID(pokemonId: string, pokemonList: any) {
        console.log(pokemonId, pokemonList)
        console.log(pokemonList[pokemonId].base)
        return pokemonList[pokemonId].base;
    }

    static getPokemonPBByID(pokemonId: string, pokemonList: any) {
        return (pokemonList).filter((pokemon: any) => pokemon.pokemonId === pokemonId);
    }

    static getPokemonPBByDexNum(num: number, pokemonList: any) {
        console.log((pokemonList).filter((pokemon: any) => pokemon.pokedex.pokemonNum === num))
        return (pokemonList).filter((pokemon: any) => pokemon.pokedex.pokemonNum === num);
    }

    static getPokemonPBByName(name: string, pokemonList: any) {
        return (pokemonList).filter((pokemon: any) => (pokemon.pokemonId).startsWith(name));
    }

    static async getAllMovesPB() {
        const response = await fetch(API_PB + "moves");
        return (await response.json()).move;
    }

    static getMovePBByID(moveId: string, moveList: any[]) {
        const move = moveList.find((move: any) => move.moveId === moveId);
        if (!move) {
          throw new Error(`Move with ID ${moveId} not found`);
        }
        return move;
    }

    static filterUniquePokemon(pokemonList: any[]) {
        const seenIds = new Set();
        return pokemonList.filter((pokemon: any) => {
          const pokemonId = pokemon.pokedex.pokemonId;
          if (pokemonId.startsWith(name) && !seenIds.has(pokemonId)) {
            seenIds.add(pokemonId);
            return true;
          }
          return false;
        });
      }

      static getPokemonPBBySpeciesName(name: string, pokemonList: any, textList: any) {
        console.log("getPokemonPBBySpeciesName ", name, pokemonList, textList);
        const list = pokemonList.filter((pokemon: any) => 
          this.getPokemonNamePB(pokemon.pokedex.pokemonId, textList).toLowerCase().startsWith(name.toLowerCase())
        );
        const lista = this.filterUniquePokemon(list);
        return lista;
      }

    static async getAllPokemonNames() {
        const response = await this.getAllPokemon();
        return response.map((pokemon: any) => ({id: pokemon.id, name: pokemon.names.English}));
    }

    static getName(key?: string, list?: any): string {
        if (key && list) {
            if (list.find((item: any) => item.id === key)) {
                return list.find((item: any) => item.id === key).name;
            } else {
                return key;
            }
        } else {
            return "???";
        }
    }

    static getKey(name?: string, list?: any): string {
        console.log(name, list)
        if (name && list) {
            if (list.find((item: any) => (item.name).toLowerCase() === name.toLowerCase())) {
                return list.find((item: any) => (item.name).toLowerCase() === name.toLowerCase()).id;
            } else {
                return name;
            }
        } else {
            return "???";
        }
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
        const defenderFirstType = this.formatTypeName(defendingPokemon.type);
        const defenderSecondType = defendingPokemon.type2 ? this.formatTypeName(defendingPokemon.type2) : null;

        
        const defenderFirstTypeWeaknesses = this.getTypeWeaknesses(defenderFirstType, types);
        const defenderSecondTypeWeaknesses = defenderSecondType ? this.getTypeWeaknesses(defenderSecondType, types) : {};
        const effectiveness = (defenderFirstTypeWeaknesses[this.formatTypeName(move.type)] ?? 1) * (defenderSecondTypeWeaknesses[this.formatTypeName(move.type)] ?? 1);
        
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
            Calculator.getEffectiveAttack(attackingPokemon.stats.baseAttack, attackerStats[1], attackerStats[0]), 
            Calculator.getEffectiveDefense(defendingPokemon.stats.baseDefense, defenderStats[2], defenderStats[0]),
            attackingPokemon.type == move.type || attackingPokemon?.type2 == move.type ? 1.2 : 1, 
            effectiveness,
            move.type,
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
            Calculator.getEffectiveAttack(attacker.stats.baseAttack, attackerStats[1] , attackerStats[0]), 
            Calculator.getEffectiveDefense(defender.stats.baseDefense, defenderStats[2], defenderStats[0]),
            attacker.type == move.type || attacker?.type2 == move.type ? 1.2 : 1, 
            effectiveness,
            move.type,
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
        let maxHealth = Calculator.getEffectiveStamina(defender.stats.baseStamina, defenderStats[3], defenderStats[0]);
        if (raidMode !== "normal") {
            maxHealth = this.getRaidHealth(raidMode);
        }
        console.log("Max health: ", maxHealth)
        while (damage <= maxHealth) {
            damage += this.getDamage(attacker, defender, quickMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
            time += quickMove.durationMs;
            energy += quickMove.energyDelta;
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
            if (energy >= -chargedMove.energyDelta) {
                const projectedDamageCharged = this.getDamage(attacker, defender, chargedMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
                const projectedDamageQuick = this.getDamage(attacker, defender, quickMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
                if ((damage + (projectedDamageQuick * chargedMove.durationMs / quickMove.durationMs) < maxHealth)) {
                    if ((projectedDamageCharged > (projectedDamageQuick * (Math.floor(chargedMove.durationMs / quickMove.durationMs))))) {
                        energy = energy + chargedMove.energyDelta <= 0 ? 0 : energy + chargedMove.energyDelta;
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

    static formatMoveName(moveName: string) {
        return moveName.replace("_FAST", "").replaceAll("_", " ").replaceAll("PLUS", "+").toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    static formatTypeName(typeName: string) {
        console.log(typeName);
        if (!typeName) return "???";
        const formattedType = typeName.replace("POKEMON_TYPE_", "").toLowerCase();
        return formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
      }
}