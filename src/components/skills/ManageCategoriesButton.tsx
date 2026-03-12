"use client";
import { useState, useTransition, useEffect } from "react";
import { Settings2, CheckCircle2, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { setEmployeeCategories } from "@/actions/skills";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface Props {
  employeeId: string;
  allCategories: Category[];
  assignedIds: string[];
}

export default function ManageCategoriesButton({ employeeId, allCategories, assignedIds }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedIds));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Auto-dismiss success toast
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  function toggle(id: string) {
    setError(null);
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleOpen() {
    setSelected(new Set(assignedIds));
    setError(null);
    setOpen(true);
  }

  function handleSave() {
    if (allCategories.length > 0 && selected.size === 0) {
      setError("Select at least one category, or close to keep existing assignments.");
      return;
    }
    startTransition(async () => {
      try {
        await setEmployeeCategories(employeeId, Array.from(selected));
        setOpen(false);
        setSuccess(true);
        router.refresh();
      } catch {
        setError("Failed to save. Please try again.");
      }
    });
  }

  return (
    <>
      {/* Success toast */}
      {success && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          Categories updated successfully
        </div>
      )}

      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Settings2 className="w-4 h-4" />
        Manage Categories
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Assign Skill Categories">
        <p className="text-sm text-gray-500 mb-4">
          Choose which skill categories apply to this employee.
        </p>

        {allCategories.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            No categories available. Add categories in Settings first.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {allCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(cat.id)}
                  onChange={() => toggle(cat.id)}
                  className="mt-0.5 accent-orange-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-400">{cat.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-5">
          <span className="text-xs text-gray-400">{selected.size} of {allCategories.length} selected</span>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={pending}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
