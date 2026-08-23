import { NextResponse } from "next/server";
import BugData from "../../../models/BugData";
import { connectDB } from "../../../lib/mongodb";

export const runtime = 'nodejs';

export async function GET(
    request: Request
) {
    try {
        await connectDB();

        const url = new URL(request.url);
        // Calculate date from 2 weeks ago

        const response = await BugData.find().sort({ createdAt: -1 });

        return NextResponse.json({ response }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rankings:", error);
        // Return detailed error in development, generic in production
        const errorMessage = process.env.NODE_ENV === 'development' 
            ? { error: "Internal Server Error", details: String(error) }
            : { error: "Internal Server Error" };
        return NextResponse.json(errorMessage, { status: 500 });
    }
}

const normalizeObject = (value: unknown, fallback: Record<string, unknown> = {}) => {
    if (value == null) return fallback;
    if (typeof value === "string") {
        if (value.trim().length === 0) return fallback;
        try {
            const parsed = JSON.parse(value);
            return typeof parsed === "object" && parsed !== null ? parsed : fallback;
        } catch {
            return fallback;
        }
    }
    if (typeof value === "object") return value as Record<string, unknown>;
    return fallback;
};

export async function POST(
    request: Request
) {
    try {
        await connectDB();

        const payload = await request.json().catch(() => null);

        console.log(payload);

        console.log(typeof payload.moveOverrides);

        if (!payload || typeof payload !== "object") {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const customBladeBoostAmount = Number(payload.customBladeBoostAmount ?? 0.1);
        const normalizeText = (value: unknown, fallback: string) => {
            if (typeof value !== "string") {
                return fallback;
            }
            return value.length > 0 ? value : fallback;
        };

        const safePayload = {
            doubleFriendshipBonus: Boolean(payload.doubleFriendshipBonus),
            customBladeBoostAmount: Number.isFinite(customBladeBoostAmount) ? customBladeBoostAmount : 0.1,
            showAllPokemonAsShiny: Boolean(payload.showAllPokemonAsShiny),
            showAllGmax: Boolean(payload.showAllGmax),
            // Non-empty fallbacks keep compatibility with any stale schema that still marks these as required strings.
            customPokemonToRankings: normalizeText(payload.customPokemonToRankings, " "),
            showCustomPokemonOnRankings: Boolean(payload.showCustomPokemonOnRankings),
            showOnlyCustomPokemonOnRankings: Boolean(payload.showOnlyCustomPokemonOnRankings),
            selfMegaBoost: Boolean(payload.selfMegaBoost),
            showDPSOnSoloRaid: Boolean(payload.showDPSOnSoloRaid),
            showHPOnSoloRaid: Boolean(payload.showHPOnSoloRaid),
            freezeRejoin: payload.freezeRejoin !== undefined ? Boolean(payload.freezeRejoin) : true,
            showIDs: Boolean(payload.showIDs),
            customChargedMoveChance: Boolean(payload.customChargedMoveChance),
            moveOverrides: normalizeObject(payload.moveOverrides, {}),
            customMoveOverrides: normalizeObject(payload.customMoveOverrides, {}),
            newMoveOverrides: normalizeObject(payload.newMoveOverrides, {}),
            addAllGmaxesToGeneralRankings: Boolean(payload.addAllGmaxesToGeneralRankings),
            simplifyCalculationText: Boolean(payload.simplifyCalculationText),
            gemless: Boolean(payload.gemless),
            slowerSwaps: Boolean(payload.slowerSwaps),
            pokeboxId: typeof payload.pokeboxId === "string" ? payload.pokeboxId : "",
        };

        const bugReport = await BugData.create(safePayload);

        return NextResponse.json({ message: "Bug report created successfully", id: bugReport._id }, { status: 201 });
    } catch (error) {
        console.error("Error creating bug report:", error);
        return NextResponse.json(
            process.env.NODE_ENV === "development"
                ? { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }
                : { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
