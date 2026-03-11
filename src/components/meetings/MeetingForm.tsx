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

interface MeetingFormProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  meeting?: Meeting;
}

export default function MeetingForm({ open, onClose, employeeId, meeting }: MeetingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
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
        <Textarea
          label="Notes"
          name="notes"
          id="notes"
          placeholder="What was discussed?"
          defaultValue={meeting?.notes || ""}
          rows={4}
        />
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
