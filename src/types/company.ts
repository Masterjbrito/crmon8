export interface CompanyConfig {
  id: string;
  name: string;
  sheetId: string | null;
  color: string;
  isParent?: boolean;
  zones?: Record<string, [number, number]>;
}
