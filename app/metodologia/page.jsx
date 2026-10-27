import Icon from "@/components/Icon";

export const metadata = { title: "Metodologia e fontes — Politiki" };

const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");

const items = [
  ["Votos", "Câmara dos Deputados e Senado Federal", "Somente votos nominais. Votações simbólicas serão identificadas como “sem registro individual”."],
  ["Proposições", "Dados Abertos da Câmara e do Senado", "Autoria, ementa, situação e tramitação serão reproduzidas das bases oficiais."],
  ["Gastos", "Cota para o Exercício da Atividade Parlamentar", "Valores serão apresentados conforme a origem, inclusive quando não houver documento individual."],
  ["Campanha e patrimônio", "Tribunal Superior Eleitoral", "Bens, doadores e fornecedores corresponderão às declarações oficiais de cada eleição."],
];
const nav = ["Princípios", ...items.map(([t]) => t), "Correções"];

export default function Page() {
  return (
    <main className="wrap method">
      <p className="eyebrow">SOBRE OS DADOS</p>
      <h1>Metodologia e fontes</h1>
      <p className="lead">O Politiki organiza dados públicos oficiais sem criar notas, rankings, estimativas ou avaliações.</p>
      <div className="method-grid">
        <aside><b>Nesta página</b>{nav.map((t) => <a key={t} href={`#${slug(t)}`}>{t}</a>)}</aside>
        <article>
          <h2 id="principios">Princípios editoriais</h2>
          <p>Todos recebem o mesmo tratamento visual e metodológico. Quando uma informação não está disponível, indicamos a ausência em vez de inferir dados.</p>
          {items.map(([titulo, fonte, texto]) => (
            <section id={slug(titulo)} key={titulo}>
              <h2>{titulo}</h2>
              <span className="source"><Icon name="check" size={12} />{fonte}</span>
              <p>{texto}</p>
            </section>
          ))}
          <div className="note" id="correcoes"><b>Correções</b><p>O canal de correção será informado antes da publicação do serviço.</p></div>
        </article>
      </div>
    </main>
  );
}
