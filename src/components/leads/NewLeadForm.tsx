"use client";

import { useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  companyId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const FIELDS = [
  { key: "Name", label: "Nome", required: true },
  { key: "Email", label: "Email", type: "email", required: true },
  { key: "Phone", label: "Telemóvel", type: "tel" },
  { key: "Zone", label: "Zona", select: ["Lisboa", "Porto", "Braga", "Aveiro", "Setúbal", "Faro", "Leiria", "Coimbra", "Viseu", "Santarém"] },
  { key: "Situation", label: "Situação" },
  { key: "Typology", label: "Tipologia" },
  { key: "Construction method", label: "Método Construção" },
  { key: "Timeframe", label: "Prazo" },
  { key: "Budget", label: "Orçamento" },
  { key: "Preferred contact", label: "Contacto Preferido", select: ["Email", "Telefone", "WhatsApp"] },
  { key: "Preferred time", label: "Hora Preferida", select: ["Manhã", "Tarde", "Sem preferência"] },
];

export default function NewLeadForm({ companyId, open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.Name || !form.Email) {
      toast.warning("Nome e Email são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, ...form }),
      });

      if (res.ok) {
        toast.success("Lead criada com sucesso!");
        setForm({});
        onCreated();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data?.error || "Erro ao criar lead.");
      }
    } catch {
      toast.error("Erro ao criar lead.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-50 focus:outline-none">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="font-bold text-lg">Nova Lead Manual</Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </Dialog.Close>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {FIELDS.map((f) => (
                <div key={f.key} className={f.key === "Name" ? "col-span-2" : ""}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    {f.label}
                    {f.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  {f.select ? (
                    <select
                      value={form[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecionar...</option>
                      {f.select.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      value={form[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full mt-6 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "A criar..." : "Criar Lead"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
