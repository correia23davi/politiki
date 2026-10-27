// Cliente da API de Dados Abertos da Câmara dos Deputados.
const BASE = "https://dadosabertos.camara.leg.br/api/v2";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function obter(url, tentativas = 4) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resp = await fetch(url, { headers: { Accept: "application/json" } });
      if (resp.ok) return await resp.json();
      if (resp.status < 500 && resp.status !== 429) throw new Error(`HTTP ${resp.status} em ${url}`);
    } catch (e) {
      if (i === tentativas) throw e;
    }
    await espera(800 * i * i); // espera crescente entre tentativas
  }
  throw new Error(`Falha ao consultar ${url}`);
}

// Percorre todas as páginas de um endpoint, devolvendo um lote por vez.
export async function* paginar(caminho, params = {}) {
  let url = `${BASE}${caminho}?${new URLSearchParams({ itens: "100", ...params })}`;
  while (url) {
    const json = await obter(url);
    yield json.dados ?? [];
    url = json.links?.find((l) => l.rel === "next")?.href ?? null;
    if (url) await espera(150); // respeita a API
  }
}
