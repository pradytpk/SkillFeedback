"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import GoalForm from "./GoalForm";
import { Plus } from "lucide-react";

interface Skill { id: string; name: string; categoryName: string }

export default function AddGoalButton({ employeeId, availableSkills = [] }: { employeeId: string; availableSkills?: Skill[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Add Goal
      </Button>
      <GoalForm open={open} onClose={() => setOpen(false)} employeeId={employeeId} availableSkills={availableSkills} />
    </>
  );
}
