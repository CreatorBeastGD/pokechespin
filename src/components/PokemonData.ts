export class PBPokemonData {
    customName: string;
    pokemonId: string;
    stats: {
        level: number;
        atk: number;
        def: number;
        hp: number;
    }
    fastAttackId: string;
    chargedAttackId: string;
    isShiny: boolean;
    isDynamax: boolean;
    max: {
        attack: number;
        guard: number;
        spirit: number;
    }

    constructor(customName: string, pokemonId: string, stats: { level: number; atk: number; def: number; hp: number; }, fastAttackId: string, chargedAttackId: string, isShiny: boolean, isDynamax: boolean, max: { attack: number; guard: number; spirit: number; }) {
        this.customName = customName;
        this.pokemonId = pokemonId;
        this.stats = stats;
        this.fastAttackId = fastAttackId;
        this.chargedAttackId = chargedAttackId;
        this.isShiny = isShiny;
        this.isDynamax = isDynamax;
        this.max = max;
    }

}