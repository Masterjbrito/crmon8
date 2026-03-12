"use client";

import { useState } from "react";
import { Lead } from "@/types/lead";
import { toast } from "sonner";

interface Props {
  lead: Lead;
  companyId: string;
  onSent: () => void;
}

export default function EmailComposer({ lead, companyId, onSent }: Props) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!lead.Email) {
      toast.warning("Esta lead não tem email associado.");
      return;
    }
    if (!body.trim()) {
      toast.warning("Escreve a mensagem antes de enviar.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: lead.Email,
          subject: lead["ID Lead"],
          message: body,
          leadId: lead["ID Lead"],
          companyId,
        }),
      });

      if (res.ok) {
        setBody("");
        toast.success("Email enviado com sucesso!");
        onSent();
      } else {
        const data = await res.json();
        toast.error(data?.error || "Erro ao enviar email.");
      }
    } catch {
      toast.error("Erro ao enviar email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* Destinatário */}
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">Para</label>
        <input
          type="text"
          value={lead.Email || "Sem email"}
          readOnly
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
        />
      </div>

      {/* Assunto (ID Lead, readonly) */}
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">Assunto</label>
        <input
          type="text"
          value={lead["ID Lead"] || ""}
          readOnly
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 font-mono"
        />
      </div>

      {/* Corpo */}
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">Mensagem</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escreve a mensagem..."
          rows={6}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={sending || !lead.Email}
        className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {sending ? (
          "A enviar..."
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Enviar via CRM
          </>
        )}
      </button>

      <p className="text-[0.65rem] text-gray-400 mt-2 text-center">
        O email será enviado pela conta Google autenticada. Assinatura: "Enviado via CRM ON8"
      </p>
    </div>
  );
}
