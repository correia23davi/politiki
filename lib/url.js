// Só aceita https e, opcionalmente, domínios de uma lista. Qualquer outra coisa vira null.
export const HOSTS_CAMARA = ["www.camara.leg.br", "camara.leg.br"];

export function urlHttps(valor, hosts) {
  if (!valor) return null;
  try {
    const u = new URL(valor);
    if (u.protocol !== "https:") return null;
    if (hosts && !hosts.includes(u.hostname)) return null;
    return u.href;
  } catch {
    return null;
  }
}
