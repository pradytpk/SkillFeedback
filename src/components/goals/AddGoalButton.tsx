"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import GoalForm from "./GoalForm";
import { Plus } from "lucide-react";

export default function AddGoalButton({ employeeId }: { employeeId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Add Goal
      </Button>
      <GoalForm open={open} onClose={() => setOpen(false)} employeeId={employeeId} />
    </>
  );
}
