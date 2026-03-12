"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompany } from "@/hooks/useCompany";
import CompanySwitcher from "./CompanySwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const { currentCompanyId } = useCompany();

  const navItems = [
    { label: "Dashboard", href: `/${currentCompanyId}/dashboard` },
    { label: "Leads", href: `/${currentCompanyId}/leads` },
  ];

  return (
    <nav className="navbar-on8 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={`/${currentCompanyId}/dashboard`} className="flex items-center">
          <span className="text-white font-bold text-xl tracking-tight">ON8 CRM</span>
        </Link>
        <CompanySwitcher />
      </div>
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link-on8 text-sm ${
              pathname.includes(item.href) ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/dashboard"
          className={`nav-link-on8 text-sm ${
            pathname === "/dashboard" ? "active" : ""
          }`}
        >
          Grupo ON8
        </Link>
      </div>
    </nav>
  );
}
