"use client";

import Link from "next/link";
import { motion } from "motion/react";

const FLOAT_ANIMATION = {
  y: [0, -10, 0],
  opacity: [0.6, 1, 0.6],
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-primary),transparent_55%)]/15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,var(--color-chart-3),transparent_60%)]/20" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/60 bg-card/90 p-10 text-center shadow-2xl shadow-primary/10 backdrop-blur">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.5em] text-muted-foreground"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Error 404
        </motion.p>

        <motion.h1
          className="mt-6 text-5xl font-semibold text-foreground sm:text-6xl"
          animate={FLOAT_ANIMATION}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Page not found
        </motion.h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          The page you’re looking for wandered off into the void. Let’s get you back to a safe
          orbit.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
          >
            Return home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-border/70 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/60"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
