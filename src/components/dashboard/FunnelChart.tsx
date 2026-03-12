"use client";

import { Lead } from "@/types/lead";

interface Props {
  leads: Lead[];
}

export default function FunnelChart({ leads }: Props) {
  const total = leads.length;
  const getCount = (status: string) => leads.filter((l) => l.Status === status).length;

  const steps = [
    { label: "Leads", count: total, color: "#64748b", rate: "" },
    {
      label: "Contactadas",
      count: getCount("Contactado"),
      color: "#3b82f6",
      rate: total > 0 ? Math.round((getCount("Contactado") / total) * 100) + "%" : "0%",
    },
    {
      label: "Visitas",
      count: getCount("Visita Técnica"),
      color: "#6366f1",
      rate: total > 0 ? Math.round((getCount("Visita Técnica") / total) * 100) + "%" : "0%",
    },
    {
      label: "Adjudicação",
      count: getCount("Adjudicado"),
      color: "#10b981",
      rate: total > 0 ? Math.round((getCount("Adjudicado") / total) * 100) + "%" : "0%",
    },
  ];

  return (
    <div className="card-on8">
      <h6 className="font-bold mb-4 text-gray-500 text-xs uppercase">
        Funil Comercial
      </h6>
      {steps.map((s, i) => (
        <div
          key={s.label}
          className="funnel-step"
          style={{
            background: s.color,
            width: `${100 - i * 8}%`,
          }}
        >
          <span>{s.label}</span>
          <span>{s.count}</span>
          {s.rate && <div className="conv-rate">{s.rate} de eficácia</div>}
        </div>
      ))}
    </div>
  );
}
