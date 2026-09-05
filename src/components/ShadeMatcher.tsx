"use client";

import { useState } from "react";
import {
  DEPTH_QUESTIONS,
  UNDERTONE_QUESTIONS,
  findShade,
  type Undertone,
} from "@/lib/shades";

export default function ShadeMatcher() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [undertone, setUndertone] = useState<Undertone | null>(null);
  const [depth, setDepth] = useState<number | null>(null);

  const result = undertone && depth ? findShade(undertone, depth) : null;
  const undertoneLabel = UNDERTONE_QUESTIONS.find((u) => u.value === undertone)?.label;

  function reset() {
    setStep(0);
    setUndertone(null);
    setDepth(null);
  }

  return (
    <div className="rounded-2xl border border-line bg-cream-dark/40 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-rose">
          <path d="M10 2c-2.5 3-5 6.2-5 9.5a5 5 0 0 0 10 0C15 8.2 12.5 5 10 2Z" />
        </svg>
        <h3 className="font-serif-display text-base text-ink">Dobierz odcień</h3>
      </div>

      {step === 0 && (
        <div>
          <p className="mt-2 text-sm text-ink-soft">
            Krótki quiz dopasuje jeden z 12 odcieni Silk Veil do Twojej skóry — zajmie mniej niż minutę.
          </p>
          <button
            onClick={() => setStep(1)}
            className="mt-4 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-dark"
          >
            Zacznij quiz →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-4">
          <span className="text-xs uppercase tracking-wide text-rose">Krok 1 z 2</span>
          <p className="mt-1 text-sm font-medium text-ink">Jak Twoja skóra reaguje na słońce?</p>
          <div className="mt-3 grid gap-2">
            {UNDERTONE_QUESTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  setUndertone(o.value);
                  setStep(2);
                }}
                className="rounded-xl border border-line bg-white p-3 text-left transition hover:border-rose hover:shadow-soft"
              >
                <span className="block text-sm font-medium text-ink">{o.label}</span>
                <span className="mt-0.5 block text-xs text-ink-soft">{o.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4">
          <span className="text-xs uppercase tracking-wide text-rose">Krok 2 z 2</span>
          <p className="mt-1 text-sm font-medium text-ink">Który odcień jest najbliższy Twojej karnacji?</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {DEPTH_QUESTIONS.map((d) => (
              <button
                key={d.depth}
                onClick={() => {
                  setDepth(d.depth);
                  setStep(3);
                }}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-white p-2.5 transition hover:border-rose hover:shadow-soft"
              >
                <span
                  className="h-9 w-9 rounded-full border border-line"
                  style={{ background: d.hex }}
                />
                <span className="text-center text-[11px] leading-tight text-ink-soft">{d.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-3 text-xs text-ink-soft underline-offset-2 hover:text-ink hover:underline"
          >
            ← Wstecz
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4">
          {result ? (
            <>
              <span className="text-xs uppercase tracking-wide text-rose">Twój dopasowany odcień</span>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-line bg-white p-4">
                <span
                  className="h-14 w-14 shrink-0 rounded-full border border-line shadow-soft"
                  style={{ background: result.hex }}
                />
                <div>
                  <p className="font-serif-display text-lg text-ink">{result.name}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Podton: {undertoneLabel}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-soft">
                Wybierz ten odcień przy zakupie w koszyku lub napisz do nas — chętnie potwierdzimy dopasowanie.
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-soft">Nie udało się dopasować odcienia. Spróbuj ponownie.</p>
          )}
          <button
            onClick={reset}
            className="mt-4 rounded-full border border-line px-5 py-2 text-xs font-medium text-ink transition hover:border-rose hover:text-rose-dark"
          >
            Zrób quiz ponownie
          </button>
        </div>
      )}
    </div>
  );
}
