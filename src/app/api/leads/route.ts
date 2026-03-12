import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLeads } from "@/lib/google/sheets";
import { getCompany, getChildCompanies } from "@/lib/companies.config";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accessToken = (session as any).accessToken;
  const companyId = req.nextUrl.searchParams.get("companyId") || "on8-living";

  const company = getCompany(companyId);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  // If parent company, aggregate from all children
  if (company.isParent) {
    const children = getChildCompanies();
    const allLeads = [];
    for (const child of children) {
      if (child.sheetId) {
        const leads = await getLeads(accessToken, child.sheetId);
        allLeads.push(...leads.map((l) => ({ ...l, companyId: child.id })));
      }
    }
    return NextResponse.json(allLeads);
  }

  if (!company.sheetId) return NextResponse.json([]);

  const leads = await getLeads(accessToken, company.sheetId);
  return NextResponse.json(leads.map((l) => ({ ...l, companyId })));
}
