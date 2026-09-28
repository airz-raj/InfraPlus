import { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Policymaker Dashboard | InfraPulse",
  description: "Live AI-Driven Infrastructure Demand Analytics",
};

export default function DashboardPage() {
  return <DashboardLayout />;
}
