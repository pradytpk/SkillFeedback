"use client";
import { useState } from "react";
import RatingDots from "@/components/ui/RatingDots";
import RatingModal from "./RatingModal";
import { MessageSquare } from "lucide-react";

interface SkillCellProps {
  employeeId: string;
  skillId: string;
  skillName: string;
  categoryName: string;
  currentRating: number | null;
  currentNotes: string | null;
}

export default function SkillCell({
  employeeId, skillId, skillName, categoryName, currentRating, currentNotes,
}: SkillCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left hover:bg-orange-50 rounded-lg p-2 transition-colors group"
        title={`Click to rate ${skillName}`}
      >
        <RatingDots value={currentRating} readonly />
        {currentNotes && (
          <div className="mt-1.5 flex items-start gap-1">
            <MessageSquare className="w-3 h-3 text-gray-300 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400 line-clamp-2">{currentNotes}</p>
          </div>
        )}
      </button>
      <RatingModal
        open={open}
        onClose={() => setOpen(false)}
        employeeId={employeeId}
        skillId={skillId}
        skillName={skillName}
        categoryName={categoryName}
        currentRating={currentRating}
        currentNotes={currentNotes}
      />
    </>
  );
}
