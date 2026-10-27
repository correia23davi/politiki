import Link from "next/link";
import { notFound } from "next/navigation";
import Empty from "@/components/Empty";
import Gastos from "@/components/Gastos";
import { buscarParlamentar, resumoGastos, ultimaColeta } from "@/lib/queries";
import { dataBR } from "@/lib/formatar";
import { urlHttps, HOSTS_CAMARA } from "@/lib/url";

export const dynamic = "force-dynamic";

const ABAS = [
  ["projetos", "Projetos"],
  ["votos", "Votos"],
  ["gastos", "Gastos"],
  ["presenca", "Presença"],
  ["campanha", "Campanha e patrimônio"],
];

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = Number(id) ? await buscarParlamentar(Number(id)).catch(() => null) : null;
  return { title: p ? `${p.nome} — Politiki` : "Parlamentar — Politiki" };
}

export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const pid = Number(id);
  if (!Number.isInteger(pid)) notFound();

  let p = null;
  try {
    p = await buscarParlamentar(pid);
  } catch (e) {
    console.error(e);
    return (
      <main className="wrap compare">
        <Empty title="Fonte indisponível" text="Não foi possível consultar os dados agora. Verifique a conexão com o banco." action="Voltar para a busca" href="/parlamentares" />
      </main>
    );
  }
  if (!p) notFound();

  const aba = ABAS.some(([k]) => k === sp.aba) ? sp.aba : "gastos";
  const titulo = ABAS.find(([k]) => k === aba)[1];
  const [gastos, coleta] = await Promise.all([
    aba === "gastos" ? resumoGastos(pid, Number(sp.ano)) : null,
    ultimaColeta("camara"),
  ]);
  const foto = urlHttps(p.fotoUrl, HOSTS_CAMARA);
  const partido = p.filiacoes[0]?.partido.sigla ?? "Sem partido";

  return (
    <main className="profile">
      <div className="wrap breadcrumbs"><Link href="/">Início</Link><span>/</span><Link href="/parlamentares">Parlamentares</Link><span>/</span><span>{p.nome}</span></div>
      <section className="wrap blank-profile">
        {foto ? <img className="avatar-photo" src={foto} alt={`Foto de ${p.nome}`} /> : <div className="avatar-placeholder" />}
        <div>
          <p className="eyebrow">DEPUTADO(A) FEDERAL · {partido} · {p.uf}</p>
          <h1>{p.nome}</h1>
          <p className="lead">
            {p.emExercicio ? "Em exercício" : "Fora de exercício"}.{" "}
            {p.idCamara && <a href={`https://www.camara.leg.br/deputados/${p.idCamara}`} target="_blank" rel="noopener noreferrer">Ver na Câmara dos Deputados</a>}
          </p>
        </div>
      </section>
      <div className="tabs-wrap">
        <nav className="wrap tabs" aria-label="Seções do perfil">
          {ABAS.map(([k, nome]) => (
            <Link key={k} href={`/parlamentares/${p.id}?aba=${k}`} className={aba === k ? "active" : ""} aria-current={aba === k ? "page" : undefined}>{nome}</Link>
          ))}
        </nav>
      </div>
      <section className="wrap profile-content">
        <div className="content-head"><div><p className="eyebrow">DADOS OFICIAIS</p><h2>{titulo}</h2></div></div>
        {aba === "gastos" ? (
          <Gastos id={p.id} resumo={gastos} />
        ) : (
          <Empty title="Dados ainda não carregados" text={`Os dados de ${titulo.toLowerCase()} serão exibidos assim que a integração com a fonte oficial estiver ativa.`} />
        )}
        <div className="note">
          <b>Compromisso com a precisão</b>
          <p>Quando um dado não existir na origem, indicaremos “sem dados”. {coleta && <>Última coleta: {dataBR(coleta)}.</>}</p>
        </div>
      </section>
    </main>
  );
}
