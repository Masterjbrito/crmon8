"use client";

import { useState } from "react";
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

export default function LeadDetailsPanel({ lead, companyId, onClose, onRefresh }: Props) {
  const [currentStatus, setCurrentStatus] = useState(lead.Status || "Pendente");
  const [changingStatus, setChangingStatus] = useState(false);

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

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-0 right-0 h-full w-full sm:w-[550px] bg-white z-50 shadow-2xl lead-panel-border overflow-y-auto focus:outline-none">
          <div className="border-b p-4 flex items-start justify-between">
            <div>
              <Dialog.Title className="font-bold text-lg">
                {lead.Name || "Sem Nome"}
              </Dialog.Title>
              <p className="text-sm text-gray-500">
                ID: {lead["ID Lead"] || "---"}
              </p>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-1">
                &times;
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4">
            {/* Core Info */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-bold text-gray-500 text-xs">Email</span>
                  <br />
                  {lead.Email || "---"}
                </div>
                <div>
                  <span className="font-bold text-gray-500 text-xs">Telemóvel</span>
                  <br />
                  {lead.Phone || "---"}
                </div>
                <div>
                  <span className="font-bold text-gray-500 text-xs">Zona</span>
                  <br />
                  {lead.Zone || "---"}
                </div>
                <div>
                  <span className="font-bold text-gray-500 text-xs">Tipologia</span>
                  <br />
                  {lead.Typology || "---"}
                </div>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">
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
                  <LeadTimeline lead={lead} companyId={companyId} />
                </Tabs.Content>
                <Tabs.Content value="emails">
                  <EmailThread leadId={lead["ID Lead"]} />
                </Tabs.Content>
                <Tabs.Content value="enviar">
                  <EmailComposer
                    lead={lead}
                    companyId={companyId}
                    onSent={onRefresh}
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
