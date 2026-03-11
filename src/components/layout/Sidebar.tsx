"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/settings", label: "Skills Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <span className="font-bold text-lg tracking-tight">SkillTracker</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">1:1 Feedback Manager</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
