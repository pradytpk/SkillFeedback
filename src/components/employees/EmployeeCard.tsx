"use client";
import { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmployeeForm from "./EmployeeForm";
import { deleteEmployee } from "@/actions/employees";
import { formatDate, formatDateRelative } from "@/lib/utils";
import { Pencil, Trash2, Calendar, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface Employee {
  id: string;
  name: string;
  role: string;
  team: string;
  startDate: Date | string;
  avatarColor: string;
  _count: { skillRatings: number; meetings: number };
  meetings: { meetingDate: Date | string }[];
}

export default function EmployeeCard({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const lastMeeting = employee.meetings[0];

  async function handleDelete() {
    if (!confirm(`Delete ${employee.name}? This cannot be undone.`)) return;
    await deleteEmployee(employee.id);
    router.refresh();
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
        <div className="flex items-start justify-between">
          <Link href={`/employees/${employee.id}/skills`} className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar name={employee.name} color={employee.avatarColor} size="lg" />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{employee.name}</h3>
              <p className="text-sm text-gray-500 truncate">{employee.role}</p>
              <Badge className="mt-1">{employee.team}</Badge>
            </div>
          </Link>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Star className="w-3.5 h-3.5" />
            <span>{employee._count.skillRatings} ratings</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{employee._count.meetings} meetings</span>
          </div>
          <div className="col-span-2 text-xs text-gray-400">
            {lastMeeting
              ? `Last 1:1: ${formatDateRelative(lastMeeting.meetingDate)}`
              : "No meetings yet"}
          </div>
          <div className="col-span-2 text-xs text-gray-400">
            Since {formatDate(employee.startDate)}
          </div>
        </div>
      </div>

      <EmployeeForm
        open={editing}
        onClose={() => setEditing(false)}
        employee={employee}
      />
    </>
  );
}
