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

  if (loading) return <p className="text-sm text-gray-400 p-3">A carregar emails...</p>;

  if (emails.length === 0) return <p className="text-sm text-gray-400 p-3">Sem emails.</p>;

  return (
    <div className="timeline-container">
      {emails.map((e) => (
        <div
          key={e.id}
          className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200"
        >
          <div className="text-xs text-gray-400 mb-1.5">
            <strong>De:</strong> {e.from} &nbsp; <strong>Data:</strong> {e.date}
          </div>
          <div
            className="text-sm text-gray-700 whitespace-pre-wrap"
          >
            {e.body}
          </div>
        </div>
      ))}
    </div>
  );
}
