"use client";

import { toast } from "sonner";

interface Props {
  onNewLead: () => void;
  onGoToLeads: () => void;
}

const actions = [
  { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "Nova Lead", action: "newLead" },
  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Agenda", action: "soon" },
  { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Obras", action: "soon" },
  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "Orçamentos", action: "soon" },
  { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "Pagamentos", action: "soon" },
  { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", label: "Definições", action: "soon" },
];

export default function QuickActions({ onNewLead, onGoToLeads }: Props) {
  const handleClick = (action: string) => {
    switch (action) {
      case "newLead":
        onNewLead();
        break;
      case "goToLeads":
        onGoToLeads();
        break;
      default:
        toast.info("Funcionalidade em desenvolvimento.");
    }
  };

  return (
    <div>
      <h6 className="font-bold mb-3 text-gray-500 text-xs uppercase">
        Ações Rápidas
      </h6>
      <div className="icon-grid">
        {actions.map((a) => (
          <div
            key={a.label}
            className="icon-box"
            onClick={() => handleClick(a.action)}
          >
            <svg
              className="w-6 h-6 mx-auto mb-1 text-[#2563eb]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={a.icon}
              />
            </svg>
            <span className="text-[0.7rem] font-semibold text-gray-600">
              {a.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
