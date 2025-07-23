import { Data } from "./special-data";

export class Calculator {

    static FixedBosses: { [pokemon: string]: string } = {
      "SKWOVET": "raid-t1-dmax",
      "WOOLOO": "raid-t1-dmax",
      "BULBASAUR": "raid-t1-dmax",
      "CHARMANDER": "raid-t1-dmax",
      "SQUIRTLE": "raid-t1-dmax",
      "BELDUM": "raid-t3-dmax",
      "GROOKEY": "raid-t1-dmax",
      "SCORBUNNY": "raid-t1-dmax",
      "SOBBLE": "raid-t1-dmax",
      "FALINKS": "raid-t3-dmax",
      "GASTLY": "raid-t1-dmax",
      "DRILBUR": "raid-t1-dmax",
      "TOXTRICITY": "raid-t4-dmax",
      "MACHOP": "raid-t2-dmax",
      "KRABBY": "raid-t1-dmax",
      "CRYOGONAL": "raid-t3-dmax",
      "PIDOVE": "raid-t1-dmax",
      "DARUMAKA": "raid-t2-dmax",
      "RAIKOU": "raid-t5-dmax",
      "ENTEI": "raid-t5-dmax",
      "SUICUNE": "raid-t5-dmax",
      "CHANSEY": "raid-t3-dmax",
      "PASSIMIAN": "raid-t3-dmax",
      "CATERPIE": "raid-t1-dmax",
      "SABLEYE": "raid-t3-dmax",
      "ROOKIDEE": "raid-t1-dmax",
      "ARTICUNO": "raid-t5-dmax",
      "ZAPDOS": "raid-t5-dmax",
      "MOLTRES": "raid-t5-dmax",
      "EXCADRILL": "raid-t3-dmax",
      "LATIAS": "raid-t5-dmax",
      "LATIOS": "raid-t5-dmax",
      "VENUSAUR_GIGANTAMAX": "raid-t6-gmax",
      "CHARIZARD_GIGANTAMAX": "raid-t6-gmax",
      "BLASTOISE_GIGANTAMAX": "raid-t6-gmax",
      "GENGAR_GIGANTAMAX": "raid-t6-gmax",
      "TOXTRICITY_GIGANTAMAX": "raid-t6-gmax",
      "LAPRAS_GIGANTAMAX": "raid-t6-gmax",
      "KINGLER_GIGANTAMAX": "raid-t6-gmax",
      "SNORLAX_GIGANTAMAX": "raid-t6-gmax",
      "MACHAMP_GIGANTAMAX": "raid-t6-gmax",
      "RILLABOOM_GIGANTAMAX": "raid-t6-gmax",
      "CINDERACE_GIGANTAMAX": "raid-t6-gmax",
      "INTELEON_GIGANTAMAX": "raid-t6-gmax",
      //"BUTTERFREE_GIGANTAMAX": "raid-t6-gmax",
    }

    static GetBossesFromBossList(dmaxDifficulty: string): string[] {
      let list: string[] = [];
      Object.entries(this.FixedBosses).forEach(([key, value]) => {
        if (value === dmaxDifficulty) {
          console.log(`Adding boss: ${key} with value: ${value}`);
          list.push(key);
        }
      });
      return list;
    }

    static DynamaxPokemon = [
      "SKWOVET",
      "GREEDENT",
      "WOOLOO",
      "DUBWOOL",
      "BULBASAUR",
      "IVYSAUR",
      "VENUSAUR",
      "CHARMANDER",
      "CHARMELEON",
      "CHARIZARD",
      "SQUIRTLE",
      "WARTORTLE",
      "BLASTOISE",
      "BELDUM",
      "METANG",
      "METAGROSS",
      "GROOKEY",
      "THWACKEY",
      "RILLABOOM",
      "SCORBUNNY",
      "RABOOT",
      "CINDERACE",
      "SOBBLE",
      "DRIZZILE",
      "INTELEON",
      "FALINKS",
      "GASTLY",
      "HAUNTER",
      "GENGAR",
      "DRILBUR",
      "EXCADRILL",
      "TOXTRICITY",
      "MACHOP",
      "MACHOKE",
      "MACHAMP",
      "KRABBY",
      "KINGLER",
      "CRYOGONAL",
      "ARTICUNO",
      "ZAPDOS",
      "MOLTRES",
      "PIDOVE",
      "TRANQUILL",
      "UNFEZANT",
      "DARUMAKA",
      "DARMANITAN",
      "KUBFU",
      "RAIKOU",
      "ENTEI",
      "SUICUNE",
      "CHANSEY",
      "BLISSEY",
      "PASSIMIAN",   
      "CATERPIE",
      "METAPOD",
      "BUTTERFREE",
      "SABLEYE",
      "URSHIFU_SINGLE_STRIKE_FORM",
      "URSHIFU_RAPID_STRIKE_FORM",
      "ROOKIDEE",
      "CORVISQUIRE",
      "CORVIKNIGHT",
      //"LATIAS",
      //"LATIOS",
      "HATENNA",
      "HATTREM",
      "HATTERENE",
      "SHUCKLE",
      "WAILMER",
      "WAILORD",
      "VENUSAUR_GIGANTAMAX",
      "CHARIZARD_GIGANTAMAX",
      "BLASTOISE_GIGANTAMAX",
      "GENGAR_GIGANTAMAX",
      "TOXTRICITY_GIGANTAMAX",
      "LAPRAS_GIGANTAMAX",
      "KINGLER_GIGANTAMAX",
      "SNORLAX_GIGANTAMAX",
      "MACHAMP_GIGANTAMAX",
      "RILLABOOM_GIGANTAMAX",
      "CINDERACE_GIGANTAMAX",
      "INTELEON_GIGANTAMAX",
      //"BUTTERFREE_GIGANTAMAX",
      "ZACIAN_CROWNED_SWORD_FORM",
      "ZAMAZENTA_CROWNED_SHIELD_FORM",
    ];

    private static CPM_VALUES: { [level: number]: number } = {
        1: 0.094,
        1.5: 0.1351374318,
        2: 0.16639787,
        2.5: 0.192650919,
        3: 0.21573247,
        3.5: 0.2365726613,
        4: 0.25572005,
        4.5: 0.2735303812,
        5: 0.29024988,
        5.5: 0.3060573775,
        6: 0.3210876,
        6.5: 0.3354450362,
        7: 0.34921268,
        7.5: 0.3624577511,
        8: 0.3752356,
        8.5: 0.387592416,
        9: 0.39956728,
        9.5: 0.4111935514,
        10: 0.4225,
        10.5: 0.4329264091,
        11: 0.44310755,
        11.5: 0.4530599591,
        12: 0.4627984,
        12.5: 0.472336093,
        13: 0.48168495,
        13.5: 0.4908558003,
        14: 0.49985844,
        14.5: 0.508701765,
        15: 0.51739395,
        15.5: 0.5259425113,
        16: 0.5343543,
        16.5: 0.5426357375,
        17: 0.5507927,
        17.5: 0.5588305862,
        18: 0.5667545,
        18.5: 0.5745691333,
        19: 0.5822789,
        19.5: 0.5898879072,
        20: 0.5974, // Tier 1 raid boss
        20.5: 0.6048236651,
        21: 0.6121573,
        21.5: 0.6194041216,
        22: 0.6265671,
        22.5: 0.6336491432,
        23: 0.64065295,
        23.5: 0.6475809666,
        24: 0.65443563,
        24.5: 0.6612192524,
        25: 0.667934, // Tier 2 raid boss
        25.5: 0.6745818959,
        26: 0.6811649,
        26.5: 0.6876849038,
        27: 0.69414365,
        27.5: 0.70054287,
        28: 0.7068842,
        28.5: 0.7131691091,
        29: 0.7193991,
        29.5: 0.7255756136,
        30: 0.7317, // Tier 3 raid boss
        30.5: 0.7347410093,
        31: 0.7377695,
        31.5: 0.7407855938,
        32: 0.74378943,
        32.5: 0.7467812109,
        33: 0.74976104,
        33.5: 0.7527290867,
        34: 0.7556855,
        34.5: 0.7586303683,
        35: 0.76156384,
        35.5: 0.7644860647,
        36: 0.76739717,
        36.5: 0.7702972656,
        37: 0.7731865,
        37.5: 0.7760649616,
        38: 0.77893275,
        38.5: 0.7817900548,
        39: 0.784637,
        39.5: 0.7874736075,
        40: 0.7903, // Tier 4 and 5 raid boss
        40.5: 0.792803968,
        41: 0.79530001,
        41.5: 0.797800015,
        42: 0.8003,
        42.5: 0.802799995,
        43: 0.8053,
        43.5: 0.8078,
        44: 0.81029999,
        44.5: 0.812799985,
        45: 0.81529999,
        45.5: 0.81779999,
        46: 0.82029999,
        46.5: 0.82279999,
        47: 0.82529999,
        47.5: 0.82779999,
        48: 0.83029999,
        48.5: 0.83279999,
        49: 0.83529999,
        49.5: 0.83779999,
        50: 0.84029999,
        50.5: 0.84279999,
        51: 0.84529999,
        100: 1.0,
        8001: 0.15,
        8002: 0.38,
        8003: 0.5,
        8004: 0.6,
        8005: 0.8,
        8005144: 0.7,
        8005243: 0.8,
        8005244: 0.75,
        8005245: 0.9,
        8006: 0.765,
        8006003: 0.85,
        8006068: 0.72,
        8006818: 0.81,
        8006131: 0.34, // What
        5001: 0.5974,
        5003: 0.73,
        5005: 0.7899,
        6001: 0.5974,
        6003: 0.76,
        6005: 0.82,
        
    };

      private static RAID_BOSS_HP: { [raidMode: string]: number } = {
        "normal": 0,
        "raid-t1": 600,
        "raid-t3": 3600,
        "raid-t4": 9000,
        "raid-t5": 15000,
        "raid-mega": 9000,
        "raid-mega-leg": 22500,
        "raid-elite": 20000,
        "raid-primal": 22500,
        "raid-t1-dmax": 1700,
        "raid-t2-dmax": 5000,
        "raid-t3-dmax": 10000,
        "raid-t4-dmax": 20000,
        "raid-t5-dmax": 22500,
        "raid-t6-gmax": 115000,
        "raid-t1-shadow": 600,
        "raid-t3-shadow": 3600,
        "raid-t5-shadow": 15000,
      }

      static getRaidBossHP(raidMode: string) {
        return this.RAID_BOSS_HP[raidMode];
      }

      static getMaxEnergyGain(damage: number, bossHP: number) {
        return Math.max(1, Math.floor(damage / (bossHP / 200)));
      }
    
      static getCPM(level: number) {
        return this.CPM_VALUES[level];
      }

      static getFriendshipBonus(friendship: number) {
        return friendship === 1 ? 1.03 : friendship === 2 ? 1.05 : friendship === 3 ? 1.07 : friendship === 4 ? 1.1 : 1;
      }

      static calculateDamage(
        power: number,
        attack: number,
        defense: number,
        STAB: number,
        effectiveness: number,
        type: string,
        shroomBonus: number,
        bonusAttacker?: any,
        bonusDefender?: any
      ) {
        /*
          console.log("Power: "+power 
            +"  Attack Stat: "+ attack 
            +"  Defense Stat: "+ defense 
            +"  STAB Bonus: "+ STAB 
            +"  Effectiveness Bonus:"+ effectiveness 
            +"  Friendship Bonus: "+(this.getFriendshipBonus(bonusAttacker[3]))
            +"  Weather Bonus: "+(this.getWeatherBoostBonus(type, bonusAttacker[0]))
            );
            */
          const attackFinal = bonusAttacker[1]  ? (attack * 6/5) : attack;
          const defenseFinal = bonusDefender[1] ? (defense * 5/6) : defense;
          const modifiers = (shroomBonus ?? 1) * effectiveness * STAB * (this.getWeatherBoostBonus(type, bonusAttacker[0])) * (this.getFriendshipBonus(bonusAttacker[3])) * (bonusAttacker[2] ? (STAB ? 1.3 : 1.1) : 1);
          
          // console.log(0.5 * (power ?? 0) * (attackFinal / defenseFinal) * modifiers );
          
          return Math.floor(
              0.5 * (power ?? 0) * (attackFinal / defenseFinal) * modifiers 
          ) + 1;
      }

      static getWeatherBoostBonus(moveType: string, weather: keyof typeof Data.weatherBoost) {
        return Data.weatherBoost[weather].boost.includes(moveType) ? 1.2 : 1;
      }

      static getEffectiveAttack(attack: number, iv: number, level: number) {
        return Math.max(1, Math.ceil((attack + iv) * this.getCPM(level)* 100000) / 100000);
      }

      static getEffectiveDefense(defense: number, iv: number, level: number) {
          return Math.max(1, Math.ceil((defense + iv) * this.getCPM(level) * 100000) / 100000);
      }

      static getEffectiveStamina(stamina: number, iv: number, level: number) {
          return Math.max(1, (stamina + iv) * this.getCPM(level));
      }

      static getEffectiveStaminaForRaid(stamina: number, iv: number, level: number, raidMode: string, pokemonId?:string, hasWeakness?: boolean) {
        if (raidMode === "normal") {
          return this.getEffectiveStamina(stamina, iv, level);
        } else {
          if (pokemonId) {
            return this.getEffectiveDMAXHP(raidMode, pokemonId, hasWeakness ?? false);
          } else {
            return this.RAID_BOSS_HP[raidMode];
          }
        }
      }

      static getEffectiveDMAXHP(raidMode: string, pokemonId: string, hasWeakness?: boolean) {
    // Mapas para lookup rápido
    const t5dmaxHP: Record<string, number> = {
        ZAPDOS: 13000,
        MOLTRES: 17500,
        ARTICUNO: 17500,
        RAIKOU: 20000,
        ENTEI: 26500,
        SUICUNE: 22000,
    };

    const t6gmaxHP: Record<string, number> = {
        VENUSAUR_GIGANTAMAX: 90000,
        CHARIZARD_GIGANTAMAX: 90000,
        BLASTOISE_GIGANTAMAX: 90000,
        GENGAR_GIGANTAMAX: 90000,
        TOXTRICITY_GIGANTAMAX: 180000,
        TOXTRICITY_LOW_KEY_GIGANTAMAX: 180000,
        TOXTRICITY_AMPED_GIGANTAMAX: 180000,
        LAPRAS_GIGANTAMAX: 135000,
        KINGLER_GIGANTAMAX: 115000,
        SNORLAX_GIGANTAMAX: 115000,
        MACHAMP_GIGANTAMAX: 115000,
        RILLABOOM_GIGANTAMAX: 120000,
        INTELEON_GIGANTAMAX: 100000,
        CINDERACE_GIGANTAMAX: 80000,
    };

    if (raidMode === "raid-t5-dmax") {
        if (pokemonId in t5dmaxHP) {
            return t5dmaxHP[pokemonId];
        } else {
            return this.RAID_BOSS_HP[raidMode] * (hasWeakness ? 1.6 : 1);
        }
    } else if (raidMode === "raid-t6-gmax") {
        if (pokemonId in t6gmaxHP) {
            return t6gmaxHP[pokemonId];
        } else {
            return this.RAID_BOSS_HP[raidMode] * (hasWeakness ? 1.6 : 1);
        }
    } else {
        return this.RAID_BOSS_HP[raidMode];
    }
}

      /**
       * 
       * @param attack Effective Attack Stat of a Pokémon
       * @param defense Effective Defense Stat of a Pokémon
       * @param stamina Effective Stamina Stat of a Pokémon
       * @returns PC of a Pokémon
       */
      static getPCs(attack: number, defense: number, stamina: number) {
          return Math.max(10, Math.floor((Math.sqrt(stamina) * attack * Math.sqrt(defense)) / 10));
      }
      
      static getRawPCs(attack: number, defense: number, stamina: number) {
        return Math.max(10, Math.floor((Math.sqrt(this.getEffectiveStamina(stamina, 0, 100)) * this.getEffectiveAttack(attack, 15, 100) * Math.sqrt(this.getEffectiveDefense(defense, 15, 100))) / 10));
      }
}