import nextConfig from "../next.config";
import { Calculator } from "./calculations";

const API = nextConfig.API_URL;

export class PoGoAPI {
    static async getAllPokemon() {
        const response = await fetch(API + "pokedex.json");
        return await response.json();
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

    static getTypeWeaknesses(type: any, allTypes: any) {
        const objType = allTypes.find((t: any) => t.type == type);
        let weaknesses: { [key: string]: number } = {};
        allTypes.forEach((t: any) => {
            if (t in objType?.doubleDamageFrom) {
                weaknesses[t.type] = 1.6;
            } else if (t in objType?.halfDamageFrom) {
                weaknesses[t.type] = 0.63;
            } else if (t in objType?.noDamageFrom) {
                weaknesses[t.type] = 0.39;
            }
        });

        return weaknesses;
    }

    static getEfectiveness(defendingPokemon: any, move: any, types: any) {
        const defenderFirstType = defendingPokemon.primaryType.names.English;
        const defenderSecondType = defendingPokemon.secondaryType?.names.English;

        console.log(defenderFirstType, defenderSecondType);
        
        const defenderFirstTypeWeaknesses = this.getTypeWeaknesses(defenderFirstType, types);
        const defenderSecondTypeWeaknesses = defenderSecondType ? this.getTypeWeaknesses(defenderSecondType, types) : {};
        const effectiveness = (defenderFirstTypeWeaknesses[move.type.type] ?? 1) * (defenderSecondTypeWeaknesses[move.type.type] ?? 1);
        return effectiveness;
    }

    static async getDamageQuickAttack(attackingPokemon: any, defendingPokemon: any, quickMove: any) {
        const types = await this.getTypes();
        const effectiveness = this.getEfectiveness(defendingPokemon, quickMove, types);
        return Calculator.calculateDamage(
            quickMove.power, 
            (attackingPokemon.stats.attack + 15) * 0.79030001, 
            (defendingPokemon.stats.defense + 15) * 0.79030001, 
            attackingPokemon.primaryType.type == quickMove.type.type || attackingPokemon.secondaryType?.type == quickMove.type.type ? 1.2 : 1, 
            effectiveness
        );
    }
}