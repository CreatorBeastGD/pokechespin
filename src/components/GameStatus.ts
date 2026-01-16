

export class GameStatus {
    timer: number = 0;
    allyPokemonMaxHealth: number[] = [];
    allyPokemonDamage: number[] = [0, 0, 0];
    allyPokemonShields: number[] = [0, 0, 0];
    allyPokemonMaxShields: number[] = [0, 0, 0];
    enemyPokemonMaxHealth: number = 0;
    enemyPokemonDamage: number = 0;
    allyCooldown: number = 0;
    enemyCooldown: number = 0;
    enemyPrepPhase: boolean = false;
    
    allyEnergy: number[] = [0, 0, 0];

    allyActiveMove: {move: any, isCharged: boolean} | null = null;
    enemyActiveMove: {move: any, isTarget: boolean} | null = null;

    activeAllyIndex: number = 0;

    spawnedOrb: {location: string, timeLeft: number} = {location: "none", timeLeft: 0};

    allyDodgeDirection: string = "none";

    maxEnergy: number = 0;

    maxPhaseCounter: number = 0;

    allyCurrentMessage: {message: string, duration: number, color: string, damage: number} | null = null;
    enemyCurrentMessage: {message: string, duration: number, color: string, damage: number} | null = null;
    globalCurrentMessage: {message: string, duration: number, color: string} | null = null;

    allyDodgeTurn: number = 0;

    damageReduction: number = 1;

    enrage: boolean = false;
    timeout: boolean = false;

    constructor() {
        this.timer = 0;
        this.allyPokemonMaxHealth = [];
        this.allyPokemonDamage = [0, 0, 0];
        this.allyPokemonShields = [0, 0, 0];
        this.enemyPokemonMaxHealth = 0;
        this.enemyPokemonDamage = 0;
        this.allyCooldown = 0;
        this.enemyCooldown = 0;
        this.enemyPrepPhase = false;
        this.allyEnergy = [0, 0, 0];
        this.allyActiveMove = null;
        this.enemyActiveMove = null;
        this.activeAllyIndex = 0;
        this.spawnedOrb = {location: "none", timeLeft: 0};
        this.allyDodgeDirection = "none";
        this.maxEnergy = 0;
        this.maxPhaseCounter = 0;
        this.allyCurrentMessage = null;
        this.enemyCurrentMessage = null;
        this.allyDodgeTurn = 0;
        this.damageReduction = 1;
        this.enrage = false;
        this.timeout = false;
    }
}