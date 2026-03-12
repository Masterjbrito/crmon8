"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead } from "@/types/lead";

export function useLeads(companyId: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, refetch: fetchLeads };
}
