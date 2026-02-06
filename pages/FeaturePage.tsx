"use client";

import {
  PageLayout,
  PageSection,
  PageContent,
  PageHeader,
} from "@/layout/PageLayout";
import React from "react";
import { Sprout, Droplets, BookOpen, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  gradient?: string;
  layout?: "tall" | "wide" | "default";
}

const FeatureCard = ({
  title,
  description,
  icon,
  gradient,
  layout = "default",
}: FeatureCardProps) => (
  <div
    className={`
      relative overflow-hidden
      rounded-xl border border-border/70 dark:border-border/40
      bg-linear-to-br ${gradient}
      bg-background/70 dark:bg-card/40
      p-6 sm:p-8
      hover:shadow-md transition-all duration-300
      group cursor-pointer
      flex flex-col justify-between
      min-h-70
      ${layout === "tall" ? "lg:col-span-2" : ""}
      ${layout === "wide" ? "lg:col-span-2 lg:row-span-2" : ""}
    `}
  >
    <div
      className="absolute inset-0 z-0 text-neutral-400/20 bg-size-[32px_32px]"
      style={{
        backgroundImage:
          "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 100%)",
      }}
    />
    {/* Background accent */}
    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" />
    </div>

    {/* Content */}
    <div
      className={`relative z-10 flex ${layout === "tall" || layout === "wide" ? "flex-col sm:flex-row" : "flex-col"} h-full justify-evenly items-center `}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="
            p-3 rounded-lg
            bg-white/10 dark:bg-white/5
            group-hover:bg-white/20 dark:group-hover:bg-white/10
            transition-colors duration-300
            backdrop-blur-sm
          "
        >
          <div
            className={`text-neutral-400 group-hover:scale-175 group-hover:animate-bounce transition-transform duration-300 mx-auto w-full group-hover:text-primary scale-150 ${layout === "wide" ? "hidden" : ""}`}
          >
            {icon}
          </div>
        </div>
      </div>

      <div className="">
        <h3
          className={`${layout === "wide" ? "text-3xl sm:text-6xl sm:mb-8" : "text-xl"} font-bold text-neutral-500 dark:text-neutral-50 mb-2 group-hover:translate-x-1 transition-transform duration-300 group-hover:text-primary`}
        >
          {title}
        </h3>
        <p
          className={`${layout === "wide" ? "text-base sm:text-lg" : "text-base"} text-neutral-400 dark:text-neutral-300 leading-relaxed`}
        >
          {description}
        </p>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:via-primary transition-all duration-300" />
  </div>
);

const features: FeatureCardProps[] = [
  {
    title: "Our Mission",
    description:
      "Empowering farmers with intelligent soil and crop analytics to maximize yield, reduce costs, and build sustainable agriculture. We believe every farmer deserves access to world-class soil intelligence, regardless of farm size or location.",
    layout: "wide",
  },
  {
    title: "Soil Health Report",
    description:
      "Get comprehensive analysis of your soil composition, pH levels, nutrient content, and organic matter.",
    icon: <ChartBar />,
  },
  {
    title: "Crop Recommendations",
    description: "AI-powered suggestions for crops best suited to your land.",
    icon: <Sprout />,
  },
  {
    title: "Fertilizer Recommendations",
    description: "Precise fertilizer blends tailored to your soil needs.",
    icon: <Droplets />,
  },
  {
    title: "Best Practices Guide",
    description: "Expert-curated tips for sustainable soil health improvement.",
    icon: <BookOpen />,
    layout: "tall",
  },
];

const FeaturePage = () => {
  return (
    <PageLayout className="border-y border-border">
      <PageHeader
        title="Transform Your Farming with Smart Soil Intelligence"
        className="mb-8 lg:mb-12 text-center lg:text-7xl dark:text-neutral-50 text-neutral-500"
      />
      <PageSection>
        <PageContent>
          {/* Bento Grid Layout - 2x2 responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </PageContent>
      </PageSection>
      <PageSection className="mt-12 sm:mt-16 lg:mt-20">
        <PageContent>
          <div className="rounded-xl border border-primary/30 bg-linear-to-br from-primary/5 to-primary/10 p-8 sm:p-12 text-center">
            <h3 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Farm?
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of farmers already using our platform to maximize
              their yields and sustainability.
            </p>
            <Button className="px-8 py-6 text-base font-semibold">
              Start Your Free Trial
            </Button>
          </div>
        </PageContent>
      </PageSection>
    </PageLayout>
  );
};

export default FeaturePage;
