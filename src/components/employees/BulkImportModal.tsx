"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { bulkCreateEmployees } from "@/actions/employees";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParsedRow {
  name: string;
  role: string;
  team: string;
  startDate: string;
  error?: string;
}

type Step = "upload" | "preview" | "done";

export default function BulkImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const [parseError, setParseError] = useState("");

  function reset() {
    setStep("upload");
    setRows([]);
    setResult(null);
    setParseError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function parseCSV(text: string): ParsedRow[] {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ""));
    const nameIdx = header.findIndex((h) => h === "name");
    const roleIdx = header.findIndex((h) => h === "role");
    const teamIdx = header.findIndex((h) => h === "team");
    const dateIdx = header.findIndex((h) => ["startdate", "start"].includes(h));

    return lines.slice(1).filter((l) => l.trim()).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const row: ParsedRow = {
        name: nameIdx >= 0 ? cols[nameIdx] ?? "" : "",
        role: roleIdx >= 0 ? cols[roleIdx] ?? "" : "",
        team: teamIdx >= 0 ? cols[teamIdx] ?? "" : "",
        startDate: dateIdx >= 0 ? cols[dateIdx] ?? "" : "",
      };
      const missing = [];
      if (!row.name) missing.push("name");
      if (!row.role) missing.push("role");
      if (!row.team) missing.push("team");
      if (!row.startDate) missing.push("startDate");
      if (missing.length) row.error = `Missing: ${missing.join(", ")}`;
      return row;
    });
  }

  function handleFile(file: File) {
    setParseError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setParseError("No data rows found. Make sure the CSV has a header row and at least one data row.");
        return;
      }
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    const valid = rows.filter((r) => !r.error);
    if (!valid.length) return;
    setImporting(true);
    try {
      const res = await bulkCreateEmployees(valid);
      setResult(res);
      setStep("done");
      router.refresh();
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  const validRows = rows.filter((r) => !r.error);
  const errorRows = rows.filter((r) => r.error);

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title="Bulk Import Members"
      maxWidth="max-w-2xl"
    >
      {step === "upload" && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Upload a CSV file with these columns (header row required):</p>
            <code className="block bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-mono">
              name,role,team,startDate
            </code>
            <p className="mt-2 text-gray-400 text-xs">Example: Jane Smith,Senior Engineer,Platform,2023-04-01</p>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          >
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1">CSV files only</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {parseError && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />{parseError}
            </p>
          )}

          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">{validRows.length} valid</span>
            {errorRows.length > 0 && <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-medium">{errorRows.length} errors</span>}
          </div>

          <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {["Name","Role","Team","Start Date","Status"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, i) => (
                  <tr key={i} className={cn(row.error ? "bg-red-50" : "")}>
                    <td className="px-3 py-2">{row.name || <span className="text-red-400 italic">—</span>}</td>
                    <td className="px-3 py-2">{row.role || <span className="text-red-400 italic">—</span>}</td>
                    <td className="px-3 py-2">{row.team || <span className="text-red-400 italic">—</span>}</td>
                    <td className="px-3 py-2">{row.startDate || <span className="text-red-400 italic">—</span>}</td>
                    <td className="px-3 py-2">
                      {row.error
                        ? <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{row.error}</span>
                        : <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />OK</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errorRows.length > 0 && (
            <p className="text-xs text-gray-400">Rows with errors will be skipped during import.</p>
          )}

          {parseError && <p className="text-sm text-red-600">{parseError}</p>}

          <div className="flex justify-between">
            <Button variant="ghost" onClick={reset}>← Back</Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={handleImport} disabled={importing || validRows.length === 0}>
                {importing ? "Importing…" : `Import ${validRows.length} Members`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div className="text-center py-8 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <div>
            <p className="text-lg font-semibold text-gray-900">{result.created} member{result.created !== 1 ? "s" : ""} imported</p>
            {result.skipped > 0 && <p className="text-sm text-gray-400 mt-1">{result.skipped} skipped (duplicates)</p>}
          </div>
          <Button onClick={() => { reset(); onClose(); }}>Done</Button>
        </div>
      )}
    </Modal>
  );
}
