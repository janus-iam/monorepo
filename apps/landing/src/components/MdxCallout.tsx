import type { ReactNode } from "react";

export function MdxCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="not-prose my-6 rounded-xl border border-(--line) bg-(--chip-bg) p-4">
      <p className="island-kicker mb-2">{title}</p>
      <div className="text-sm leading-7 text-(--sea-ink-soft)">{children}</div>
    </aside>
  );
}
