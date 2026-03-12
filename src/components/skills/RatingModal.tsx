"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import RatingDots from "@/components/ui/RatingDots";
import { addRating } from "@/actions/ratings";
import { RATING_LABELS, RATING_NOTE_TEMPLATES } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  skillId: string;
  skillName: string;
  categoryName: string;
  currentRating: number | null;
  currentNotes: string | null;
}

export default function RatingModal({
  open,
  onClose,
  employeeId,
  skillId,
  skillName,
  categoryName,
  currentRating,
  currentNotes,
}: RatingModalProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(currentRating);
  const [notes, setNotes] = useState(currentNotes || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!rating) return;
    setLoading(true);
    try {
      await addRating(employeeId, skillId, rating, notes || undefined);
      router.refresh();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Rate: ${skillName}`}>
      <p className="text-xs text-gray-500 mb-4">{categoryName}</p>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Rating</p>
        <RatingDots value={rating} onChange={setRating} />
        {rating && (
          <p className="mt-2 text-sm text-gray-600 font-medium">{RATING_LABELS[rating]}</p>
        )}
      </div>

      <div className="mb-1">
        <Textarea
          label="Notes (optional)"
          id="notes"
          placeholder="e.g. Demonstrated strong system design in Q4 project..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
        <div className="mt-2">
          <p className="text-xs text-gray-400 mb-1.5">Quick fill:</p>
          <div className="flex flex-wrap gap-1.5">
            {RATING_NOTE_TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setNotes(t)}
                className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 px-2.5 py-1 rounded-full transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!rating || loading}>
          {loading ? "Saving..." : "Save Rating"}
        </Button>
      </div>
    </Modal>
  );
}
