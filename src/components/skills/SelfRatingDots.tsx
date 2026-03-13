"use client";
import { cn } from "@/lib/utils";
import { RATING_LABELS } from "@/lib/constants";

interface SelfRatingDotsProps {
  value: number | null;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

const DOT_BORDER_COLORS = [
  "border-red-400",
  "border-orange-400",
  "border-yellow-400",
  "border-blue-400",
  "border-green-500",
];

export default function SelfRatingDots({ value, onChange, readonly = false }: SelfRatingDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(rating)}
          title={`Self: ${RATING_LABELS[rating]}`}
          className={cn(
            "w-5 h-5 rounded-full border-2 transition-all",
            value !== null && value >= rating
              ? DOT_BORDER_COLORS[rating - 1] + " bg-white"
              : "border-gray-300 bg-white",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        />
      ))}
      {value !== null && value !== undefined && (
        <span className="ml-1 text-xs text-gray-400 italic">self</span>
      )}
    </div>
  );
}
