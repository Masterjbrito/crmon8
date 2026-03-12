export function parseCorpoEmail(corpo: string): Record<string, string> {
  const linhas = corpo.split("\n");
  const objeto: Record<string, string> = {};

  for (const linha of linhas) {
    const trimmed = linha.trim();
    if (trimmed.includes(":")) {
      const partes = trimmed.split(":");
      const chave = partes[0].trim();
      const valor = partes.slice(1).join(":").trim();
      if (chave && chave !== "New lead received") {
        objeto[chave] = valor;
      }
    }
  }

  return objeto;
}
