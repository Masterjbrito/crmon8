"use client";

import { useLeads } from "@/hooks/useLeads";
import StatsTicker from "@/components/dashboard/StatsTicker";
import LeadsMap from "@/components/dashboard/LeadsMap";
import QuickActions from "@/components/dashboard/QuickActions";
import AlertsList from "@/components/dashboard/AlertsList";
import FunnelChart from "@/components/dashboard/FunnelChart";
import { COMPANIES } from "@/lib/companies.config";

export default function GroupDashboard() {
  // Fetch from parent (on8) which aggregates all children
  const { leads, loading } = useLeads("on8");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">A carregar dashboard do grupo...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#0f172a] text-white px-6 py-3 text-sm font-semibold flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-white/30" />
        Visão Grupo ON8 — Dados agregados de todas as empresas
      </div>
      <StatsTicker leads={leads} />
      <div className="dashboard-container">
        <LeadsMap leads={leads} />
        <div className="card-on8">
          <QuickActions />
          <AlertsList leads={leads} />
          {/* Company breakdown */}
          <div className="mt-4">
            <h6 className="font-bold mb-2 text-gray-500 text-xs uppercase">
              Leads por Empresa
            </h6>
            {COMPANIES.filter((c) => !c.isParent).map((c) => {
              const count = leads.filter((l) => l.companyId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </div>
                  <span className="text-sm font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <FunnelChart leads={leads} />
      </div>
    </div>
  );
}
