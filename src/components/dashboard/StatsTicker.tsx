"use client";

import { Lead } from "@/types/lead";

interface Props {
  leads: Lead[];
}

export default function StatsTicker({ leads }: Props) {
  const getCount = (status: string) => leads.filter((l) => l.Status === status).length;
  const total = leads.length;

  const cards = `
    <div class="stat-card-detail brd-leads">
      <div class="stat-title">&#x1f3af; Leads</div>
      <span class="stat-main-val">${getCount("Pendente")} <small style="font-size:0.6rem;color:#64748b;">por abrir</small></span>
      <div class="stat-sub-row"><span>Acum. M&ecirc;s: <b>${total}</b></span><span class="growth-up">&uarr; 12%</span></div>
    </div>
    <div class="stat-card-detail brd-estudo">
      <div class="stat-title">&#128065; Em Estudo / Visita</div>
      <span class="stat-main-val">${getCount("Visita Técnica")}</span>
      <div class="stat-sub-row"><span>Visitas: <b>${getCount("Visita Técnica")}</b></span></div>
    </div>
    <div class="stat-card-detail brd-orc">
      <div class="stat-title">&#x1f4ca; Or&ccedil;amentos</div>
      <span class="stat-main-val">${getCount("Em Orçamentação")} <small style="font-size:0.6rem;color:#64748b;">Elaborados</small></span>
      <div class="stat-sub-row"><span>Acum.: <b>${getCount("Em Orçamentação")}</b></span><span class="growth-up">&uarr; 8%</span></div>
    </div>
    <div class="stat-card-detail brd-adj">
      <div class="stat-title">&#x2705; Adjudica&ccedil;&atilde;o</div>
      <span class="stat-main-val">${getCount("Adjudicado")}</span>
      <div class="stat-sub-row"><span>Total: <b>${getCount("Adjudicado")}</b></span></div>
    </div>
    <div class="stat-card-detail brd-fat">
      <div class="stat-title">&#x1f4b0; Fatura&ccedil;&atilde;o</div>
      <span class="stat-main-val">---</span>
      <div class="stat-sub-row"><span>Em breve</span></div>
    </div>
    <div class="stat-card-detail brd-obra">
      <div class="stat-title">&#x1f528; Gest&atilde;o de Obra</div>
      <div class="stat-sub-row"><span>Em curso: <b>---</b></span></div>
    </div>
    <div class="stat-card-detail brd-obj">
      <div class="stat-title">&#x1f3af; Objetivos</div>
      <div class="stat-sub-row"><span>Fat. Mensal: <b>---</b></span></div>
    </div>
  `;

  // Duplicate cards for infinite scroll effect
  return (
    <div className="global-stats-wrapper">
      <div
        className="global-stats-grid"
        dangerouslySetInnerHTML={{ __html: cards + cards }}
      />
    </div>
  );
}
