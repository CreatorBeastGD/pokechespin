
export class Calculator {
    static calculateDamage(
        power: number,
        attack: number,
        defense: number,
        STAB: number,
        effectiveness: number
    ) {
        return Math.floor(
            0.5 * power * (attack / defense) * STAB * effectiveness
        ) + 1;
    } 
}