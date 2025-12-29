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

        // Delete rankings older than 2 weeks (non-blocking, fire and forget)
        Ranking.deleteMany({ date: { $lt: twoWeeksAgo } }).catch(err => 
            console.error("Error deleting old rankings:", err)
        );

        // Aggregate counts per pokemon within last 2 weeks
        const counts = await Ranking.aggregate([
            { $match: { date: { $gte: twoWeeksAgo } } },
            { $group: { _id: "$pokemon", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        return NextResponse.json({ counts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rankings:", error);
        // Return detailed error in development, generic in production
        const errorMessage = process.env.NODE_ENV === 'development' 
            ? { error: "Internal Server Error", details: String(error) }
            : { error: "Internal Server Error" };
        return NextResponse.json(errorMessage, { status: 500 });
    }
}
