"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import { useCompany } from "@/hooks/useCompany";
import StatsTicker from "@/components/dashboard/StatsTicker";
import LeadsMap from "@/components/dashboard/LeadsMap";
import QuickActions from "@/components/dashboard/QuickActions";
import AlertsList from "@/components/dashboard/AlertsList";
import FunnelChart from "@/components/dashboard/FunnelChart";
import NewLeadForm from "@/components/leads/NewLeadForm";
import { SkeletonDashboard } from "@/components/ui/Skeleton";

export default function CompanyDashboard() {
  const { companyId } = useParams<{ companyId: string }>();
  const { leads, loading, error, refetch } = useLeads(companyId);
  const { company } = useCompany();
  const router = useRouter();
  const [showNewLead, setShowNewLead] = useState(false);

  if (loading) return <SkeletonDashboard />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-red-500 font-semibold">{error}</div>
        <p className="text-sm text-gray-400">Verifica se a sheet está partilhada com a tua conta Google.</p>
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
    <div>
      <StatsTicker leads={leads} />
      <div className="dashboard-container">
        <LeadsMap leads={leads} />
        <div className="card-on8">
          <QuickActions
            onNewLead={() => setShowNewLead(true)}
            onGoToLeads={() => router.push(`/${companyId}/leads`)}
          />
          <AlertsList leads={leads} />
        </div>
        <FunnelChart leads={leads} />
      </div>

      {/* Floating button */}
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
