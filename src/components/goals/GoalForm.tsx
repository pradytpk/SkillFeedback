"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { createGoal, updateGoal } from "@/actions/goals";

interface GoalFormProps {
  employeeId: string;
  open: boolean;
  onClose: () => void;
  goal?: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    targetDate: string | null;
    status: string;
  };
}

export default function GoalForm({ employeeId, open, onClose, goal }: GoalFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setSaving(true);
    setError("");
    try {
      if (goal) {
        await updateGoal(goal.id, employeeId, fd);
      } else {
        await createGoal(employeeId, fd);
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={goal ? "Edit Goal" : "Add Goal"}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <Input name="title" defaultValue={goal?.title ?? ""} placeholder="e.g. Lead a cross-team project" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <Textarea name="description" defaultValue={goal?.description ?? ""} placeholder="What does success look like?" rows={3} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
            <Input name="category" defaultValue={goal?.category ?? ""} placeholder="e.g. Technical, Leadership" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date (optional)</label>
            <Input
              type="date"
              name="targetDate"
              defaultValue={goal?.targetDate ? goal.targetDate.slice(0, 10) : ""}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : goal ? "Save Changes" : "Add Goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
