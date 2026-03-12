"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCompany } from "@/hooks/useCompany";
import CompanySwitcher from "./CompanySwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const { currentCompanyId, company } = useCompany();

  const isGroup = company?.isParent;
  const basePath = isGroup ? "" : `/${currentCompanyId}`;

  const navItems = isGroup
    ? [{ label: "Dashboard", href: "/dashboard" }]
    : [
        { label: "Dashboard", href: `/${currentCompanyId}/dashboard` },
        { label: "Leads", href: `/${currentCompanyId}/leads` },
      ];

  return (
    <nav className="navbar-on8 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={basePath + "/dashboard"} className="flex items-center gap-2">
          {company?.logo && (
            <Image
              src={company.logo}
              alt={company.name}
              width={40}
              height={40}
              className="rounded-lg object-contain bg-white"
            />
          )}
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
            CRM
          </span>
        </Link>
        <CompanySwitcher />
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link-on8 text-sm ${
              pathname === item.href ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
        {!isGroup && (
          <Link
            href="/dashboard"
            className={`nav-link-on8 text-sm ${
              pathname === "/dashboard" ? "active" : ""
            }`}
          >
            Grupo
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="nav-link-on8 text-sm ml-2 opacity-60 hover:opacity-100"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
