"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead } from "@/types/lead";

export function useLeads(companyId: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads?companyId=${companyId}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(Array.isArray(data) ? data : []);
      } else {
        console.error("[useLeads] API error:", data);
        setError(data.error || "Erro ao carregar leads");
        setLeads([]);
      }
    } catch (err) {
      console.error("[useLeads] Fetch error:", err);
      setError("Erro de ligação");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
}
