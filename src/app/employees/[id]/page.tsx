import { redirect } from "next/navigation";

export default function EmployeePage({ params }: { params: { id: string } }) {
  redirect(`/employees/${params.id}/skills`);
}
