"use client";

import { Lead } from "@/types/lead";

interface Props {
  leads: Lead[];
}

export default function AlertsList({ leads }: Props) {
  const recent = leads.slice(0, 5);

  return (
    <div>
      <h6 className="font-bold mb-3 text-gray-500 text-xs uppercase">
        Últimos Alertas (5 dias)
      </h6>
      <div className="overflow-auto" style={{ maxHeight: 250 }}>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400">Sem alertas.</p>
        ) : (
          recent.map((l, i) => (
            <div key={i} className="alert-item">
              <div className="font-bold text-sm">{l.Name || "Lead"}</div>
              <div className="text-xs text-gray-500">{l.Status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
