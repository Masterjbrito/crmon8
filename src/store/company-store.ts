import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyStore {
  currentCompanyId: string;
  setCompany: (id: string) => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      currentCompanyId: "on8-living",
      setCompany: (id: string) => set({ currentCompanyId: id }),
    }),
    { name: "crm-on8-company" }
  )
);
