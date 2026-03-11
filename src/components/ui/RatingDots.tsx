"use client";
import { cn } from "@/lib/utils";
import { RATING_LABELS } from "@/lib/constants";

interface RatingDotsProps {
  value: number | null;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

const DOT_COLORS = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];

export default function RatingDots({ value, onChange, readonly = false }: RatingDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(rating)}
          title={RATING_LABELS[rating]}
          className={cn(
            "w-5 h-5 rounded-full border-2 transition-all",
            value !== null && value >= rating
              ? DOT_COLORS[rating - 1]
              : "bg-gray-100 border-gray-300",
            value !== null && value >= rating ? "border-transparent" : "",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        />
      ))}
      {value !== null && value !== undefined && (
        <span className="ml-1 text-xs text-gray-500">{RATING_LABELS[value]}</span>
      )}
    </div>
  );
}
