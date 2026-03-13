"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upsertAppraisalRecord } from "@/actions/appraisal";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { CheckCircle2 } from "lucide-react";

interface AppraisalRecord {
  overallRating: string | null;
  talentBoxPerf: string | null;
  talentBoxPot: string | null;
  achievements: string | null;
  strengths: string | null;
  developAreas: string | null;
  devPlanNextYear: string | null;
  peerFeedbackNotes: string | null;
}

interface AppraisalFormProps {
  employeeId: string;
  fiscalYear: string;
  record: AppraisalRecord | null;
}

const OVERALL_RATINGS = ["S", "A", "B", "C", "D"];
const TALENT_LEVELS = ["High", "Medium", "Low"];

const RATING_STYLE: Record<string, string> = {
  S: "bg-purple-100 border-purple-400 text-purple-700",
  A: "bg-green-100 border-green-400 text-green-700",
  B: "bg-blue-100 border-blue-400 text-blue-700",
  C: "bg-yellow-100 border-yellow-400 text-yellow-700",
  D: "bg-red-100 border-red-400 text-red-700",
};

export default function AppraisalForm({ employeeId, fiscalYear, record }: AppraisalFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [overallRating, setOverallRating] = useState(record?.overallRating ?? "");
  const [talentBoxPerf, setTalentBoxPerf] = useState(record?.talentBoxPerf ?? "");
  const [talentBoxPot, setTalentBoxPot] = useState(record?.talentBoxPot ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("overallRating", overallRating);
    fd.set("talentBoxPerf", talentBoxPerf);
    fd.set("talentBoxPot", talentBoxPot);
    setSaving(true);
    try {
      await upsertAppraisalRecord(employeeId, fiscalYear, fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Overall Rating</label>
        <div className="flex gap-2">
          {OVERALL_RATINGS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setOverallRating(overallRating === r ? "" : r)}
              className={`w-10 h-10 rounded-lg border-2 font-bold text-sm transition-all ${
                overallRating === r
                  ? RATING_STYLE[r]
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">S = Exceptional · A = Exceeds · B = Meets · C = Developing · D = Below</p>
      </div>

      {/* Talent Box */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
          <div className="flex gap-2">
            {TALENT_LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setTalentBoxPerf(talentBoxPerf === l ? "" : l)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  talentBoxPerf === l
                    ? "bg-orange-100 border-orange-300 text-orange-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Potential</label>
          <div className="flex gap-2">
            {TALENT_LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setTalentBoxPot(talentBoxPot === l ? "" : l)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  talentBoxPot === l
                    ? "bg-blue-100 border-blue-300 text-blue-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text sections */}
      <Textarea
        label="Achievements"
        name="achievements"
        placeholder="Key accomplishments this fiscal year..."
        defaultValue={record?.achievements ?? ""}
        rows={3}
      />
      <Textarea
        label="Strengths"
        name="strengths"
        placeholder="Core strengths demonstrated..."
        defaultValue={record?.strengths ?? ""}
        rows={3}
      />
      <Textarea
        label="Development Areas"
        name="developAreas"
        placeholder="Areas to improve or focus on..."
        defaultValue={record?.developAreas ?? ""}
        rows={3}
      />
      <Textarea
        label="Development Plan (Next Year)"
        name="devPlanNextYear"
        placeholder="Planned actions, training, targets for next FY..."
        defaultValue={record?.devPlanNextYear ?? ""}
        rows={3}
      />
      <Textarea
        label="Peer Feedback Notes"
        name="peerFeedbackNotes"
        placeholder="Summary of 360/peer feedback received..."
        defaultValue={record?.peerFeedbackNotes ?? ""}
        rows={3}
      />

      <div className="flex items-center justify-between pt-2">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" /> Saved
          </span>
        )}
        <div className="ml-auto">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : record ? "Update Record" : "Save Appraisal"}
          </Button>
        </div>
      </div>
    </form>
  );
}
