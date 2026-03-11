"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { RATING_LABELS, RATING_COLORS } from "@/lib/constants";

interface RatingPoint {
  skillId: string;
  skillName: string;
  categoryName: string;
  rating: number;
  ratedAt: string;
}

interface SkillProgressChartProps {
  ratings: RatingPoint[];
}

export default function SkillProgressChart({ ratings }: SkillProgressChartProps) {
  if (ratings.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No rating history yet
      </div>
    );
  }

  // Collect all unique skills
  const skills = Array.from(
    new Map(ratings.map((r) => [r.skillId, { id: r.skillId, name: r.skillName }])).values()
  );

  // Collect all unique dates
  const dateSet = new Set(ratings.map((r) => r.ratedAt.slice(0, 10)));
  const dates = Array.from(dateSet).sort();

  // Build chart data: one row per date
  const chartData = dates.map((date) => {
    const row: Record<string, string | number> = {
      date: format(new Date(date), "MMM d"),
    };
    for (const skill of skills) {
      const entry = ratings.filter((r) => r.skillId === skill.id && r.ratedAt.slice(0, 10) === date);
      if (entry.length > 0) {
        row[skill.name] = entry[entry.length - 1].rating;
      }
    }
    return row;
  });

  const COLORS = Object.values(RATING_COLORS);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }}
          tickFormatter={(v) => RATING_LABELS[v]?.slice(0, 3) ?? v}
        />
        <Tooltip
          formatter={(value, name) => [
            `${value} — ${RATING_LABELS[value as number] ?? value}`,
            name,
          ]}
        />
        <Legend />
        {skills.map((skill, i) => (
          <Line
            key={skill.id}
            type="monotone"
            dataKey={skill.name}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
