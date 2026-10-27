import Icon from "./Icon";

const fontes = ["Câmara dos Deputados", "Senado Federal", "Tribunal Superior Eleitoral"];

export default function Sources() {
  return (
    <div className="sources">
      {fontes.map((x) => <span key={x}><Icon name="check" size={13} />{x}</span>)}
    </div>
  );
}
