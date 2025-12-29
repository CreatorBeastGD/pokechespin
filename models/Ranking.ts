import mongoose from 'mongoose';

const RankingSchema = new mongoose.Schema(
    {
        pokemon: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const Ranking = mongoose.models?.Ranking || mongoose.model('Ranking', RankingSchema);

export default Ranking;