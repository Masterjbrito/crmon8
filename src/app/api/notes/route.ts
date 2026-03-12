import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNotes, saveNote } from "@/lib/google/sheets";
import { getCompany } from "@/lib/companies.config";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leadId = req.nextUrl.searchParams.get("leadId");
  const companyId = req.nextUrl.searchParams.get("companyId") || "on8-living";

  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

  const company = getCompany(companyId);
  if (!company?.sheetId) return NextResponse.json([]);

  const accessToken = (session as any).accessToken;
  const notes = await getNotes(accessToken, company.sheetId, leadId);

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { leadId, companyId, texto } = body;

  if (!leadId || !texto) return NextResponse.json({ error: "leadId and texto required" }, { status: 400 });

  const company = getCompany(companyId || "on8-living");
  if (!company?.sheetId) return NextResponse.json({ error: "Invalid company" }, { status: 400 });

  const accessToken = (session as any).accessToken;
  const success = await saveNote(accessToken, company.sheetId, leadId, texto);

  return NextResponse.json({ success });
}
