"use client";

import { useEffect, useState } from "react";
import { Lead } from "@/types/lead";
import { HistoryEntry } from "@/types/history";

interface Props {
  lead: Lead;
  companyId: string;
}

function parseDateBr(v: string): Date {
  if (!v) return new Date(0);
  const parts = v.split(" ");
  if (parts.length < 2) return new Date(0);
  const dateParts = parts[0].split("/");
  if (dateParts.length !== 3) return new Date(0);
  const timeParts = parts[1].split(":");
  return new Date(
    parseInt(dateParts[2]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[0]),
    parseInt(timeParts[0] || "0"),
    parseInt(timeParts[1] || "0")
  );
}

export default function LeadTimeline({ lead, companyId }: Props) {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [histRes, emailRes] = await Promise.all([
          fetch(`/api/history?leadId=${encodeURIComponent(lead["ID Lead"])}&companyId=${companyId}`),
          fetch(`/api/emails/thread?leadId=${encodeURIComponent(lead["ID Lead"])}`),
        ]);

        const history: HistoryEntry[] = histRes.ok ? await histRes.json() : [];
        const emails = emailRes.ok ? await emailRes.json() : [];

        const emailEntries: HistoryEntry[] = emails.map((e: any) => ({
          data: e.date || "",
          tipo: "EMAIL",
          titulo: "Email",
          conteudo: `De: ${e.from} Para: ${e.to}`,
        }));

        const systemEntry: HistoryEntry = {
          data: lead["Data Receção"] || "",
          tipo: "SISTEMA",
          titulo: "Lead Registada",
          conteudo: "Entrada via sistema.",
        };

        const all = [systemEntry, ...history.filter((h) => h.tipo !== "EMAIL"), ...emailEntries];
        all.sort((a, b) => parseDateBr(b.data).getTime() - parseDateBr(a.data).getTime());
        setItems(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [lead, companyId]);

  if (loading) return <p className="text-sm text-gray-400 p-3">A carregar...</p>;

  return (
    <div className="timeline-container">
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Sem histórico.</p>
      ) : (
        items.map((h, i) => {
          const badgeClass =
            h.tipo === "EMAIL"
              ? "email-badge"
              : h.tipo === "SISTEMA"
              ? "system-badge"
              : "note-badge";

          return (
            <div key={i} className="timeline-item">
              <span className={badgeClass}>{h.tipo}</span>
              <small className="text-gray-400 ml-2">{h.data}</small>
              <p className="text-sm mb-1 mt-1 font-bold">{h.titulo || ""}</p>
              <p className="text-sm text-gray-500 mb-0">{h.conteudo}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
