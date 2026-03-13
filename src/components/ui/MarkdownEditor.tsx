"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, rows = 4, label }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "edit"
                ? "text-orange-600 border-b-2 border-orange-500 bg-white -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "preview"
                ? "text-orange-600 border-b-2 border-orange-500 bg-white -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Preview
          </button>
        </div>

        {tab === "edit" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 text-sm text-gray-900 resize-y focus:outline-none focus:ring-1 focus:ring-orange-400 font-mono"
          />
        ) : (
          <div className="px-3 py-2 min-h-[80px] text-sm text-gray-900 prose prose-sm max-w-none
            [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-1
            [&>h2]:text-sm [&>h2]:font-bold [&>h2]:mb-1
            [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:pl-4 [&>ul>li]:list-disc [&>ul>li]:mb-0.5
            [&>ol]:mb-2 [&>ol]:pl-4 [&>ol>li]:list-decimal [&>ol>li]:mb-0.5
            [&>strong]:font-semibold [&>em]:italic">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <span className="text-gray-400 italic">Nothing to preview</span>
            )}
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-400">Supports **bold**, *italic*, # headings, - lists</p>
    </div>
  );
}
