"use client";
import { useState } from "react";
import { createCommitment, updateCommitmentStatus, deleteCommitment } from "@/actions/commitments";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, XCircle, Plus, Trash2 } from "lucide-react";

interface Commitment {
  id: string;
  description: string;
  status: string;
  dueDate: string | null;
}

const STATUS_CYCLE: Record<string, string> = {
  OPEN: "DONE",
  DONE: "DROPPED",
  DROPPED: "OPEN",
};

const STATUS_ICON = {
  OPEN: <Circle className="w-4 h-4 text-gray-400" />,
  DONE: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  DROPPED: <XCircle className="w-4 h-4 text-red-400" />,
};

const STATUS_LABEL_CLASS: Record<string, string> = {
  OPEN: "text-gray-700",
  DONE: "text-gray-400 line-through",
  DROPPED: "text-red-400 line-through",
};

export default function CommitmentList({
  commitments,
  meetingId,
  employeeId,
}: {
  commitments: Commitment[];
  meetingId: string;
  employeeId: string;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!desc.trim()) return;
    setSaving(true);
    try {
      await createCommitment(employeeId, desc.trim(), meetingId);
      setDesc("");
      setAdding(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, status: string) {
    await updateCommitmentStatus(id, STATUS_CYCLE[status] ?? "OPEN", employeeId);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await deleteCommitment(id, employeeId);
    router.refresh();
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Commitments</p>
      <div className="space-y-1.5">
        {commitments.map((c) => (
          <div key={c.id} className="flex items-start gap-2 group">
            <button
              onClick={() => handleToggle(c.id, c.status)}
              className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
              title="Cycle status"
            >
              {STATUS_ICON[c.status as keyof typeof STATUS_ICON] ?? STATUS_ICON.OPEN}
            </button>
            <p className={`text-sm flex-1 ${STATUS_LABEL_CLASS[c.status] ?? ""}`}>{c.description}</p>
            <button
              onClick={() => handleDelete(c.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="mt-2 flex gap-2">
          <input
            autoFocus
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
            placeholder="Add a commitment..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !desc.trim()}
            className="text-sm px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => setAdding(false)}
            className="text-sm px-3 py-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-orange-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add commitment
        </button>
      )}
    </div>
  );
}
