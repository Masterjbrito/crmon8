"use client";

import { Lead } from "@/types/lead";

interface Props {
  leads: Lead[];
}

interface StatCard {
  cls: string;
  icon: string;
  title: string;
  mainValue: string;
  mainSuffix?: string;
  rows: { left: string; right?: string; rightClass?: string }[];
}

export default function StatsTicker({ leads }: Props) {
  const getCount = (status: string) => leads.filter((l) => l.Status === status).length;
  const total = leads.length;

  const cards: StatCard[] = [
    {
      cls: "brd-leads",
      icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
      title: "Leads",
      mainValue: String(getCount("Pendente")),
      mainSuffix: "por abrir",
      rows: [
        { left: `Acum. Mês: ${total}`, right: "\u2191 12%", rightClass: "growth-up" },
      ],
    },
    {
      cls: "brd-estudo",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      title: "Em Estudo / Visita",
      mainValue: String(getCount("Visita Técnica")),
      rows: [
        { left: `Visitas: ${getCount("Visita Técnica")}` },
      ],
    },
    {
      cls: "brd-orc",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      title: "Orçamentos",
      mainValue: String(getCount("Em Orçamentação")),
      mainSuffix: "Elaborados",
      rows: [
        { left: `Acum.: ${getCount("Em Orçamentação")}`, right: "\u2191 8%", rightClass: "growth-up" },
      ],
    },
    {
      cls: "brd-adj",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Adjudicação",
      mainValue: String(getCount("Adjudicado")),
      rows: [
        { left: `Total: ${getCount("Adjudicado")}` },
      ],
    },
    {
      cls: "brd-fat",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Faturação",
      mainValue: "---",
      rows: [{ left: "Em breve" }],
    },
    {
      cls: "brd-obra",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      title: "Gestão de Obra",
      mainValue: "",
      rows: [
        { left: "Em curso: ---" },
      ],
    },
    {
      cls: "brd-obj",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Objetivos",
      mainValue: "",
      rows: [
        { left: "Fat. Mensal: ---" },
      ],
    },
  ];

  const renderCard = (card: StatCard, key: number) => (
    <div key={key} className={`stat-card-detail ${card.cls}`}>
      <div className="stat-title">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
        </svg>
        {card.title}
      </div>
      {card.mainValue && (
        <span className="stat-main-val">
          {card.mainValue}
          {card.mainSuffix && (
            <small className="text-gray-400 text-[0.6rem] ml-1">{card.mainSuffix}</small>
          )}
        </span>
      )}
      {card.rows.map((row, j) => (
        <div key={j} className="stat-sub-row">
          <span>{row.left}</span>
          {row.right && <span className={row.rightClass || ""}>{row.right}</span>}
        </div>
      ))}
    </div>
  );

  // Duplicate for infinite scroll
  return (
    <div className="global-stats-wrapper">
      <div className="global-stats-grid">
        {cards.map((c, i) => renderCard(c, i))}
        {cards.map((c, i) => renderCard(c, i + 100))}
      </div>
    </div>
  );
}
