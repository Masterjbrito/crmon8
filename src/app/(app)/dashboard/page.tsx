"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import StatsTicker from "@/components/dashboard/StatsTicker";
import LeadsMap from "@/components/dashboard/LeadsMap";
import QuickActions from "@/components/dashboard/QuickActions";
import AlertsList from "@/components/dashboard/AlertsList";
import FunnelChart from "@/components/dashboard/FunnelChart";
import { COMPANIES } from "@/lib/companies.config";
import { toast } from "sonner";

export default function GroupDashboard() {
  const { leads, loading } = useLeads("on8");
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">A carregar dashboard do grupo...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#0f172a] text-white px-6 py-3 text-sm font-semibold flex items-center gap-3">
        <Image src="/logos/on8.jpg" alt="ON8" width={28} height={28} className="rounded-md" />
        Visão Grupo ON8 — Dados agregados de todas as empresas
      </div>
      <StatsTicker leads={leads} />
      <div className="dashboard-container">
        <LeadsMap leads={leads} />
        <div className="card-on8">
          <QuickActions
            onNewLead={() => toast.info("Seleciona uma empresa para criar leads.")}
            onGoToLeads={() => router.push("/on8-living/leads")}
          />
          <AlertsList
          leads={leads}
          onSelectLead={(lead) => {
            const cId = lead.companyId || "on8-living";
            router.push(`/${cId}/leads`);
          }}
        />
          <div className="mt-4">
            <h6 className="font-bold mb-2 text-gray-500 text-xs uppercase">
              Leads por Empresa
            </h6>
            {COMPANIES.filter((c) => !c.isParent).map((c) => {
              const count = leads.filter((l) => l.companyId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded px-1"
                  onClick={() => router.push(`/${c.id}/dashboard`)}
                >
                  <div className="flex items-center gap-2.5 text-sm">
                    <Image
                      src={c.logo}
                      alt={c.name}
                      width={24}
                      height={24}
                      className="rounded-md object-contain"
                    />
                    <span className="font-medium">{c.name}</span>
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
