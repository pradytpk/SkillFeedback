"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import EmployeeForm from "./EmployeeForm";
import { Plus } from "lucide-react";

export default function AddEmployeeButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Add Employee
      </Button>
      <EmployeeForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}
