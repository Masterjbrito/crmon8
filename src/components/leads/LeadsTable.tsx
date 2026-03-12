"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/types/lead";
import LeadDetailsPanel from "./LeadDetailsPanel";

interface Props {
  leads: Lead[];
  companyId: string;
  onRefresh: () => void;
  initialLeadId?: string;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Pendente: "#ff9800",
    Contactado: "#2563eb",
    "Visita Técnica": "#6366f1",
    "Em Orçamentação": "#3b82f6",
    Adjudicado: "#10b981",
  };
  return colors[status] || "#64748b";
}

export default function LeadsTable({ leads, companyId, onRefresh, initialLeadId }: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-open lead from URL param
  useEffect(() => {
    if (initialLeadId && leads.length > 0 && !selectedLead) {
      const match = leads.find((l) => l["ID Lead"] === initialLeadId);
      if (match) setSelectedLead(match);
    }
  }, [initialLeadId, leads]);

  const filtered = leads.filter((l) => {
    // Status filter
    if (statusFilter !== "all" && l.Status !== statusFilter) return false;

    // Text search
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    return (
      (l.Name || "").toLowerCase().includes(q) ||
      (l["ID Lead"] || "").toLowerCase().includes(q) ||
      (l.Zone || "").toLowerCase().includes(q) ||
      (l.Status || "").toLowerCase().includes(q) ||
      (l.Email || "").toLowerCase().includes(q) ||
      (l.Phone || "").toLowerCase().includes(q)
    );
  });

  // Count leads by status for filter badges
  const statusCounts: Record<string, number> = {};
  leads.forEach((l) => {
    statusCounts[l.Status] = (statusCounts[l.Status] || 0) + 1;
  });

  return (
    <>
      <div className="card-on8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h5 className="font-bold text-lg">
            Gestão de Leads
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filtered.length}{debouncedSearch || statusFilter !== "all" ? ` de ${leads.length}` : ""})
            </span>
          </h5>
          <input
            type="text"
            placeholder="Procurar por nome, email, zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setStatusFilter("all")}
            className={`text-xs px-3 py-1 rounded-full font-medium transition ${
              statusFilter === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Todas ({leads.length})
          </button>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                statusFilter === status
                  ? "text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={
                statusFilter === status
                  ? { backgroundColor: getStatusColor(status) }
                  : undefined
              }
            >
              {status} ({count})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="table-leads overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="p-3">Data</th>
                <th className="p-3">Lead / Nome</th>
                <th className="p-3 hidden lg:table-cell">Email</th>
                <th className="p-3 hidden md:table-cell">Zona</th>
                <th className="p-3">Status</th>
                <th className="p-3 w-16">Ver</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedLead(lead)}
                  className="cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                >
                  <td className="p-3 text-sm text-gray-500 whitespace-nowrap">
                    {lead["Data Receção"]
                      ? lead["Data Receção"].toString().split(" ")[0]
                      : "---"}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-sm">{lead.Name || "S/ Nome"}</div>
                    <div className="text-xs text-gray-400 font-mono">{lead["ID Lead"]}</div>
                    {lead.Phone && (
                      <div className="text-xs text-gray-400 md:hidden">{lead.Phone}</div>
                    )}
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">{lead.Email || "---"}</span>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border">
                      {lead.Zone || "---"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className="inline-block text-white text-xs px-2.5 py-1 rounded font-medium"
                      style={{ backgroundColor: getStatusColor(lead.Status) }}
                    >
                      {lead.Status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-sm hover:bg-gray-200 hover:border-blue-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    {debouncedSearch
                      ? `Nenhuma lead encontrada para "${debouncedSearch}"`
                      : "Sem leads."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <LeadDetailsPanel
          lead={selectedLead}
          companyId={companyId}
          onClose={() => setSelectedLead(null)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}
