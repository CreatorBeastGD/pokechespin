"use client"

import { useState } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Button } from "./ui/button";

export default function CalculateButton({
    attacker,
    defender,
    move } : { attacker: any, defender: any, move: any }
) {

    const [damage, setDamage] = useState<number | null>(null);

    const calculateDamage = async () => {
        console.log(attacker, defender, move);
        const damage = await PoGoAPI.getDamageQuickAttack(attacker, defender, move);
        setDamage(damage);
    }

    return (
        <>
        <Button
        onClick={calculateDamage}
        className="w-full py-2 text-white bg-primary rounded-lg"
        >
        Calculate
        </Button>
        <p>{damage}</p>
        </>
    );
}
