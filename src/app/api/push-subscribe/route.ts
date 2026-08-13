import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "अमान्य सब्सक्रिप्शन" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("subscribers").updateOne(
      { endpoint: subscription.endpoint },
      { $set: { ...subscription, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "सब्सक्राइब नहीं हो पाया" }, { status: 500 });
  }
}
