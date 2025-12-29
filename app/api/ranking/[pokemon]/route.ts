import { NextResponse } from "next/server";
import Ranking from "../../../../models/Ranking";
import { connectDB } from "../../../../lib/mongodb";

export async function GET(
    request: Request, 
    { params }: { params: Promise<{ pokemon: string }> }
) {
    try {
        await connectDB();
        const { pokemon } = await params;
        const url = new URL(request.url);

        // Calculate date from 2 weeks ago
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        // Optionally prune old entries (global) to keep collection tidy
        await Ranking.deleteMany({ date: { $lt: twoWeeksAgo } });

        const countsMode = url.searchParams.get("mode") === "counts" || url.searchParams.get("counts") === "true";

        if (countsMode) {
            const count = await Ranking.countDocuments({ pokemon, date: { $gte: twoWeeksAgo } });
            return NextResponse.json({ pokemon, count }, { status: 200 });
        }

        const rankings = await Ranking.find({ pokemon, date: { $gte: twoWeeksAgo } }).sort({ date: -1 });
        return NextResponse.json({ rankings }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rankings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request, 
    { params }: { params: Promise<{ pokemon: string }> }
) {
    try {
        await connectDB();
        const { pokemon } = await params;
        const data = await request.json();
        const newRanking = new Ranking({ pokemon, ...data });
        await newRanking.save();
        return NextResponse.json({ message: "Ranking entry created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating ranking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}