"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

interface MoodPoint {
  date: string;
  mood: number;
}

const MOOD_LABELS: Record<number, string> = {
  1: "😞 Difficult",
  2: "😕 Low",
  3: "😐 Neutral",
  4: "🙂 Good",
  5: "😄 Great",
};

export default function MoodTrendChart({ data }: { data: MoodPoint[] }) {
  if (data.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Meeting Mood Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            tickFormatter={(v) => ["", "😞", "😕", "😐", "🙂", "😄"][v] ?? v}
          />
          <Tooltip
            formatter={(v) => [MOOD_LABELS[v as number] ?? v, "Mood"]}
            labelStyle={{ fontSize: 12 }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
          <ReferenceLine y={3} stroke="#e5e7eb" strokeDasharray="4 2" />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#ea580c"
            strokeWidth={2}
            dot={{ fill: "#ea580c", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
