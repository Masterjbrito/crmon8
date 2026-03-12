"use client";

import { useState, useCallback } from "react";
import { Lead } from "@/types/lead";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import LeadTimeline from "./LeadTimeline";
import EmailThread from "./EmailThread";
import EmailComposer from "./EmailComposer";
import NotesSection from "./NotesSection";

const STATUSES = [
  { value: "Pendente", color: "#ff9800" },
  { value: "Contactado", color: "#2563eb" },
  { value: "Visita Técnica", color: "#6366f1" },
  { value: "Em Orçamentação", color: "#3b82f6" },
  { value: "Adjudicado", color: "#10b981" },
];

interface Props {
  lead: Lead;
  companyId: string;
  onClose: () => void;
  onRefresh: () => void;
}

// All lead detail fields from original GAS
const DETAIL_FIELDS: { key: keyof Lead; label: string }[] = [
  { key: "Email", label: "Email" },
  { key: "Phone", label: "Telemóvel" },
  { key: "Zone", label: "Zona" },
  { key: "Situation", label: "Situação" },
  { key: "Typology", label: "Tipologia" },
  { key: "Construction method", label: "Método Construção" },
  { key: "Timeframe", label: "Prazo" },
  { key: "Budget", label: "Orçamento" },
  { key: "Preferred contact", label: "Contacto Preferido" },
  { key: "Preferred time", label: "Hora Preferida" },
  { key: "Data Receção", label: "Data Receção" },
  { key: "Ultima Modificacao", label: "Última Modificação" },
];

export default function LeadDetailsPanel({ lead, companyId, onClose, onRefresh }: Props) {
  const [currentStatus, setCurrentStatus] = useState(lead.Status || "Pendente");
  const [changingStatus, setChangingStatus] = useState(false);
  const [emailRefreshKey, setEmailRefreshKey] = useState(0);
  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setChangingStatus(true);
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(lead["ID Lead"])}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, status: newStatus }),
      });
      if (res.ok) {
        setCurrentStatus(newStatus);
        toast.success(`Status alterado para ${newStatus}`);
        setTimelineRefreshKey((k) => k + 1);
        onRefresh();
      } else {
        toast.error("Erro ao alterar status");
      }
    } catch {
      toast.error("Erro ao alterar status");
    } finally {
      setChangingStatus(false);
    }
  };

  // After sending email: refresh thread, timeline, mark as Contactado
  const handleEmailSent = useCallback(async () => {
    setEmailRefreshKey((k) => k + 1);
    setTimelineRefreshKey((k) => k + 1);
    // Auto-set to Contactado like original GAS enviarEmailManual
    if (currentStatus === "Pendente") {
      await handleStatusChange("Contactado");
    }
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatus]);

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-0 right-0 h-full w-full sm:w-[580px] bg-white z-50 shadow-2xl lead-panel-border overflow-y-auto focus:outline-none">
          {/* Header */}
          <div className="border-b p-4 flex items-start justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <Dialog.Title className="font-bold text-lg">
                {lead.Name || "Sem Nome"}
              </Dialog.Title>
              <p className="text-sm text-gray-500 font-mono">
                {lead["ID Lead"] || "---"}
              </p>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-1">
                &times;
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4">
            {/* Full Lead Detail - All 13 fields */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h6 className="text-xs font-bold text-gray-400 uppercase mb-3">Informação da Lead</h6>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {DETAIL_FIELDS.map((f) => {
                  const val = lead[f.key];
                  if (!val) return null;
                  return (
                    <div key={f.key} className="text-sm">
                      <span className="font-semibold text-gray-500 text-xs block">{f.label}</span>
                      <span className="text-gray-800">{String(val)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Pills */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">
                Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    disabled={changingStatus}
                    onClick={() => handleStatusChange(s.value)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${
                      currentStatus === s.value
                        ? "text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    style={
                      currentStatus === s.value
                        ? { backgroundColor: s.color }
                        : undefined
                    }
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs.Root defaultValue="historico">
              <Tabs.List className="flex gap-1 mb-0">
                <Tabs.Trigger value="historico" className="tab-on8">
                  Histórico
                </Tabs.Trigger>
                <Tabs.Trigger value="emails" className="tab-on8">
                  Emails
                </Tabs.Trigger>
                <Tabs.Trigger value="enviar" className="tab-on8">
                  Enviar
                </Tabs.Trigger>
                <Tabs.Trigger value="notas" className="tab-on8">
                  Notas
                </Tabs.Trigger>
              </Tabs.List>

              <div className="tab-content-on8">
                <Tabs.Content value="historico">
                  <LeadTimeline key={timelineRefreshKey} lead={lead} companyId={companyId} />
                </Tabs.Content>
                <Tabs.Content value="emails">
                  <EmailThread key={emailRefreshKey} leadId={lead["ID Lead"]} />
                </Tabs.Content>
                <Tabs.Content value="enviar">
                  <EmailComposer
                    lead={lead}
                    companyId={companyId}
                    onSent={handleEmailSent}
                  />
                </Tabs.Content>
                <Tabs.Content value="notas">
                  <NotesSection
                    leadId={lead["ID Lead"]}
                    companyId={companyId}
                  />
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
