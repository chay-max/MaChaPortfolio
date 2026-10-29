"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "macha:intro:v1";

/** A brief brand introduction, independent of content loading or navigation. */
export default function IntroScreen() {
  const [phase, setPhase] = useState<"hidden" | "enter" | "exit">("hidden");

  useEffect(() => {
    // Respect reduced motion and never leave content blocked without JavaScript.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "seen");
    } catch {
      // Private browsers may deny storage; the intro can still finish normally.
    }
    setPhase("enter");
    const exit = window.setTimeout(() => setPhase("exit"), 1350);
    const finish = window.setTimeout(() => setPhase("hidden"), 1900);
    return () => {
      window.clearTimeout(exit);
      window.clearTimeout(finish);
    };
  }, []);

  if (phase === "hidden") return null;
  return (
    <div className={`intro-screen intro-screen--${phase}`}>
      <div className="intro-brand" role="status" aria-label="Opening MaCha">
        <span aria-hidden="true">
          Ma<span className="intro-cha">Cha</span>
          <span className="intro-dot">.</span>
        </span>
        <span className="intro-name">Maxwell Christopher Chay</span>
      </div>
      <button className="intro-skip" onClick={() => setPhase("hidden")}>
        Skip intro
      </button>
    </div>
  );
}
