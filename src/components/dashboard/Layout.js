"use client";
import { useAuth } from "@/app/provider";

export default function Layout({ sidebar, header, children }) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col p-6 gap-8 min-h-screen hidden md:flex">
        {sidebar}
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
          {header}
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600 dark:text-neutral-300">{user?.email}</span>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
