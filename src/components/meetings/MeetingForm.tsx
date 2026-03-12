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
}

interface MeetingTemplate {
  id: string;
  title: string;
  notesTemplate: string | null;
}

interface MeetingFormProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  meeting?: Meeting;
  templates?: MeetingTemplate[];
}

export default function MeetingForm({ open, onClose, employeeId, meeting, templates = [] }: MeetingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(meeting?.notes || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("notes", notes);
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
