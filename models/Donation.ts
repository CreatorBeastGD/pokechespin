import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema(
    {
        donationEmail: {
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

const Donation = mongoose.models?.Donation || mongoose.model('Donation', DonationSchema);

export default Donation;