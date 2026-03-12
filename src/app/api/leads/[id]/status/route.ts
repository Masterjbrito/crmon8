import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateLeadStatus } from "@/lib/google/sheets";
import { getCompany } from "@/lib/companies.config";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { companyId, status } = body;

  const company = getCompany(companyId);
  if (!company?.sheetId) return NextResponse.json({ error: "Invalid company" }, { status: 400 });

  const accessToken = (session as any).accessToken;
  const success = await updateLeadStatus(accessToken, company.sheetId, id, status);

  return NextResponse.json({ success });
}
