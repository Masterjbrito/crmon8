import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM ON8",
  description: "Gestor de Leads ON8",
  icons: {
    icon: "/logos/on8.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </SessionProvider>
      </body>
    </html>
  );
}
