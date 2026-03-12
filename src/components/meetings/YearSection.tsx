"use client";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, NotebookPen, CheckCircle2 } from "lucide-react";
import { upsertYearNote } from "@/actions/yearNotes";
import MeetingCard from "./MeetingCard";
import Button from "@/components/ui/Button";
import AddMeetingButton from "./AddMeetingButton";

interface ActionItem {
  id: string;
  description: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Meeting {
  id: string;
  meetingDate: string;
  notes: string | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
  actionItems: ActionItem[];
}

interface Props {
  employeeId: string;
  yearLabel: string;        // e.g. "2024-25"
  meetings: Meeting[];
  initialNotes: string;
  defaultOpen?: boolean;
}

export default function YearSection({ employeeId, yearLabel, meetings, initialNotes, defaultOpen }: Props) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [notes, setNotes] = useState(initialNotes);
  const [editingNotes, setEditingNotes] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSaveNotes() {
    startTransition(async () => {
      await upsertYearNote(employeeId, yearLabel, notes);
      setEditingNotes(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Year header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900">FY {yearLabel}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {meetings.length} meeting{meetings.length !== 1 ? "s" : ""}
          </span>
          {notes && (
            <span className="text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
              Annual notes added
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {/* Annual overall notes */}
          <div className="px-5 py-4 bg-orange-50/40 border-b border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <NotebookPen className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">Annual Overall Notes</span>
                <span className="text-xs text-gray-400">(Included in PDF export)</span>
              </div>
              {saved && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>
            {editingNotes ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add overall comments for this fiscal year..."
                  rows={3}
                  className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white resize-none"
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={handleSaveNotes} disabled={pending}>
                    {pending ? "Saving..." : "Save Notes"}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => { setNotes(initialNotes); setEditingNotes(false); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingNotes(true)}
                className="min-h-[40px] text-sm text-gray-600 cursor-pointer rounded-lg px-3 py-2 hover:bg-orange-100/60 transition-colors"
              >
                {notes
                  ? <p className="whitespace-pre-wrap">{notes}</p>
                  : <p className="text-gray-400 italic">Click to add annual notes for FY {yearLabel}...</p>}
              </div>
            )}
          </div>

          {/* Meetings for this year */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">1:1 Meetings</p>
              <AddMeetingButton employeeId={employeeId} />
            </div>
            {meetings.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-3 text-center">No meetings in this fiscal year.</p>
            ) : (
              <div className="space-y-3">
                {meetings.map((m) => (
                  <MeetingCard key={m.id} meeting={m} employeeId={employeeId} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
