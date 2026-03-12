"use client";

import { useRouter } from "next/navigation";
import { useCompany } from "@/hooks/useCompany";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function CompanySwitcher() {
  const { company, companies, setCompany } = useCompany();
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50"
          sideOffset={5}
        >
          {companies.map((c) => (
            <DropdownMenu.Item
              key={c.id}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 outline-none"
              onSelect={() => handleSelect(c.id)}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.name}
              {c.isParent && (
                <span className="ml-auto text-xs text-gray-400">Grupo</span>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
