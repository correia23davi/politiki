import Icon from "@/components/Icon";
import Empty from "@/components/Empty";
import Sources from "@/components/Sources";

export const metadata = { title: "Proposições — Politiki" };

export default function Page() {
  return (
    <main className="wrap compare">
      <p className="eyebrow">PROPOSIÇÕES LEGISLATIVAS</p>
      <h1>Consulte um projeto</h1>
      <p className="lead">Busque pelo número, ano, tema ou autoria para ver ementa, tramitação e votações.</p>
      <div className="big-search"><Icon name="search" size={22} /><input aria-label="Buscar proposição" placeholder="Número, ano ou palavra-chave" /><button>Buscar</button></div>
      <div className="data-space"><Empty title="Nenhuma proposição selecionada" text="Ementa, autores, tramitação e votos aparecerão após uma consulta à fonte oficial." /></div>
      <Sources />
    </main>
  );
}
