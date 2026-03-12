"use client";

import { useParams } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import StatsTicker from "@/components/dashboard/StatsTicker";
import LeadsMap from "@/components/dashboard/LeadsMap";
import QuickActions from "@/components/dashboard/QuickActions";
import AlertsList from "@/components/dashboard/AlertsList";
import FunnelChart from "@/components/dashboard/FunnelChart";

export default function CompanyDashboard() {
  const { companyId } = useParams<{ companyId: string }>();
  const { leads, loading } = useLeads(companyId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">A carregar dashboard...</div>
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
