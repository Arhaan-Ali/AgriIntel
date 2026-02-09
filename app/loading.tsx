"use client";

import { motion } from "motion/react";

const DOTS = [0, 1, 2] as const;

export default function Loading() {
	return (
		<main
			className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6"
			aria-busy="true"
			aria-live="polite"
		>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-primary),transparent_55%)]/15" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,var(--color-chart-2),transparent_60%)]/20" />

			<div className="relative z-10 w-full max-w-sm">
				<div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur">
					<div className="flex items-center gap-4">
						<div className="relative">
							<motion.div
								className="absolute inset-0 rounded-full border border-primary/40"
								animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
								transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
							/>
							<motion.div
								className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15"
								animate={{ rotate: 360 }}
								transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
							>
								<div className="h-5 w-5 rounded-full bg-primary" />
							</motion.div>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
								Loading
							</p>
							<div className="flex items-center gap-2 text-lg font-semibold text-foreground">
								Preparing your dashboard
								<span className="sr-only">Please wait</span>
							</div>
						</div>
					</div>

					<div className="mt-8 space-y-4">
						<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
							<motion.div
								className="h-full w-1/2 rounded-full bg-primary"
								animate={{ x: ["-50%", "120%"] }}
								transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
							/>
						</div>

						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							{DOTS.map((dot) => (
								<motion.span
									key={dot}
									className="inline-block h-2 w-2 rounded-full bg-primary/60"
									animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
									transition={{
										duration: 1.2,
										repeat: Infinity,
										delay: dot * 0.2,
										ease: "easeInOut",
									}}
								/>
							))}
							<span>Syncing secure resources</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
