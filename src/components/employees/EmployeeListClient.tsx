"use client";
import { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmployeeForm from "./EmployeeForm";
import { deleteEmployee } from "@/actions/employees";
import { formatDate, formatDateRelative } from "@/lib/utils";
import { Users, Search, Calendar, Star, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Employee {
  id: string; name: string; role: string; team: string;
  startDate: string; avatarColor: string;
  _count: { skillRatings: number; meetings: number };
  meetings: { meetingDate: string }[];
}

export default function EmployeeListClient({ employees, teams }: {
  employees: Employee[]; teams: string[];
}) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return e.name.toLowerCase().includes(q) || e.team.toLowerCase().includes(q);
  });

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    await deleteEmployee(id);
    router.refresh();
  }

  const editingEmployee = employees.find((e) => e.id === editingId);

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name or team..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          {employees.length === 0
            ? <><p className="text-lg font-medium">No team members yet</p><p className="text-sm mt-1">Add your first team member to get started.</p></>
            : <p className="text-lg font-medium">No results for &quot;{search}&quot;</p>}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Member</span><span>Team</span><span>Skill Ratings</span><span>Last 1:1</span><span />
          </div>
          {filtered.map((employee, idx) => {
            const lastMeeting = employee.meetings[0];
            return (
              <div key={employee.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 hover:bg-orange-50/50 transition-colors ${idx !== filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
                <Link href={`/employees/${employee.id}/skills`} className="flex items-center gap-3 min-w-0 group">
                  <Avatar name={employee.name} color={employee.avatarColor} size="md" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">{employee.name}</p>
                    <p className="text-xs text-gray-400 truncate">{employee.role}</p>
                    <p className="text-xs text-gray-400">Since {formatDate(employee.startDate)}</p>
                  </div>
                </Link>
                <div><Badge>{employee.team}</Badge></div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-3.5 h-3.5" />{employee._count.skillRatings}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs">{lastMeeting ? formatDateRelative(lastMeeting.meetingDate) : "—"}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(employee.id)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(employee.id, employee.name)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingEmployee && (
        <EmployeeForm open={!!editingId} onClose={() => setEditingId(null)}
          employee={editingEmployee} teams={teams} />
      )}
    </>
  );
}
