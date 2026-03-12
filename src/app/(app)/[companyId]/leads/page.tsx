"use client";

import { useParams } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import { useCompany } from "@/hooks/useCompany";
import LeadsTable from "@/components/leads/LeadsTable";
import { SkeletonTable } from "@/components/ui/Skeleton";

export default function LeadsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { leads, loading, error, refetch } = useLeads(companyId);
  const { company } = useCompany();

  if (loading) return <div className="p-4"><SkeletonTable /></div>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );
  }

  if (!company?.sheetId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-5xl opacity-20">📋</div>
        <div className="text-gray-400 font-semibold">{company?.name || companyId}</div>
        <p className="text-sm text-gray-400">Esta empresa ainda não tem sheet configurada.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <LeadsTable leads={leads} companyId={companyId} onRefresh={refetch} />
    </div>
  );
}
