

export class RaidStatus {
    timer: number = 0;
    allyPokemonMaxHealth: number[] = [];
    allyPokemonDamage: number[] = [];
    enemyPokemonMaxHealth: number = 0;
    enemyPokemonDamage: number = 0;
    allyCooldown: number = 0;
    enemyCooldown: number = 0;
    enemyPrepPhase: boolean = false;
    
    allyEnergy: number[] = [];
    enemyEnergy: number = 0;

    allyActiveMove: {move: any, isCharged: boolean} | null = null;
    enemyActiveMove: {move: any, isCharged: boolean} | null = null;

    activeAllyIndex: number = 0;

    allyCurrentMessage: {message: string, duration: number, color: string, damage: number} | null = null;
    enemyCurrentMessage: {message: string, duration: number, color: string, damage: number} | null = null;
    globalCurrentMessage: {message: string, duration: number, color: string} | null = null;
    enrageCurrentMessage: {message: string, duration: number, color: string} | null = null;

    allyDodgeTurn: number = 0;

    damageReduction: number = 1;

    enrage: boolean = false;
    timeout: boolean = false;

    targetDodgeWindow: boolean = false;

    isRelobby: number = 0;

    dodgeWindowStart: number = 0;
    dodgeWindowEnd: number = 0;

    lastHitTime: number = 0;
    lastEnemyHitTime: number = 0;

    hasDodged = false;
    relobbyTimer: number = 0;

    isSubdued: boolean = false;
    prevWasCharged: boolean = false;

    constructor(pokemonCount: number, relobbyTimer: number) {
        this.timer = 0;
        this.allyPokemonMaxHealth = new Array(pokemonCount).fill(0);
        this.allyPokemonDamage = new Array(pokemonCount).fill(0);
        this.enemyPokemonMaxHealth = 0;
        this.enemyPokemonDamage = 0;
        this.allyCooldown = 0;
        this.enemyCooldown = 0;
        this.enemyPrepPhase = false;
        this.allyEnergy = new Array(pokemonCount).fill(0);
        this.enemyEnergy = 0;
        this.allyActiveMove = null;
        this.enemyActiveMove = null;
        this.activeAllyIndex = 0;
        this.allyCurrentMessage = null;
        this.enemyCurrentMessage = null;
        this.allyDodgeTurn = 0;
        this.damageReduction = 1;
        this.enrage = false;
        this.timeout = false;
        this.targetDodgeWindow = false;
        this.relobbyTimer = relobbyTimer;
    }
}