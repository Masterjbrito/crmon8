import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/google/gmail";
import { registerHistory, updateLeadStatus } from "@/lib/google/sheets";
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

  try {
    await sendEmail(accessToken, to, subject, message);

    const company = getCompany(companyId || "on8-living");
    if (company?.sheetId && leadId) {
      // Register in history (like enviarEmailCrm in GAS)
      await registerHistory(accessToken, company.sheetId, leadId, "EMAIL ENVIADO", subject);

      // Auto-update status to "Contactado" (like enviarEmailManual in GAS)
      await updateLeadStatus(accessToken, company.sheetId, leadId, "Contactado");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[emails/send] Error:", error?.message || error);
    return NextResponse.json(
      { error: "Falha ao enviar email", detail: error?.message },
      { status: 500 }
    );
  }
}
