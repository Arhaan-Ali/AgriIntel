"use client";

import { PageLayout } from "@/layout/PageLayout";
import React from "react";
import { Button } from "@/components/ui/button";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export const HeroCard = ({
  title,
  description,
  icon,
  gradient,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}) => (
  <div
    className={`
    relative overflow-hidden
    rounded-xl border border-border/50
    bg-linear-to-br ${gradient}
    p-6 sm:p-8
    hover:shadow-lg transition-all duration-300
    group cursor-pointer
    flex flex-col justify-between
    min-h-64 sm:min-h-80
    backdrop-blur-sm
  `}
  >
    {/* Background accent */}
    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-50" />
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
      <div className="p-3 rounded-lg inline-block w-fit bg-white/10 dark:bg-black/10 group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-all duration-300 backdrop-blur-sm">
        <div className="text-neutral-900 dark:text-neutral-100 group-hover:scale-110 transition-transform duration-300 group-hover:text-primary">
          {icon}
        </div>
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>

    {/* Bottom accent */}
    <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:via-primary transition-all duration-300" />
  </div>
);

const HeroPage = () => {
  return (
    <PageLayout className="lg:py-0 px-0 relative overflow-hidden py-0">
      <section className='w-full sm:h-max relative flex flex-col py-24 sm:py-16 lg:py-38 text-center border-b border-border px-4 sm:px-12 bg-cover bg-center bg-[url("/hero.png")] mask-b-from-80 mask-b-to-transparent'>
      <BackgroundRippleEffect />
        <div
          className="absolute inset-0 bg-background/10 backdrop-brightness-80"
          aria-hidden="true"
        />
        <div className="space-y-6 sm:space-y-8 relative z-100">
          {/* Main Headline */}
          <div>
            <h1 className="text-5xl leading-14 sm:text-5xl lg:text-7xl font-extrabold sm:leading-22 tracking-tight text-neutral-100 mb-4 sm:mb-6 capitalize text-shadow sm:text-shadow-lg lg:text-shadow-xl dark:text-white z-10">
              Soil intelligence for modern farmers
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
              Unlock the potential of your farmland with AI-powered soil
              analysis, crop recommendations, and sustainable farming practices.
              Make data-driven decisions that transform your yields.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4">
            <Button className="px-8 py-6 text-base font-semibold dark:border-neutral-200 dark:text-neutral-100">
              Get Started Free
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-base font-semibold dark:border-neutral-200 dark:text-white"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HeroPage;
