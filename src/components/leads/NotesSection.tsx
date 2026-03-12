"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Note {
  data: string;
  texto: string;
}

interface Props {
  leadId: string;
  companyId: string;
}

export default function NotesSection({ leadId, companyId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/notes?leadId=${encodeURIComponent(leadId)}&companyId=${companyId}`
      );
      if (res.ok) {
        setNotes(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId, companyId]);

  // BUG #1 FIX: saveInternalNote now calls POST /api/notes
  const handleSave = async () => {
    if (!newNote.trim()) {
      toast.warning("Escreve uma nota primeiro.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, companyId, texto: newNote }),
      });

      if (res.ok) {
        setNewNote("");
        toast.success("Nota guardada com sucesso!");
        await fetchNotes();
      } else {
        toast.error("Erro ao guardar nota.");
      }
    } catch {
      toast.error("Erro ao guardar nota.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Escreve uma nota..."
        rows={4}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50 mb-4"
      >
        {saving ? "A guardar..." : "Guardar Nota"}
      </button>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl opacity-20 mb-2">📝</div>
          <p className="text-sm text-gray-400">Sem notas para esta lead.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((n, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">{n.data}</div>
              <div className="text-sm text-gray-700">{n.texto}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
