import "./globals.css";
import Shell from "@/components/Shell";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Politiki — O que seus representantes fazem",
  description: "Projetos, votos, gastos e patrimônio de parlamentares, reunidos de fontes oficiais e apresentados com contexto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Shell>
          {children}
          <Footer />
        </Shell>
      </body>
    </html>
  );
}
