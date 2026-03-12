import { CompanyConfig } from "@/types/company";

export const COMPANIES: CompanyConfig[] = [
  {
    id: "on8",
    name: "ON8 (Grupo)",
    sheetId: null,
    color: "#2563eb",
    logo: "/logos/on8.jpg",
    isParent: true,
  },
  {
    id: "on8-living",
    name: "ON8 Living",
    sheetId: "1LinMzstDoOWAl-knbTUeiatiRuXbOrDEIVPvMQc1FvM",
    color: "#2563eb",
    logo: "/logos/on8-living.jpg",
    zones: {
      Lisboa: [38.72, -9.13],
      Porto: [41.15, -8.62],
      Braga: [41.55, -8.42],
      Aveiro: [40.64, -8.65],
      "Setúbal": [38.52, -8.89],
      Faro: [37.01, -7.93],
      Leiria: [39.74, -8.8],
      Coimbra: [40.2, -8.41],
      Viseu: [40.65, -7.91],
      "Santarém": [39.23, -8.68],
    },
  },
  {
    id: "on8-it",
    name: "ON8 IT",
    sheetId: null,
    color: "#6366f1",
    logo: "/logos/on8-it.jpg",
  },
  {
    id: "habiteight",
    name: "Habiteight",
    sheetId: null,
    color: "#10b981",
    logo: "/logos/habiteight.jpg",
  },
];

export function getCompany(id: string): CompanyConfig | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function getChildCompanies(): CompanyConfig[] {
  return COMPANIES.filter((c) => !c.isParent && c.sheetId);
}
