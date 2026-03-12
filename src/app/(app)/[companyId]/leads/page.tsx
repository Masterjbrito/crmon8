"use client";

import { useParams } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import LeadsTable from "@/components/leads/LeadsTable";

export default function LeadsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { leads, loading, refetch } = useLeads(companyId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">A carregar leads...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <LeadsTable leads={leads} companyId={companyId} onRefresh={refetch} />
    </div>
  );
}
