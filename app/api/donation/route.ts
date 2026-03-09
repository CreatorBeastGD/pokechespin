import { NextResponse } from "next/server";
import Donation from "../../../models/Donation";
import { connectDB } from "../../../lib/mongodb";
import { createHmac } from "crypto";

export async function POST(request: Request) {
    await connectDB();

    // Leer el body como texto para la verificación
    const rawBody = await request.text();
    // Obtener la cabecera de la firma
    const signature = request.headers.get("x-bmc-signature") || request.headers.get("x-signature-sha256");
    const webhookSecret = process.env.BMAC_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calcular la firma local
    const hmac = createHmac("sha256", webhookSecret);
    hmac.update(rawBody, "utf8");
    const localSignature = hmac.digest("hex");

    if (signature !== localSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parsear el body a JSON después de verificar
    const body = JSON.parse(rawBody);

    
    const donatorEmail = body.data?.supporter_email;
    const donationMsgType = body.data?.type;

    switch (donationMsgType) {
        case "donation.refunded":
            break;
            return NextResponse.json({ message: "Donation refunded", data: body }, { status: 200 });
        case "donation.created":
            return NextResponse.json({ message: "Donation created", data: body }, { status: 200 });
            break;
    }

    // ...procesar la donación aquí...
}