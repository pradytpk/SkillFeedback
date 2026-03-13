"use client";
import { useState } from "react";
import { toggleSelfAssessment } from "@/actions/employees";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";

export default function SelfAssessmentToggle({ employeeId, enabled }: { employeeId: string; enabled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleSelfAssessment(employeeId);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={enabled ? "Disable self-assessment" : "Enable self-assessment"}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
        enabled
          ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
          : "text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
      }`}
    >
      <UserCheck className="w-4 h-4" />
      {enabled ? "Self-Assessment On" : "Self-Assessment Off"}
    </button>
  );
}
