import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, UserPlus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { buttonVariants } from "@janus/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@janus/ui/components/card";
import { LightRays } from "@janus/ui/components/magicui/light-rays";
import { StripedPattern } from "@janus/ui/components/magicui/striped-pattern";
import { cn } from "@janus/ui/lib/utils";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const panel = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i + 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function HomeComponent() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <LightRays
        className="absolute inset-0 -z-20 rounded-[inherit]"
        count={18}
        color="oklch(0.6152 0.1657 26.98 / 0.2)"
        blur={10}
        speed={18}
        length="72vh"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 text-foreground/10 dark:text-foreground/[0.07]"
        aria-hidden
      >
        <StripedPattern className="mask-[radial-gradient(75%_55%_at_50%_18%,white,transparent)]" />
      </div>

      <div className="container flex flex-1 flex-col items-center justify-center px-4 py-10 md:py-14">
        <motion.header
          className="max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-primary mb-3 text-[0.65rem] font-medium uppercase tracking-[0.28em] md:text-xs">
            Open source IAM
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Identity and access, unified
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-lg text-balance text-sm leading-relaxed md:text-base">
            Authenticate users, manage sessions, and enforce access while keeping your stack under
            your control.
          </p>
        </motion.header>

        <motion.div
          className="mt-12 grid w-full max-w-2xl gap-4 sm:grid-cols-2 sm:gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: 0.05 },
            },
          }}
        >
          <motion.div custom={0} variants={panel}>
            <Card className="relative h-full border-border/80 bg-card/80 backdrop-blur-[2px] transition-[box-shadow,ring-color] hover:shadow-md hover:ring-1 hover:ring-primary/25">
              <CardHeader className="pb-2">
                <div className="text-primary mb-2 flex size-9 items-center justify-center ring-1 ring-primary/20 bg-primary/5">
                  <KeyRound className="size-4" aria-hidden />
                </div>
                <CardTitle className="text-base md:text-lg">Sign in</CardTitle>
                <CardDescription>Continue to your account and open the dashboard.</CardDescription>
              </CardHeader>
              <CardFooter className="border-border/60 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <Link
                  to="/login"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full justify-center sm:w-auto",
                  )}
                >
                  Log in
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div custom={1} variants={panel}>
            <Card className="relative h-full border-border/80 bg-card/80 backdrop-blur-[2px] transition-[box-shadow,ring-color] hover:shadow-md hover:ring-1 hover:ring-primary/25">
              <CardHeader className="pb-2">
                <div className="text-primary mb-2 flex size-9 items-center justify-center ring-1 ring-primary/20 bg-primary/5">
                  <UserPlus className="size-4" aria-hidden />
                </div>
                <CardTitle className="text-base md:text-lg">Create an account</CardTitle>
                <CardDescription>
                  Register to start using Janus with your organization.
                </CardDescription>
              </CardHeader>
              <CardFooter className="border-border/60 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <Link
                  to="/register"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full justify-center sm:w-auto",
                  )}
                >
                  Register
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
