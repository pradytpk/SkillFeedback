"use client";
import { useState } from "react";
import RatingDots from "@/components/ui/RatingDots";
import SelfRatingDots from "./SelfRatingDots";
import RatingModal from "./RatingModal";
import { MessageSquare, CheckCircle2 } from "lucide-react";

interface SkillCellProps {
  employeeId: string;
  skillId: string;
  skillName: string;
  categoryName: string;
  currentRating: number | null;
  currentNotes: string | null;
  targetRating?: number | null;
  selfAssessmentEnabled?: boolean;
  currentSelfRating?: number | null;
}

export default function SkillCell({
  employeeId, skillId, skillName, categoryName, currentRating, currentNotes, targetRating,
  selfAssessmentEnabled = false, currentSelfRating = null,
}: SkillCellProps) {
  const [open, setOpen] = useState(false);

  const delta = targetRating && currentRating ? currentRating - targetRating : null;
  const meetsTarget = delta !== null && delta >= 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left hover:bg-orange-50 rounded-lg p-2 transition-colors group"
        title={`Click to rate ${skillName}`}
      >
        <div className="flex items-center justify-between mb-1">
          <RatingDots value={currentRating} readonly />
          {targetRating && (
            meetsTarget
              ? <span title={`Meets target (${targetRating})`}><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /></span>
              : <span className="text-xs font-bold text-red-500 flex-shrink-0" title={`Target: ${targetRating}, gap: ${delta}`}>{delta}</span>
          )}
        </div>
        {selfAssessmentEnabled && currentSelfRating !== null && (
          <div className="mt-1">
            <SelfRatingDots value={currentSelfRating} readonly />
          </div>
        )}
        {targetRating && !currentRating && (
          <p className="text-xs text-gray-300 mt-0.5">Target: {targetRating}</p>
        )}
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
        selfAssessmentEnabled={selfAssessmentEnabled}
        currentSelfRating={currentSelfRating}
      />
    </>
  );
}
