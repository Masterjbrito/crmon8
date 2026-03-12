"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import { useCompany } from "@/hooks/useCompany";
import LeadsTable from "@/components/leads/LeadsTable";
import NewLeadForm from "@/components/leads/NewLeadForm";
import { SkeletonTable } from "@/components/ui/Skeleton";

export default function LeadsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const searchParams = useSearchParams();
  const initialLeadId = searchParams.get("leadId") || undefined;
  const { leads, loading, error, refetch } = useLeads(companyId);
  const { company } = useCompany();
  const [showNewLead, setShowNewLead] = useState(false);

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
      <LeadsTable leads={leads} companyId={companyId} onRefresh={refetch} initialLeadId={initialLeadId} />

      <button
        onClick={() => setShowNewLead(true)}
        className="btn-create-lead flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        NOVA LEAD MANUAL
      </button>

      <NewLeadForm
        companyId={companyId}
        open={showNewLead}
        onClose={() => setShowNewLead(false)}
        onCreated={refetch}
      />
    </div>
  );
}
