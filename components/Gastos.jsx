import Link from "next/link";
import Empty from "./Empty";
import { brl, mesAbrev } from "@/lib/formatar";

export default function Gastos({ id, resumo }) {
  if (!resumo) {
    return <Empty title="Sem despesas registradas" text="Não há despesas da cota parlamentar carregadas para este parlamentar." />;
  }
  const maxCat = Math.max(...resumo.categorias.map((c) => c.valor), 1);
  const maxMes = Math.max(...resumo.meses.map((m) => m.valor), 1);

  return (
    <div className="gastos">
      <div className="year-pick">
        {resumo.anos.map((a) => (
          <Link key={a} href={`/parlamentares/${id}?aba=gastos&ano=${a}`} className={a === resumo.ano ? "active" : ""}>{a}</Link>
        ))}
      </div>
      <p className="total-gasto"><span>Total da cota em {resumo.ano}</span><b>{brl(resumo.total)}</b><small>{resumo.quantidade} lançamentos</small></p>

      <div className="activity-grid">
        <div className="panel">
          <div className="panel-title"><h3>Por categoria</h3></div>
          {resumo.categorias.map((c) => (
            <div className="bar-row" key={c.nome}>
              <span>{c.nome}</span>
              <div><i style={{ width: `${(c.valor / maxCat) * 100}%` }} /></div>
              <b>{brl(c.valor)}</b>
            </div>
          ))}
        </div>
        <div className="panel">
          <div className="panel-title"><h3>Por mês</h3></div>
          {resumo.meses.map((m) => (
            <div className="bar-row" key={m.mes}>
              <span>{mesAbrev(m.mes)}</span>
              <div><i style={{ width: `${(m.valor / maxMes) * 100}%` }} /></div>
              <b>{brl(m.valor)}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><h3>Principais fornecedores</h3></div>
        <table className="tabela">
          <thead><tr><th>Fornecedor</th><th>Valor</th></tr></thead>
          <tbody>{resumo.fornecedores.map((f) => <tr key={f.nome}><td>{f.nome}</td><td>{brl(f.valor)}</td></tr>)}</tbody>
        </table>
      </div>

      <div className="note">
        <b>Sobre estes valores</b>
        <p>Parte das despesas (como telefonia e correios) é contratual e não tem documento individual por parlamentar. O teto da cota varia por estado, então compare valores apenas entre parlamentares do mesmo estado.</p>
      </div>
    </div>
  );
}
