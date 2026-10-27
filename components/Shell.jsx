"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const links = [
  ["/parlamentares", "Parlamentares"],
  ["/proposicoes", "Proposições"],
  ["/comparador", "Comparador"],
  ["/metodologia", "Metodologia"],
];

function Header({ dark, toggle }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header>
      <div className="nav wrap">
        <Link href="/" className="brand">POLITIKI<span>.</span></Link>
        <nav className={open ? "open" : ""}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname.startsWith(href) ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggle} aria-label="Alternar modo claro e escuro"><Icon name={dark ? "sun" : "moon"} /></button>
          <button className="icon-btn mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu"><Icon name="menu" /></button>
        </div>
      </div>
    </header>
  );
}

export default function Shell({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tema");
      if (saved) setDark(saved === "escuro");
      else setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem("tema", next ? "escuro" : "claro"); } catch {}
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <Header dark={dark} toggle={toggle} />
      {children}
    </div>
  );
}
