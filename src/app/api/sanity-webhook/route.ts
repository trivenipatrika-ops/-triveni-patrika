import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import webpush from "@/lib/webPush";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "अनधिकृत" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, categorySlug, isBreaking } = body;

  revalidatePath("/");
  if (categorySlug) revalidatePath(`/${categorySlug}`);
  if (slug) revalidatePath(`/news/${slug}`);

  if (title && slug) {
    try {
      const db = await getDb();
      const subscribers = await db.collection("subscribers").find({}).toArray();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      const payload = JSON.stringify({
        title: isBreaking ? `🔴 ब्रेकिंग: ${title}` : title,
        body: "पूरी खबर पढ़ने के लिए टैप करें",
        url: `${siteUrl}/news/${slug}`,
      });

      await Promise.all(
        subscribers.map(async (sub: any) => {
          try {
            await webpush.sendNotification(sub, payload);
          } catch (err: any) {
            if (err.statusCode === 404 || err.statusCode === 410) {
              await db.collection("subscribers").deleteOne({ _id: sub._id });
            }
          }
        })
      );
    } catch (e) {
      // notification sending failed, page revalidation above still succeeded
    }
  }

  return NextResponse.json({ success: true });
}
