import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createLead } from "@/lib/google/sheets";
import { getCompany } from "@/lib/companies.config";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { companyId, ...leadData } = body;

  if (!leadData.Name || !leadData.Email) {
    return NextResponse.json({ error: "Name and Email required" }, { status: 400 });
  }

  const company = getCompany(companyId || "on8-living");
  if (!company?.sheetId) {
    return NextResponse.json({ error: "Company has no sheet configured" }, { status: 400 });
  }

  const accessToken = (session as any).accessToken;

  try {
    await createLead(accessToken, company.sheetId, leadData);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[leads/create] Error:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to create lead", detail: error?.message },
      { status: 500 }
    );
  }
}
