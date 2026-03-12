"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createEmployee, updateEmployee } from "@/actions/employees";
import { AVATAR_COLORS } from "@/lib/constants";
import { formatInputDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  role: string;
  team: string;
  startDate: Date | string;
  avatarColor: string;
}

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee;
  teams: string[];
}

export default function EmployeeForm({ open, onClose, employee, teams }: EmployeeFormProps) {
  const router = useRouter();
  const [color, setColor] = useState(employee?.avatarColor || AVATAR_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("avatarColor", color);
    try {
      if (employee) { await updateEmployee(employee.id, formData); }
      else { await createEmployee(formData); }
      router.refresh();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={employee ? "Edit Team Member" : "Add Team Member"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" name="name" id="name" placeholder="Jane Smith"
          defaultValue={employee?.name} required />
        <Input label="Role / Title" name="role" id="role" placeholder="Senior Engineer"
          defaultValue={employee?.role} required />
        <div>
          <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">Team</label>
          <select id="team" name="team" defaultValue={employee?.team || ""} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
            <option value="" disabled>Select team</option>
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {teams.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">No teams yet — add them in Settings → Teams.</p>
          )}
        </div>
        <Input label="Start Date" name="startDate" id="startDate" type="date"
          defaultValue={employee ? formatInputDate(employee.startDate) : ""} required />
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Avatar Color</p>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className={cn("w-7 h-7 rounded-full border-2 transition-all",
                  color === c ? "border-gray-800 scale-110" : "border-transparent")}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : employee ? "Save Changes" : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
