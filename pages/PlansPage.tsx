"use client";

import { PageLayout, PageSection, PageContent } from "@/layout/PageLayout";
import React from "react";
import { Check, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PlanFeature, PlanProps } from "@/types/plans/plan.interface";

const PlanCard = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  comingSoon = false,
  cta,
}: PlanProps) => (
  <div
    className={`
      relative overflow-hidden
      rounded-xl border
      p-6 sm:p-8
      transition-all duration-300
      group
      flex flex-col h-full bg-card/60 backdrop-blur-sm
      hover:shadow-lg
      border-border
      hover:border-primary/40
    `}
  >
    {/* Background accent */}
    {/* <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-50" />
    </div> */}

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-5xl sm:text-6xl text-center font-bold text-primary/80 dark:text-neutral-50 w-full">
            {name}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-300 mb-4">
          {description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1 w-full justify-center">
          <span className="text-4xl sm:text-5xl font-bold text-neutral-500 dark:text-neutral-50">
            {price}
          </span>
          {typeof price === "number" && (
            <span className="text-neutral-400 dark:text-neutral-300 ">
              /month
            </span>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-3 flex-1 mb-0 border border-border/50 p-6 sm:pt-8 rounded-xl bg-linear-to-br from-muted/5 to-muted/10">
        <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-300 uppercase tracking-wider">
          What&apos;s included
        </p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-border/50 shrink-0 mt-0.5" />
              )}
              <span
                className={`text-sm sm:text-base ${
                  feature.included
                    ? "text-neutral-400 dark:text-neutral-300"
                    : "text-neutral-400 dark:text-neutral-300 line-through"
                }`}
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
        <div className="mb-4 sm:mb-6 mt-6">
          <Button
            className="w-full"
            variant={highlighted ? "outline" : "default"}
            disabled={comingSoon}
          >
            {comingSoon ? "Coming Soon" : cta}
          </Button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:via-primary transition-all duration-300" />
    </div>
  </div>
);

const PlansPage = () => {
  const freePlan: PlanProps = {
    name: "Free",
    price: 0,
    description: "Perfect for getting started with soil analysis",
    cta: "Get Started",
    gradient: "from-blue-400/10 to-cyan-500/10",
    features: [
      { name: "Basic Soil Health Report", included: true },
      { name: "Monthly Analysis", included: true },
      { name: "Email Support", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "Priority Support", included: false },
      { name: "Custom Recommendations", included: false },
    ],
  };

  const proPlan: PlanProps = {
    name: "Pro",
    price: "Coming Soon",
    description: "Advanced features for serious farmers",
    cta: "Get Pro",
    highlighted: true,
    gradient: "from-purple-400/15 to-pink-500/15",
    comingSoon: true,
    features: [
      { name: "Comprehensive Soil Analysis", included: true },
      { name: "Weekly Detailed Reports", included: true },
      { name: "Priority Support", included: true },
      { name: "Advanced Analytics Dashboard", included: true },
      { name: "AI Crop Recommendations", included: true },
      { name: "Custom Fertilizer Plans", included: true },
    ],
  };

  return (
    <PageLayout className="py-0 pt-8 lg:py-0 lg:pt-16 bg-background px-0 text-neutral-500 dark:text-neutral-50">
      <section className="max-w-6xl mx-auto text-center space-y-8 sm:space-y-12 px-4">
        {/* Header */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-500 dark:text-neutral-50">
            Choose Your{" "}
            <span className="text-primary/60 dark:text-primary">Plan</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Choose the plan that works best for you and your farming needs.
            Start free and upgrade anytime.
          </p>
        </div>

        {/* Plan Cards */}
        <PageSection>
          <PageContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
              <PlanCard {...freePlan} />
              <PlanCard {...proPlan} />
            </div>
          </PageContent>
        </PageSection>

        {/* FAQ or Additional Info */}
      </section>
      <div className="mt-12 sm:mt-16 p-6 sm:p-12 border-y border-primary/30 bg-linear-to-br from-primary/5 to-primary/10 text-center">
        <h3 className="text-xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Need more information?
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mb-4">
          Contact our team to discuss custom plans or enterprise solutions for
          large-scale farming operations.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </PageLayout>
  );
};

export default PlansPage;
