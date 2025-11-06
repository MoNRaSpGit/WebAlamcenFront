import { useState } from "react";
import "../styles/Accordion.css";

export default function Accordion({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="acc">
      <button className="acc-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="acc-title">{title}</span>

        {badge && (
          <span className={`acc-badge ${badge.toLowerCase()}`}>
            {badge}
          </span>
        )}

        <span className={`acc-caret ${open ? "rot" : ""}`}>⌄</span>
      </button>

      {open && <div className="acc-body">{children}</div>}
    </div>
  );
}
