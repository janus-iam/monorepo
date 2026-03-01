import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  DataPrivacy,
  AuthFlow,
  Services,
  Community,
  Pricing,
  SectionReveal,
} from "#/components/landing";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <main className="px-4 pb-16 pt-6 sm:pt-8">
      <div className="page-wrap space-y-12 sm:space-y-16">
        <section className="rise-in">
          <Hero />
        </section>
        <SectionReveal delay={0}>
          <DataPrivacy />
        </SectionReveal>
        <SectionReveal delay={50}>
          <AuthFlow />
        </SectionReveal>
        <SectionReveal delay={100}>
          <Services />
        </SectionReveal>
        <SectionReveal delay={50}>
          <Community />
        </SectionReveal>
        <SectionReveal delay={50}>
          <Pricing />
        </SectionReveal>
      </div>
    </main>
  );
}
