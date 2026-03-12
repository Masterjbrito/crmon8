export interface HistoryEntry {
  data: string;
  tipo: "SISTEMA" | "EMAIL" | "NOTA" | "EMAIL ENVIADO" | string;
  titulo: string;
  conteudo: string;
}
