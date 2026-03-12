"use client";

import { useEffect, useState } from "react";

interface EmailMsg {
  id: string;
  from: string;
  to: string;
  date: string;
  subject: string;
  body: string;
}

interface Props {
  leadId: string;
}

export default function EmailThread({ leadId }: Props) {
  const [emails, setEmails] = useState<EmailMsg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emails/thread?leadId=${encodeURIComponent(leadId)}`);
        if (res.ok) {
          setEmails(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, [leadId]);

  if (loading) {
    return (
      <div className="timeline-container space-y-3 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-3xl opacity-20 mb-2">📧</div>
        <p className="text-sm text-gray-400">Sem emails trocados com esta lead.</p>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      {emails.map((e) => (
        <div
          key={e.id}
          className="bg-[#f8fafc] p-3 rounded-lg mb-3 border border-[#e2e8f0]"
        >
          <div className="text-xs text-[#64748b] mb-1.5 flex flex-wrap gap-x-4">
            <span><strong>De:</strong> {e.from}</span>
            <span><strong>Para:</strong> {e.to}</span>
            <span><strong>Data:</strong> {e.date}</span>
          </div>
          <div className="text-[13px] text-[#334155] whitespace-pre-wrap leading-relaxed">
            {e.body}
          </div>
        </div>
      ))}
    </div>
  );
}
