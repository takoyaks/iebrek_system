"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/auth";

export default function Sidebar() {

    const router = useRouter();
    const pathname = usePathname();
    const links = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/logbook-report", label: "Logbook Report" },
        { href: "/dashboard/reports", label: "Reports" },
        { href: "/dashboard/settings", label: "Settings" },
    ];

return (
    <>
        <nav className="flex flex-col gap-2 mb-4">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded font-medium ${
                        pathname === link.href
                            ? "text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
        <button
            onClick={async () => {
                await logout();
                router.replace("/");
            }}
            className="w-full px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition text-sm mt-auto"
        >
            Logout
        </button>
    </>
);
}
