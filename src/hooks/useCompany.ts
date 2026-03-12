"use client";

import { useCompanyStore } from "@/store/company-store";
import { getCompany, COMPANIES } from "@/lib/companies.config";

export function useCompany() {
  const { currentCompanyId, setCompany } = useCompanyStore();
  const company = getCompany(currentCompanyId);

  return {
    currentCompanyId,
    company,
    companies: COMPANIES,
    setCompany,
  };
}
