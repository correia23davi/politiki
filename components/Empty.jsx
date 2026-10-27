import Link from "next/link";
import Icon from "./Icon";

export default function Empty({ title, text, action, href = "/" }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon name="search" size={24} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && <Link href={href} className="secondary">{action}</Link>}
    </div>
  );
}
