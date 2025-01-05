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

    static async getAllPokemonPB() {
        const response = await fetch(API_PB + "pokemon");
        return (await response.json()).pokemon;
    }

    static async getAllPokemonImagesPB() {
        const response = await fetch('/api/pokemonImages');
        return (await response.json()).pokemon;
    }

    static async getAllEnglishNamesPB() {
        const response = await fetch('/api/pokemonNames');;
        return (await response.json());
    }

    static formatPokemonText(text: string, constants: any) {
        return (text ? text.replaceAll(/\$t\(constants:pokemon\:(\w+)\)/g, (_, key) => {
            return constants.pokemon[key] || key;
          }).replaceAll(/\$t\(constants:pokemon\.(\w+)\)/g, (_, key) => {
            return constants.pokemon[key] || key;
          }) : "Error");
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
        return (pokemonList).filter((pokemon: any) => pokemon.pokemonId === pokemonId);
    }

    static getPokemonPBByDexNum(num: number, pokemonList: any) {
        return (pokemonList).filter((pokemon: any) => pokemon.pokedex.pokemonNum === num);
    }

    static getPokemonPBByName(name: string, pokemonList: any) {
        const list = (pokemonList).filter((pokemon: any) => (pokemon.pokemonId).startsWith(name));
        const origPokemon = this.getPokemonPBByID(name, pokemonList)[0];
        const listFiltered = list ? (list).filter((pokemon: any) => (pokemon?.pokedex?.pokemonId === origPokemon?.pokedex?.pokemonId) || (pokemon?.pokedex?.pokemonId === origPokemon?.pokedex?.pokemonId + "_MEGA")) : [];
        return listFiltered;
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
        oneMember: any,
        avoids?: any,
        ignoreRelobbyTime?: any
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

        console.log (quickMoveAttacker, chargedMoveAttacker, quickMoveDefender, chargedMoveDefender);

        let attackerMove = null;
        let defenderMove = null;
        
        let battleLog = []

        let firstDmgReduction = false;

        const types = await this.getTypes();

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
                        console.log("Attacker evades the next move!")
                        attackerEvades = true;
                        firstDmgReduction = true;

                        attackerDamageStart = -501;
                        battleLog.push({"turn": (time + 500), "attacker": "attacker", "dodge": true});
                    }
                }
                
                // If the attacker is not evading, it can cast a move
                if (!firstDmgReduction) {
                    // Attacker can select its charged move
                    if (attackerEnergy >= -chargedMoveAttacker.energyDelta) {
                        console.log("Attacker casts a charged move at time " + time);
                        attackerDamageStart = time;
                        attackerMove = chargedMoveAttacker;
                        attackerEnergy += chargedMoveAttacker.energyDelta;
                        attackerChargedAttackUses++;
                    }
                    // Attacker will cast a quick move
                    else {
                        console.log("Attacker casts a quick move at time " + time);
                        attackerDamageStart = time;
                        attackerMove = quickMoveAttacker;
                        attackerEnergy += quickMoveAttacker.energyDelta;
                        if (attackerEnergy > 100) {
                            attackerEnergy = 100;
                        }
                        attackerQuickAttackUses++;
                    }
                }
                firstDmgReduction = false;
            }
            // Attacker deals damage
            if (attackerMove !== null && attackerDamageStart > -1 && time === attackerDamageStart + attackerMove.damageWindowStartMs) 
            {
                const projectedDamage = this.getDamage(attacker, defender, attackerMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender);
                attackerDamage += projectedDamage;
                tdo += projectedDamage;
                console.log("Attacker deals " + projectedDamage + " damage with move " + attackerMove.moveId + " at time " + time);
                defenderEnergy += Math.floor(projectedDamage / 2);
                if (defenderEnergy > 100) {
                    defenderEnergy = 100;
                }
                battleLog.push({"turn": time, "attacker": "attacker", "move": attackerMove.moveId, "damage": projectedDamage, "energy": attackerEnergy, "stackedDamage": attackerDamage, "health": defenderHealth});
                // End of simulation
                if (attackerDamage >= defenderHealth) {
                    console.log("Defender faints at time " + time + ", end of simulation.");
                    battleLog.push({"turn": time, "attacker": "defender", "relobby": false});
                    break;
                }
            }
            // Attacker has finished casting its move
            if (attackerMove != null && attackerDamageStart >= 0 && time >= attackerDamageStart + attackerMove.durationMs) {
                attackerDamageStart = -1;
                attackerMove = null;
                console.log("Attacker has finished casting its move at time " + time);
            }
            
            // Defender can cast a move
            if (defenderDamageStart == -1) {
                defenderDamageStart = time;
                // Defender can select its charged move
                if (defenderEnergy >= -chargedMoveDefender.energyDelta) {
                    if (Math.random() > 0.5) {
                        console.log("Defender casts a charged move at time " + time);
                        defenderMove = chargedMoveDefender;
                        defenderEnergy += chargedMoveDefender.energyDelta;
                        defenderChargedAttackUses++;
                    } else {
                        console.log("Defender casts a quick move at time " + time);
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
                    console.log("Defender casts a quick move at time " + time);
                    defenderMove = quickMoveDefender;
                    defenderEnergy += quickMoveDefender.energyDelta;
                    if (defenderEnergy > 100) {
                        defenderEnergy = 100;
                    }
                    defenderQuickAttackUses++;
                }
            }
            // Defender deals damage
            if (defenderDamageStart > -1 && 
                time === defenderDamageStart + defenderMove?.damageWindowStartMs) 
            {
                const projectedDamageDefender = this.getDamage(defender, attacker, defenderMove, types, defenderStats, attackerStats, bonusDefender, bonusAttacker);
                const finalDamage = Math.floor(((attackerFaint) ? 0 : (attackerEvades ? 0.25 : 1)) * projectedDamageDefender);
                console.log("Final damage: " + finalDamage);
                defenderDamage += finalDamage
                attackerEnergy += (finalDamage/2)
                if (attackerEnergy > 100) {
                    attackerEnergy = 100;
                }
                if (defenderDamage != 0) {
                    battleLog.push({"turn": time, "attacker": "defender", "move": defenderMove.moveId, "damage": finalDamage, "energy": defenderEnergy, "stackedDamage": defenderDamage, "health": attackerHealth});
                }
                console.log("Defender deals damage: " + (attackerFaint ? 0 : projectedDamageDefender + (attackerEvades ? " reduced x0.25" : "")) + " with move " + defenderMove.moveId + " at time " + time);
                
                attackerEvades = false;
                // Attacker faints
                if (defenderDamage >= attackerHealth) {
                    attackerEnergy = 0;
                    console.log("Attacker faints at time " + time);
                    attackerFaints++;
                    defenderDamage = 0;
                    attackerFaint = true
                    // Attacker has a 1.5 second delay before the next attacker is sent.
                    // If the attacker faints 6 times, the attacker will have a 10 second delay before the next attacker is sent.
                    if (oneMember ? true : (attackerFaints % 6) == 0) {
                        battleLog.push({"turn": time, "attacker": "attacker", "relobby": true, "tdo": tdo});
                        //console.log("Attacker has a 8 second delay before the next attacker is sent.");
                        attackerDamageStart = ignoreRelobbyTime ? -1001 : -8001;
                    } else {
                        battleLog.push({"turn": time, "attacker": "attacker", "relobby": false, "tdo": tdo});
                        attackerDamageStart = -1001;
                    }
                    tdo = 0;
                }
            }
            // Defender has finished casting its move
            if (defenderMove !== null && time >= defenderDamageStart + defenderMove.durationMs) {
                defenderDamageStart = (Math.floor(Math.random() * 3) * -500) - 1501;
                defenderMove = null;

            }
            if (defenderDamageStart < -1) {
                defenderDamageStart++;
            }
            if (attackerDamageStart < -1) {
                attackerDamageStart++;
            }
            time++;
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

    static formatMoveName(moveName: string) {
        return moveName.replace("_FAST", "").replaceAll("_", " ").replaceAll("PLUS", "+").toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    static formatTypeName(typeName: string) {
        if (!typeName) return "???";
        const formattedType = typeName.replace("POKEMON_TYPE_", "").toLowerCase();
        return formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
      }
}