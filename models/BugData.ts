import mongoose, { Schema } from 'mongoose';

const BugDataSchema = new mongoose.Schema(
    {
        doubleFriendshipBonus: {
            type: Boolean,
            required: true,
        },
        customBladeBoostAmount: {
            type: Number,
            required: true,
            default: 0.1,
        },
        showAllPokemonAsShiny: {
            type: Boolean,
            required: true,
            default: false,
        },
        showAllGmax: {
            type: Boolean,
            required: true,
            default: false,
        },
        customPokemonToRankings: {
            type: String,
            required: false,
            default: "",
        },
        showCustomPokemonOnRankings: {
            type: Boolean,
            required: true,
            default: false,
        },
        showOnlyCustomPokemonOnRankings: {
            type: Boolean,
            required: true,
            default: false,
        },
        selfMegaBoost: {
            type: Boolean,
            required: true,
            default: false,
        },
        showDPSOnSoloRaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        showHPOnSoloRaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        freezeRejoin: {
            type: Boolean,
            required: true,
            default: true,
        },
        showIDs: {
            type: Boolean,
            required: true,
            default: false,
        },
        customChargedMoveChance: {
            type: Boolean,
            required: true,
            default: false,
        },
        moveOverrides: {
            type: Schema.Types.Mixed,
            required: false,
            default: {},
        },
        customMoveOverrides: {
            type: Schema.Types.Mixed,
            required: false,
            default: {},
        },
        newMoveOverrides: {
            type: Schema.Types.Mixed,
            required: false,
            default: {},
        },
        addAllGmaxesToGeneralRankings: {
            type: Boolean,
            required: true,
            default: false,
        },
        simplifyCalculationText: {
            type: Boolean,
            required: true,
            default: false,
        },
        gemless: {
            type: Boolean,
            required: true,
            default: false,
        },
        slowerSwaps: {
            type: Boolean,
            required: true,
            default: false,
        },
        pokeboxId: {
            type: String,
            required: false,
            default: "",
        },
        bugMessage: {
            type: String,
            required: false,
            default: "",
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// In Next.js dev hot-reload, cached models can keep stale validators from older schema versions.
if (process.env.NODE_ENV === "development" && mongoose.models?.BugData) {
    delete mongoose.models.BugData;
}

const BugData = mongoose.models?.BugData || mongoose.model('BugData', BugDataSchema);

export default BugData;

/*
        localStorage.setItem("doubleFriendshipBonus", "false");
        localStorage.setItem("customBladeBoostAmount", "0.1");
        localStorage.setItem("showAllPokemonAsShiny", "false");
        localStorage.setItem("showAllGmax", "false");
        localStorage.setItem("customPokemonToRankings", "");
        localStorage.setItem("showCustomPokemonOnRankings", "false");
        localStorage.setItem("showOnlyCustomPokemonOnRankings", "false");
        localStorage.setItem("selfMegaBoost", "false");
        localStorage.setItem("showDPSOnSoloRaid", "false");
        localStorage.setItem("showHPOnSoloRaid", "false");
        localStorage.setItem("freezeRejoin", "true");
        localStorage.setItem("showIDs", "false");
        localStorage.setItem("customChargedMoveChance", "false");
        localStorage.removeItem("moveOverrides");
        localStorage.removeItem("customMoveOverrides");
        localStorage.removeItem("newMoveOverrides");
        localStorage.setItem("addAllGmaxesToGeneralRankings", "false");
        localStorage.setItem("simplifyCalculationText", "false");
        localStorage.setItem("gemless", "false");
        localStorage.setItem("slowerSwaps", "false");
        localStorage.setItem("pokeboxId", "");
*/