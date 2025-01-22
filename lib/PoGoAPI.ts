import { get } from "http";
import nextConfig from "../next.config";
import { Calculator } from "./calculations";

const API = nextConfig.API_URL;
const API_PB = nextConfig.API_PB_URL;
const API_STATIC_PB = nextConfig.API_STATIC_PB_URL;

export class PoGoAPI {
    static async getAllPokemon() {
        const response = await fetch(API + "pokedex.json", {
        });
        return await response.json();
    }

    static getVersion() {
        return "1.9.3";
    }
    
    static async getTypes () {
        const response = await fetch(API + "types.json");
        return await response.json();
    }

    static async getAllPokemonPB() {
        const response = await fetch(API_PB + "pokemon");
        return (await response.json()).pokemon;
    }
    
    static async getAllMovesPB() {
        const response = await fetch(API_PB + "moves");
        return (await response.json()).move;
    }

    static async getAllPokemonImagesPB() {
        const response = await fetch('/api/pokemonImages');
        return (await response.json()).pokemon;
    }

    static async getAllEnglishNamesPB() {
        const response = await fetch('/api/pokemonNames');;
        return (await response.json());
    }
    

    static formatPokemonText(text: string, constants: any): string {
        if (!text) return "Error";
    
        const placeholderRegex = /\$t\(constants:pokemon[:\.](\w+)\)/g;
    
        let previousText;
        do {
            previousText = text;
            text = text.replace(placeholderRegex, (_, key) => {
                return constants.pokemon[key] || key;
            });
        } while (text !== previousText); // Repite hasta que no haya más cambios
    
        return text;
    }

    static getPreferredMovesPB(pokemonId: string, megaPokemonId: string, pokemonList: any) {
        //console.log(pokemonId, megaPokemonId);
        const pokeData = this.getPokemonPBByID(pokemonId, pokemonList)[0];
        const pokeDataMega = this.getPokemonPBByID(megaPokemonId, pokemonList)[0];

        const quickMoves = Array.from(new Set((pokeDataMega?.quickMoves || []).concat(pokeData?.quickMoves || [])));
        const chargedMoves = Array.from(new Set((pokeDataMega?.cinematicMoves || []).concat(pokeData?.cinematicMoves || [])));
    
        return { preferredMovesQuick: quickMoves, preferredMovesCharged: chargedMoves };
    }

    static getPokemonNamePB(pokemonId: string, textList: any) {
        return pokemonId ? this.formatPokemonText(textList.pokemon[pokemonId], textList) : "???";
    }

    static getMoveNamePB(moveId: string, textList: any) {
        return textList.moves[moveId];
    }

    static getPokemonImageByID(pokemonId: string, pokemonList: any) {
        return pokemonList[pokemonId].base;
    }

    static getPokemonPBByID(pokemonId: string, pokemonList: any) {
        
        if (pokemonId === "HO_OH" || pokemonId === "HO-OH") {
            pokemonId = "HO_OH";
        }
        //console.log(pokemonId);
        return (pokemonList).filter((pokemon: any) => pokemon.pokemonId === pokemonId);
    }

    static getPokemonPBByDexNum(num: number, pokemonList: any) {
        return (pokemonList).filter((pokemon: any) => pokemon.pokedex.pokemonNum === num);
    }

    static getPokemonPBByName(name: string, pokemonList: any) {
        
        if (name === "HO_OH" || name === "HO-OH") {
            name = "HO_OH";
        }
        const list = (pokemonList).filter((pokemon: any) => (pokemon.pokemonId).startsWith(name));
        const origPokemon = this.getPokemonPBByID(name, pokemonList)[0];
        const listFiltered = list ? (list).filter((pokemon: any) => (pokemon?.pokedex?.pokemonId === origPokemon?.pokedex?.pokemonId) || (pokemon?.pokedex?.pokemonId === origPokemon?.pokedex?.pokemonId + "_MEGA")) : [];
        return listFiltered;
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
          if (!(pokemonId.endsWith("_MEGA") || pokemonId.endsWith("_MEGA_Y") || pokemonId.endsWith("_MEGA_X") ) && !seenIds.has(pokemonId)) {
            seenIds.add(pokemonId);
            return true;
          }
          return false;
        });
      }

    static getPokemonPBBySpeciesName(name: string, pokemonList: any, textList: any) {
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

    static getGigantamaxAttack(pokemonId: any, allMoves: any, maxMoveLevel: any) {
        const moveSuffix = maxMoveLevel === 1 ? "" : maxMoveLevel;
        switch (pokemonId) {
            case "CHARIZARD_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_WILDFIRE" + moveSuffix);
            case "BUTTERFREE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_BEFUDDLE" + moveSuffix);
            case "PIKACHU_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_VOLT_CRASH" + moveSuffix);
            case "MEOWTH_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_GOLD_RUSH" + moveSuffix);
            case "MACHAMP_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_CHI_STRIKE" + moveSuffix);
            case "GENGAR_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_TERROR" + moveSuffix);
            case "LAPRAS_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_RESONANCE" + moveSuffix);
            case "EEVEE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_CUDDLE" + moveSuffix);
            case "SNORLAX_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_REPLENISH" + moveSuffix);
            case "GARBODOR_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_MALODOR" + moveSuffix);
            case "DREDNAW_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_STONESURGE" + moveSuffix);
            case "CORVIKNIGHT_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_WIND_RAGE" + moveSuffix);
            case "TOXTRICITY_LOW_KEY_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_STUN_SHOCK" + moveSuffix);        
            case "TOXTRICITY_AMPED_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_STUN_SHOCK" + moveSuffix);
            case "TOXTRICITY_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_STUN_SHOCK" + moveSuffix);
            case "ALCREMIE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_FINALE" + moveSuffix);
            case "DURALUDON_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_DEPLETION" + moveSuffix);
            case "ORBEETLE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_GRAVITAS" + moveSuffix);
            case "COALOSSAL_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_VOLCALITH" + moveSuffix);
            case "SANDACONDA_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_SANDBLAST" + moveSuffix);
            case "GRIMMSNARL_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_SNOOZE" + moveSuffix);
            case "FLAPPLE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_TARTNESS" + moveSuffix);
            case "APPLETUN_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_SWEETNESS" + moveSuffix);
            case "HATTERENE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_SMITE" + moveSuffix);
            case "COPPERAJAH_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_STEELSURGE" + moveSuffix);
            case "MELMETAL_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_MELTDOWN" + moveSuffix);
            case "KINGLER_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_FOAM_BURST" + moveSuffix);
            case "CENTISKORCH_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_CENTIFERNO" + moveSuffix);
            case "CINDERACE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_FIREBALL" + moveSuffix);
            case "RILLABOOM_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_DRUM_SOLO" + moveSuffix);
            case "INTELEON_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_HYDRO_SNIPE" + moveSuffix);
            case "URSHIFU_SINGLESTRIKE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_ONE_BLOW" + moveSuffix);
            case "URSHIFU_RAPIDSTRIKE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_RAPID_FLOW" + moveSuffix);
            case "BLASTOISE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_CANNONADE" + moveSuffix);
            case "VENUSAUR_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_VINE_LASH" + moveSuffix);
            default:
                return null;
        }
    }

    static getDynamaxAttack(pokemonId: any, moveType: any, allMoves: any, maxMoveLevel: any) {
        
        console.log(pokemonId, moveType, allMoves, maxMoveLevel);
        if (pokemonId.endsWith("_GIGANTAMAX")) {
            return this.getGigantamaxAttack(pokemonId, allMoves, maxMoveLevel);
        } else {
            const move = allMoves.find((m: any) => {
                return m.type === moveType && m.moveId && m.moveId.startsWith("MAX_") && (m.moveId).endsWith(maxMoveLevel === 1 ? "" : maxMoveLevel.toString());
            });
            console.log(move)
            if (!move) {
                return null;
            } else {
                return move;
            }
        }
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

    static async getDamageAttackDynamax(attackingPokemon: any, defendingPokemon: any, move: any, attackerStats: any, defenderStats: any, bonusAttacker?: any, bonusDefender?: any, raidMode?: any, maxMoveLevel?: any) {
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
        )
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
        //console.log(types);
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

    static getDamageEnraged(attacker: any, defender: any, move: any, types: any, attackerStats: any, defenderStats: any, bonusAttacker?: any, bonusDefender?: any, raidMode?: any, attackEnraged?: boolean) {
        const raid = raidMode ? raidMode : "normal";
        if (raid !== "normal") {
            defenderStats = this.convertStats(defenderStats, raid);
        }
        //console.log(types);
        const effectiveness = this.getEfectiveness(defender, move, types);
        return Calculator.calculateDamage(
            move.power, 
            Calculator.getEffectiveAttack((attacker.stats.baseAttack * (attackEnraged ? 1.81 : 1)) , attackerStats[1] , attackerStats[0]), 
            Calculator.getEffectiveDefense((defender.stats.baseDefense * (attackEnraged ? 1 : 3)), defenderStats[2], defenderStats[0]),
            attacker.type == move.type || attacker?.type2 == move.type ? 1.2 : 1, 
            effectiveness,
            move.type,
            bonusAttacker,
            bonusDefender
        );
    }

    static convertStats(defenderStats: any, raidMode: any) {
        let convertedStats = [];
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
        } else if (raidMode === "raid-t1-dmax") {
            convertedStats = [8001, 15, 15, 1700];
        } else if (raidMode === "raid-t2-dmax") {
            convertedStats = [8002, 15, 15, 5000];
        } else if (raidMode === "raid-t3-dmax") {
            convertedStats = [8003, 15, 15, 10000];
        } else if (raidMode === "raid-t4-dmax") {
            convertedStats = [8004, 15, 15, 20000];
        } else if (raidMode === "raid-t5-dmax") {
            convertedStats = [8005, 15, 15, 60000];
        } else if (raidMode === "raid-t6-gmax") {
            convertedStats = [8006, 15, 15, 90000];
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

    static getDynamaxRaidDelays (raidMode: any) {
        if (raidMode === "raid-t1-dmax") {
            return [11000, 11000]
        } else if (raidMode === "raid-t2-dmax") {
            return [11000, 11000]
        } else if (raidMode === "raid-t3-dmax") {
            return [9000, 9000]
        } else if (raidMode === "raid-t4-dmax") {
            return [9000, 9000]
        } else if (raidMode === "raid-t5-dmax") {
            return [9000, 9000]
        } else if (raidMode === "raid-t6-gmax") {
            return [5000, 7000]
        } else {
            return [1000,1000]
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
        const types = await this.getTypes();
        let energy = 0;
        let time = 0;
        let damage = 0;
        let quickAttackUses = 0;
        let chargedAttackUses = 0;
        let turn = 0;
        let graphic = [];
        let maxHealth = Calculator.getEffectiveStamina(defender.stats.baseStamina, defenderStats[3], defenderStats[0]);
        if (raidMode !== "normal") {
            maxHealth = this.getRaidHealth(raidMode);
        }
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

    static simulateBreakpoints(attacker: any, defender: any, quickMove: any, chargedMove: any, attackerStats: any, defenderStats: any, raidMode: any, bonusAttacker: any, bonusDefender: any, types: any) {
        if (raidMode !== "normal") {
            defenderStats = this.convertStats(defenderStats, raidMode);
        }
        let energy = 0;
        let time = 0;
        let damage = 0;
        let quickAttackUses = 0;
        let chargedAttackUses = 0;
        let turn = 0;
        let graphic = [];
        let maxHealth = Calculator.getEffectiveStamina(defender.stats.baseStamina, defenderStats[3], defenderStats[0]);
        if (raidMode !== "normal") {
            maxHealth = this.getRaidHealth(raidMode);
        }
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

    static async advancedSimulation(
        attacker: any, 
        defender: any,
        quickMoveAttacker: any, 
        chargedMoveAttacker: any, 
        quickMoveDefender: any, 
        chargedMoveDefender: any, 
        attackerStats: any, 
        defenderStats: any,
        raidMode: any, 
        bonusAttacker: any, 
        bonusDefender: any, 
        teamCount: any,
        avoids?: any,
        relobbyTime?: any,
        enraged?: any,
        peopleCount?: any,
    ) {
        if (raidMode !== "normal") {
            defenderStats = this.convertStats(defenderStats, raidMode);
        }

        let time = 0;

        // Damage window start, will be -1 if the attacker is not casting a move
        let attackerDamageStart = -1;
        let defenderDamageStart = -1;


        let attackerEnergy = 0;
        let defenderEnergy = 0;
        let attackerHealth = Math.floor(Calculator.getEffectiveStamina(attacker.stats.baseStamina, attackerStats[3], attackerStats[0]));
        let defenderHealth = Calculator.getEffectiveStaminaForRaid(defender.stats.baseStamina, defenderStats[3], defenderStats[0], raidMode);
        
        let attackerFaints = 0;
        let attackerEvades = false;
        let attackerFaint = false;

        let attackerDamage = 0;
        let defenderDamage = 0;
        let tdo = 0;
        let attackerQuickAttackUses = 0;
        let defenderQuickAttackUses = 0;
        let attackerChargedAttackUses = 0;
        let defenderChargedAttackUses = 0;

        //console.log (quickMoveAttacker, chargedMoveAttacker, quickMoveDefender, chargedMoveDefender);

        let attackerMove = null;
        let defenderMove = null;
        
        let battleLog = []

        let firstDmgReduction = false;

        const types = await this.getTypes();

        let hasEnraged = false;
        let isEnraged = false;

        let purifiedGemsCount = 0;

        let purifiedGemsLimit = 5 * peopleCount;

        let purifiedGemCooldown = -1;
        
        let simGoing = true

        while (attackerDamage <= defenderHealth) {
            // Attacker can cast a move
            if (attackerDamageStart == -1) {
                attackerFaint = false;
                // Defender has casted a charged move, attacker may try to evade it
                if (avoids === true && defenderDamageStart != -1 && !attackerEvades && defenderMove != null) {
                    const projectedDamageDefender = Math.floor(0.25 * this.getDamage(defender, attacker, defenderMove, types, defenderStats, attackerStats, bonusDefender, bonusAttacker));
                
                    if (defenderMove.energyDelta < 0 && 
                        time < defenderDamageStart + defenderMove.damageWindowStartMs && 
                        (projectedDamageDefender + defenderDamage) < attackerHealth) {
                        // Attacker evades the move
                        //console.log("Attacker evades the next move!")
                        attackerEvades = true;
                        firstDmgReduction = true;

                        attackerDamageStart = -1001;
                        for (let i = 0 ; i < peopleCount ; i++) {
                            battleLog.push({"turn": (time + 500), "attacker": "attacker", "dodge": true});
                        }
                    }
                }
                
                // If the attacker is not evading, it can cast a move
                if (!firstDmgReduction) {
                    // Attacker can select its charged move
                    if (attackerEnergy >= -chargedMoveAttacker.energyDelta) {
                        //console.log("Attacker casts a charged move at time " + time);
                        attackerDamageStart = time - 1;
                        attackerMove = chargedMoveAttacker;
                        attackerEnergy += chargedMoveAttacker.energyDelta;
                        attackerChargedAttackUses++;
                    }
                    // Attacker will cast a quick move
                    else {
                        //console.log("Attacker casts a quick move at time " + time);
                        attackerDamageStart = time - 1;
                        attackerMove = quickMoveAttacker;
                        attackerEnergy += quickMoveAttacker.energyDelta;
                        if (attackerEnergy > 100) {
                            attackerEnergy = 100;
                        }
                        attackerQuickAttackUses++;
                    }

                    // Attacker has a purified gem and can use it
                    if (enraged && (purifiedGemsCount < purifiedGemsLimit) && isEnraged && purifiedGemCooldown == -1) {
                        for (let i = 0 ; i < peopleCount ; i++) {
                            purifiedGemsCount++;
                            battleLog.push({"turn": time, "attacker": "attacker", "purifiedgem": true});
                        }
                        purifiedGemCooldown = -5001;
                    }

                    // 8 Purified gems have been used, the defender subdues
                    if (enraged && purifiedGemsCount >= 8 && isEnraged) {
                        isEnraged = false;
                        //console.log("Defender subdues at time " + time);
                        battleLog.push({"turn": time, "attacker": "defender", "subdued": true});
                    }
                }
                firstDmgReduction = false;
            }
            // Attacker deals damage
            if (attackerMove !== null && attackerDamageStart > -1 && time === attackerDamageStart + attackerMove.damageWindowStartMs) 
            {
                for (let i = 0; i < peopleCount && simGoing; i++) {
                    const projectedDamage = (isEnraged ? 
                        this.getDamageEnraged(attacker, defender, attackerMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender, raidMode, false) : 
                        this.getDamage(attacker, defender, attackerMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender, raidMode)
                    )
                    
                    tdo += projectedDamage / peopleCount;
                    
                    attackerDamage += projectedDamage;
                    //console.log("Attacker deals " + projectedDamage + " damage with move " + attackerMove.moveId + " at time " + time);
                    defenderEnergy += Math.floor(projectedDamage / 2);
                    if (defenderEnergy > 100) {
                        defenderEnergy = 100;
                    }
                    battleLog.push({"turn": time, "attacker": "attacker", "move": attackerMove.moveId, "damage": projectedDamage, "energy": attackerEnergy, "stackedDamage": attackerDamage, "health": defenderHealth});
                    // End of simulation
                    if (attackerDamage >= defenderHealth) {
                        //console.log("Defender faints at time " + time + ", end of simulation.");
                        battleLog.push({"turn": time, "attacker": "defender", "relobby": false});
                        simGoing = false;
                        break;
                    }
                }

                // Defender is a shadow raid boss and reaches 60% of health, it will enrage
                if (simGoing && enraged && ((defenderHealth - attackerDamage) / defenderHealth) <= 0.6 && !hasEnraged) {
                    hasEnraged = true;
                    isEnraged = true;
                    defenderHealth = defenderHealth * 1.2;
                    //console.log("Defender enrages at time " + time);
                    battleLog.push({"turn": time, "attacker": "defender", "enraged": true});
                }

                // Defender reaches 15% of health, it subdues
                if (simGoing && enraged && ((defenderHealth - attackerDamage) / defenderHealth) <= 0.15 && isEnraged) {
                    isEnraged = false;
                    //console.log("Defender subdues at time " + time);
                    battleLog.push({"turn": time, "attacker": "defender", "subdued": true});
                }
            }
            // Attacker has finished casting its move
            if (simGoing && attackerMove != null && attackerDamageStart >= 0 && time >= attackerDamageStart + attackerMove.durationMs) {
                attackerDamageStart = -1;
                attackerMove = null;
                //console.log("Attacker has finished casting its move at time " + time);
            }
            
            // Defender can cast a move
            if (simGoing && defenderDamageStart == -1) {
                defenderDamageStart = time - 1;
                // Defender can select its charged move
                if (defenderEnergy >= -chargedMoveDefender.energyDelta) {
                    if (Math.random() > 0.5) {
                        //console.log("Defender casts a charged move at time " + time);
                        defenderMove = chargedMoveDefender;
                        defenderEnergy += chargedMoveDefender.energyDelta;
                        defenderChargedAttackUses++;
                    } else {
                        //console.log("Defender casts a quick move at time " + time);
                        defenderMove = quickMoveDefender;
                        defenderEnergy += quickMoveDefender.energyDelta;
                        if (defenderEnergy > 100) {
                            defenderEnergy = 100;
                        }
                        defenderQuickAttackUses++;
                    }
                }
                // Defender will cast a quick move
                else {
                    //console.log("Defender casts a quick move at time " + time);
                    defenderMove = quickMoveDefender;
                    defenderEnergy += quickMoveDefender.energyDelta;
                    if (defenderEnergy > 100) {
                        defenderEnergy = 100;
                    }
                    defenderQuickAttackUses++;
                }
            }
            // Defender deals damage
            if (simGoing && defenderDamageStart > -1 && 
                time === defenderDamageStart + defenderMove?.damageWindowStartMs) 
            {
                const projectedDamageDefender = (isEnraged ?
                    this.getDamageEnraged(defender, attacker, defenderMove, types, defenderStats, attackerStats, bonusDefender, bonusAttacker, raidMode, true) :
                    this.getDamage(defender, attacker, defenderMove, types, defenderStats, attackerStats, bonusDefender, bonusAttacker, raidMode)
                )
                const finalDamage = Math.floor(((attackerFaint) ? 0 : (attackerEvades ? 0.25 : 1)) * projectedDamageDefender);
                //console.log("Final damage: " + finalDamage);
                
                defenderDamage += finalDamage
                attackerEnergy += Math.floor(finalDamage / 2);
                for (let i = 0 ; i < peopleCount ; i++) {
                    
                    if (attackerEnergy > 100) {
                        attackerEnergy = 100;
                    }
                    if (defenderDamage != 0) {
                        battleLog.push({"turn": time, "attacker": "defender", "move": defenderMove.moveId, "damage": finalDamage, "energy": defenderEnergy, "stackedDamage": defenderDamage, "health": attackerHealth});
                    }
                }
                //console.log("Defender deals damage: " + (attackerFaint ? 0 : projectedDamageDefender + (attackerEvades ? " reduced x0.25" : "")) + " with move " + defenderMove.moveId + " at time " + time);
                
                attackerEvades = false;
                // Attacker faints
                if (defenderDamage >= attackerHealth) {
                    attackerEnergy = 0;
                    //console.log("Attacker faints at time " + time);
                    attackerFaints++;
                    defenderDamage = 0;
                    attackerFaint = true
                    // Attacker has a 1.5 second delay before the next attacker is sent.
                    // If the attacker faints teamCount times, the attacker will have a 10 second delay before the next attacker is sent.
                    if ((attackerFaints % teamCount) == 0) {
                        battleLog.push({"turn": time, "attacker": "attacker", "relobby": true, "tdo": tdo});
                        //console.log("Attacker has a 8 second delay before the next attacker is sent.");
                        attackerDamageStart = (relobbyTime * -1000) - 1;
                    } else {
                        battleLog.push({"turn": time, "attacker": "attacker", "relobby": false, "tdo": tdo});
                        attackerDamageStart = -1001;
                    }
                    tdo = 0;
                }
            }
            // Defender has finished casting its move
            if (simGoing && defenderMove !== null && time >= defenderDamageStart + defenderMove.durationMs) {
                defenderDamageStart = (Math.floor(Math.random() * 3) * -500) - 1501;
                defenderMove = null;

            }
            if (defenderDamageStart < -1) {
                defenderDamageStart++;
            }
            if (attackerDamageStart < -1) {
                attackerDamageStart++;
            }
            if (purifiedGemCooldown < -1) {
                purifiedGemCooldown++;
            }
            time++;
            if (!simGoing) {
                break;
            }
        }

        return {time, attackerQuickAttackUses, attackerChargedAttackUses, defenderQuickAttackUses, defenderChargedAttackUses, battleLog, attackerFaints, attackerDamage};
        

        // In a raid battle, the defender is the raid boss

        // A raid boss will attack each 1.5/2.5 seconds, chosen randomly

        // Raid Boss has an energy bar of 100, and will have a 50% chance of using a charged move when it has enough energy

        // Each attack has a damage window start and end time, which is the time in which the attack will deal damage

        // Each Pokemon will attack when the damage window is open, and will deal damage based on the damage window

        // damage window parameter on attacks are attack.damageWindowStartMs and attack.damageWindowEndMs

        // When the attacker faints, he will have a 1.5 second delay before the next attacker is sent

        // Both Pokémon will gain energy based on the energyDelta of the attack
        
        // Both Pokémon will gain 50% energy of the damage taken (1 energy per 2 damage taken)

    }

    

    static sumAllElements(arr: any[][]) {
        return arr.reduce((acc, val) => acc + val.reduce((acc2, val2) => acc2 + val2, 0), 0);
    }

    static everyoneFaints(attackerFaints: any[][]) {
        return attackerFaints.every((team) => team.every((pokemon) => pokemon === 1));
    }

    static async AdvancedSimulationDynamax(attackers: any[][], defender: any, attackersQuickMove: any[][], attackersCinematicMove: any[][], attackersStats: any[][][], defenderLargeAttack: any, defenderTargetAttack: any, raidMode: any, attackerMaxMoves: any[][]) {
        console.log(attackers, defender, attackersQuickMove, attackersCinematicMove, attackersStats, defenderLargeAttack, defenderTargetAttack, raidMode);
        
        let defenderStats = this.convertStats([40,15,15,15], raidMode);
        
        let attackerDamageStart = [-1, -1, -1, -1];
        let defenderDamageStart = -1;

        let attackerEnergy = [[0,0,0], [0,0,0], [0,0,0], [0,0,0]];
        let defenderEnergy = 100;
        let activePokemon = [0, 0, 0, 0];
        let attackerHealth = [[
            Calculator.getEffectiveStamina(attackers[0][0].stats.baseStamina, attackersStats[0][0][3], attackersStats[0][0][0]),
            Calculator.getEffectiveStamina(attackers[0][1].stats.baseStamina, attackersStats[0][1][3], attackersStats[0][1][0]),
            Calculator.getEffectiveStamina(attackers[0][2].stats.baseStamina, attackersStats[0][2][3], attackersStats[0][2][0])
        ], [
            Calculator.getEffectiveStamina(attackers[1][0].stats.baseStamina, attackersStats[1][0][3], attackersStats[1][0][0]),
            Calculator.getEffectiveStamina(attackers[1][1].stats.baseStamina, attackersStats[1][1][3], attackersStats[1][1][0]),
            Calculator.getEffectiveStamina(attackers[1][2].stats.baseStamina, attackersStats[1][2][3], attackersStats[1][2][0])
        ], [
            Calculator.getEffectiveStamina(attackers[2][0].stats.baseStamina, attackersStats[2][0][3], attackersStats[2][0][0]),
            Calculator.getEffectiveStamina(attackers[2][1].stats.baseStamina, attackersStats[2][1][3], attackersStats[2][1][0]),
            Calculator.getEffectiveStamina(attackers[2][2].stats.baseStamina, attackersStats[2][2][3], attackersStats[2][2][0])
        ], [
            Calculator.getEffectiveStamina(attackers[3][0].stats.baseStamina, attackersStats[3][0][3], attackersStats[3][0][0]),
            Calculator.getEffectiveStamina(attackers[3][1].stats.baseStamina, attackersStats[3][1][3], attackersStats[3][1][0]),
            Calculator.getEffectiveStamina(attackers[3][2].stats.baseStamina, attackersStats[3][2][3], attackersStats[3][2][0])
        ]];
        let defenderHealth = Calculator.getEffectiveStaminaForRaid(defender.stats.baseStamina, defender.stats.raidCP, defender.stats.raidBossCP, raidMode);
        let attackerFaints = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let attackerEvades = [false, false, false, false];
        let attackerFaint = [false, false, false, false];
        let attackerDamage = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let defenderDamage = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let tdo = [0, 0, 0, 0];
        let attackerQuickAttackUses = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let attackerChargedAttackUses = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let maxEnergy = 0;
        let maxEnergyGain = 0;
        let defenderLargeAttackUses = 0;
        let defenderTargetAttackUses = 0;
        let battleLog = [];
        let time = 0;
        let firstDmgReduction = false;
        let attackerMove: (typeof attackersQuickMove[0][0] | typeof attackersCinematicMove[0][0] | null)[] = [null, null, null, null];
        let defenderMove = null;
        let desperate = false;
        let simGoing = true;

        let targeted = false;
        let target = 0;
        

        const types = await this.getTypes();

        const dynamaxDelays = this.getDynamaxRaidDelays(raidMode);
        const delayLargeAttack = dynamaxDelays[0];
        const delayTargetAttack = dynamaxDelays[1];

        while (this.sumAllElements(attackerDamage) <= defenderHealth) {
            for (let i = 0 ; i < 4 ; i++) {
                // Actions of each attacker
                // Attacker i can cast a move
                if (attackerDamageStart[i] == -1 && activePokemon[i] < 3) {
                    // Attacker of member i may cast a move
                    if (attackerEnergy[i][activePokemon[i]] >= -attackersCinematicMove[i][activePokemon[i]].energyDelta) {
                        // Attacker of member i casts a charged move
                            attackerDamageStart[i] = time - 1;
                            attackerMove[i] = attackersCinematicMove[i][activePokemon[i]];
                            attackerEnergy[i][activePokemon[i]] += attackersCinematicMove[i][activePokemon[i]].energyDelta;
                            attackerChargedAttackUses[i][activePokemon[i]]++;
                        }
                        // Attacker of member i casts a quick move
                    else {
                        attackerDamageStart[i] = time - 1;
                        attackerMove[i] = attackersQuickMove[i][activePokemon[i]];
                        attackerEnergy[i][activePokemon[i]] += attackersQuickMove[i][activePokemon[i]].energyDelta;
                        if (attackerEnergy[i][activePokemon[i]] > 100) {
                            attackerEnergy[i][activePokemon[i]] = 100;
                        }
                        attackerQuickAttackUses[i][activePokemon[i]]++;
                    }    
                }
                // Attacker i deals damage
                if (attackerMove[i] !== null && attackerDamageStart[i] > -1 && time === attackerDamageStart[i] + attackerMove[i].damageWindowStartMs && activePokemon[i] < 3) {
                    const projectedDamage = this.getDamage(attackers[i][activePokemon[i]], defender, attackerMove[i], types, attackersStats[i][activePokemon[i]], defenderStats, ["EXTREME", false, false, 0], ["EXTREME", false, false, 0] , raidMode);
                    tdo[i] += projectedDamage;
                    attackerDamage[i][activePokemon[i]] += projectedDamage;
                    
                    maxEnergy += Calculator.getMaxEnergyGain(projectedDamage, defenderHealth);
                    if (maxEnergy > 100) {
                        maxEnergy = 100;
                    }
                    maxEnergyGain += maxEnergy;
                    battleLog.push({"turn": time,"attacker":"attacker", "attackerID": attackers[i][activePokemon[i]], "move": attackerMove[i].moveId, "damage": projectedDamage, "energy": attackerEnergy[i][activePokemon[i]], "stackedDamage": this.sumAllElements(attackerDamage), "health": defenderHealth});
                    // End of simulation
                    if (this.sumAllElements(attackerDamage) >= defenderHealth) {
                        battleLog.push({"turn": time, "attacker": "defender", "relobby": false});
                        simGoing = false;
                        break;
                    }
                }

                // Attacker i has finished casting its move
                if (activePokemon[i] < 3 && simGoing && attackerMove[i] != null && attackerDamageStart[i] >= 0 && time >= attackerDamageStart[i] + attackerMove[i].durationMs) {
                    attackerDamageStart[i] = -1;
                    attackerMove[i] = null;
                }
            }
            if (maxEnergyGain > 0 && simGoing) {
                battleLog.push({"turn": time, "attacker": "energy", "energy": maxEnergy});
                maxEnergyGain = 0;
            }
            if (maxEnergy >= 100) {
                maxEnergy = 0;
                attackerDamageStart = [-1001, -1001, -1001, -1001];
                // Dynamax phase starts
            }

            // Defender can cast a move
            if (simGoing && defenderDamageStart == -1) {
                defenderDamageStart = time - 1;
                // Defender can select its charged move
                if (Math.random() > defenderTargetAttack.power / (defenderLargeAttack.power + defenderTargetAttack.power)) {
                    defenderDamageStart = time - 1;
                    defenderMove = defenderLargeAttack;
                    defenderLargeAttackUses++;

                    targeted = false;
                } else {
                    defenderDamageStart = time - 1;
                    defenderMove = defenderTargetAttack;
                    defenderTargetAttackUses++;

                    targeted = true;
                    target = Math.floor(Math.random() * 4); // Needs tweaks
                }
            }

            // Defender deals damage
            if (simGoing && defenderDamageStart > -1 && time === defenderDamageStart + defenderMove.durationMs) {
                
                if (targeted) {
                    if (activePokemon[target] < 3) {
                        const projectedDamageDefender = 2 * this.getDamage(defender, attackers[target][activePokemon[target]], defenderMove, types, defenderStats, attackersStats[target][activePokemon[target]], ["EXTREME", false, false, 0], ["EXTREME", false, false, 0], raidMode);
                        const finalDamage = Math.floor(projectedDamageDefender);
                        defenderDamage[target][activePokemon[target]] += finalDamage;
                        attackerEnergy[target][activePokemon[target]] += Math.floor(finalDamage / 2);
                        battleLog.push({"turn": time, "attacker": "defender", "move": defenderMove.moveId, "damage": finalDamage, "energy": defenderEnergy, "stackedDamage": defenderDamage[target][activePokemon[target]], "health": attackerHealth[target][activePokemon[target]]});
                    
                    }
                } else {
                    for (let i = 0 ; i < 4 ; i++) {
                        if (activePokemon[i] < 3) {
                            const projectedDamageDefender = this.getDamage(defender, attackers[i][activePokemon[i]], defenderMove, types, defenderStats, attackersStats[i][activePokemon[i]], ["EXTREME", false, false, 0], ["EXTREME", false, false, 0], raidMode);
                            const finalDamage = Math.floor(projectedDamageDefender);
                            defenderDamage[i][activePokemon[i]] += finalDamage;
                            attackerEnergy[i][activePokemon[i]] += Math.floor(finalDamage / 2);
                            battleLog.push({"turn": time, "attacker": "defender", "move": defenderMove.moveId, "damage": finalDamage, "energy": defenderEnergy, "stackedDamage": defenderDamage[i][activePokemon[i]], "health": attackerHealth[i][activePokemon[i]]});
                        }
                    }
                }
                // Attacker faints
                for (let i = 0 ; i < 4 ; i++) {
                    if (defenderDamage[i][activePokemon[i]] >= attackerHealth[i][activePokemon[i]]) {
                        attackerEnergy[i][activePokemon[i]] = 0;
                        attackerFaints[i][activePokemon[i]]++;
                        defenderDamage[i][activePokemon[i]] = 0;
                        attackerFaint[i] = true;
                        battleLog.push({"turn": time, "attacker": "attacker", "relobby": false, "tdo": tdo[i]});
                        activePokemon[i]++;
                        attackerDamageStart[i] = -1001;
                        tdo[i] = 0;
                    }
                }
            }

            // Defender has finished casting its move
            if (simGoing && defenderMove !== null && time >= defenderDamageStart + defenderMove.durationMs) {
                defenderDamageStart = -this.getDynamaxRaidDelays(raidMode)[targeted ? 1 : 0] - 1;
                defenderMove = null;
            }

            for (let i = 0 ; i < 4 ; i++) {
                if (attackerDamageStart[i] < -1) {
                    attackerDamageStart[i]++;
                }
            }

            if (defenderDamageStart < -1) {
                defenderDamageStart++;
            }

            if (this.everyoneFaints(attackerFaints)) {
                simGoing = false;
            }

            time++;
            if (!simGoing) {
                break;
            }

            
        }
        console.log("Simulation was done! " + time);
        console.log(attackerDamage);
        return {time, attackerQuickAttackUses, attackerChargedAttackUses, defenderLargeAttackUses, defenderTargetAttackUses, battleLog, attackerFaints, attackerDamage};
            

        // attackers is an array where the first index is the member, and the second index is the pokemon

        // Each member has a team of 3 pokémon, and each pokémon has a quick move and a charged move

        // Only one pokemon from each member is attacking at a time, which is considered the "active" pokémon

        // There is a bar of energy that is shared between all members.

        // The energy bar will be filled with any attack that is casted by the members.

        // Once the energy bar reaches 100, dynamax phase will occur

        // Dynamax phase will last 3 turns, and the energy bar will be reset to 0

        // Dynamax phase doesnt contribute to time.

        // During dynamax phase, each member may cast a max attack, max shield or max heal if they have them available

        // Defender will attack each window of time, given by its raid mode

        // A member may dodge a targeted attack, reducing the damage by 50%

        // A large attack will deal damage to all active pokémon

        // A targeted attack will deal damage to one pokémon, selected by random, or the last one to set up shields.

        // 
    }

    static formatMoveName(moveName: string) {
        return moveName.replace("_FAST", "").replaceAll("_", " ").replaceAll("PLUS", "+").toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ").replace("2", "").replace("3", "");
    }

    static formatTypeName(typeName: string) {
        if (!typeName) return "???";
        const formattedType = typeName.replace("POKEMON_TYPE_", "").toLowerCase();
        return formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
      }
}