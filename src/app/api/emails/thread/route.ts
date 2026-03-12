import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchEmailsBySubject } from "@/lib/google/gmail";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leadId = req.nextUrl.searchParams.get("leadId");
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

  const accessToken = (session as any).accessToken;
  const emails = await searchEmailsBySubject(accessToken, leadId);

  return NextResponse.json(emails);
}
