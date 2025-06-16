
import nextConfig from "../next.config";
import { Calculator } from "./calculations";

const API = nextConfig.API_URL;
const API_PB = nextConfig.API_PB_URL;

export class PoGoAPI {
    
    static getVersion() {
        return "1.22.0.1";
    }

    static async getAllPokemon() {
        const response = await fetch(API + "pokedex.json", {
        });
        return await response.json();
    }
    
    static async getTypes () {
        const response = await fetch(API + "types.json");
        return await response.json();
    }

    static async getAllPokemonPB() {
        const response = await fetch(API_PB + "pokemon");
        return (await response.json()).pokemon;
    }

    static async getAvailableMaxPokemonPB() {
        const response = await fetch(API_PB + "raids");
        // return (await response.json()).dynamaxPokemon;
        return Calculator.DynamaxPokemon;
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

    static formatMoveText(text: string, constants: any): string {
        if (!text) return "Error";
    
        const placeholderRegex = /\$t\(constants:moves[:\.](\w+)\)/g;
    
        let previousText;
        do {
            previousText = text;
            text = text.replace(placeholderRegex, (_, key) => {
                return constants.moves[key] || key;
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
        return this.formatMoveText(textList.moves[moveId], textList);
    }

    static getPokemonImageByID(pokemonId: string, pokemonList: any) {
        return pokemonList[pokemonId].base;
    }

    static getPokemonPBByID(pokemonId: string, pokemonList: any) {
    if (pokemonId === "HO_OH" || pokemonId === "HO-OH") {
        pokemonId = "HO_OH";
    }
    let pokemon = (pokemonList).filter((pokemon: any) => pokemon.pokemonId === pokemonId);
    if (pokemon.length > 0 && pokemon[0].pokemonId === "ZACIAN_CROWNED_SWORD_FORM") {
        pokemon[0].quickMoves = ["METAL_CLAW_FAST", "AIR_SLASH_FAST"];
        pokemon[0].cinematicMoves = ["PLAY_ROUGH", "CLOSE_COMBAT", "GIGA_IMPACT", "BEHEMOTH_BLADE"];
    } else if (pokemon.length > 0 && pokemon[0].pokemonId === "ZAMAZENTA_CROWNED_SHIELD_FORM") {
        pokemon[0].quickMoves = ["METAL_CLAW_FAST", "ICE_FANG_FAST"];
        pokemon[0].cinematicMoves = ["MOONBLAST", "CLOSE_COMBAT", "GIGA_IMPACT", "BEHEMOTH_BASH"];
    }
    return pokemon;
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
        if (moveId === "BEHEMOTH_BLADE") {
            move.power = 200;
            move.energyDelta = -100;
        } else if (moveId === "BEHEMOTH_BASH") {
            move.power = 125;
            move.energyDelta = -50;
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
                return allMoves.find((m: any) => m.moveId === "GMAX_HYDROSNIPE" + moveSuffix);
            case "URSHIFU_SINGLE_STRIKE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_ONE_BLOW" + moveSuffix);
            case "URSHIFU_RAPID_STRIKE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_RAPID_FLOW" + moveSuffix);
            case "BLASTOISE_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_CANNONADE" + moveSuffix);
            case "VENUSAUR_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "GMAX_VINE_LASH" + moveSuffix);
            case "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "MAX_BEHEMOTH_BASH" + moveSuffix);
            case "ZACIAN_CROWNED_SWORD_GIGANTAMAX":
                return allMoves.find((m: any) => m.moveId === "MAX_BEHEMOTH_BLADE" + moveSuffix);
            default:
                return null;
        }
    }

    static getDynamaxAttack(pokemonId: any, moveType: any, allMoves: any, maxMoveLevel: any, moveSelected: any = null) {
        //console.log(pokemonId);
        if (pokemonId.endsWith("_GIGANTAMAX")) {
            return this.getGigantamaxAttack(pokemonId, allMoves, maxMoveLevel);
        } else if (pokemonId == "ZACIAN_CROWNED_SWORD_FORM") {
            // Special case for Zacian's Max Behemoth Blade
            const max = maxMoveLevel === 1 ? "" : maxMoveLevel;
            let move = allMoves.find((m: any) => m.moveId === "MAX_BEHEMOTH_BLADE" );
            move.power = maxMoveLevel === 1 ? 250 : maxMoveLevel === 2 ? 300 : 350;
            return move;
        } else if (pokemonId == "ZAMAZENTA_CROWNED_SHIELD_FORM") {
            // Special case for Zamazenta's Max Behemoth Bash
            const max = maxMoveLevel === 1 ? "" : maxMoveLevel;
            let move = allMoves.find((m: any) => m.moveId === "MAX_BEHEMOTH_BASH" );
            move.power = maxMoveLevel === 1 ? 250 : maxMoveLevel === 2 ? 300 : 350;
            return move;
        } else {
            if (moveSelected?.moveId.startsWith("HIDDEN_POWER_")) {
                return allMoves.find((m: any) => m.moveId === "MAX_STRIKE" + (maxMoveLevel === 1 ? "" : maxMoveLevel.toString()));
            }
            const move = allMoves.find((m: any) => {
                return m.type === moveType && m.moveId && m.moveId.startsWith("MAX_") && (m.moveId).endsWith(maxMoveLevel === 1 ? "" : maxMoveLevel.toString());
            });
            if (!move) {
                return null;
            } else {
                return move;
            }
        }
    }

    static getTypeComboWeaknesses(allTypes: any[], type1: any, type2?: any) {
        const type1Weaknesses = this.getTypeWeaknesses(type1, allTypes);
        let type2Weaknesses: { [key: string]: number } = {};
    
        if (type2) {
            type2Weaknesses = this.getTypeWeaknesses(type2, allTypes);
        }
    
        const combinedWeaknesses: { [key: string]: number } = {};
    
        for (const type in type1Weaknesses) {
            combinedWeaknesses[type] = type1Weaknesses[type];
        }
    
        for (const type in type2Weaknesses) {
            if (combinedWeaknesses[type]) {
                combinedWeaknesses[type] *= type2Weaknesses[type];
            } else {
                combinedWeaknesses[type] = type2Weaknesses[type];
            }
        }
    
        return combinedWeaknesses;
    }

    static hasDoubleWeaknesses(type1: string, type2: string, allTypes: any[]) {
        let t1 = this.formatTypeName(type1);
        let t2 = type2 ? this.formatTypeName(type2) : null;
        const weaknesses = this.getTypeComboWeaknesses(allTypes, t1, t2);
    
        for (const type in weaknesses) {
            if (weaknesses[type] > 1.6) {
                return true;
            }
        }
    
        return false;
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
                weaknesses[t.type] = 0.625;
            } else if (objType.noDamageFrom.includes(t.type)) {
                weaknesses[t.type] = 0.390625;
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

    static async getDamageAttackDynamax(attackingPokemon: any, defendingPokemon: any, move: any, attackerStats: any, defenderStats: any, bonusAttacker?: any, bonusDefender?: any, raidMode?: any, maxMoveLevel?: any, additionalBonus?: any) {
        const raid = raidMode ? raidMode : "normal";
        if (raid !== "normal") {
            defenderStats = this.convertStats(defenderStats, raid, defendingPokemon.pokemonId);
            bonusDefender = [bonusDefender[0], false, false, 0];
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
            additionalBonus ? additionalBonus : 1,
            bonusAttacker,
            bonusDefender,
        )
    }

    static async getDamageAttack(attackingPokemon: any, defendingPokemon: any, move: any, attackerStats: any, defenderStats: any, bonusAttacker?: any, bonusDefender?: any, raidMode?: any, additionalBonus?: any) {
        const raid = raidMode ? raidMode : "normal";
        if (raid !== "normal") {
            defenderStats = this.convertStats(defenderStats, raid, defendingPokemon.pokemonId);
            bonusDefender = [bonusDefender[0], false, false, 0];
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
            (additionalBonus ? additionalBonus : 1),
            bonusAttacker,
            bonusDefender,
        );
    }
    
    static getDamage(
        attacker: any, 
        defender: any, 
        move: any, 
        types: any, 
        attackerStats: any, 
        defenderStats: any, 
        bonusAttacker?: any, 
        bonusDefender?: any, 
        raidMode?: any,
        shroomBonus?: any,
        damageMultiplier?: any,
        attackBonus?: any
    ) {
        const raid = raidMode ? raidMode : "normal";
        if (raid !== "normal") {
            defenderStats = this.convertStats(defenderStats, raid, defender.pokemonId);
            bonusDefender = [bonusDefender[0], false, false, 0];
        }
        //console.log(attacker.pokemonId + " " + defender.pokemonId + " " + move.moveId + " " + types + " " + attackerStats + " " + defenderStats + " " + bonusAttacker + " " + bonusDefender + " " + raidMode + " " + shroomBonus + " " + damageMultiplier);
        const effectiveness = this.getEfectiveness(defender, move, types);
        return Calculator.calculateDamage(
            move.power, 
            Calculator.getEffectiveAttack(attacker.stats.baseAttack, attackerStats[1] , attackerStats[0]), 
            Calculator.getEffectiveDefense(defender.stats.baseDefense, defenderStats[2], defenderStats[0]),
            attacker.type == move.type || attacker?.type2 == move.type ? 1.2 : 1, 
            effectiveness,
            move.type,
            ((shroomBonus || shroomBonus !== 0) ? shroomBonus : damageMultiplier ? damageMultiplier : 1),
            bonusAttacker,
            bonusDefender
        );
    }

    static getDamageEnraged(attacker: any, defender: any, move: any, types: any, attackerStats: any, defenderStats: any, bonusAttacker?: any, bonusDefender?: any, raidMode?: any, attackEnraged?: boolean, damageMultiplier?: any) {
        const raid = raidMode ? raidMode : "normal";
        if (raid !== "normal") {
            defenderStats = this.convertStats(defenderStats, raid);
            bonusDefender = [bonusDefender[0], false, false, 0];
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
            ((damageMultiplier || damageMultiplier !== 0) ? damageMultiplier : 1),
            bonusAttacker,
            bonusDefender
        );
    }

    static convertStats(defenderStats: any, raidMode: any, defenderId?: any) {
        // Mapas para valores fijos
        const baseStats: Record<string, number[]> = {
            "raid-t1": [5001, 15, 15, 600],
            "raid-t3": [5003, 15, 15, 3600],
            "raid-t4": [5005, 15, 15, 9000],
            "raid-mega": [5005, 15, 15, 9000],
            "raid-t5": [5005, 15, 15, 15000],
            "raid-elite": [5005, 15, 15, 20000],
            "raid-primal": [5005, 15, 15, 22500],
            "raid-mega-leg": [5005, 15, 15, 22500],
            "raid-t1-dmax": [8001, 15, 15, 1700],
            "raid-t2-dmax": [8002, 15, 15, 5000],
            "raid-t3-dmax": [8003, 15, 15, 10000],
            "raid-t4-dmax": [8004, 15, 15, 20000],
            "raid-t1-shadow": [6001, 15, 15, 600],
            "raid-t3-shadow": [6003, 15, 15, 3600],
            "raid-t5-shadow": [6005, 15, 15, 15000],
        };

        const t5dmaxStats: Record<string, number[]> = {
            RAIKOU: [8005243, 15, 15, 20000],
            ENTEI: [8005244, 15, 15, 26500],
            SUICUNE: [8005245, 15, 15, 22000],
            ARTICUNO: [8005144, 15, 15, 17500],
            MOLTRES: [8005144, 15, 15, 17500],
            ZAPDOS: [8005144, 15, 15, 13000],
        };

        const t6gmaxStats: Record<string, number[]> = {
            VENUSAUR_GIGANTAMAX: [8006003, 15, 15, 90000],
            CHARIZARD_GIGANTAMAX: [8006003, 15, 15, 90000],
            BLASTOISE_GIGANTAMAX: [8006003, 15, 15, 90000],
            GENGAR_GIGANTAMAX: [8006, 15, 15, 90000],
            LAPRAS_GIGANTAMAX: [8006, 15, 15, 90000],
            MACHAMP_GIGANTAMAX: [8006068, 15, 15, 115000],
            SNORLAX_GIGANTAMAX: [8006, 15, 15, 115000],
            KINGLER_GIGANTAMAX: [8006, 15, 15, 115000],
            TOXTRICITY_AMPED_GIGANTAMAX: [8006, 15, 15, 180000],
            TOXTRICITY_LOW_KEY_GIGANTAMAX: [8006, 15, 15, 180000],
            TOXTRICITY_GIGANTAMAX: [8006, 15, 15, 180000],
            RILLABOOM_GIGANTAMAX: [8005245, 15, 15, 120000],
            INTELEON_GIGANTAMAX: [8006818, 15, 15, 100000],
            CINDERACE_GIGANTAMAX: [8006068, 15, 15, 80000],
        };

        // DMAX Tier 5
        if (raidMode === "raid-t5-dmax") {
            if (defenderId && t5dmaxStats[defenderId]) {
                return t5dmaxStats[defenderId];
            }
            // Default for t5-dmax
            return [8005, 15, 15, defenderId ? 20000 : 22500];
        }

        // GMAX Tier 6
        if (raidMode === "raid-t6-gmax") {
            if (defenderId && t6gmaxStats[defenderId]) {
                return t6gmaxStats[defenderId];
            }
            // Default for t6-gmax
            return [8006, 15, 15, 115000];
        }

        // Otros modos con valores fijos
        if (baseStats[raidMode]) {
            return baseStats[raidMode];
        }

        // Por defecto, devuelve los stats originales
        return defenderStats;
    }

    static getRaidHealth (raidMode: any) {
        if (raidMode === "raid-t1" || raidMode === "raid-t1-shadow") {
            return 600;
        } else if (raidMode === "raid-t3" || raidMode === "raid-t3-shadow") {
            return 3600;
        } else if (raidMode === "raid-t4" || raidMode === "raid-mega") {
            return 9000;
        } else if (raidMode === "raid-t5" || raidMode === "raid-t5-shadow") {
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
            return [3000, 5000]
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
        enraged: boolean = raidMode.endsWith("shadow"),
        peopleCount?: any,
        partyPower?: any
    ) {
        if (raidMode !== "normal") {
            defenderStats = this.convertStats(defenderStats, raidMode);
        }
        let partyPowerCounter = 0;
        let partyPowerLimit = (partyPower ? (peopleCount === 2 ? 18 : (peopleCount === 3 ? 9 : (peopleCount > 3 ? 6 : -1))) : -1);
        let partyPowerActivated = false;

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

        let multiplier = 1;

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

                    // Attacker can activate its Party Power´
                    if (partyPowerCounter === partyPowerLimit && !partyPowerActivated) {
                        partyPowerActivated = true;
                        partyPowerCounter = 0;
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
                if (attackerMove.energyDelta < 0 && partyPowerActivated) {
                    partyPowerActivated = false;
                    multiplier = 2;
                } else if (attackerMove.energyDelta >= 0 && partyPowerCounter < partyPowerLimit) {
                    partyPowerCounter++;
                }

                for (let i = 0; i < peopleCount && simGoing; i++) {
                    
                    const projectedDamage = (isEnraged ? 
                        this.getDamageEnraged(attacker, defender, attackerMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender, raidMode, false, multiplier) : 
                        this.getDamage(attacker, defender, attackerMove, types, attackerStats, defenderStats, bonusAttacker, bonusDefender, raidMode, 0, multiplier)
                    )
                    tdo += projectedDamage / peopleCount;
                    
                    attackerDamage += projectedDamage;
                    //console.log("Attacker deals " + projectedDamage + " damage with move " + attackerMove.moveId + " at time " + time);
                    defenderEnergy += Math.floor(projectedDamage / 2);
                    if (defenderEnergy > 100) {
                        defenderEnergy = 100;
                    }
                    battleLog.push({"turn": time, "attacker": "attacker", "move": attackerMove.moveId, "damage": projectedDamage, "energy": attackerEnergy, "stackedDamage": attackerDamage, "health": defenderHealth, "partypower": (multiplier == 2)});
                    // End of simulation
                    if (attackerDamage >= defenderHealth) {
                        //console.log("Defender faints at time " + time + ", end of simulation.");
                        battleLog.push({"turn": time, "attacker": "defender", "relobby": false});
                        simGoing = false;
                        break;
                    }
                }
                
                multiplier = 1;

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
                    this.getDamageEnraged(defender, attacker, defenderMove, types, defenderStats, attackerStats, bonusDefender, bonusAttacker, "normal", true) :
                    this.getDamage(defender, attacker, defenderMove, types, defenderStats, attackerStats, bonusDefender, bonusAttacker, "normal")
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
        return attackerFaints.every((team) => team.every((pokemon) => pokemon === true));
    }

    static getDamageMultiplier(raidMode: any, enraged?: boolean, desperate?: boolean, defender?: any) {
        if (desperate) {
            return 4;
        } if (raidMode === "raid-t5-dmax") {
          return 2;
        } if (raidMode === "raid-t6-gmax") {
            if (defender.pokemonId === "TOXTRICITY_AMPED_GIGANTAMAX" || defender.pokemonId === "TOXTRICITY_LOW_KEY_GIGANTAMAX") {
                return 1.333;
            } else {
                return 1;
            }
        }
        return 1;
    }

    static getDefenseMultiplier(raidMode: any) {
        if (raidMode === "raid-t6-gmax") {
            return (1);
        } else {
            return 1;
        }
    }

    static getHigherElement(arr: any[]) {
        return arr.reduce((acc, val) => Math.max(acc, val), 0);
    }

    static getHigherElementIndex(arr: any[]) {
        return arr.reduce((acc, val, index) => val > arr[acc] ? index : acc, 0);
    }
    

    static getHigherElementIndexNotDead(arr: any[], faints: any[]) {
        let indexList = [];
        let valueList = [];
        for (let i = 0; i < arr.length; i++) {
            if (faints[i] === false) {
                indexList.push(i);
                valueList.push(arr[i]);
            }
        }
        //console.log(indexList)
        if (indexList.length === 0) {
            return 3;
        } else {
            return indexList[this.getHigherElementIndex(valueList)];
        }
    }

    static allActiveMembersFullyHealed(health: any[][], selected: any[]) {
        for (let i = 0; i < selected.length; i++) {
            if (health[i][selected[i]] > 0) {
                return false;
            }
        }
        return true

    }

    static chooseRandomTargetWithShieldsOrAny(shields: any[][], selected: any[]) {
        // Obtener los valores de shields basados en los índices de selected
        let list = [];

        for (let i = 0; i < selected.length; i++) {
            if (shields[i][selected[i]] > 0) {
                list.push(i);
            }
        }

    
        // Si hay atacantes con escudos, elegir uno aleatorio
        if (list.length > 0) {
            const randomIndex = Math.floor(Math.random() * list.length);
            return list[randomIndex];
        }
    
        // Si no hay atacantes con escudos, elegir un atacante aleatorio de selected
        const randomIndex = Math.floor(Math.random() * selected.length);
        return randomIndex;
    }

    static getHelperBonusDamage(hb: number) {
        switch (hb) {
            case 0:
                return 1;
            case 1:
                return 1.1;
            case 2:
                return 1.15;
            case 3:
                return 1.188;
            case 4:
                return 1.25;
            default:
                return 1;
        }
    }

    static getBestQuickMove(pokemon: any, boss: any, types: any, raidMode?: string, allMoves?: any) {
        let bestMove = null;
        let bestDamage = 0;
        pokemon.quickMoves.forEach((move: any) => {
            let moveData = this.getMovePBByID(move, allMoves);
            moveData.power = 10;
            const damage = this.getDamage(pokemon, boss, moveData, types, [40,15,15,15], [40,15,15,15], ["EXTREME", false, false, 0], ["EXTREME", false, false, 0], raidMode, 0, 1, 1);
            //console.log("Quick Move: " + moveData.moveId + " Damage: " + damage);
            if (damage > bestDamage) {
                bestMove = moveData;
                bestDamage = damage;
            }
        });
        return bestMove;
    }

    static getAttackerTierList(
        pokemonList: any,
        allMoves: any,
        types: any,
    ) {
        const availableDmaxPoke = Calculator.DynamaxPokemon;
        const bossList = Calculator.GetBossesFromBossList();
        let tierList: { pokemon: any; tier: number, versus: { boss: any; pokemon: any; tier: number}[]}[] = [];
        availableDmaxPoke.forEach((attacker: string) => {
            const pokemonData = this.getPokemonPBByID(attacker, pokemonList)[0];
            let average = 0;
            let counter = 0;
            let versusBossList: { boss: any; pokemon: any; tier: number}[] = [];
            bossList.forEach((boss: any) => {
                const bossData = this.getPokemonPBByID(boss, pokemonList)[0];
                const raidMode = Calculator.FixedBosses[boss];
                const quickMove: any = this.getBestQuickMove(pokemonData, bossData, types, raidMode, allMoves);
                const maxMove = this.getDynamaxAttack(pokemonData.pokemonId, quickMove.type, allMoves, 3, quickMove);
                const damageDone = this.getDamage(pokemonData, bossData, maxMove, types, [40,15,15,15], this.convertStats([40,15,15,15], raidMode, bossData.pokemonId), ["EXTREME", false, false, 0], ["EXTREME", false, false, 0], raidMode, this.getDefenseMultiplier(raidMode), 1, 1);
                counter++;
                versusBossList.push({
                    boss: bossData,
                    pokemon: pokemonData,
                    tier: damageDone,
                });
                average = (damageDone + (average * (counter - 1))) / counter;
            });
            tierList.push({
                pokemon: pokemonData,
                tier: average,
                versus: versusBossList,
            });
            console.log("Pokemon: " + pokemonData.pokemonId + " Tier: " + average);
        });
        return tierList.sort((a, b) => b.tier - a.tier);
    }

    static getTierForPokemon(
        pokemonId: string,
        pokemonList: any,
        allMoves: any,
        types: any,
        texts?: any,
    ) {
        const bossList = Calculator.GetBossesFromBossList();
        let average = 0;
        let counter = 0;
        let versusBossList: { boss: any; pokemon: any; tier: number; maxmove: any}[] = [];
        const pokemonData = this.getPokemonPBByID(pokemonId, pokemonList)[0];
        bossList.forEach((boss: any) => {
            const bossData = this.getPokemonPBByID(boss, pokemonList)[0];
            console.log(pokemonId);
            const raidMode = Calculator.FixedBosses[boss];
            const quickMove: any = this.getBestQuickMove(pokemonData, bossData, types, raidMode, allMoves);
            const maxMove = this.getDynamaxAttack(pokemonData.pokemonId, quickMove.type, allMoves, 3, quickMove);
            const damageDone = this.getDamage(pokemonData, bossData, maxMove, types, [40,15,15,15], this.convertStats([40,15,15,15], raidMode, bossData.pokemonId), ["EXTREME", false, false, 0], ["EXTREME", false, false, 0], raidMode, this.getDefenseMultiplier(raidMode), 1, 1);
            counter++;
            versusBossList.push({
                boss: PoGoAPI.getPokemonNamePB(boss, texts),
                pokemon: pokemonData,
                tier: damageDone,
                maxmove: PoGoAPI.getMoveNamePB(maxMove.moveId, texts),
            });
            average = (damageDone + (average * (counter - 1))) / counter;
        });
        return versusBossList;
    }

    /*
{
        const attackerStat = [40,15,15,15]
        const defenderStat = this.convertStats([40,15,15,15], raidMode, boss.pokemonId);
        let attackersStat: { pokemon: any; quickMove: any; maxMove: any; damage: number; fastMove: any;}[] = [];
        availableDmaxPoke.forEach((attacker: string) => {
            const pokemonData = this.getPokemonPBByID(attacker, pokemonList)[0];
            const quickMove: any = this.getBestQuickMove(pokemonData, boss, types, raidMode, allMoves);
            //console.log("Pokemon: " + pokemonData.pokemonId + " Quick Move: " + quickMove.moveId + " Type of move: " + quickMove.type);
            const maxMove = this.getDynamaxAttack(pokemonData.pokemonId, quickMove.type, allMoves, 3, quickMove);
            //console.log(weather)
            const damageDone = this.getDamage(pokemonData, boss, maxMove, types, attackerStat, defenderStat, [weather, false, false, 0], [weather, false, false, 0], raidMode, this.getDefenseMultiplier(raidMode), 1, 1);
            attackersStat.push({pokemon: pokemonData, quickMove: quickMove, maxMove: maxMove, damage: damageDone, fastMove: this.getBestQuickMove(pokemonData, boss, types, raidMode, allMoves)});
        });
        return attackersStat.sort((a, b) => b.damage - a.damage);
    }
    */

    static getFastestQuickMove(pokemon: any, boss: any, types: any, raidMode?: string, allMoves?: any) {
        let bestMove = null;
        let bestDuration = 99999999;
        let bestDamage = 0;
        pokemon.quickMoves.forEach((move: any) => {
            let moveData = this.getMovePBByID(move, allMoves);
            moveData.power = 10;
            const damage = this.getDamage(pokemon, boss, moveData, types, [40,15,15,15], [40,15,15,15], ["EXTREME", false, false, 0], ["EXTREME", false, false, 0], raidMode, 0, 1, 1);
            if (moveData.durationMs < bestDuration) {
                bestMove = moveData;
                bestDamage = damage;
                bestDuration = moveData.durationMs;
            } else if (moveData.durationMs == bestDuration) {
                if (damage > bestDamage) {
                    bestMove = moveData;
                    bestDamage = damage;
                    bestDuration = moveData.durationMs;
                }
            }
        });
        return bestMove;
    }

    static getGeneralBestDefendersDynamax(
        boss: any,
        pokemonList: any,
        availableDmaxPoke: any,
        raidMode: string,
        allMoves: any,
        types: any,
        weather: string,
    ) {
        const attackerStat = [40,15,15,15]
        const defenderStat = this.convertStats([40,15,15,15], raidMode, boss.pokemonId);
        let graphic: { pokemon: any; large:number; targetBest:number; targetWorst:number; targetAvg: number; tankScore: number; fastMove: any;}[] = [];
        const bossMoves = boss.cinematicMoves.map((move: any) => this.getMovePBByID(move, allMoves));
        bossMoves.filter((move: any) => move.moveId !== "RETURN" && move.moveId !== "FRUSTRATION");
        availableDmaxPoke.forEach((defender: string) => {
            const pokemonData = this.getPokemonPBByID(defender, pokemonList)[0];
            let percentAfterLarge = 0;
            let percentAfterTargetBestCase = 0;
            let percentAfterTargetWorstCase = 0;
            for (let i = 0; i < bossMoves.length; i++) {
                const move = bossMoves[i];
                //percentAfterLarge = (Math.max(0, ((Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0])
                //    - Math.max(0, (this.getDamage(boss, pokemonData, move, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode,false, false, boss)))))) / Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0])) + (percentAfterLarge*i)) / (i+1);
                percentAfterLarge = (this.getDamage(boss, pokemonData, move, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode,false, false, boss)) + (percentAfterLarge*i)) / (i+1);
                //percentAfterTargetBestCase = (((((Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0])
                //    - Math.max(0, (this.getDamage(boss, pokemonData, move, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.4 * this.getDamageMultiplier(raidMode,false, false, boss)))))) / Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0]))) + (percentAfterTargetBestCase*i)) / (i+1);
                percentAfterTargetBestCase = (this.getDamage(boss, pokemonData, move, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.29 * this.getDamageMultiplier(raidMode,false, false, boss)) + (percentAfterTargetBestCase*i)) / (i+1);
                //percentAfterTargetWorstCase = (((((Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0])
                //    - Math.max(0, (this.getDamage(boss, pokemonData, move, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.7 * this.getDamageMultiplier(raidMode,false, false, boss)))))) / Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0]))) + (percentAfterTargetWorstCase*i)) / (i+1);
                percentAfterTargetWorstCase = (this.getDamage(boss, pokemonData, move, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.6 * this.getDamageMultiplier(raidMode,false, false, boss)) + (percentAfterTargetWorstCase*i)) / (i+1);
            }
            const tankScore = ((Math.max(0, percentAfterLarge + (Math.max(0, (percentAfterTargetBestCase + percentAfterTargetWorstCase)))/2)  / 2))
            graphic.push({pokemon: pokemonData, large: percentAfterLarge, targetBest: Math.max(0, percentAfterTargetBestCase), targetWorst: Math.max(0, percentAfterTargetWorstCase), targetAvg: ((Math.max(0, (percentAfterTargetBestCase + percentAfterTargetWorstCase)))/2)  ,tankScore: tankScore, fastMove: this.getFastestQuickMove(pokemonData, boss, types, raidMode, allMoves)});
        })
        return graphic.sort((a, b) => {
            if (a.tankScore > b.tankScore) {
                return 1;
            } else if (a.tankScore < b.tankScore) {
                return -1;
            } else {
                return b.targetBest - a.targetBest;
            }
        })
    }

    static getBestDefendersDynamax(
        boss: any,
        pokemonList: any,
        availableDmaxPoke: any,
        raidMode: string,
        allMoves: any,
        types: any,
        bossLargeAttack: any,
        bossTargetAttack: any,
        weather: string,
    ) {
        const attackerStat = [40,15,15,15]
        const defenderStat = this.convertStats([40,15,15,15], raidMode, boss.pokemonId);
        const bossLargeAttackData = this.getMovePBByID(bossLargeAttack, allMoves);
        const bossTargetAttackData = this.getMovePBByID(bossTargetAttack, allMoves);
        let graphic: { pokemon: any; large:number; targetBest:number; targetWorst:number; targetAvg: number; tankScore: number; fastMove: any;}[] = [];
        availableDmaxPoke.forEach((defender: string) => {
            const pokemonData = this.getPokemonPBByID(defender, pokemonList)[0];

            //console.log("HP of " + pokemonData.pokemonId +": "+ Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0]) + " After attack: " + this.getDamage(boss, pokemonData, bossLargeAttackData, types, defenderStat, attackerStat, ["EXTREME", false, false, 0], ["EXTREME", false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode,false, false, boss)))
            //const percentAfterLarge = Math.max(0, ((Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0])
            //    - Math.max(0, (this.getDamage(boss, pokemonData, bossLargeAttackData, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode,false, false, boss)))))) / Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0]))
            const percentAfterLarge = this.getDamage(boss, pokemonData, bossLargeAttackData, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode,false, false, boss))
            //const percentAfterTargetBestCase = (((Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0])
            //    - Math.max(0, (this.getDamage(boss, pokemonData, bossTargetAttackData, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.4 * this.getDamageMultiplier(raidMode,false, false, boss)))))) / Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0]))
            const percentAfterTargetBestCase = this.getDamage(boss, pokemonData, bossTargetAttackData, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.29 * this.getDamageMultiplier(raidMode,false, false, boss))
            //const percentAfterTargetWorstCase = (((Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0])
            //    - Math.max(0, (this.getDamage(boss, pokemonData, bossTargetAttackData, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.7 * this.getDamageMultiplier(raidMode,false, false, boss)))))) / Calculator.getEffectiveStamina(pokemonData.stats.baseStamina, attackerStat[3], attackerStat[0]))
            const percentAfterTargetWorstCase = this.getDamage(boss, pokemonData, bossTargetAttackData, types, defenderStat, attackerStat, [weather, false, false, 0], [weather, false, false, 0], "normal", 0, 2 * 0.6 * this.getDamageMultiplier(raidMode,false, false, boss))
            const tankScore = ((Math.max(0, percentAfterLarge + (Math.max(0, (percentAfterTargetBestCase + percentAfterTargetWorstCase)))/2)  / 2))
            //console.log("Pokemon: " + pokemonData.pokemonId + " Tank Score: " + tankScore);
            graphic.push({pokemon: pokemonData, large: percentAfterLarge, targetBest: Math.max(0, percentAfterTargetBestCase), targetWorst: Math.max(0, percentAfterTargetWorstCase), targetAvg: ((Math.max(0, (percentAfterTargetBestCase + percentAfterTargetWorstCase)))/2)  ,tankScore: tankScore, fastMove: this.getFastestQuickMove(pokemonData, boss, types, raidMode, allMoves)});
        })
        //console.log(graphic)
        return graphic.sort((a, b) => {
            if (a.tankScore > b.tankScore) {
                return 1;
            } else if (a.tankScore < b.tankScore) {
                return -1;
            } else {
                return b.targetBest - a.targetBest;
            }
        }
            
        );
    }

    static GetBestAttackersDynamax(
        boss: any,
        pokemonList: any,
        availableDmaxPoke: any,
        raidMode: string,
        allMoves: any,
        types: any,
        weather: string
    ) {
        const attackerStat = [40,15,15,15]
        const defenderStat = this.convertStats([40,15,15,15], raidMode, boss.pokemonId);
        let attackersStat: { pokemon: any; quickMove: any; maxMove: any; damage: number; fastMove: any;}[] = [];
        availableDmaxPoke.forEach((attacker: string) => {
            const pokemonData = this.getPokemonPBByID(attacker, pokemonList)[0];
            const quickMove: any = this.getBestQuickMove(pokemonData, boss, types, raidMode, allMoves);
            //console.log("Pokemon: " + pokemonData.pokemonId + " Quick Move: " + quickMove.moveId + " Type of move: " + quickMove.type);
            const maxMove = this.getDynamaxAttack(pokemonData.pokemonId, quickMove.type, allMoves, 3, quickMove);
            //console.log(weather)
            const damageDone = this.getDamage(pokemonData, boss, maxMove, types, attackerStat, defenderStat, [weather, false, false, 0], [weather, false, false, 0], raidMode, this.getDefenseMultiplier(raidMode), 1, 1);
            attackersStat.push({pokemon: pokemonData, quickMove: quickMove, maxMove: maxMove, damage: damageDone, fastMove: this.getBestQuickMove(pokemonData, boss, types, raidMode, allMoves)});
        });
        return attackersStat.sort((a, b) => b.damage - a.damage);
    }

    static async AdvancedSimulationDynamax(
        attackers: any[][], 
        defender: any, 
        attackersQuickMove: any[][], 
        attackersCinematicMove: any[][], 
        attackersStats: any[][][], 
        defenderLargeAttack: any, 
        defenderTargetAttack: any, 
        raidMode: any, 
        attackerMaxMoves: any[][],
        strategy: string[] = [],
        shroom: string[] = [],
        weather: string = "EXTREME",
        helperBonus: number = 0,
        friendship: any[] = [0,0,0,0],
        prioritiseEnergy: boolean,
    ) {
        let defenderStats = this.convertStats([40,15,15,15], raidMode, defender.pokemonId);
        
        let attackerDamageStart = [-1, -1, -1, -1];
        let defenderDamageStart = -1;

        let attackerEnergy = attackers.map(() => [0, 0, 0]);
        let defenderEnergy = 300;
        let activePokemon = attackers.map(() => 0);
        /*

        const attackerMaxHP = [[
            Math.floor(Calculator.getEffectiveStamina(attackers[0][0].stats.baseStamina, attackersStats[0][0][3], attackersStats[0][0][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[0][1].stats.baseStamina, attackersStats[0][1][3], attackersStats[0][1][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[0][2].stats.baseStamina, attackersStats[0][2][3], attackersStats[0][2][0]))
        ], [
            Math.floor(Calculator.getEffectiveStamina(attackers[1][0].stats.baseStamina, attackersStats[1][0][3], attackersStats[1][0][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[1][1].stats.baseStamina, attackersStats[1][1][3], attackersStats[1][1][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[1][2].stats.baseStamina, attackersStats[1][2][3], attackersStats[1][2][0]))
        ], [
            Math.floor(Calculator.getEffectiveStamina(attackers[2][0].stats.baseStamina, attackersStats[2][0][3], attackersStats[2][0][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[2][1].stats.baseStamina, attackersStats[2][1][3], attackersStats[2][1][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[2][2].stats.baseStamina, attackersStats[2][2][3], attackersStats[2][2][0]))
        ], [
            Math.floor(Calculator.getEffectiveStamina(attackers[3][0].stats.baseStamina, attackersStats[3][0][3], attackersStats[3][0][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[3][1].stats.baseStamina, attackersStats[3][1][3], attackersStats[3][1][0])),
            Math.floor(Calculator.getEffectiveStamina(attackers[3][2].stats.baseStamina, attackersStats[3][2][3], attackersStats[3][2][0]))
        ]];
        */
        const attackerMaxHP = attackers.map((team, i) => 
            team.map((pokemon, j) => 
            Math.floor(Calculator.getEffectiveStamina(pokemon.stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0]))
            )
        );

        const types = await this.getTypes();
        const allMoves = await this.getAllMovesPB();

        let hasWeakness = this.hasDoubleWeaknesses(defender.type, defender.type2, types);

        let attackerHealth = attackerMaxHP.map(team => team.map(pokemon => pokemon));
        let defenderHealth = Calculator.getEffectiveStaminaForRaid(defender.stats.baseStamina, defender.stats.raidCP, defender.stats.raidBossCP, raidMode, defender.pokemonId, hasWeakness);
        
        let attackerEvades = [false, false, false, false];
        let attackerFaint = [false, false, false, false];
        let attackerDamage = attackers.map(() => [0, 0, 0]);
        let defenderDamage = attackers.map(() => [0, 0, 0]);
        let tdo = [0, 0, 0, 0];
        let attackerQuickAttackUses = attackers.map(() => [0, 0, 0]);
        let attackerChargedAttackUses = attackers.map(() => [0, 0, 0]);
        let maxEnergy = 0;
        let maxEnergyGain = 0;
        let defenderLargeAttackUses = 0;
        let defenderTargetAttackUses = 0;
        let battleLog = [];
        let time = 0;
        let firstDmgReduction = [false, false, false, false];
        let attackerMove: (typeof attackersQuickMove[0][0] | typeof attackersCinematicMove[0][0] | null)[] = [null, null, null, null];
        let defenderMove = null;
        let enraged = false;
        let desperate = false;
        let simGoing = true;
        let dealtDamage = false;

        let shieldHP = attackers.map(() => [0, 0, 0]);
        let shieldHPMAX = attackers.map(() => [0, 0, 0]);

        let win = false;
        let dynamaxPhases = 0;

        for (let i = 0 ; i < attackers.length ; i++) {
            for (let j = 0 ; j < 3 ; j++) {
                shieldHP[i][j] = 0;
                shieldHPMAX[i][j] = attackerMaxMoves[i][j][1] * 60;
            }
        }

        let dmgScore = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let tankScore = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let healScore = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];


        for (let i = 0 ; i < attackers.length ; i++) {
            for (let j = 0 ; j < 3 ; j++) {
                // Damage that can be done in one max attack
                dmgScore[i][j] = this.getDamage(attackers[i][j], defender, this.getDynamaxAttack(attackers[i][j].pokemonId, attackersQuickMove[i][j].type, allMoves , attackerMaxMoves[i][j][0], attackersQuickMove[i][j]), types, attackersStats[i][j], defenderStats, [weather, false, false, friendship[i]], [weather, false, false, 0], raidMode);
                // Percentage of health remaining after one targeted and one large attack
                tankScore[i][j] = ((
                    ((Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                    - Math.max(0, - shieldHP[i][j] + (this.getDamage(defender, attackers[i][j], defenderLargeAttack,  types, defenderStats, attackersStats[i][j], [weather, false, false, 0], [weather, false, false, friendship[i]], "normal", 0, this.getDamageMultiplier(raidMode,false, false, defender)))))) / Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                    + ((Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                    - Math.max(0, - shieldHP[i][j] + (this.getDamage(defender, attackers[i][j], defenderTargetAttack, types, defenderStats, attackersStats[i][j], [weather, false, false, 0], [weather, false, false, friendship[i]], "normal", 0,  this.getDamageMultiplier(raidMode,false, false, defender)))))) / Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                  )  / 2) * (1 + shieldHPMAX[i][j] / 60);
                  
                // Highest HP
                let healthFactor = (attackerMaxMoves[i][activePokemon[i]][2] === 1) ? 0.08 : (attackerMaxMoves[i][activePokemon[i]][2] === 2 ? 0.12 : (attackerMaxMoves[i][activePokemon[i]][2] === 3 ? 0.16 : 0));
                let healAmount = Math.floor(healthFactor * Calculator.getEffectiveStamina(attackers[i][activePokemon[i]].stats.baseStamina, attackersStats[i][activePokemon[i]][3], attackersStats[i][activePokemon[i]][0]));
                healScore[i][j] = healAmount
            }
        }
        
        // console.log(tankScore)

        // activePokemon = [this.getHigherElementIndex(tankScore[0]), this.getHigherElementIndex(tankScore[1]), this.getHigherElementIndex(tankScore[2]), this.getHigherElementIndex(tankScore[3])];
        // console.log(activePokemon);

        let targeted = false;
        let target = 0;

        // Roll for the first move of the defender
        targeted = Math.random() > (defenderTargetAttack.power / (defenderLargeAttack.power + defenderTargetAttack.power)) ? true : false;
        defenderMove = !targeted ? defenderLargeAttack : defenderTargetAttack;

        const dynamaxDelays = this.getDynamaxRaidDelays(raidMode);
        defenderDamageStart = -dynamaxDelays[targeted ? 1 : 0];

        //console.log(!targeted ? "Spread":"Target" + " move: " + defenderMove.moveId + " with power: " + defenderMove.power + " and damage window: " + defenderMove.damageWindowStartMs + "ms to " + activePokemon[target] + " of attacker " + target);
        //

        let attackerFaints = attackers.map(() => [false, false, false]);
        let totalfaints = 0;

        const activeDPS = [false, false, false, false];

        let pokemonCanParticipate = attackers.map(() => [true, true, true]);
        // console.log(pokemonCanParticipate)

        let shrooms = shroom.map((shroom) => shroom === "true");
        // console.log(shrooms)

        let hasParticle = [false, false, false, false];

        while (this.sumAllElements(attackerDamage) <= defenderHealth) {            
            // Each 15 seconds, one Max Orb generates
            if (time % 15000 === 0 && time > 0) {
                let ellegibleAttackers = [];
                for (let i = 0; i < attackers.length; i++) {
                    if (activePokemon[i] < 3 && !attackerFaints[i][activePokemon[i]] && pokemonCanParticipate[i][activePokemon[i]]) {
                        ellegibleAttackers.push(i);
                    }
                }
                if (ellegibleAttackers.length > 0) {
                    const randomIndex = Math.floor(Math.random() * ellegibleAttackers.length);
                    hasParticle[ellegibleAttackers[randomIndex]] = true;
                    battleLog.push({"turn": time, "attacker": "attacker", "particle": true, "member": ellegibleAttackers[randomIndex]});
                }
            }
            // After 10 seconds of a Max Orb generation, if it was not claimed, it will be lost
            if (time % 15000 === 10000 && time > 0) {
                for (let i = 0; i < attackers.length; i++) {
                    if (hasParticle[i]) {
                        hasParticle[i] = false;
                    }
                }
            }
            for (let i = 0 ; i < attackers.length ; i++) {
                // Actions of each attacker
                // There is a targeted move coming from the defender to i, will try to dodge it
                if (defenderDamageStart != -1 && !attackerEvades[i] && defenderMove != null && time < defenderDamageStart + defenderMove.damageWindowStartMs && activePokemon[i] < 3 && target === i && targeted && !firstDmgReduction[i]) {
                    const projectedDamageDefender = this.getDamage(defender, attackers[i][activePokemon[i]], defenderMove, types, defenderStats, attackersStats[i][activePokemon[i]], [weather, false, false, 0], [weather, false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode, enraged, desperate, defender));
                    if (projectedDamageDefender < attackerHealth[i][activePokemon[i]] ) {
                        // Attacker i evades the move
                        attackerEvades[i] = true;
                        firstDmgReduction[i] = true;
                        attackerDamageStart[i] = -1002;
                        battleLog.push({"turn": time, "attacker": "attacker", "dodge": true, "member": i});
                        if (hasParticle[i]) {
                            // Attacker i uses the Max Orb
                            battleLog.push({"turn": time, "attacker": "attacker", "maxOrb": true, "member": i});
                            maxEnergy += 10;
                            if (maxEnergy > 100) {
                                maxEnergy = 100;
                            }
                            maxEnergyGain += maxEnergy;
                            hasParticle[i] = false;
                        }
                    }
                } 
                if (hasParticle[i]) {
                    // Attacker i uses the Max Orb
                    attackerDamageStart[i] = -1002;
                    battleLog.push({"turn": time, "attacker": "attacker", "maxOrb": true, "member": i});
                    maxEnergy += 10;
                    if (maxEnergy > 100) {
                        maxEnergy = 100;
                    }
                    maxEnergyGain += maxEnergy;
                    hasParticle[i] = false;
                } 
                if (!firstDmgReduction[i] && time > 0) {
                    if (attackerDamageStart[i] == -1 && activePokemon[i] < 3 ) {
                        // Attacker of member i may cast a move
                        const projectedDamageQuick = Math.floor(this.getDamage(attackers[i][activePokemon[i]], defender, attackersQuickMove[i][activePokemon[i]], types, attackersStats[i][activePokemon[i]], defenderStats, [weather, false, false, friendship[i]], [weather, false, false, 0] , raidMode, ((shrooms[i] === true ? 2 : 1) * this.getDefenseMultiplier(raidMode) * this.getHelperBonusDamage(helperBonus))));
                        const maxEnergyQuickAttack = Calculator.getMaxEnergyGain(projectedDamageQuick, defenderHealth);
                        const projectedDamageCinematic = Math.floor(this.getDamage(attackers[i][activePokemon[i]], defender, attackersCinematicMove[i][activePokemon[i]], types, attackersStats[i][activePokemon[i]], defenderStats, [weather, false, false, friendship[i]], [weather, false, false, 0] , raidMode, ((shrooms[i] === true ? 2 : 1) * this.getDefenseMultiplier(raidMode) * this.getHelperBonusDamage(helperBonus))));
                        const maxEnergyCinematicAttack = Calculator.getMaxEnergyGain(projectedDamageCinematic, defenderHealth);
                        if ((attackerEnergy[i][activePokemon[i]] >= -attackersCinematicMove[i][activePokemon[i]].energyDelta) 
                            && (!prioritiseEnergy ||
                                (prioritiseEnergy && (maxEnergyCinematicAttack * (attackersQuickMove[i][activePokemon[i]].durationMs / attackersCinematicMove[i][activePokemon[i]].durationMs) >= maxEnergyQuickAttack))
                            )
                        ) {
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
                            console.log("Attacker " + i + " casts quick move: " + attackerMove[i].moveId + " with energy delta: " + attackerMove[i].energyDelta + " at time " + time);
                            attackerEnergy[i][activePokemon[i]] += attackersQuickMove[i][activePokemon[i]].energyDelta;
                            if (attackerEnergy[i][activePokemon[i]] > 100) {
                                attackerEnergy[i][activePokemon[i]] = 100;
                            }
                            attackerQuickAttackUses[i][activePokemon[i]]++;
                        }    
                    }
                }
                firstDmgReduction[i] = false;
                // Attacker i deals damage
                if (attackerMove[i] !== null && attackerDamageStart[i] > -1 && time === attackerDamageStart[i] + attackerMove[i].damageWindowStartMs && activePokemon[i] < 3) {
                    const projectedDamage = Math.floor(this.getDamage(attackers[i][activePokemon[i]], defender, attackerMove[i], types, attackersStats[i][activePokemon[i]], defenderStats, [weather, false, false, friendship[i]], [weather, false, false, 0] , raidMode, ((shrooms[i] === true ? 2 : 1) * this.getDefenseMultiplier(raidMode) * this.getHelperBonusDamage(helperBonus))));
                    tdo[i] += projectedDamage;
                    attackerDamage[i][activePokemon[i]] += projectedDamage;
                    console.log("Attacker " + i + " deals " + projectedDamage + " damage with move: " + attackerMove[i].moveId + " at time " + time);
                    maxEnergy += Calculator.getMaxEnergyGain(projectedDamage, defenderHealth);
                    if (maxEnergy > 100) {
                        maxEnergy = 100;
                    }
                    maxEnergyGain += maxEnergy;
                    battleLog.push({"turn": time,"attacker":"attacker", "attackerID": attackers[i][activePokemon[i]], "move": attackerMove[i].moveId, "damage": projectedDamage, "energy": attackerEnergy[i][activePokemon[i]], "stackedDamage": this.sumAllElements(attackerDamage), "health": defenderHealth, "member": i});
                    // End of simulation, defender faints
                    if (this.sumAllElements(attackerDamage) >= defenderHealth) {
                        battleLog.push({"turn": time, "attacker": "defender", "relobby": false});
                        simGoing = false;
                        win = true;
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
                battleLog.push({"turn": time, "attacker": "energy", "energyGain": maxEnergy});
                maxEnergyGain = 0;
            }

            // Max Phase
            if (maxEnergy >= 100) {
                maxEnergy = 0;
                attackerDamageStart = [-1, -1, -1, -1];
                dealtDamage = true;
                defenderDamageStart = -1000;
                dynamaxPhases++;
                // Attackers swap their pokemon to match their role
                for (let i = 0 ; i < attackers.length ; i++) {
                    if (strategy[i] === "dmg") {
                        activePokemon[i] = this.getHigherElementIndexNotDead(dmgScore[i], attackerFaints[i]);
                    } else if (strategy[i] === "tank") {
                        activePokemon[i] = this.getHigherElementIndexNotDead(tankScore[i], attackerFaints[i]);
                        // If a tank role has full shield in its best Tank, will swap to its DPS
                        if (activePokemon[i] < 3 && shieldHP[i][activePokemon[i]] >= ((shieldHPMAX[i][activePokemon[i]]) - (20 * attackerMaxMoves[i][activePokemon[i]][1]))) {
                            activePokemon[i] = this.getHigherElementIndexNotDead(dmgScore[i], attackerFaints[i]);
                            activeDPS[i] = true;
                        }
                    } else if (strategy[i] === "heal") {
                        activePokemon[i] = this.getHigherElementIndexNotDead(healScore[i], attackerFaints[i]);
                    }
                }
                // Dynamax phase starts
                // Order for DPS -> Attack
                // Order for Tank -> Shield -> Attack
                // Order for Heal -> Heal -> Shield -> Attack
                for (let turn = 0 ; turn < 3 ; turn++) {
                    for (let i = 0 ; i < attackers.length ; i++) {
                        if (activePokemon[i] < 3) {
                            const dmaxAttack = this.getDynamaxAttack(attackers[i][activePokemon[i]].pokemonId, attackersQuickMove[i][activePokemon[i]].type, allMoves, attackerMaxMoves[i][activePokemon[i]][0], attackersQuickMove[i][activePokemon[i]]);
                            const maxMoveDamage = Math.floor(this.getDamage(attackers[i][activePokemon[i]], defender, dmaxAttack, types, attackersStats[i][activePokemon[i]], defenderStats, [weather, false, false, friendship[i]], [weather, false, false, 0] , raidMode, ((shrooms[i] === true ? 2 : 1) * this.getHelperBonusDamage(helperBonus) * this.getDefenseMultiplier(raidMode))));
                            if (strategy[i] === "dmg") {
                                // Attacker will cast its max move
                                const projectedDamage = maxMoveDamage;
                                tdo[i] += projectedDamage;
                                attackerDamage[i][activePokemon[i]] += projectedDamage;
                                battleLog.push({"turn": time, "attacker": "attacker", "attackerID": attackers[i][activePokemon[i]], "move": dmaxAttack.moveId, "damage": projectedDamage, "energy": attackerEnergy[i][activePokemon[i]], "stackedDamage": this.sumAllElements(attackerDamage), "health": defenderHealth, "member": i, "dynamax": true});
                            } else if (strategy[i] === "tank") {
                                if (!activeDPS[i] && attackerMaxMoves[i][activePokemon[i]][1] > 0 && shieldHP[i][activePokemon[i]] <= ((shieldHPMAX[i][activePokemon[i]]) - (20 * attackerMaxMoves[i][activePokemon[i]][1]))) {
                                    shieldHP[i][activePokemon[i]] += (20 * attackerMaxMoves[i][activePokemon[i]][1]);
                                    battleLog.push({"turn": time, "attacker": "attacker", "attackerID": attackers[i][activePokemon[i]], "shield": true, "member": i, "dynamax": true});
                                } else {  
                                    const projectedDamage = maxMoveDamage;
                                    tdo[i] += projectedDamage;
                                    attackerDamage[i][activePokemon[i]] += projectedDamage;
                                    
                                    battleLog.push({"turn": time, "attacker": "attacker", "attackerID": attackers[i][activePokemon[i]], "move": dmaxAttack.moveId, "damage": projectedDamage, "energy": attackerEnergy[i][activePokemon[i]], "stackedDamage": this.sumAllElements(attackerDamage), "health": defenderHealth, "member": i, "dynamax": true});
                                }
                            } else if (strategy[i] === "heal") {
                                if (attackerMaxMoves[i][activePokemon[i]][2] > 0 && !this.allActiveMembersFullyHealed(defenderDamage, activePokemon)) {
                                    let healthFactor = (attackerMaxMoves[i][activePokemon[i]][2] === 1) ? 0.08 : (attackerMaxMoves[i][activePokemon[i]][2] === 2 ? 0.12 : 0.16);
                                    let healAmount = Math.floor(healthFactor * Calculator.getEffectiveStamina(attackers[i][activePokemon[i]].stats.baseStamina, attackersStats[i][activePokemon[i]][3], attackersStats[i][activePokemon[i]][0]));
                                    for (let j = 0 ; j < attackers.length ; j++) {
                                        defenderDamage[j][activePokemon[j]] -= healAmount;
                                        if (defenderDamage[j][activePokemon[j]] < 0) {
                                            defenderDamage[j][activePokemon[j]] = 0;
                                        }
                                        //console.log("Healed pokémon: " + defenderDamage[j][activePokemon[j]] + "/" + attackerHealth[j][activePokemon[j]]);
                                    }
                                    battleLog.push({"turn": time, "attacker": "attacker", "attackerID": attackers[i][activePokemon[i]], "heal": true, "member": i, "dynamax": true});
                                }
                                else if (attackerMaxMoves[i][activePokemon[i]][1] > 0 && shieldHP[i][activePokemon[i]] < (shieldHPMAX[i][activePokemon[i]]) - (20 * attackerMaxMoves[i][activePokemon[i]][1])) {
                                    shieldHP[i][activePokemon[i]] += (20 * attackerMaxMoves[i][activePokemon[i]][1]);
                                    battleLog.push({"turn": time, "attacker": "attacker", "attackerID": attackers[i][activePokemon[i]], "shield": true, "member": i, "dynamax": true});
                                } else {
                                    const projectedDamage = maxMoveDamage;
                                    tdo[i] += projectedDamage;
                                    attackerDamage[i][activePokemon[i]] += projectedDamage;
                                    
                                battleLog.push({"turn": time, "attacker": "attacker", "attackerID": attackers[i][activePokemon[i]], "move": dmaxAttack.moveId, "damage": projectedDamage, "energy": attackerEnergy[i][activePokemon[i]], "stackedDamage": this.sumAllElements(attackerDamage), "health": defenderHealth, "member": i, "dynamax": true});
                                }
                            }
                        }
                        
                    }
                    // Defender faints, end of simulation
                    if (this.sumAllElements(attackerDamage) >= defenderHealth) {
                        battleLog.push({"turn": time, "attacker": "defender", "relobby": false});
                        simGoing = false;
                        win = true;
                        break;
                    }
                }
                
                // Max phase ends, dead members will cheer
                for (let i = 0 ; i < attackers.length ; i++) {
                    if (activePokemon[i] == 3) {
                        maxEnergy += 25;
                        battleLog.push({"turn": time, "attacker": "attacker", "cheer": true, "member": i});
                        if (maxEnergy > 100) {
                            maxEnergy = 100;
                        }
                    }
                }

                // Tank score gets recalculated.
                for (let i = 0 ; i < attackers.length; i++) {
                    activeDPS[i] = false;
                    for (let j = 0 ; j < 3 ; j++) {
                        tankScore[i][j] = (
                            ((Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                            - Math.max(0, - shieldHP[i][j] + (this.getDamage(defender, attackers[i][j], defenderLargeAttack, types, defenderStats, attackersStats[i][j], [weather, false, false, 0], [weather, false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode, false, false, defender)))))) / Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                            + ((Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                            - Math.max(0, - shieldHP[i][j] + (this.getDamage(defender, attackers[i][j], defenderTargetAttack, types, defenderStats, attackersStats[i][j], [weather, false, false, 0], [weather, false, false, 0], "normal", 0, this.getDamageMultiplier(raidMode, false, false, defender)))))) / Calculator.getEffectiveStamina(attackers[i][j].stats.baseStamina, attackersStats[i][j][3], attackersStats[i][j][0])
                          )  / 2
                    }
                }

                // Attackers swap their pokemon back to their best tank
                for (let i = 0 ; i < attackers.length ; i++) {
                    if (strategy[i] === "dmg") {
                        activePokemon[i] = this.getHigherElementIndexNotDead(tankScore[i], attackerFaints[i]);
                    } else if (strategy[i] === "tank") {
                        activePokemon[i] = this.getHigherElementIndexNotDead(tankScore[i], attackerFaints[i]);
                    } else if (strategy[i] === "heal") {
                        activePokemon[i] = this.getHigherElementIndexNotDead(tankScore[i], attackerFaints[i]);
                    }
                }
            }

            // Defender can cast a move
            if (simGoing && defenderDamageStart == -1) {
                defenderDamageStart = time - 1;
                if (defenderMove.moveId === defenderTargetAttack.moveId) {
                    defenderTargetAttackUses++;
                    
                    // Will choose a target a random attacker with shields, if there are no attackers with shields, will choose a random attacker
                    target = this.chooseRandomTargetWithShieldsOrAny(shieldHP, activePokemon);
                } else {
                    defenderLargeAttackUses++;
                }
            }

            // Defender deals damage
            if (simGoing && defenderDamageStart > -1 && time === defenderDamageStart + defenderMove.durationMs) {
                
                if (targeted) {
                    if (activePokemon[target] < 3) {
                        const projectedDamageDefender = this.getDamage(
                            defender, 
                            attackers[target][activePokemon[target]], 
                            defenderMove, 
                            types, 
                            defenderStats, 
                            attackersStats[target][activePokemon[target]], 
                            [weather, false, false, 0], 
                            [weather, false, false, 0], 
                            "normal", 
                            0, 
                            (attackerEvades[target] ? 1 : 2) * this.getDamageMultiplier(raidMode, enraged, desperate, defender));
                        const finalDamage = Math.floor(projectedDamageDefender);
                        let finalDamageReduced = finalDamage;
                        if (finalDamage > shieldHP[target][activePokemon[target]]) {
                            finalDamageReduced = finalDamage - shieldHP[target][activePokemon[target]];
                            shieldHP[target][activePokemon[target]] = 0;
                        } else {
                            shieldHP[target][activePokemon[target]] -= finalDamage;
                            finalDamageReduced = 0;
                        }
                        defenderDamage[target][activePokemon[target]] += finalDamageReduced;
                        attackerEnergy[target][activePokemon[target]] += Math.floor(finalDamage / 2);
                        battleLog.push({"turn": time, "attacker": "defender", "move": defenderMove.moveId, "damage": finalDamageReduced, "stackedDamage": defenderDamage[target][activePokemon[target]], "health": attackerHealth[target][activePokemon[target]]});
                    }
                } else {
                    for (let i = 0 ; i < attackers.length ; i++) {
                        if (activePokemon[i] < 3) {
                            const projectedDamageDefender = this.getDamage(
                                defender, 
                                attackers[i][activePokemon[i]], 
                                defenderMove, 
                                types, 
                                defenderStats, 
                                attackersStats[i][activePokemon[i]], 
                                [weather, false, false, 0], 
                                [weather, false, false, 0], 
                                "normal", 
                                0, 
                                this.getDamageMultiplier(raidMode, enraged, desperate, defender)
                            );
                            const finalDamage = Math.floor(projectedDamageDefender);
                            let finalDamageReduced = finalDamage;
                            if (finalDamage > shieldHP[i][activePokemon[i]]) {
                                finalDamageReduced = finalDamage - shieldHP[i][activePokemon[i]];
                                shieldHP[i][activePokemon[i]] = 0;
                            } else {
                                shieldHP[i][activePokemon[i]] -= finalDamage;
                                finalDamageReduced = 0;
                            }
                            defenderDamage[i][activePokemon[i]] += finalDamageReduced;
                            attackerEnergy[i][activePokemon[i]] += Math.floor(finalDamage / 2);
                            battleLog.push({"turn": time, "attacker": "defender", "move": defenderMove.moveId, "damage": finalDamageReduced, "stackedDamage": defenderDamage[i][activePokemon[i]], "health": attackerHealth[i][activePokemon[i]]});
                        }
                    }
                }
                // Attacker faints
                for (let i = 0 ; i < attackers.length ; i++) {
                    if (defenderDamage[i][activePokemon[i]] >= attackerHealth[i][activePokemon[i]]) {
                        //console.log(activePokemon)
                        attackerEnergy[i][activePokemon[i]] = 0;
                        attackerFaints[i][activePokemon[i]] = true;
                        defenderDamage[i][activePokemon[i]] = 0;
                        totalfaints++;
                        attackerFaint[i] = true;
                        battleLog.push({"turn": time, "attacker": "attacker", "relobby": false, "tdo": tdo[i]});
                        activePokemon[i] = this.getHigherElementIndexNotDead(tankScore[i], attackerFaints[i]);
                        attackerDamageStart[i] = -1000;
                        tdo[i] = 0;
                        //console.log(attackerFaints)
                        //console.log("Attacker " + i + " fainted at time " + time);
                        //console.log(activePokemon)
                    }
                }
                dealtDamage = true;
            }

            // Defender has finished casting its move
            if (simGoing && dealtDamage && defenderMove !== null && time >= defenderDamageStart + defenderMove.durationMs) {
                // Defender can select its charged move
                if (Math.random() > defenderTargetAttack.power / (defenderLargeAttack.power + defenderTargetAttack.power)) {
                    defenderMove = defenderTargetAttack;
                    targeted = true;
                } else {
                    defenderMove = defenderLargeAttack;
                    targeted = false;
                }
                defenderDamageStart = -dynamaxDelays[targeted ? 1 : 0];
                target = 33;
                dealtDamage = false;
                // console.log(!targeted ? "Spread":"Target" + " move: " + defenderMove.moveId + " with power: " + defenderMove.power + " and damage window: " + defenderMove.damageWindowStartMs + "ms to " + activePokemon[target] + " of attacker " + target);
            }

            for (let i = 0 ; i < attackers.length ; i++) {
                if (attackerDamageStart[i] < -1) {
                    attackerDamageStart[i]++;
                }
            }

            if (defenderDamageStart < -1) {
                defenderDamageStart++;
            }

            if (this.everyoneFaints(attackerFaints)) {
                simGoing = false;
                battleLog.push({"turn": time, "lost": true});
                win = false;
            }

            time++;

            if ((raidMode.endsWith("gmax") && time === 150000) || (raidMode.endsWith("dmax") && time === 270000)) {
                enraged = true;
                battleLog.push({"turn": time, "enraged": true});
            } if ((raidMode.endsWith("gmax") && time === 180000) || (raidMode.endsWith("dmax") && time === 300000)) {
                desperate = true;
                battleLog.push({"turn": time, "desperate": true});
            } if (!simGoing) {
                break;
            }

            
        }
        //console.log("Simulation was done! " + time);
        //console.log(attackerDamage);
        return {time, attackerQuickAttackUses, attackerChargedAttackUses, defenderLargeAttackUses, defenderTargetAttackUses, battleLog, attackerFaints, attackerDamage, win, dynamaxPhases};
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