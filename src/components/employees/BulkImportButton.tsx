"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import BulkImportModal from "./BulkImportModal";
import { Upload } from "lucide-react";

export default function BulkImportButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Upload className="w-4 h-4 mr-1.5" />
        Import CSV
      </Button>
      <BulkImportModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
