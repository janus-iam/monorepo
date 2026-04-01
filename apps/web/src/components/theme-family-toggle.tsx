import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import useMeasure from "react-use-measure";

import { useTheme } from "@/components/theme-provider";
import FamilyButton from "@janus/ui/components/cult-ui/family-button";
import { cn } from "@janus/ui/lib/utils";

const tabs = [
  { id: 0, label: "Light", theme: "light" as const },
  { id: 1, label: "Dark", theme: "dark" as const },
  { id: 2, label: "System", theme: "system" as const },
];

function themeToTabId(t: string | undefined) {
  if (t === "dark") return 1;
  if (t === "light") return 0;
  return 2;
}

export function ThemeFamilyToggle() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(() => themeToTabId(theme));
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    setActiveTab(themeToTabId(theme));
  }, [theme]);

  const content = useMemo(() => {
    switch (activeTab) {
      case 0:
        return (
          <div className="flex items-center justify-center text-amber-200">
            <Sun aria-hidden className="size-[4.5rem]" strokeWidth={1.15} />
          </div>
        );
      case 1:
        return (
          <div className="flex items-center justify-center text-sky-200">
            <Moon aria-hidden className="size-[4.5rem]" strokeWidth={1.15} />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center text-neutral-300">
            <Monitor aria-hidden className="size-[4.5rem]" strokeWidth={1.15} />
          </div>
        );
      default:
        return null;
    }
  }, [activeTab]);

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      setDirection(newTabId > activeTab ? 1 : -1);
      setActiveTab(newTabId);
      const next = tabs.find((t) => t.id === newTabId)?.theme;
      if (next) setTheme(next);
    }
  };

  const variants = {
    initial: (dir: number) => ({
      x: 120 * dir,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: -120 * dir,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <FamilyButton>
      <div
        className="flex w-full max-w-[196px] flex-col items-center pt-3"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div
          className="flex cursor-pointer gap-0.5 rounded-lg bg-neutral-800/90 p-[3px] shadow-inner ring-1 ring-white/10"
          role="tablist"
          aria-label="Color theme"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative z-10 rounded-[5px] px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                activeTab === tab.id
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300",
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {activeTab === tab.id ? (
                <motion.span
                  layoutId="theme-family-bubble"
                  className="absolute inset-0 z-0 bg-neutral-950 mix-blend-difference shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]"
                  style={{ borderRadius: 5 }}
                  transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
                />
              ) : null}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
          <motion.div
            className="relative mx-auto my-2.5 w-full max-w-[160px] overflow-hidden"
            initial={false}
            animate={{ height: bounds.height }}
          >
            <div className="px-2 py-2 md:p-4" ref={ref}>
              <AnimatePresence
                custom={direction}
                mode="popLayout"
                onExitComplete={() => setIsAnimating(false)}
              >
                <motion.div
                  key={activeTab}
                  variants={variants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  custom={direction}
                  onAnimationStart={() => setIsAnimating(true)}
                  onAnimationComplete={() => setIsAnimating(false)}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </MotionConfig>
      </div>
    </FamilyButton>
  );
}
