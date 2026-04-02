import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { trpc } from "@/utils/trpc";
import { ArrowCta } from "@/components/arrow-cta";
import { StripedPattern } from "@janus/ui/components/magicui/striped-pattern";
import { LightRays } from "@janus/ui/components/magicui/light-rays";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  const ctaContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.1,
      },
    },
  };

  const ctaAreaVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2 flex flex-col items-center justify-center text-center">
      <LightRays
        className="absolute inset-0 -z-10"
        count={20}
        color="#fff"
        blur={8}
        speed={2000}
        length="400px"
      />
      <h1 className="text-6xl font-bold">What do you mean ?</h1>
      <h2 className="mb-2 font-medium">
        Yeees exactly like{" "}
        <a
          href="https://en.wikipedia.org/wiki/What_Do_You_Mean%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          that🎧
        </a>
      </h2>
      <div className="grid gap-6 w-full place-items-center">
        <section className="rounded-lg p-4 w-full flex flex-col items-center">
          <motion.div
            className="flex items-center justify-center gap-2 w-full"
            variants={ctaContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="relative flex h-[400px] w-full items-center justify-center gap-2"
              variants={ctaAreaVariants}
              whileHover={{ y: -10, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
            >
              <Link to="/login">
                <div className="text-7xl p-4 rounded-3xl shadow-2xl">Login</div>
              </Link>
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowCta className="text-white h-80 w-96 rotate-180 scale-y-[-1] translate-y-1/3" />
              </motion.div>
              <StripedPattern className="mask-[radial-gradient(200px_circle_at_center,white,transparent)]" />
            </motion.div>
            <motion.div
              className="relative flex h-[400px] w-full items-center justify-center gap-2"
              variants={ctaAreaVariants}
              whileHover={{ y: -10, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
            >
              <motion.div
                animate={{ y: [0, -11, 0] }}
                transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
              >
                <ArrowCta className="text-white h-96 w-80 rotate-180 scale-x-[-1] -translate-y-1/3" />
              </motion.div>
              <Link to="/register">
                <div className="text-7xl p-4 rounded-3xl shadow-2xl">Register</div>
              </Link>
              <StripedPattern className="mask-[radial-gradient(200px_circle_at_center,white,transparent)]" />
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
