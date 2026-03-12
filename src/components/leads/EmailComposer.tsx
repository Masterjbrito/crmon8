"use client";

import { useState } from "react";
import { Lead } from "@/types/lead";

interface Props {
  lead: Lead;
  companyId: string;
  onSent: () => void;
}

export default function EmailComposer({ lead, companyId, onSent }: Props) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!lead.Email || !body.trim()) {
      alert("Preenche o email do lead e a mensagem.");
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
        onSent();
      } else {
        alert("Erro ao enviar email.");
      }
    } catch {
      alert("Erro ao enviar email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={lead["ID Lead"] || ""}
        readOnly
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm bg-gray-50 text-gray-500"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Escreve a mensagem..."
        rows={6}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50"
      >
        {sending ? "A enviar..." : "Enviar via CRM"}
      </button>
    </div>
  );
}
