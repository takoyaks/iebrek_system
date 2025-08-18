"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import Admin_logbook_report from "@/components/admin_logbook/page"; // Adjusted import path


export default function Dashboard() {
    return (
        <DashboardLayout
            sidebar={<DashboardSidebar />}
            header={<DashboardHeader title="Logbook Report" />}
        >
            <Admin_logbook_report />
        </DashboardLayout>
    );
}
