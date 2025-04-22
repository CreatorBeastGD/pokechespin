
export class Data {
    
    static weatherBoost = {
        "EXTREME": {
            boost: ["POKEMON_TYPE_BIRD"],
        },
        "SUNNY": {
            boost: ["POKEMON_TYPE_FIRE", "POKEMON_TYPE_GRASS", "POKEMON_TYPE_GROUND"],
        },
        "RAINY": {
            boost: ["POKEMON_TYPE_WATER", "POKEMON_TYPE_ELECTRIC", "POKEMON_TYPE_BUG"],
        },
        "FOG": {
            boost: ["POKEMON_TYPE_DARK", "POKEMON_TYPE_GHOST"],
        },
        "PARTLY_CLOUDY": {
            boost: ["POKEMON_TYPE_NORMAL", "POKEMON_TYPE_ROCK"],
        },
        "CLOUDY": {
            boost: ["POKEMON_TYPE_FAIRY", "POKEMON_TYPE_FIGHTING", "POKEMON_TYPE_POISON"],
        },
        "WINDY": {
            boost: ["POKEMON_TYPE_DRAGON", "POKEMON_TYPE_FLYING", "POKEMON_TYPE_PSYCHIC"],
        },
        "SNOW": {
            boost: ["POKEMON_TYPE_ICE", "POKEMON_TYPE_STEEL"],
        },

    }
}