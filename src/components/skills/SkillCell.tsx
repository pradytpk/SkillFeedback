"use client";
import { useState } from "react";
import RatingDots from "@/components/ui/RatingDots";
import RatingModal from "./RatingModal";

interface SkillCellProps {
  employeeId: string;
  skillId: string;
  skillName: string;
  categoryName: string;
  currentRating: number | null;
  currentNotes: string | null;
}

export default function SkillCell({
  employeeId,
  skillId,
  skillName,
  categoryName,
  currentRating,
  currentNotes,
}: SkillCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left hover:bg-indigo-50 rounded-lg p-2 transition-colors group"
        title={`Click to rate ${skillName}`}
      >
        <RatingDots value={currentRating} readonly />
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
