"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { createGoal, updateGoal } from "@/actions/goals";

function getCurrentFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  return month >= 4 ? `${year}-${String(year + 1).slice(2)}` : `${year - 1}-${String(year).slice(2)}`;
}

interface Skill { id: string; name: string; categoryName: string }

interface GoalFormProps {
  employeeId: string;
  open: boolean;
  onClose: () => void;
  availableSkills?: Skill[];
  goal?: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    targetDate: string | null;
    status: string;
    fiscalYear: string | null;
    quarter: string | null;
    weight: number;
    linkedSkillId: string | null;
  };
}

export default function GoalForm({ employeeId, open, onClose, goal, availableSkills = [] }: GoalFormProps) {
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

  const currentFY = getCurrentFiscalYear();

  return (
    <Modal open={open} onClose={onClose} title={goal ? "Edit Goal" : "Add Goal"} maxWidth="max-w-lg">
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
            <Input type="date" name="targetDate" defaultValue={goal?.targetDate ? goal.targetDate.slice(0, 10) : ""} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year</label>
            <select
              name="fiscalYear"
              defaultValue={goal?.fiscalYear ?? currentFY}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {[-1, 0, 1].map((offset) => {
                const y = new Date().getFullYear() + offset;
                const fy = `${y}-${String(y + 1).slice(2)}`;
                return <option key={fy} value={fy}>FY {fy}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
            <select
              name="quarter"
              defaultValue={goal?.quarter ?? ""}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">Any</option>
              <option value="Q1">Q1 (Apr–Jun)</option>
              <option value="Q2">Q2 (Jul–Sep)</option>
              <option value="Q3">Q3 (Oct–Dec)</option>
              <option value="Q4">Q4 (Jan–Mar)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <select
              name="weight"
              defaultValue={String(goal?.weight ?? 1)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="1">1 – Normal</option>
              <option value="2">2 – Important</option>
              <option value="3">3 – Critical</option>
            </select>
          </div>
        </div>

        {availableSkills.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Linked Skill (optional)</label>
            <select
              name="linkedSkillId"
              defaultValue={goal?.linkedSkillId ?? ""}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">— none —</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id}>{s.categoryName} / {s.name}</option>
              ))}
            </select>
          </div>
        )}

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
