import { google } from "googleapis";

function getAuth(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
}

function getGmail(accessToken: string) {
  return google.gmail({ version: "v1", auth: getAuth(accessToken) });
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  date: string;
  subject: string;
  body: string;
}

export async function searchEmailsBySubject(
  accessToken: string,
  subject: string
): Promise<EmailMessage[]> {
  const gmail = getGmail(accessToken);

  const res = await gmail.users.messages.list({
    userId: "me",
    q: `subject:"${subject}"`,
  });

  if (!res.data.messages || res.data.messages.length === 0) return [];

  const messages: EmailMessage[] = [];
  for (const msg of res.data.messages) {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id!,
      format: "full",
    });

    const headers = detail.data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
        ?.value || "";

    let body = "";
    if (detail.data.payload?.body?.data) {
      body = Buffer.from(detail.data.payload.body.data, "base64").toString(
        "utf-8"
      );
    } else if (detail.data.payload?.parts) {
      const textPart = detail.data.payload.parts.find(
        (p) => p.mimeType === "text/plain"
      );
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
      }
    }

    messages.push({
      id: msg.id!,
      from: getHeader("From"),
      to: getHeader("To"),
      date: getHeader("Date"),
      subject: getHeader("Subject"),
      body,
    });
  }

  return messages.reverse();
}

export async function sendEmail(
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const gmail = getGmail(accessToken);

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    `${body}<br><br>---<br>Enviado via CRM ON8`,
  ].join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  return true;
}
