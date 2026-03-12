"use client";

import { useParams } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import { useCompany } from "@/hooks/useCompany";
import StatsTicker from "@/components/dashboard/StatsTicker";
import LeadsMap from "@/components/dashboard/LeadsMap";
import QuickActions from "@/components/dashboard/QuickActions";
import AlertsList from "@/components/dashboard/AlertsList";
import FunnelChart from "@/components/dashboard/FunnelChart";
import { SkeletonDashboard } from "@/components/ui/Skeleton";

export default function CompanyDashboard() {
  const { companyId } = useParams<{ companyId: string }>();
  const { leads, loading, error } = useLeads(companyId);
  const { company } = useCompany();

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
          <QuickActions />
          <AlertsList leads={leads} />
        </div>
        <FunnelChart leads={leads} />
      </div>
    </div>
  );
}
