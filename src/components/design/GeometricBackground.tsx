import React, { useMemo } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Building2, Home, Handshake, TrendingUp, KeyRound } from "lucide-react";

const GeometricBackground: React.FC = () => {
  const { settings } = useSettings();

  const { show, lineOpacity, shapeOpacity, iconOpacity } = useMemo(() => {
    const intensity = Math.max(0, Math.min(100, settings.backgroundIntensity ?? 40));
    return {
      show: (settings.backgroundStyle || "geometric") === "geometric",
      lineOpacity: intensity / 800, // 0 - 0.125
      shapeOpacity: intensity / 1000 + 0.02, // 0.02 - 0.12
      iconOpacity: intensity / 900, // 0 - 0.11
    };
  }, [settings.backgroundIntensity, settings.backgroundStyle]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.35)_75%,rgba(0,0,0,0.15))]"
    >
      {/* SVG grid + abstract shapes using CSS variables for colors */}
      <svg className="absolute inset-0 h-full w-full text-primary" role="img">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="hsl(var(--background))" />
        <rect width="100%" height="100%" fill="url(#grid)" opacity={lineOpacity} />

        {/* Abstract angled shapes */}
        <g className="text-accent" opacity={shapeOpacity}>
          <polygon points="0,120 220,0 0,0" fill="currentColor" />
          <polygon points="0,260 320,0 220,0 0,120" fill="currentColor" />
        </g>
      </svg>

      {/* Thematic subtle icons */}
      {settings.showThemedIcons !== false && (
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 place-items-center gap-8">
          {[
            { C: Building2, key: "b1" },
            { C: Home, key: "h1" },
            { C: Handshake, key: "hs1" },
            { C: TrendingUp, key: "t1" },
            { C: KeyRound, key: "k1" },
            { C: Home, key: "h2" },
            { C: Building2, key: "b2" },
            { C: TrendingUp, key: "t2" },
            { C: Handshake, key: "hs2" },
            { C: KeyRound, key: "k2" },
          ].map(({ C, key }, i) => (
            <div
              key={key}
              className={`hidden sm:block ${i % 2 === 0 ? "text-primary" : "text-accent"}`}
              style={{ opacity: iconOpacity }}
            >
              <C className="w-16 h-16 md:w-20 md:h-20" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeometricBackground;
