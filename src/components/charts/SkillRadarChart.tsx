"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CategoryAverage {
  category: string;
  average: number;
}

export default function SkillRadarChart({ data }: { data: CategoryAverage[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No ratings yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
        <Radar
          name="Avg Rating"
          dataKey="average"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.3}
        />
        <Tooltip formatter={(v) => [Number(v).toFixed(1), "Avg Rating"]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
