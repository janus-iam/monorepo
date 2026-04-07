import * as React from "react";
import { useTranslation } from "react-i18next";

import { DottedMap } from "@janus/ui/components/magicui/dotted-map";
import type { Marker } from "@janus/ui/components/magicui/dotted-map";

type MyMarker = Marker & {
  overlay: {
    countryCode: string;
    label: string;
  };
};

const markers: MyMarker[] = [
  {
    lat: 48.5112,
    lng: 2.2055,
    size: 2.0,
    overlay: { countryCode: "eu", label: "Paris" },
  },
];

export function Map() {
  const { t } = useTranslation();
  const id = React.useId();

  return (
    <section className="space-y-3">
      <div className="island-shell relative h-[min(520px,72vh)] w-full overflow-hidden rounded-2xl">
        <div className="absolute inset-0 z-0">
          <div className="to-background absolute inset-0 bg-radial from-transparent to-200%" />
          <DottedMap<MyMarker>
            className="text-(--lagoon)"
            markerColor="var(--lagoon-deep)"
            markers={markers}
            renderMarkerOverlay={({ marker, x, y, r, index }) => {
              const { countryCode, label } = marker.overlay;
              const href = `https://flagcdn.com/w80/${countryCode}.webp`;

              const clipId = `${id}-flag-clip-${index}`.replace(/:/g, "-");
              const imgR = r * 0.75;

              const fontSize = r * 0.9;
              const pillH = r * 1.5;
              const pillW = label.length * (fontSize * 0.62) + r * 1.4;
              const pillX = x + r + r * 0.6;
              const pillY = y - pillH / 2;

              return (
                <g style={{ pointerEvents: "none" }}>
                  <clipPath id={clipId}>
                    <circle cx={x} cy={y} r={imgR} />
                  </clipPath>

                  <image
                    href={href}
                    x={x - imgR}
                    y={y - imgR}
                    width={imgR * 2}
                    height={imgR * 2}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${clipId})`}
                  />

                  <rect
                    x={pillX}
                    y={pillY}
                    width={pillW}
                    height={pillH}
                    rx={pillH / 2}
                    fill="rgba(0,0,0,0.55)"
                  />
                  <text
                    x={pillX + r * 0.7}
                    y={y + fontSize * 0.35}
                    fontSize={fontSize}
                    fill="white"
                  >
                    {label}
                  </text>
                </g>
              );
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-(--surface-strong) via-(--surface-strong)/55 to-transparent"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-5 pt-20 sm:px-8 sm:pb-7 sm:pt-28">
          <div className="ml-auto max-w-[min(100%,22rem)] text-right">
            <p className="island-kicker mb-2">{t("sections.map.kicker")}</p>
            <h2 className="display-title text-3xl font-bold leading-[1.06] tracking-tight sm:text-4xl md:text-[2.75rem]">
              <span className="block bg-linear-to-br from-(--sea-ink) via-(--palm) to-(--lagoon-deep) bg-clip-text text-transparent">
                {t("sections.map.titleAccent")}
              </span>
              <span className="mt-0.5 block text-(--sea-ink)">{t("sections.map.titleRest")}</span>
            </h2>
            <p className="mt-3 text-xs font-medium leading-relaxed text-(--sea-ink-soft) sm:text-sm">
              {t("sections.map.tagline")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
