import Empty from "@/components/Empty";
import Sources from "@/components/Sources";

export const metadata = { title: "Comparador — Politiki" };

export default function Page() {
  return (
    <main className="wrap compare">
      <p className="eyebrow">COMPARAÇÃO LADO A LADO</p>
      <h1>Compare parlamentares</h1>
      <p className="lead">Selecione até três pessoas. Os mesmos indicadores serão exibidos no mesmo período e sem pontuações.</p>
      <div className="compare-grid">
        {[1, 2, 3].map((i) => (
          <button className="compare-person add" key={i}><b>+</b><h3>Adicionar parlamentar</h3><span>{i === 1 ? "Comece por uma pessoa" : "Opcional"}</span></button>
        ))}
      </div>
      <div className="data-space"><Empty title="Comparação vazia" text="Nenhum indicador será exibido até que parlamentares sejam selecionados e os dados oficiais carregados." /></div>
      <Sources />
    </main>
  );
}
