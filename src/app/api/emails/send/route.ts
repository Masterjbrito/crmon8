import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/google/gmail";
import { registerHistory } from "@/lib/google/sheets";
import { getCompany } from "@/lib/companies.config";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { to, subject, message, leadId, companyId } = body;

  if (!to || !subject || !message) {
    return NextResponse.json({ error: "to, subject and message required" }, { status: 400 });
  }

  const accessToken = (session as any).accessToken;
  await sendEmail(accessToken, to, subject, message);

  // Register in history
  const company = getCompany(companyId || "on8-living");
  if (company?.sheetId) {
    await registerHistory(accessToken, company.sheetId, leadId, "EMAIL ENVIADO", subject);
  }

  return NextResponse.json({ success: true });
}
