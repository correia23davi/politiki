import Link from "next/link";
import Icon from "@/components/Icon";
import Empty from "@/components/Empty";
import Sources from "@/components/Sources";
import { BuscaSchema } from "@/lib/schemas";
import { urlHttps, HOSTS_CAMARA } from "@/lib/url";
import { listarParlamentares } from "@/lib/queries";

export const metadata = { title: "Parlamentares — Politiki" };
export const dynamic = "force-dynamic";

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

function href({ q, uf, pagina }) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (uf) p.set("uf", uf);
  if (pagina > 1) p.set("pagina", String(pagina));
  const s = p.toString();
  return `/parlamentares${s ? `?${s}` : ""}`;
}

export default async function Page({ searchParams }) {
  const busca = BuscaSchema.safeParse(await searchParams);
  const filtros = busca.success ? busca.data : { pagina: 1 };

  let dados = null;
  try {
    dados = await listarParlamentares(filtros);
  } catch (e) {
    console.error(e);
  }

  return (
    <main className="wrap compare">
      <p className="eyebrow">PARLAMENTARES</p>
      <h1>Consulte um parlamentar</h1>
      <p className="lead">Deputados federais em exercício, com dados das fontes oficiais.</p>

      <form action="/parlamentares" className="big-search">
        <Icon name="search" size={22} />
        <input name="q" defaultValue={filtros.q ?? ""} aria-label="Buscar por nome" placeholder="Nome do parlamentar" />
        <select name="uf" defaultValue={filtros.uf ?? ""} aria-label="Estado">
          <option value="">Todos os estados</option>
          {UFS.map((u) => <option key={u}>{u}</option>)}
        </select>
        <button type="submit">Buscar</button>
      </form>

      <div className="data-space">
        {!dados ? (
          <Empty title="Fonte indisponível" text="Não foi possível consultar os dados agora. Tente novamente em instantes." />
        ) : dados.itens.length === 0 ? (
          <Empty title="Nenhum parlamentar encontrado" text="Ajuste o nome ou o estado. Se o banco ainda estiver vazio, rode a ingestão dos dados." action="Limpar busca" href="/parlamentares" />
        ) : (
          <>
            <p className="update">{dados.total} parlamentares</p>
            <div className="compare-grid">
              {dados.itens.map((p) => (
                <Link key={p.id} href={`/parlamentares/${p.id}`} className="compare-person">
                  {urlHttps(p.fotoUrl, HOSTS_CAMARA) && <img src={urlHttps(p.fotoUrl, HOSTS_CAMARA)} alt="" width="78" height="78" loading="lazy" />}
                  <h3>{p.nome}</h3>
                  <span>{p.filiacoes[0]?.partido.sigla ?? "Sem partido"} · {p.uf}</span>
                </Link>
              ))}
            </div>
            {dados.paginas > 1 && (
              <div className="pager">
                {filtros.pagina > 1 && <Link href={href({ ...filtros, pagina: filtros.pagina - 1 })}>← Anterior</Link>}
                <span>Página {filtros.pagina} de {dados.paginas}</span>
                {filtros.pagina < dados.paginas && <Link href={href({ ...filtros, pagina: filtros.pagina + 1 })}>Próxima →</Link>}
              </div>
            )}
          </>
        )}
      </div>
      <Sources />
    </main>
  );
}
