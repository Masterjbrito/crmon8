import { google } from "googleapis";
import { Lead } from "@/types/lead";
import { HistoryEntry } from "@/types/history";
import { format } from "date-fns";

function getAuth(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
}

function getSheets(accessToken: string) {
  return google.sheets({ version: "v4", auth: getAuth(accessToken) });
}

export async function getLeads(
  accessToken: string,
  sheetId: string
): Promise<Lead[]> {
  const sheets = getSheets(accessToken);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Folha1",
  });

  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const lead: Record<string, string> = {};
    headers.forEach((col: string, i: number) => {
      lead[col] = row[i] || "";
    });
    if (!lead["Status"]) lead["Status"] = "Pendente";
    return lead as unknown as Lead;
  });
}

export async function updateLeadStatus(
  accessToken: string,
  sheetId: string,
  leadId: string,
  newStatus: string
): Promise<boolean> {
  const sheets = getSheets(accessToken);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Folha1",
  });

  const rows = res.data.values;
  if (!rows) return false;

  const headers = rows[0];
  let colStatus = headers.indexOf("Status");
  let colModif = headers.indexOf("Ultima Modificacao");

  if (colStatus === -1) {
    colStatus = headers.length;
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Folha1!${colLetter(colStatus)}1`,
      valueInputOption: "RAW",
      requestBody: { values: [["Status"]] },
    });
  }

  if (colModif === -1) {
    colModif = colStatus + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Folha1!${colLetter(colModif)}1`,
      valueInputOption: "RAW",
      requestBody: { values: [["Ultima Modificacao"]] },
    });
  }

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === leadId) {
      const rowNum = i + 1;
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          valueInputOption: "RAW",
          data: [
            {
              range: `Folha1!${colLetter(colStatus)}${rowNum}`,
              values: [[newStatus]],
            },
            {
              range: `Folha1!${colLetter(colModif)}${rowNum}`,
              values: [[format(new Date(), "dd/MM/yyyy HH:mm")]],
            },
          ],
        },
      });
      await registerHistory(accessToken, sheetId, leadId, "SISTEMA", `Alteração de Status para ${newStatus}`);
      return true;
    }
  }
  return false;
}

export async function getHistory(
  accessToken: string,
  sheetId: string,
  leadId: string
): Promise<HistoryEntry[]> {
  const sheets = getSheets(accessToken);
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Historico",
    });

    const rows = res.data.values;
    if (!rows) return [];

    return rows
      .filter((row) => row[1] === leadId) // BUG #2 FIX: filter by row[1] (ID Lead), not row[0] (Data)
      .map((row) => ({
        data: row[0] || "",
        tipo: row[2] || "",
        titulo: row[3] || "",
        conteudo: row[3] || "",
      }))
      .reverse();
  } catch {
    return [];
  }
}

export async function getNotes(
  accessToken: string,
  sheetId: string,
  leadId: string
): Promise<{ data: string; texto: string }[]> {
  const sheets = getSheets(accessToken);
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Notas",
    });

    const rows = res.data.values;
    if (!rows) return [];

    return rows
      .filter((row) => row[0] === leadId)
      .map((row) => ({
        data: row[1] || "",
        texto: row[2] || "",
      }));
  } catch {
    return [];
  }
}

export async function saveNote(
  accessToken: string,
  sheetId: string,
  leadId: string,
  texto: string
): Promise<boolean> {
  const sheets = getSheets(accessToken);

  // Ensure Notas sheet exists
  try {
    await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Notas!A1",
    });
  } catch {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: "Notas" } } }],
      },
    });
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Notas!A1",
      valueInputOption: "RAW",
      requestBody: { values: [["ID Lead", "Data", "Nota"]] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Notas!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [[leadId, format(new Date(), "dd/MM/yyyy HH:mm"), texto]],
    },
  });

  await registerHistory(accessToken, sheetId, leadId, "NOTA", texto);
  return true;
}

export async function registerHistory(
  accessToken: string,
  sheetId: string,
  leadId: string,
  tipo: string,
  conteudo: string
): Promise<void> {
  const sheets = getSheets(accessToken);

  try {
    await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Historico!A1",
    });
  } catch {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: "Historico" } } }],
      },
    });
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Historico!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [["Data", "ID Lead", "Tipo", "Conteúdo"]],
      },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Historico!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [format(new Date(), "dd/MM/yyyy HH:mm"), leadId, tipo, conteudo],
      ],
    },
  });
}

// Creates a new lead row in Folha1 (mirrors extrairLeadsDinamico from GAS)
export async function createLead(
  accessToken: string,
  sheetId: string,
  data: Record<string, string>
): Promise<void> {
  const sheets = getSheets(accessToken);

  // Get headers to know column order
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Folha1!1:1",
  });

  const headers = res.data.values?.[0] || [
    "Data Receção", "ID Lead", "Name", "Email", "Phone",
    "Situation", "Zone", "Typology", "Construction method",
    "Timeframe", "Budget", "Preferred contact", "Preferred time",
  ];

  // Get last row to calculate next ID (like GAS proximoNumero)
  const allData = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Folha1",
  });

  const rows = allData.data.values || [];
  let nextNumber = 8000;
  if (rows.length > 1) {
    const lastIdCol = rows[rows.length - 1][1] || "";
    const match = lastIdCol.match(/\d+/);
    nextNumber = match ? parseInt(match[0]) + 1 : 8000 + rows.length - 1;
  }

  const nome = data.Name || "Cliente";
  const zona = data.Zone || "Portugal";
  const idFormatado = `LEAD ${nextNumber} - ${nome} - ${zona}`;
  const dataRececao = format(new Date(), "dd/MM/yyyy HH:mm");

  // Build row matching headers
  const row = headers.map((col: string) => {
    if (col === "Data Receção") return dataRececao;
    if (col === "ID Lead") return idFormatado;
    if (col === "Status") return "Pendente";
    return data[col] || "";
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Folha1!A1",
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });

  // Register in history
  await registerHistory(accessToken, sheetId, idFormatado, "SISTEMA", "Lead criada manualmente via CRM");
}

function colLetter(index: number): string {
  let letter = "";
  let i = index;
  while (i >= 0) {
    letter = String.fromCharCode((i % 26) + 65) + letter;
    i = Math.floor(i / 26) - 1;
  }
  return letter;
}
