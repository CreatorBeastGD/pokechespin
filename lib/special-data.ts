
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
    static specialChargedAttacks = {
        "RAYQUAZA": [{
            id: "DRAGON_ASCENT",
            names: {
                English: "Dragon Ascent",
                Spanish: "Ascenso Draco",
            },
            power: 140,
            energy: -50,
            durationMs: 3500,
            type: {
                names: {
                    English: "Flying",
                    Spanish: "Volador",
                },
                type: "POKEMON_TYPE_FLYING",
            }
        }],
        "RAYQUAZA_MEGA": [{
            id: "DRAGON_ASCENT",
            names: {
                English: "Dragon Ascent",
                Spanish: "Ascenso Draco",
            },
            power: 140,
            energy: -50,
            durationMs: 3500,
            type: {
                names: {
                    English: "Flying",
                    Spanish: "Volador",
                },
                type: "POKEMON_TYPE_FLYING",
            }
        }],
        "NECROZMA_DUSK_MANE": [{
            id: "SUNSTEEL_STRIKE",
            names: {
                English: "Sunsteel Strike",
                Spanish: "Meteoimpacto",
            },
            power: 230,
            energy: -100,
            durationMs: 3000,
            type: {
                names: {
                    English: "Steel",
                    Spanish: "Acero",
                },
                type: "POKEMON_TYPE_STEEL",
            }
        }]
        ,
        "NECROZMA_DAWN_WINGS": [{
            id: "MOONGEIST_BEAM",
            names: {
                English: "Moongeist Beam",
                Spanish: "Rayo Umbrío",
            },
            power: 230,
            energy: -100,
            durationMs: 3000,
            type: {
                    names: {
                English: "Ghost",
                        Spanish: "Fantasma",
                },
                type: "POKEMON_TYPE_GHOST",
            }
        }]
        ,
        "DIALGA_ORIGIN": [{
            id: "ROAR_OF_TIME",
            names: {
                English: "Roar of Time",
                Spanish: "Distorsión",
            },
            power: 160,
            energy: -100,
            durationMs: 2000,
            type: {
                names: {
                    English: "Dragon",
                    Spanish: "Dragón",
                },
                type: "POKEMON_TYPE_DRAGON",
            }
            }],
        "PALKIA_ORIGIN": [{
            id: "SPACIAL_REND",
            names: {
                English: "Spacial Rend",
                Spanish: "Corte Vacío",
            },
            power: 160,
            energy: -100,
            durationMs: 2500,
            type: {
                names: {
                    English: "Dragon",
                    Spanish: "Dragón",
                },
                type: "POKEMON_TYPE_DRAGON",
            }
        }],
        "HO_OH": [{
            id: "SACRED_FIRE_PLUS",
            names: {
                English: "Sacred Fire+",
                Spanish: "Fuego Sagrado+",
            },
            power: 135,
            energy: -100,
            durationMs: 2500,
            type: {
                names: {
                    English: "Fire",
                    Spanish: "Fuego",
                },
                type: "POKEMON_TYPE_FIRE",
            }
        },{
            id: "SACRED_FIRE_PLUS_PLUS",
            names: {
                English: "Sacred Fire++",
                Spanish: "Fuego Sagrado++",
            },
            power: 155,
            energy: -100,
            durationMs: 2500,
            type: {
                names: {
                    English: "Fire",
                    Spanish: "Fuego",
                },
                type: "POKEMON_TYPE_FIRE",
            }
        }],
        "LUGIA": [{
            id: "AEROBLAST_PLUS",
            names: {
                English: "Aeroblast+",
                Spanish: "Aerochorro+",
            },
            power: 200,
            energy: -100,
            durationMs: 3500,
            type: {
                names: {
                    English: "Flying",
                    Spanish: "Volador",
                },
                type: "POKEMON_TYPE_FLYING",
            }
        },{
            id: "AEROBLAST_PLUS_PLUS",
            names: {
                English: "Aeroblast++",
                Spanish: "Aerochorro++",
            },
            power: 225,
            energy: -100,
            durationMs: 3500,
            type: {
                names: {
                    English: "Flying",
                    Spanish: "Volador",
                },
                type: "POKEMON_TYPE_FLYING",
            }
        }],
    }   
}