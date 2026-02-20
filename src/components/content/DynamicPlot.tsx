"use client";

import dynamic from "next/dynamic";
import { type ComponentProps } from "react";

const PlotLoading = () => (
  <div className="h-64 bg-muted animate-pulse rounded-lg" />
);

const RawPlot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: PlotLoading,
});

type PlotProps = ComponentProps<typeof RawPlot>;

/**
 * Shared Plotly wrapper — forces full-width rendering.
 * Plotly sets inline `display: inline-block` which collapses width;
 * the outer div + useResizeHandler ensures proper sizing.
 */
function Plot(props: PlotProps) {
  return (
    <div style={{ width: "100%", position: "relative" }}>
      <RawPlot
        {...props}
        useResizeHandler
        style={{ width: "100%", ...props.style }}
      />
    </div>
  );
}

export { Plot, PlotLoading };
