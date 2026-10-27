// Cache em memória com validade. Reduz consultas repetidas ao banco e agrupa
// pedidos idênticos simultâneos. Vale por instância do servidor (na Vercel, por função).
const guardado = new Map();
const MAX_ENTRADAS = 500;

export function comCache(chave, ttlMs, buscar) {
  const agora = Date.now();
  const hit = guardado.get(chave);
  if (hit && hit.expira > agora) return hit.promessa;

  const promessa = Promise.resolve().then(buscar);
  if (guardado.size >= MAX_ENTRADAS) guardado.delete(guardado.keys().next().value);
  guardado.set(chave, { promessa, expira: agora + ttlMs });
  promessa.catch(() => guardado.delete(chave)); // erros não ficam guardados
  return promessa;
}
