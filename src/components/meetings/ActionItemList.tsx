"use client";
import { useState, useOptimistic } from "react";
import { createActionItem, updateActionItemStatus, deleteActionItem } from "@/actions/meetings";
import { ACTION_ITEM_STATUS_LABELS, ACTION_ITEM_STATUS_CLASSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Check, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ActionItem {
  id: string;
  description: string;
  status: string;
  dueDate: Date | string | null;
}

const STATUS_CYCLE: Record<string, string> = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "OPEN",
  CANCELLED: "OPEN",
};

export default function ActionItemList({
  actionItems,
  meetingId,
  employeeId,
}: {
  actionItems: ActionItem[];
  meetingId: string;
  employeeId: string;
}) {
  const router = useRouter();
  const [items, setOptimisticItems] = useOptimistic(actionItems);
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  async function handleStatusToggle(item: ActionItem) {
    const nextStatus = STATUS_CYCLE[item.status] || "OPEN";
    setOptimisticItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
    );
    await updateActionItemStatus(item.id, nextStatus, employeeId);
    router.refresh();
  }

  async function handleAdd() {
    if (!newDesc.trim()) return;
    setAdding(true);
    try {
      await createActionItem(meetingId, employeeId, newDesc.trim());
      setNewDesc("");
      setShowAdd(false);
      router.refresh();
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteActionItem(id, employeeId);
    router.refresh();
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Action Items</p>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {items.length === 0 && !showAdd && (
        <p className="text-xs text-gray-400 italic">No action items</p>
      )}

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2 group">
            <button
              onClick={() => handleStatusToggle(item)}
              title={`Status: ${ACTION_ITEM_STATUS_LABELS[item.status]} — click to advance`}
              className={cn(
                "mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 transition-colors",
                ACTION_ITEM_STATUS_CLASSES[item.status] || "bg-gray-100 text-gray-500"
              )}
            >
              {item.status === "DONE" ? <Check className="w-3 h-3" /> : ACTION_ITEM_STATUS_LABELS[item.status]}
            </button>
            <span
              className={cn(
                "text-sm flex-1",
                item.status === "DONE" && "line-through text-gray-400",
                item.status === "CANCELLED" && "line-through text-gray-400"
              )}
            >
              {item.description}
              {item.dueDate && (
                <span className="ml-1.5 text-xs text-gray-400">
                  · due {formatDate(item.dueDate)}
                </span>
              )}
            </span>
            <button
              onClick={() => handleDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {showAdd && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Action item description..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newDesc.trim()}
            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {adding ? "..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}
