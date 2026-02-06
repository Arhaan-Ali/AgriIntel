"use client"

import { PageContent, PageLayout, PageSection } from '@/layout/PageLayout'
import {
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  Leaf,
  Target,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Motion, spring } from 'react-motion'

const highlightCards = [
  {
    title: 'Real-Time Insights',
    description:
      'Instant soil analysis with AI-powered recommendations delivered to your dashboard.',
    icon: <Sparkles size={24} />,
    gradient: 'from-neutral-200/5 to-primary/1',
  },
  {
    title: 'Boost Yields',
    description:
      'Increase crop productivity with data-driven strategies tailored to your farm.',
    icon: <TrendingUp size={24} />,
    gradient: 'from-neutral-200/5 to-primary/1',
  },
  {
    title: 'Smart Analytics',
    description:
      'Track soil health trends over time with comprehensive historical data.',
    icon: <BarChart3 size={24} />,
    gradient: 'from-neutral-200/5 to-primary/1',
  },
  {
    title: 'Optimize Resources',
    description:
      'Reduce fertilizer costs and environmental impact with precision recommendations.',
    icon: <Zap size={24} />,
    gradient: 'from-neutral-200/5 to-primary/1',
  },
]

const pillars = [
  {
    title: 'Our Mission',
    description:
      'Empower farmers with intelligent soil and crop analytics to grow more with less.',
    icon: <Leaf size={24} />,
    gradient: 'from-primary/5 to-primary/1',
  },
  {
    title: 'Our Aim',
    description:
      'Make sustainable, data-driven farming accessible to every grower worldwide.',
    icon: <Target size={24} />,
    gradient: 'from-primary/5 to-primary/1',
  },
]


const AboutCard = ({
  title,
  description,
  icon,
  gradient,
}: {
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
}) => (
  <div
    className={`
      relative overflow-hidden
      rounded-xl border border-border
      bg-linear-to-br ${gradient}
      p-6 sm:p-8
      hover:shadow-md transition-all duration-300
      group
      flex flex-col gap-4
    `}
  >
    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-3xl" />
    </div>
    <div className="relative z-10">
      <div className="mb-4 inline-flex rounded-lg bg-white/10 dark:bg-black/10 p-2.5 backdrop-blur-sm group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors">
        <div className="text-foreground group-hover:text-primary group-hover:scale-125 transition-all duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-neutral-500 dark:text-neutral-50 mb-2 group-hover:translate-x-1 transition-transform duration-300 group-hover:text-primary">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-300 leading-relaxed">
        {description}
      </p>
    </div>
    <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:via-primary transition-all duration-300" />
  </div>
)

type StatFormat = 'kPlus' | 'mPlus' | 'percent' | 'decimal'

const formatStatValue = (value: number, format: StatFormat) => {
  if (format === 'kPlus') return `${Math.round(value / 1000)}K+`
  if (format === 'mPlus') return `${Math.round(value / 1000000)}M+`
  if (format === 'percent') return `${Math.round(value)}%`
  return value.toFixed(1)
}

const AnimatedStat = ({
  value,
  format,
  triggerKey,
}: {
  value: number
  format: StatFormat
  triggerKey: number
}) => (
  <Motion
    key={triggerKey}
    defaultStyle={{ val: 0 }}
    style={{ val: spring(value, { stiffness: 110, damping: 18 }) }}
  >
    {(interpolated: { [key: string]: number }) => (
      <div className="text-2xl sm:text-4xl font-bold text-primary mb-2">
        {formatStatValue(interpolated.val, format)}
      </div>
    )}
  </Motion>
)

const AboutPage = () => {
  const statsRef = React.useRef<HTMLDivElement | null>(null)
  const [statsTrigger, setStatsTrigger] = React.useState(0)
  const wasVisible = React.useRef(false)

  React.useEffect(() => {
    const target = statsRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current) {
          wasVisible.current = true
          setStatsTrigger((prev) => prev + 1)
        }

        if (!entry.isIntersecting) {
          wasVisible.current = false
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])
  return (
    <PageLayout className="min-h-dvh">
      <PageSection className="">
        <PageContent>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-500 dark:text-neutral-50 tracking-tight translate-z-90 text-shadow sm:text-shadow-sm">
            Built to help farmers <span className='text-primary/60 dark:text-primary'>grow smarter</span>, faster, and sustainably.
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-neutral-400 dark:text-neutral-300 leading-relaxed">
                We blend agronomy expertise with modern AI to deliver clear, actionable
                insights on soil health, crop selection, and fertilizer planning.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="relative overflow-hidden rounded-xl border border-border bg-linear-to-br from-primary/5 to-primary/10">
                  <div className="aspect-4/3">
                    <Image
                      src="/about-01.png"
                      alt="Soil analysis in the field"
                      fill
                      className="object-cover brightness-75 hover:brightness-100 transition-all duration-300"
                      sizes="(min-width: 640px) 50vw, 100vw"
                      priority
                    />
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-border bg-linear-to-br from-primary/5 to-primary/10">
                  <div className="aspect-4/3">
                    <Image
                      src="/about-02.png"
                      alt="Smart farming dashboard view"
                      fill
                      className="object-cover brightness-75 hover:brightness-100 transition-all duration-300"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar) => (
                <AboutCard
                  key={pillar.title}
                  title={pillar.title}
                  description={pillar.description}
                  icon={pillar.icon}
                  gradient={pillar.gradient}
                />
              ))}
            </div>
          </div>
        </PageContent>
      </PageSection>

      <PageSection className="mt-12 sm:mt-16 lg:mt-20">
        <PageContent>
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-neutral-500 dark:text-neutral-50 mb-4 text-shadow sm:text-shadow-sm">
              <span className='text-primary/60 dark:text-primary'>Why</span> Farmers Choose Us
            </h2>
            <p className="text-neutral-400 dark:text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to optimize your farm in one intelligent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {highlightCards.map((benefit) => (
              <AboutCard
                key={benefit.title}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
                gradient={benefit.gradient}
              />
            ))}
          </div>
        </PageContent>
      </PageSection>

      <PageSection className="mt-12 sm:mt-16 lg:mt-20">
        <PageContent>
          <div
            ref={statsRef}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center py-8 sm:py-12 px-4 rounded-xl border border-border/50 bg-linear-to-br from-primary/5 to-primary/10"
          >
            <div>
              <AnimatedStat value={10000} format="kPlus" triggerKey={statsTrigger} />
              <p className="text-xs sm:text-sm text-muted-foreground">Active Farmers</p>
            </div>
            <div>
              <AnimatedStat value={2000000} format="mPlus" triggerKey={statsTrigger} />
              <p className="text-xs sm:text-sm text-muted-foreground">Acres Analyzed</p>
            </div>
            <div>
              <AnimatedStat value={35} format="percent" triggerKey={statsTrigger} />
              <p className="text-xs sm:text-sm text-muted-foreground">Avg Yield Increase</p>
            </div>
            <div>
              <AnimatedStat value={99.9} format="decimal" triggerKey={statsTrigger} />
              <p className="text-xs sm:text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </PageContent>
      </PageSection>
    </PageLayout>
  )
}

export default AboutPage