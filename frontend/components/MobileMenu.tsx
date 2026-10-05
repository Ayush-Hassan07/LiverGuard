"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, []);

  return (
    <details
      ref={menuRef}
      className="mobile-menu"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary aria-label="Open navigation menu">⋮</summary>
      <div className="mobile-menu-panel">
        <Link href="/about-model">About the model</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </details>
  );
}
