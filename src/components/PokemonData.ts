export class PBPokemonData {
    id: number;
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
    };
    megaLevel: number = 0;
    highestMegaForm: string;

    constructor(id: number, customName: string, pokemonId: string, stats: { level: number; atk: number; def: number; hp: number; }, fastAttackId: string, chargedAttackId: string, isShiny: boolean, isDynamax: boolean, max: { attack: number; guard: number; spirit: number; }, megaLevel: number = 0, highestMegaForm: string = "") {
        this.id = id;
        this.customName = customName;
        this.pokemonId = pokemonId;
        this.stats = stats;
        this.fastAttackId = fastAttackId;
        this.chargedAttackId = chargedAttackId;
        this.isShiny = isShiny;
        this.isDynamax = isDynamax;
        this.max = max;
        this.megaLevel = megaLevel;
        this.highestMegaForm = highestMegaForm;
    }

}