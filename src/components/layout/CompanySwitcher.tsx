"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCompany } from "@/hooks/useCompany";
import { useLeads } from "@/hooks/useLeads";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function CompanySwitcher() {
  const { company, companies, currentCompanyId, setCompany } = useCompany();
  const { leads } = useLeads(currentCompanyId);
  const router = useRouter();

  const handleSelect = (id: string) => {
    setCompany(id);
    const c = companies.find((co) => co.id === id);
    if (c?.isParent) {
      router.push("/dashboard");
    } else {
      router.push(`/${id}/dashboard`);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: company?.color }}
          />
          {company?.name || "Selecionar"}
          {leads.length > 0 && (
            <span className="bg-white/20 text-[0.65rem] px-1.5 py-0.5 rounded-full">
              {leads.length}
            </span>
          )}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50"
          sideOffset={5}
        >
          {companies.map((c) => (
            <DropdownMenu.Item
              key={c.id}
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-md cursor-pointer hover:bg-gray-100 outline-none"
              onSelect={() => handleSelect(c.id)}
            >
              <Image
                src={c.logo}
                alt={c.name}
                width={28}
                height={28}
                className="rounded-md object-contain bg-gray-50"
              />
              <span className="font-medium">{c.name}</span>
              {c.isParent && (
                <span className="ml-auto text-[0.65rem] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  Grupo
                </span>
              )}
              {!c.sheetId && !c.isParent && (
                <span className="ml-auto text-[0.6rem] text-gray-300">
                  sem dados
                </span>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
