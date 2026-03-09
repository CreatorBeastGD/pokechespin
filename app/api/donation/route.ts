import { NextResponse } from "next/server";
import Ranking from "../../../models/Ranking";
import { connectDB } from "../../../lib/mongodb";

export async function POST(
    request: Request
) {
        await connectDB();
        
        const body = await request.json();

        return NextResponse.json({ message: "Donation received", data: body }, { status: 200 });
    
}