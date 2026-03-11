"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import MeetingForm from "./MeetingForm";
import { Plus } from "lucide-react";

export default function AddMeetingButton({ employeeId }: { employeeId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Log Meeting
      </Button>
      <MeetingForm open={open} onClose={() => setOpen(false)} employeeId={employeeId} />
    </>
  );
}
