"use client";
import { useState } from "react";
import { deleteMeeting } from "@/actions/meetings";
import { formatDate, formatDateRelative } from "@/lib/utils";
import ActionItemList from "./ActionItemList";
import MeetingForm from "./MeetingForm";
import Button from "@/components/ui/Button";
import { Pencil, Trash2, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActionItem {
  id: string;
  description: string;
  status: string;
  dueDate: Date | string | null;
}

interface Meeting {
  id: string;
  meetingDate: Date | string;
  notes: string | null;
  feedback: string | null;
  actionItems: ActionItem[];
}

export default function MeetingCard({
  meeting,
  employeeId,
}: {
  meeting: Meeting;
  employeeId: string;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this meeting record?")) return;
    await deleteMeeting(meeting.id, employeeId);
    router.refresh();
  }

  const openCount = meeting.actionItems.filter((a) => a.status === "OPEN" || a.status === "IN_PROGRESS").length;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">{formatDate(meeting.meetingDate)}</p>
                <p className="text-xs text-gray-400">{formatDateRelative(meeting.meetingDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {openCount > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {openCount} open
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setExpanded((e) => !e)}>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {meeting.feedback && (
            <div className="mt-3 bg-orange-50 rounded-lg px-3 py-2">
              <p className="text-xs font-semibold text-orange-700 mb-1">Feedback</p>
              <p className="text-sm text-gray-700">{meeting.feedback}</p>
            </div>
          )}
        </div>

        {expanded && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
            {meeting.notes && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{meeting.notes}</p>
              </div>
            )}
            <ActionItemList
              actionItems={meeting.actionItems.map((a) => ({
                ...a,
                dueDate: a.dueDate ? new Date(a.dueDate).toISOString() : null,
              }))}
              meetingId={meeting.id}
              employeeId={employeeId}
            />
          </div>
        )}

        {!expanded && meeting.actionItems.length > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full px-5 py-2 text-xs text-gray-400 hover:text-gray-600 border-t border-gray-100 text-left hover:bg-gray-50 transition-colors"
          >
            {meeting.actionItems.length} action item{meeting.actionItems.length !== 1 ? "s" : ""} · Click to expand
          </button>
        )}
      </div>

      <MeetingForm
        open={editing}
        onClose={() => setEditing(false)}
        employeeId={employeeId}
        meeting={{
          ...meeting,
          meetingDate:
            typeof meeting.meetingDate === "string"
              ? meeting.meetingDate
              : meeting.meetingDate.toISOString(),
        }}
      />
    </>
  );
}
