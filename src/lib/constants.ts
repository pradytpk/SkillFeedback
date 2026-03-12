export const RATING_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Developing",
  3: "Proficient",
  4: "Advanced",
  5: "Expert",
};

export const RATING_COLORS: Record<number, string> = {
  1: "#f87171", // red-400
  2: "#fb923c", // orange-400
  3: "#facc15", // yellow-400
  4: "#60a5fa", // blue-400
  5: "#22c55e", // green-500
};

export const RATING_BG_CLASSES: Record<number, string> = {
  1: "bg-red-100 text-red-700 border-red-200",
  2: "bg-orange-100 text-orange-700 border-orange-200",
  3: "bg-yellow-100 text-yellow-700 border-yellow-200",
  4: "bg-blue-100 text-blue-700 border-blue-200",
  5: "bg-green-100 text-green-700 border-green-200",
};

export const RATING_DOT_CLASSES: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-blue-400",
  5: "bg-green-500",
};

export const ACTION_ITEM_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

export const ACTION_ITEM_STATUS_CLASSES: Record<string, string> = {
  OPEN: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600 line-through",
};

export const AVATAR_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
];

export const ACTION_ITEM_STATUSES = ["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"] as const;
export type ActionItemStatus = (typeof ACTION_ITEM_STATUSES)[number];

export const RATING_NOTE_TEMPLATES = [
  "Led this independently in a recent project",
  "Demonstrated consistently across the quarter",
  "Improving — needs occasional guidance",
  "Early stage — requires significant support",
  "Exceeded expectations — a clear strength",
];
