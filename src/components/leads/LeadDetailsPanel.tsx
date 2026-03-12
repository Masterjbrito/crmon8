"use client";

import { Lead } from "@/types/lead";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import LeadTimeline from "./LeadTimeline";
import EmailThread from "./EmailThread";
import EmailComposer from "./EmailComposer";
import NotesSection from "./NotesSection";

interface Props {
  lead: Lead;
  companyId: string;
  onClose: () => void;
  onRefresh: () => void;
}

export default function LeadDetailsPanel({ lead, companyId, onClose, onRefresh }: Props) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-0 right-0 h-full w-[550px] bg-white z-50 shadow-2xl lead-panel-border overflow-y-auto focus:outline-none">
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
              <button className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                &times;
              </button>
            </Dialog.Close>
          </div>

          <div className="p-4">
            <div className="bg-gray-50 rounded-xl p-3 mb-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-bold">Email:</span>
                <br />
                {lead.Email || "---"}
              </div>
              <div>
                <span className="font-bold">Telemóvel:</span>
                <br />
                {lead.Phone || "---"}
              </div>
              <div>
                <span className="font-bold">Zona:</span>
                <br />
                {lead.Zone || "---"}
              </div>
              <div>
                <span className="font-bold">Status:</span>
                <br />
                {lead.Status || "Pendente"}
              </div>
            </div>

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
