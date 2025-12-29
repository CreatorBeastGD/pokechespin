import { NextResponse } from "next/server";
import Ranking from "../../../models/Ranking";
import { connectDB } from "../../../lib/mongodb";

export const runtime = 'nodejs';

export async function GET(
    request: Request
) {
    try {
        await connectDB();

        const url = new URL(request.url);
        // Calculate date from 2 weeks ago
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        // Delete rankings older than 2 weeks
        await Ranking.deleteMany({ date: { $lt: twoWeeksAgo } });

        // Aggregate counts per pokemon within last 2 weeks
        const counts = await Ranking.aggregate([
            { $match: { date: { $gte: twoWeeksAgo } } },
            { $group: { _id: "$pokemon", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        return NextResponse.json({ counts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rankings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
