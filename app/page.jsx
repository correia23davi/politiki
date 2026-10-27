import Link from "next/link";
import Icon from "@/components/Icon";
import Empty from "@/components/Empty";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">TRANSPARÊNCIA PÚBLICA, SEM RUÍDO</p>
          <h1>Saiba o que seus<br />representantes fazem.</h1>
          <p className="lead">Projetos, votos, gastos e patrimônio reunidos de fontes oficiais e apresentados com contexto.</p>
          <form action="/parlamentares" className="big-search">
            <Icon name="search" size={22} />
            <input name="q" aria-label="Buscar" placeholder="Nome do parlamentar" />
            <button type="submit">Buscar</button>
          </form>
          <div className="quick">
            <span>Filtros rápidos</span>
            <button>Deputados federais</button><button>Senadores</button><button>Por estado</button><button>Em exercício</button>
          </div>
          <p className="update"><span />A data será exibida após a conexão com as fontes oficiais</p>
        </div>
      </section>
      <section className="wrap section">
        <div className="section-head">
          <div><p className="eyebrow">ACOMPANHE</p><h2>Atividade recente</h2></div>
          <p>Dados publicados pelo Congresso Nacional</p>
        </div>
        <div className="activity-grid">
          <div className="panel"><div className="panel-title"><h3>Últimas votações</h3></div><Empty title="Nenhuma votação carregada" text="Os registros aparecerão após a integração oficial." /></div>
          <div className="panel"><div className="panel-title"><h3>Últimas proposições</h3></div><Empty title="Nenhuma proposição carregada" text="Os registros aparecerão após a integração oficial." /></div>
        </div>
      </section>
      <section className="explore">
        <div className="wrap explore-in">
          <div><p className="eyebrow">CONSULTE POR PESSOA</p><h2>Conheça seus representantes</h2><p>Consulte a atuação parlamentar sem rankings ou juízos de valor.</p></div>
          <Link href="/parlamentares" className="primary">Explorar parlamentares <Icon name="arrow" /></Link>
        </div>
      </section>
    </main>
  );
}
