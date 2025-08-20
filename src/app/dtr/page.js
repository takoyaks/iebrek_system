"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import Dtr_builder from "@/components/dtr_builder/main"; // Adjusted import path
import { useAuth } from "@/app/provider";
import { useRouter } from "next/navigation";


export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) {
        if (typeof window !== "undefined") router.replace("/");
        return null;
    }
    return (
        <DashboardLayout
            sidebar={<DashboardSidebar />}
            header={<DashboardHeader title="DTR Builder" />}
        >
            <Dtr_builder />
        </DashboardLayout>
    );
}