"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { createMeeting, updateMeeting } from "@/actions/meetings";
import { formatInputDate } from "@/lib/utils";

interface Meeting {
  id: string;
  meetingDate: Date | string;
  notes: string | null;
  feedback: string | null;
  moodScore?: number | null;
  qualityFlag?: string | null;
}

interface MeetingTemplate {
  id: string;
  title: string;
  notesTemplate: string | null;
}

interface OpenActionItem {
  id: string;
  description: string;
}

interface MeetingFormProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  meeting?: Meeting;
  templates?: MeetingTemplate[];
  previousOpenItems?: OpenActionItem[];
}

const MOOD_OPTIONS = [
  { value: 1, emoji: "😞", label: "Difficult" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

const QUALITY_FLAGS = [
  { value: "GREAT", label: "Great" },
  { value: "NORMAL", label: "Normal" },
  { value: "DIFFICULT", label: "Difficult" },
];

export default function MeetingForm({ open, onClose, employeeId, meeting, templates = [], previousOpenItems = [] }: MeetingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(meeting?.notes || "");
  const [moodScore, setMoodScore] = useState<number | null>(meeting?.moodScore ?? null);
  const [qualityFlag, setQualityFlag] = useState<string>(meeting?.qualityFlag ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("notes", notes);
    if (moodScore !== null) formData.set("moodScore", String(moodScore));
    formData.set("qualityFlag", qualityFlag);
    try {
      if (meeting) {
        await updateMeeting(meeting.id, employeeId, formData);
      } else {
        await createMeeting(employeeId, formData);
      }
      router.refresh();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={meeting ? "Edit 1:1 Meeting" : "Log 1:1 Meeting"} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Meeting Date"
          name="meetingDate"
          id="meetingDate"
          type="date"
          defaultValue={meeting ? formatInputDate(meeting.meetingDate) : formatInputDate(new Date())}
          required
        />

        {/* Mood Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Mood (optional)</label>
          <div className="flex gap-2 flex-wrap">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMoodScore(moodScore === m.value ? null : m.value)}
                title={m.label}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border-2 transition-all ${
                  moodScore === m.value
                    ? "border-orange-400 bg-orange-50 scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-xs text-gray-500">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Flag */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Quality (optional)</label>
          <div className="flex gap-2">
            {QUALITY_FLAGS.map((q) => (
              <button
                key={q.value}
                type="button"
                onClick={() => setQualityFlag(qualityFlag === q.value ? "" : q.value)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  qualityFlag === q.value
                    ? "bg-orange-100 border-orange-300 text-orange-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carry-forward open items */}
        {!meeting && previousOpenItems.length > 0 && (
          <div className="bg-amber-50 rounded-lg px-4 py-3 border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 mb-2">Open items from last meeting:</p>
            <ul className="space-y-1">
              {previousOpenItems.map((item) => (
                <li key={item.id} className="text-xs text-amber-800 flex items-start gap-1.5">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 inline-block" />
                  {item.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          {templates.length > 0 && !meeting && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Use Template</label>
              <select
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                defaultValue=""
                onChange={(e) => {
                  const tpl = templates.find((t) => t.id === e.target.value);
                  if (tpl?.notesTemplate) setNotes(tpl.notesTemplate);
                }}
              >
                <option value="">— select a template —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          )}
          <Textarea
            label="Notes"
            name="notes"
            id="notes"
            placeholder="What was discussed?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <Textarea
          label="Feedback"
          name="feedback"
          id="feedback"
          placeholder="Key feedback for this employee..."
          defaultValue={meeting?.feedback || ""}
          rows={3}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : meeting ? "Save Changes" : "Log Meeting"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
