"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EmployeeSubNav({ employeeId }: { employeeId: string }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/employees/${employeeId}/skills`, label: "Skills" },
    { href: `/employees/${employeeId}/meetings`, label: "Meetings" },
    { href: `/employees/${employeeId}/progress`, label: "Progress" },
  ];

  return (
    <nav className="flex gap-1 mt-4 -mb-5">
      {tabs.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            pathname === href
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
