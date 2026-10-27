import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-top">
        <div>
          <Link href="/" className="brand">POLITIKI<span>.</span></Link>
          <p>Dados públicos com contexto.<br />Informação para uma democracia mais transparente.</p>
        </div>
        <div>
          <b>Explore</b>
          <Link href="/parlamentares">Parlamentares</Link>
          <Link href="/proposicoes">Proposições</Link>
          <Link href="/comparador">Comparador</Link>
        </div>
        <div>
          <b>Sobre</b>
          <Link href="/metodologia">Metodologia e fontes</Link>
          <Link href="/metodologia#correcoes">Política de correções</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>Politiki · Projeto independente e apartidário</span>
        <span>Conteúdo vinculado às fontes oficiais</span>
      </div>
    </footer>
  );
}
