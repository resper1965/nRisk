"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";

interface DomainScore {
  name: string;
  value: number;
}

interface SpiderChartProps {
  data: DomainScore[];
}

export function SpiderChart({ data }: SpiderChartProps) {
  return (
    <div className="h-[400px] w-full rounded-2xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm">
      <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted">
        Postura por Domínio (ISO 27001)
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
            animationBegin={300}
            animationDuration={1500}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
